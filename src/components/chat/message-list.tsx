import React from "react"
import type { ChatMessage } from "@/lib/types/chat"
import MessageComponent from "./message"
import WelcomeScreen from "./welcome-screen"

interface MessageListProps {
  messages: ChatMessage[]
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
        ) : <>
          {messages.filter(message => message.type === "user" || message.type === "assistant").map((message) =>
            <MessageComponent key={message._id} id={message._id} role={message.type} text={message.ai.parts.filter(part => part._tag === "TextPart").map(part => part.text).join("")} />
          )}
          <MessageComponent key={"brrr"} id={"brrr"} role={"assistant"} text={messages.filter(message => message.type === "chunk").map(message => message.ai.parts.filter(part => part._tag === "TextPart").map(part => part.text).join("")).join("")} />
        </>}
      </div>
    </div>
  )
} 