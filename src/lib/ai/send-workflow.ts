import { Activity, DurableClock, DurableDeferred, Workflow } from "@effect/workflow"
import { Effect, Layer, Schema, Redacted, Hash, Schedule, Ref } from "effect"
import { cookies } from "next/headers"
import { AiError, AiInput, AiLanguageModel } from "@effect/ai"
import { AssistantMessage, TextPart, UserMessage } from "@effect/ai/AiInput"
import * as AiResponse from "@effect/ai/AiResponse"
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { Stream } from "effect"
import { DocumentConflictError, InvalidDocumentError, PouchDBPutError, putDocument } from "@/lib/db/pouchdb"
import { Chat, ChatAssistantMessage, ChatAssistantMessageChunk, ChatAssistantMessageError, ChatMessage, ChatUserMessage } from "@/lib/types/chat"
import { ChatSettings } from "@/lib/types/settings"
import { initialModels } from "@/lib/config/models"
import { getUserDbName } from "../db/common"
import PouchDB from "pouchdb-browser"
import { mergeAiResponse } from "./common"
import { runNode } from "../services/node"
import { generateSystemPrompt } from "./system-prompt"
import { couchdbUrlNode } from "../db/node"

// Error definitions
class GetCookiesError extends Schema.TaggedError<GetCookiesError>("GetCookiesError")("GetCookiesError", {
    message: Schema.String
}) { }

class StreamError extends Schema.TaggedError<StreamError>("StreamError")("StreamError", {
    message: Schema.String,
    error: Schema.Union(PouchDBPutError, DocumentConflictError, InvalidDocumentError)
}) { }

class CleanupError extends Schema.TaggedError<CleanupError>("CleanupError")("CleanupError", {
    message: Schema.String
}) { }

class LastMessageError extends Schema.TaggedError<LastMessageError>("LastMessageError")("LastMessageError", {
    message: Schema.String
}) { }

const getDb = <T extends {}>(sessionToken: string, url: string) => {
    return new PouchDB<T>(url, {
        skip_setup: true,
        fetch: (url, options) => {
            const headers = new Headers(options?.headers || {});
            headers.set('Cookie', `AuthSession=${sessionToken}`);
            return fetch(url, {
                ...options,
                headers
            });
        }
    });
}

const getMessageDb = (sessionToken: string, userId: string) => {
    return getDb<ChatMessage>(sessionToken, `${couchdbUrlNode}/${getUserDbName(userId, 'messages')}`)
}

const getChatDb = (sessionToken: string, userId: string) => {
    return getDb<Chat>(sessionToken, `${couchdbUrlNode}/${getUserDbName(userId, 'chats')}`)
}

// Define the workflow
const SendMessageWorkflow = Workflow.make({
    name: "SendMessageWorkflow",
    success: Schema.Void,
    error: Schema.Union(GetCookiesError, CleanupError, LastMessageError),
    payload: Schema.Struct({
        chat: Chat,
        hash: Schema.String,
        messages: Schema.Array(Schema.Union(
            ChatUserMessage,
            ChatAssistantMessage
        )),
        profile: ChatSettings,
        selectedModel: Schema.String,
        userId: Schema.String,
    }),
    idempotencyKey: ({ hash }) => {
        return hash
    }
})

// Workflow implementation layer
const SendMessageWorkflowLayer = SendMessageWorkflow.toLayer(
    Effect.fn(function* (payload, executionId) {
        // Activity 1: Get cookies and session token
        yield* Activity.make({
            name: "CheckLastMessage",
            error: LastMessageError,
            success: Schema.Void,
            execute: Effect.gen(function* () {
                if (payload.messages.at(-1)?.type !== "ChatUserMessage") {
                    return yield* Effect.fail(new LastMessageError({
                        message: "No last message found"
                    }))
                }
            })
        })

        const sessionToken = yield* Activity.make({
            name: "GetCookies",
            error: GetCookiesError,
            success: Schema.String,
            execute: Effect.gen(function* () {
                const cookieStore = yield* Effect.promise(() => cookies())
                const token = cookieStore.get("AuthSession")?.value
                if (!token) {
                    return yield* Effect.fail(new GetCookiesError({
                        message: "No session token found"
                    }))
                }
                return token
            })
        })

        const chatRes = yield* Activity.make({
            name: "UpdateChatStatus",
            error: Schema.Union(PouchDBPutError, DocumentConflictError, InvalidDocumentError),
            success: Schema.String,
            execute: Effect.gen(function* () {
                const chat = yield* putDocument(getChatDb(sessionToken, payload.userId), { ...payload.chat, status: "generating" })
                return chat.rev
            })
        }).pipe(
            Effect.catchAll(Effect.fn(function* (error) {
                yield* Effect.logError(error)
                return payload.chat._rev
            }))
        )

        // Activity 2: Create stream and post chunks
        yield* Activity.make({
            name: "StreamAndChunks",
            error: Schema.Union(AiError.AiError, PouchDBPutError, DocumentConflictError, InvalidDocumentError),
            success: Schema.Void,
            execute: Effect.gen(function* () {
                const messageDb = getMessageDb(sessionToken, payload.userId)
                const prompt = AiInput.make(payload.messages.map(message =>
                    message.type === "ChatUserMessage" ? message.ai :
                        AssistantMessage.make({
                            parts: message.ai.parts.flatMap((part) => part._tag === "TextPart" ? [TextPart.make({ text: part.text })] : [])
                        })
                ))
                const chankCount = yield* Ref.make(0)
                yield* AiLanguageModel.streamText({
                    system: generateSystemPrompt(payload.profile.personalPreferences),
                    prompt
                }).pipe(
                    Stream.runForEach(Effect.fn(function* (chunk) {
                        const chunkMessage = Schema.encodeSync(ChatMessage)({
                            _id: `${payload.chat._id}_chank_${payload.messages.length}_${yield* chankCount.get}`,
                            type: "ChatAssistantMessageChunk",
                            ai: chunk
                        })
                        yield* Ref.update(chankCount, (n) => n + 1)
                        yield* putDocument(messageDb, chunkMessage)
                            .pipe(Effect.retry({
                                while: (error) => error instanceof PouchDBPutError,
                                times: 3,
                                schedule: Schedule.exponential(1000)
                            }))
                    }))
                )
            })
        }).pipe(
            Effect.catchAll(Effect.fn(function* (error) {
                yield* Effect.logError(error)
                const messageDb = getMessageDb(sessionToken, payload.userId)
                yield* putDocument(messageDb, Schema.encodeSync(ChatAssistantMessageError)({
                    _id: `${payload.chat._id}_error_${payload.messages.length}_${+Date.now()}`,
                    type: "ChatAssistantMessageError",
                    error: error.toString()
                }))
                    .pipe(Effect.retry({
                        while: (error) => error instanceof PouchDBPutError,
                        times: 3,
                        schedule: Schedule.exponential(1000)
                    }), Effect.catchAll(Effect.logError))
                return
            })))


        // Activity 3: Delete chunks and post final message
        yield* Activity.make({
            name: "Cleanup",
            error: CleanupError,
            execute: Effect.gen(function* () {
                const messageDb = getMessageDb(sessionToken, payload.userId)
                // const chatDb = getChatDb(sessionToken, payload.userId) @todo

                const { rows: chnaks } = yield* Effect.tryPromise({
                    try: () => messageDb.allDocs<ChatAssistantMessageChunk>({
                        include_docs: true,
                        startkey: `${payload.chat._id}_chank_`,
                        endkey: `${payload.chat._id}_chank_\uffff`
                    }),
                    catch: (error) => new CleanupError({
                        message: "Error in Cleanup " + error?.toString?.()
                    })
                })
                // const chat = yield* Effect.promise(() => chatDb.get(payload.chatId))
                // if (chat.status !== "active") {
                //     return yield* Effect.fail(new CleanupError({
                //         message: "Chat is not active"
                //     }))
                // }
                const aiResponse = chnaks.filter(chunk => chunk.id.split('_')[2] === payload.messages.length.toString()).reduce((acc, chunk) => mergeAiResponse(acc, Schema.decodeSync(AiResponse.AiResponse)(chunk.doc!.ai)),
                    AiResponse.empty)
                // const chunkIds = message.chunks
                const assistantMessage = Schema.encodeSync(ChatMessage)({
                    _id: `${payload.chat._id}_message_${payload.messages.length}`,
                    type: "ChatAssistantMessage",
                    ai: aiResponse,
                })

                yield* Effect.promise(() => getMessageDb(sessionToken, payload.userId).bulkDocs(
                    [assistantMessage,
                        ...chnaks.map(({ id, value: { rev } }) => ({
                            _id: id,
                            _rev: rev,
                            _deleted: true
                        }) as unknown as ChatAssistantMessage)])
                )
                yield* putDocument(getChatDb(sessionToken, payload.userId), { ...payload.chat, status: "active", _rev: chatRes }).pipe(
                    Effect.catchAll(Effect.fn(function* (error) {
                        const chat = yield* Effect.promise(() => getChatDb(sessionToken, payload.userId).get(payload.chat._id))
                        return yield* putDocument(getChatDb(sessionToken, payload.userId), { ...chat, status: "active" })
                    })),
                    Effect.mapError(error => new CleanupError({
                        message: "Error in Cleanup " + error?.toString?.()
                    }))
                )
            })
        })
    })
)

// Export the workflow execution function
export async function sendMessageWorkflow({
    messages,
    profile,
    selectedModel,
    chat,
    hash,
}: {
    messages: (ChatUserMessage | ChatAssistantMessage)[]
    profile: ChatSettings
    selectedModel: string
    chat: Chat
    hash: string
}) {
    const userId = profile.userProfile.userId
    return SendMessageWorkflow.execute({
        chat: Schema.decodeSync(Chat)(chat),
        hash: hash,
        messages: Schema.decodeSync(Schema.Array(Schema.Union(ChatUserMessage, ChatAssistantMessage)))(messages),
        profile, selectedModel, userId
    }).pipe(
        Effect.provide(SendMessageWorkflowLayer),
        Effect.provide(OpenAiLanguageModel.model(initialModels.find((m: { id: string }) => m.id === selectedModel)?.providers?.openrouter ?? "")),
        Effect.provide(OpenAiClient.layer({
            apiUrl: "https://openrouter.ai/api/v1/",
            apiKey: Redacted.make(profile?.apiKeySettings?.providers.openrouter ?? "")
        })),
        runNode
    )
} 