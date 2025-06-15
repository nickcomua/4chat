"use client"

import React, { useState } from "react"
import type { Message } from "@/types/chat"
import { useFind, usePouch } from 'use-pouchdb'
import TopBar from "@/components/layout/top-bar"
import MessageList from "./message-list"
import MessageInput from "./message-input"
import { AiInput, AiLanguageModel } from "@effect/ai"
import { Effect, Console, Fiber, Redacted } from "effect"
import { AssistantMessage, TextPart, UserMessage } from "@effect/ai/AiInput"
import { putDocument } from "@/lib/db/pouchdb"
import { runWeb } from "@/services/web"
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { BrowserHttpClient } from "@effect/platform-browser"
import { ChatSettings } from "@/types/settings"
import { toast } from "sonner"

export default function ChatArea() {
  const [selectedModel, setSelectedModel] = useState("Gemini 2.5 Flash")
  const [inputValue, setInputValue] = useState("")
  const messageDb: PouchDB.Database<Message> = usePouch("messages")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]

  const { docs: messages, loading, error } = useFind<Message>({
    db: "messages",
    index: {
      fields: ['createdAt'],
    },
    selector: { createdAt: { $gte: null } },
    sort: ['createdAt'],
  })

  // console.log("messages", messages, loading, error)
  function onSubmit(e: React.FormEvent) {
    return Effect.gen(function* () {
      e.preventDefault()
      if (!inputValue.trim()) return

      // Add user message
      const userMessage: Message = {
        _id: crypto.randomUUID(),
        createdAt: +new Date(),
        content: inputValue,
        role: "user",
      }

      messageDb.put(userMessage)
      setInputValue("")
      const messageId = crypto.randomUUID()
      const assistantMessage: Message = {
        _id: messageId,
        createdAt: +new Date(),
        content: "...Loading",
        role: "assistant",
      }
      const withLoading = yield* Effect.fork(putDocument(messageDb, assistantMessage).pipe(Effect.catchAll(Effect.die)))

      // Create Effect program for generating AI response

      // Format context messages for AI
      // const contextMessages = messages.map(message => ({
      //   role: message.role as 'user' | 'assistant',
      //   content: message.content,
      // }))
      // Generate text using AI SDK wrapped in Effect
      const prompt = AiInput.make([
        ...messages.map(message => message.role === "user" ? UserMessage.make({
          parts: [
            TextPart.make({
              text: message.content,
            }),
          ],
        }) : AssistantMessage.make({
          parts: [
            TextPart.make({
              text: message.content,
            }),
          ],
        })),
        UserMessage.make({
          parts: [
            TextPart.make({
              text: inputValue,
            }),
          ],
        })
      ])
      yield* Console.log("AI Prompt", prompt)
      const { text } = yield* AiLanguageModel.generateText({
        prompt,
        system: undefined, // @todo
      }).pipe(Effect.catchAll((error) => {
        // Console.error("Error in AI response generation:", error.message)
        return Effect.die(error)

        // Update database with error message
        // const loadingResult = yield* Fiber.join(withLoading)

        // yield* putDocument(messageDb, {
        //   _id: loadingResult.id,
        //   _rev: loadingResult.rev,
        //   content: "Sorry, I encountered an error while generating a response. Please try again.",
        //   role: "assistant",
        //   createdAt: +new Date(),
        // }).pipe(Effect.mapError(Effect.die))
        // return yield* Effect.die(error)
        // return "Error handled"
      }))

      // Log successful result
      yield* Console.log("AI Response generated successfully", {
        inputValue,
        prompt,
        result: text
      })

      // Update database with successful response
      const loadingResult = yield* Fiber.join(withLoading)

      yield* putDocument(messageDb, {
        _id: loadingResult.id,
        _rev: loadingResult.rev,
        content: text,
        role: "assistant",
        createdAt: +new Date(),
      }).pipe(Effect.catchAll(Effect.die))



      return text
    }).pipe(
      Effect.provide(OpenAiLanguageModel.model("google/gemini-2.5-flash-preview")),
      Effect.provide(OpenAiClient.layer({ apiUrl: "/api/_openrouter/", apiKey: Redacted.make(profile?.apiKeySettings?.providers.openrouter) })),
      // Effect.catchAll((error) => Effect.gen(function* () {
      //   yield* Console.error("Error in AI response generation:", error)

      //   toast.error("Error in AI response generation: " + error)
      //   return "Error handled"
      // })),
      runWeb
    )
  }

  // Handle errors gracefully

  // )
  // )



  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
      {/* Chat Background */}
      <div className="absolute bottom-0 top-0 w-full overflow-hidden border-l border-t border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none sm:translate-y-3.5 sm:rounded-tl-xl"></div>

      {/* Content Container */}
      <div className="absolute bottom-0 top-0 w-full">
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
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
    </main>
  )
} 