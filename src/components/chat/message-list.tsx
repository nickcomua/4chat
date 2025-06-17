import React, { useEffect, useRef, useState } from "react"
import type { ChatAssistantMessage, ChatAssistantMessageChunk, ChatMessage, ChatUserMessage } from "@/lib/types/chat"
import { UserMessage, AssistantMessage } from "./message"
import WelcomeScreen from "./welcome-screen"
import { ChevronDown } from "lucide-react"
import { AiResponse } from "@effect/ai"
import { mergeAiResponse } from "@/lib/ai/common"


export default function MessageList({ messages, chunks }: {
  messages: (ChatUserMessage | ChatAssistantMessage)[]
  chunks: ChatAssistantMessageChunk[]
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
    console.log("scrollToBottom", container.scrollHeight)
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
    // Check if a new message was added
    // if (messages.length > prevMessagesLengthRef.current) {
    const lastMessage = messages.at(-1)
    // If it's a user message, scroll to top
    if (lastMessage?.type === "ChatUserMessage" && chunks.length === 0) {
      console.log("scrollToBottom", lastMessage?.type, chunks.length)
      console.log("scrollToBottom", scrollContainerRef.current, document.querySelector(`[data-message-id='${lastMessage._id}']`))
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight - window.innerHeight + document.querySelector(`[data-message-id='${lastMessage._id}']`)!.getBoundingClientRect().height,
          behavior: "instant"
        })
      })
    }
    // }
    // prevMessagesLengthRef.current = messages.length
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
        className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10"
      >
        {messages.map((message, i) =>
          message.type === "ChatUserMessage" ?
            <UserMessage key={message._id} id={message._id} text={message.ai.parts.filter(part => part._tag === "TextPart").map(part => part.text).join("")} /> :
            <AssistantMessage
              key={message._id} id={message._id}
              text={mergeAiResponse(AiResponse.empty, message.ai).text}
              className={`${i === messages.length - 1 ? "min-h-[calc(100vh-20rem)]" : ""}`}
            />
        )}
        {(chunks.length > 0 || messages.at(-1)?.type === "ChatUserMessage") &&
          <AssistantMessage className="min-h-[calc(100vh-20rem)]"
            key={chunks?.[0]?._id?.split("_").slice(0, 2).join("_") ?? "chunks"}
            id={chunks?.[0]?._id?.split("_").slice(0, 2).join("_") ?? "chunks"}
            text={chunks.reduce((aiResponse, message) => mergeAiResponse(aiResponse, message.ai), AiResponse.empty).text} />
        }
        {/* {
          messages.at(-1)?.type === "ChatUserMessage" &&
          <div key={`${messages.at(-1)?._id.split("_")[0]}_${Number(messages.at(-1)?._id.split("_")[1]) + 1}`} className="relative w-full max-w-full h-screen" />
        } */}
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