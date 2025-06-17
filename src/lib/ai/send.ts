"use server"

import { Effect, Fiber, Stream } from "effect"
import { AiInput, AiLanguageModel } from "@effect/ai"
import { AssistantMessage, TextPart, UserMessage } from "@effect/ai/AiInput"
import * as AiResponse from "@effect/ai/AiResponse"
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { Redacted } from "effect"
import { putDocument } from "@/lib/db/pouchdb"
import { runWeb } from "@/lib/services/web"
import { Chat, ChatAssistantMessage, ChatAssistantMessageChunk, ChatMessage, ChatUserMessage } from "@/lib/types/chat"
import { ChatSettings } from "@/lib/types/settings"
import { initialModels } from "@/lib/config/models"
import { redirect } from "next/navigation"
import { couchdbUrlBase, getUserDbName } from "../db/common"
import PouchDB from "pouchdb"
import { cookies } from "next/headers"
import { mergeAiResponse } from "./common"


export async function sendMessage({
	inputValue,
	chatId,
	messages,
	profile,
	selectedModel,
	userId,
}: {
	inputValue: string
	chatId: string
	messages: ChatMessage[]
	profile?: ChatSettings
	selectedModel: string
	userId: string
}) {
	return Effect.gen(function* () {
		if (!inputValue.trim()) return
		const cookieStore = yield* Effect.promise(() => cookies())
		const sessionToken = cookieStore.get("AuthSession")?.value
		yield* Effect.log("couchdbUrlBase", couchdbUrlBase)
		yield* Effect.log("sessionToken", sessionToken)
		const messageDb = new PouchDB<ChatMessage>(`${couchdbUrlBase}/${getUserDbName(userId, 'messages')}`, {
			skip_setup: true,
			fetch: (url, options) => {
				const headers = new Headers(options?.headers || {});
				headers.set('Cookie', `AuthSession=${sessionToken}`);
				return fetch(url, {
					...options,
					headers
				});
			}
		})

		const prompt = AiInput.make([
			...messages.filter(message => message.type === "ChatUserMessage" || message.type === "ChatAssistantMessage").map(message =>
				message.type === "ChatUserMessage" ? UserMessage.make({ parts: message.ai.parts.filter(part => part._tag === "TextPart").map(part => TextPart.make({ text: part.text })) }) :
					AssistantMessage.make({
						parts: message.ai.parts.filter(part => part._tag === "TextPart").map(part => TextPart.make({ text: part.text }))
					})
			),
			UserMessage.make({
				parts: [
					TextPart.make({
						text: inputValue,
					}),
				],
			})
		])
		yield* Effect.log("AI Prompt", prompt)
		const [aiResponseStream1, aiResponseStream2] = yield* Stream.broadcast(2, { capacity: "unbounded" })(AiLanguageModel.streamText({
			prompt,
			system: undefined, // @todo
		}))

		const aiResponseFork = yield* Effect.fork(Stream.runFold(aiResponseStream1, AiResponse.empty, mergeAiResponse))
		const chanksResults = yield* Effect.fork(Stream.runFoldEffect(aiResponseStream2, [] as { readonly id: string; readonly ok: boolean; readonly rev: string; }[], Effect.fn(function* (acc, v) {
			const chunkMessage = ChatAssistantMessageChunk.make({
				_id: `${chatId}_${messages.length + 1}_${acc.length}`,
				type: "ChatAssistantMessageChunk",
				ai: v
			})
			const fiber = yield* putDocument(messageDb, chunkMessage)
			yield* Effect.log("Chunk Message", chunkMessage)
			return [...acc, fiber]
		})))

		const [aiResponse, ids] = yield* Effect.all([Fiber.join(aiResponseFork), Fiber.join(chanksResults)])
		// const aiResponse = yield* Fiber.join(aiResponseFork)
		yield* Effect.log("AI Response generated successfully", {
			inputValue,
			prompt,
			result: aiResponse
		})

		const assistantMessage = ChatAssistantMessage.make({
			_id: `${chatId}_${messages.length + 1}`,
			type: "ChatAssistantMessage",
			ai: aiResponse,
		})

		
		yield* Effect.promise(() => messageDb.bulkDocs(
			[assistantMessage,
				...ids.map(id => ({
					_id: id.id,
					_rev: id.rev,
					_deleted: true
				}) as unknown as ChatAssistantMessage)])
		)

	}).pipe(
		Effect.provide(OpenAiLanguageModel.model(initialModels.find((m: { id: string }) => m.id === selectedModel)?.providers?.openrouter ?? "")),
		Effect.provide(OpenAiClient.layer({ apiUrl: "https://openrouter.ai/api/v1/", apiKey: Redacted.make(profile?.apiKeySettings?.providers.openrouter ?? "") })),
		Effect.catchAll((error) => Effect.gen(function* () {
			yield* Effect.logError("Error in AI response generation:", error)
			throw new Error("Error in AI response generation: " + error)
		})),
		runWeb
	)
}