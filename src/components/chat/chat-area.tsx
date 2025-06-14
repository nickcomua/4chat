"use client"

import React, { useState } from "react"
import type { Message } from "@/types/chat"
import { useFind, usePouch } from 'use-pouchdb'
import TopBar from "../layout/top-bar"
import MessageList from "./message-list"
import MessageInput from "./message-input"


export default function ChatArea() {
  const [selectedModel, setSelectedModel] = useState("Gemini 2.5 Flash")
  const [inputValue, setInputValue] = useState("")
  const messageDb: PouchDB.Database<Message> = usePouch("messages")
  const { docs: messages, loading, error } = useFind<Message>({
    db: "messages",
    index: {
      fields: ['createdAt'],
    },
    selector: { createdAt: { $gte: null } },
    sort: ['createdAt'],
  })

  // console.log("messages", messages, loading, error)
  const onSubmit = async (e: React.FormEvent) => {
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
      content: "...Loadimg",
      role: "assistant",
    }
    const withLoading = messageDb.put(assistantMessage)
    if ('Writer' in self) {
      // @ts-ignore
      const writer = await Writer.create();
      const result = await writer.write(
          inputValue, {
          context: messages.map(message => `${message.role}: ${message.content}`).join("\n"),
        }
      )
      console.log("result", { inputValue, context: messages.map(message => `${message.role}: ${message.content}`).join("\n"), result })
      const withLoadingAwaited = await withLoading
      messageDb.put({
        _id: withLoadingAwaited.id,
        _rev: withLoadingAwaited.rev,
        content: result,
        role: "assistant",
        createdAt: +new Date(),
      })
    }
  }

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