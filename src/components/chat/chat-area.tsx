"use client"

import React, { useEffect, useState } from "react"
import { Chat, ChatAssistantMessage, ChatAssistantMessageChunk, ChatMessage, ChatUserMessage } from "@/lib/types/chat"
import { useFind, usePouch } from 'use-pouchdb'
import TopBar from "@/components/layout/top-bar"
import MessageList from "./message-list"
import MessageInput from "./message-input"
import { AiInput, AiLanguageModel } from "@effect/ai"
import { Effect, Fiber, Redacted, Stream, pipe } from "effect"
import { AssistantMessage, TextPart, UserMessage } from "@effect/ai/AiInput"
import { DocumentConflictError, InvalidDocumentError, PouchDBPutError, putDocument } from "@/lib/db/pouchdb"
import { runWeb } from "@/lib/services/web"
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { BrowserHttpClient } from "@effect/platform-browser"
import { ChatSettings } from "@/lib/types/settings"
import { toast } from "sonner"
import * as AiResponse from "@effect/ai/AiResponse"
import { useParams, useRouter } from "next/navigation"
import { initialModels } from "@/lib/config/models"

export default function ChatArea() {
  const { id: chatId }: { id: string | undefined } = useParams()
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const chatsDb: PouchDB.Database<Chat> = usePouch("chats")
  const messageDb: PouchDB.Database<ChatMessage> = usePouch("messages")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]
  const selectedModel = profile?.modelSettings?.preferredModel ?? "gemini-2-0-flash"
  const { docs: messages, loading, error, state } = useFind<ChatMessage>({
    db: "messages",
    index: {
      fields: ["chatId", "index"]
    },
    selector: { chatId: chatId ?? "", index: { $gt: null } },
    sort: ["chatId", "index"],
  })
  useEffect(() => {
    console.log("chatId", chatId, messages.length)
    if (chatId && !messages.length && !loading) {
      router.push("/")
    }
  }, [chatId, messages, router])
  function onSubmit() {
    return Effect.gen(function* () {
      if (!inputValue.trim()) return

      // Add user message
      const newChatId = yield* Effect.succeed(chatId).pipe(Effect.map(id => id ?? crypto.randomUUID()))
      const userMessage = ChatUserMessage.make({
        _id: crypto.randomUUID(),
        type: "user",
        chatId: newChatId,
        index: messages.length,
        createdAt: +new Date(),
        ai: UserMessage.make({
          parts: [
            TextPart.make({
              text: inputValue,
            }),
          ],
        }),
      })
      yield* Effect.log("User Message", userMessage)
      yield* putDocument(messageDb, userMessage).pipe(Effect.catchAll(Effect.die))
      yield* Effect.log("User Message added to database")
      setInputValue("")


      const chatFork = yield* Effect.fork((newChatId === chatId) ? Effect.succeed(null) : putDocument(chatsDb, {
        _id: newChatId,
        name: inputValue.slice(0, 25),
        createdAt: +new Date(),
      }).pipe(Effect.catchAll(Effect.die)))



      const prompt = AiInput.make([
        ...messages.filter(message => message.type === "user" || message.type === "assistant").map(message =>
          // @todo not only text parts
          message.type === "user" ? UserMessage.make({ parts: message.ai.parts.filter(part => part._tag === "TextPart").map(part => TextPart.make({ text: part.text })) }) :
            AssistantMessage.make({
              parts: message.ai.parts.filter(part => part._tag === "TextPart").map(part => TextPart.make({ text: part.text }))
            })
        ),
        userMessage.ai
      ])
      yield* Effect.log("AI Prompt", prompt)
      const [aiResponseStream1, aiResponseStream2] = yield* Stream.broadcast(2, { capacity: "unbounded" })(AiLanguageModel.streamText({
        prompt,
        system: undefined, // @todo
      }))
      const aiResponseFork = yield* Effect.fork(Stream.runFold(aiResponseStream1, AiResponse.empty, AiResponse.merge))
      const chanksResults = yield* Effect.fork(Stream.runFoldEffect(aiResponseStream2, [] as { readonly id: string; readonly ok: boolean; readonly rev: string; }[], Effect.fn(function* (acc, v) {
        const chunkMessage = ChatAssistantMessageChunk.make({
          _id: crypto.randomUUID(),
          type: "chunk",
          chatId: newChatId,
          index: messages.length * 10 + acc.length,
          createdAt: +new Date(),
          ai: v
        })
        // const fiber = yield* Effect.fork(putDocument(messageDb, chunkMessage))
        const fiber = yield* putDocument(messageDb, chunkMessage)
        yield* Effect.log("Chunk Message", chunkMessage)
        return [...acc, fiber]
      }))
      )

      const [aiResponse, ids] = yield* Effect.all([Fiber.join(aiResponseFork), Fiber.join(chanksResults)])
      // Log successful result
      yield* Effect.log("AI Response generated successfully", {
        inputValue,
        prompt,
        result: aiResponse
      })

      const assistantMessage = ChatAssistantMessage.make({
        _id: crypto.randomUUID(),
        chatId: newChatId,
        index: messages.length + 1,
        type: "assistant",
        status: "success",
        startedAt: +new Date(),
        endedAt: +new Date(),
        ai: aiResponse,
      })

      yield* putDocument(messageDb, assistantMessage).pipe(Effect.catchAll(Effect.die))
      // const idsFibers = (yield* Fiber.join(chanksResults)).map(fiber => Fiber.join(fiber))
      // yield* Effect.log({ idsFibers })
      // const ids = yield* Effect.all(idsFibers, { concurrency: "unbounded" })
      yield* Effect.log({ ids })
      for (const id of ids) {
        yield* Effect.promise(() => messageDb.remove({
          _id: id.id,
          _rev: id.rev,
        }))
      }

      const chatForkResult = yield* Fiber.join(chatFork)
      if (chatForkResult) {
        return yield* Effect.sync(() => router.replace(`/chat/${newChatId}`))
      }
    }).pipe(
      Effect.provide(OpenAiLanguageModel.model(initialModels.find(m => m.id === selectedModel)?.providers?.openrouter ?? "")),
      Effect.provide(OpenAiClient.layer({ apiUrl: "/api/_openrouter/", apiKey: Redacted.make(profile?.apiKeySettings?.providers.openrouter) })),
      Effect.catchAll((error) => Effect.gen(function* () {
        yield* Effect.logError("Error in AI response generation:", error)

        toast.error("Error in AI response generation: " + error)
        return "Error handled"
      })),
      runWeb
    )
  }

  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
      {/* Chat Background */}
      <div className="absolute bottom-0 top-0 w-full overflow-hidden border-l border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none"></div>

      {/* Content Container */}
      <div className="absolute bottom-0 top-0 w-full">
        {/* @todo move topbar to sidebar */}
        <TopBar />
        <MessageList messages={messages} onPromptClick={(prompt) => setInputValue(prompt)} />
      </div>

      {/* Input Area */}
      <MessageInput
        inputValue={inputValue}
        onInputChange={(e) => {
          setInputValue(e.target.value)
        }}
        onSubmit={onSubmit}
      />
    </main>
  )
} 