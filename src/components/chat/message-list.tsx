"use client"

import React from "react"
import type { Message } from "@/types/chat"
import MessageComponent from "./message"
import WelcomeScreen from "./welcome-screen"

interface MessageListProps {
  messages: Message[]
  onPromptClick: (prompt: string) => void
}

export default function MessageList({ messages, onPromptClick }: MessageListProps) {
  return (
    <div
      className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pt-safe-offset-40"
      style={{ paddingBottom: "144px", scrollbarGutter: "stable both-edges" }}
    >
      <div
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10"
      >
        {messages.length === 0 ? (
          <WelcomeScreen onPromptClick={onPromptClick} />
        ) : (
          messages.map((message) => <MessageComponent key={message._id} message={message} />)
        )}
      </div>
    </div>
  )
} 