import React, { useEffect, useRef, useState } from "react"
import type { ChatAssistantMessage, ChatAssistantMessageChunk, ChatAssistantMessageError, ChatMessage, ChatUserMessage } from "@/lib/types/chat"
import { UserMessage, AssistantMessage } from "./message"
import WelcomeScreen from "./welcome-screen"
import { ChevronDown, LoaderCircle } from "lucide-react"
import { AiResponse } from "@effect/ai"
import { mergeAiResponse } from "@/lib/ai/common"
import { Schema } from "effect"
import { cn } from "@/lib/utils"


export default function MessageList({ messages, chunks, errors, onRetry, onEdit, editMode }: {
  messages: (ChatUserMessage | ChatAssistantMessage)[]
  chunks: ChatAssistantMessageChunk[]
  errors: ChatAssistantMessageError[]
  onRetry?: (messageId: string) => void
  onEdit?: (messageId: string) => void
  editMode?: number | null
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  // const prevMessagesLengthRef = useRef(messages.length)

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    // setTimeout(() => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "instant"
    })
    // }, 100)
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 100
      setShowScrollButton(isNotAtBottom)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (messages.at(-1)?.type === "ChatUserMessage" && chunks.length === 0) {
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "instant"
        })
      })
    }
  }, [messages, chunks])

  return (
    <div
      ref={scrollContainerRef}
      className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pt-safe-offset-40"
      style={{ paddingBottom: "144px", scrollbarGutter: "stable both-edges" }}
    >
      <div
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10",
          editMode !== null && "opacity-50"
        )}
      >
        {messages.map((message, i) =>
          message.type === "ChatUserMessage" ?
            <UserMessage key={message._id}
              id={message._id}
              text={message.ai.parts.filter(part => part._tag === "TextPart").map(part => part.text).join("")}
              onRetry={() => onRetry?.(message._id)}
              onEdit={() => onEdit?.(message._id)}
            /> :
            <AssistantMessage
              key={message._id} id={message._id}
              errors={errors.filter(error => error._id.split("_")[2] === message._id.split("_")[2])}
              text={mergeAiResponse(AiResponse.empty, Schema.decodeSync(AiResponse.AiResponse)(message.ai)).text}
              className={`${i === messages.length - 1 ? "min-h-[calc(100vh-20rem)]" : ""}`}
              onRetry={() => {
                const [chatId, , index] = message._id.split("_")
                onRetry?.(`${chatId}_message_${Number(index) - 1}`)
              }}
            />
        )}
        {(messages.at(-1)?.type === "ChatUserMessage" && chunks.length === 0 && editMode === null) &&
          <div className="min-h-[calc(100vh-20rem)]" >
            <LoaderCircle className="animate-spin" />
          </div>
        }
        {chunks.length > 0 &&
          <AssistantMessage className="min-h-[calc(100vh-20rem)]"
            key={`${chunks?.[0]?._id?.split("_")[0]}_message_${chunks?.[0]?._id?.split("_")[2]}`}
            id={`${chunks?.[0]?._id?.split("_")[0]}_message_${chunks?.[0]?._id?.split("_")[2]}`}
            text={chunks.reduce((aiResponse, message) => mergeAiResponse(aiResponse, Schema.decodeSync(AiResponse.AiResponse)(message.ai)), AiResponse.empty).text} />
        }
      </div>
      {showScrollButton && (
        <div className="pointer-events-none left-60 fixed inset-x-0 bottom-36 z-10 flex justify-center">
          <button
            onClick={scrollToBottom}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-secondary/40 bg-[--chat-overlay] px-3 py-2 text-xs font-medium text-secondary-foreground/70 transition-colors hover:bg-secondary backdrop-blur-xl"
          >
            <span className="pb-0.5">Scroll to bottom</span>
            <ChevronDown className="-mr-1 h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
} 