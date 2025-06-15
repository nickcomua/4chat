"use client"

import React, { useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import ModelSelector from "./model-selector"

interface MessageInputProps {
  inputValue: string
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  selectedModel: string
  onModelChange: (model: string) => void
}

export default function MessageInput({
  inputValue,
  onInputChange,
  onSubmit,
  selectedModel,
  onModelChange,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle textarea auto-resize
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e)
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${scrollHeight}px`
    }
  }

  // Reset textarea height after submit
  const handleLocalSubmit = (e: React.FormEvent) => {
    onSubmit(e)
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px"
    }
  }

  // Handle keyboard events for Enter/Shift+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (inputValue.trim()) {
        handleLocalSubmit(e as any)
      }
    }
  }

  return (
    <div className="pointer-events-none absolute bottom-0 z-10 w-full px-2">
      <div className="relative mx-auto flex w-full max-w-3xl flex-col text-center">
        <div className="pointer-events-none">
          <div className="pointer-events-auto">
            <div
              className="border-reflect rounded-t-[20px] bg-[--chat-input-background] p-2 pb-0 backdrop-blur-lg ![--c:--chat-input-gradient]"
              style={
                {
                  "--gradientBorder-gradient":
                    "linear-gradient(180deg, var(--min), var(--max), var(--min)), linear-gradient(15deg, var(--min) 50%, var(--max))",
                  "--start": "#000000e0",
                  "--opacity": "1",
                } as React.CSSProperties
              }
            >
              <div
                className="relative flex w-full flex-col items-stretch gap-2 rounded-t-xl border border-b-0 border-white/70 bg-[--chat-input-background] px-3 pt-3 text-secondary-foreground outline outline-8 outline-[hsl(var(--chat-input-gradient)/0.5)] pb-safe-offset-3 max-sm:pb-6 sm:max-w-3xl dark:border-[hsl(0,0%,83%)]/[0.04] dark:bg-secondary/[0.045] dark:outline-chat-background/40"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.1) 0px 80px 50px 0px, rgba(0, 0, 0, 0.07) 0px 50px 30px 0px, rgba(0, 0, 0, 0.06) 0px 30px 15px 0px, rgba(0, 0, 0, 0.04) 0px 15px 8px, rgba(0, 0, 0, 0.04) 0px 6px 4px, rgba(0, 0, 0, 0.02) 0px 2px 2px",
                }}
              >
                <div className="flex flex-grow flex-col">
                  <div></div>
                  <div className="flex flex-grow flex-row items-start">
                    <textarea
                      name="input"
                      id="chat-input"
                      placeholder="Type your message here..."
                      className="w-full resize-none bg-transparent text-base leading-6 text-foreground outline-none placeholder:text-secondary-foreground/60 disabled:opacity-0"
                      aria-label="Message input"
                      aria-describedby="chat-input-description"
                      autoComplete="off"
                      style={{ height: "48px" }}
                      value={inputValue}
                      onChange={handleLocalInputChange}
                      ref={textareaRef}
                      onKeyDown={handleKeyDown}
                    />
                    <div id="chat-input-description" className="sr-only">
                      Press Enter to send, Shift + Enter for new line
                    </div>
                  </div>

                  <div className="-mb-px mt-2 flex w-full flex-row-reverse justify-between">
                    <div
                      className="-mr-0.5 -mt-0.5 flex items-center justify-center gap-2"
                      aria-label="Message actions"
                    >
                      <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect bg-[rgb(162,59,103)] font-semibold shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 w-9 relative rounded-lg p-2 text-pink-50"
                        onClick={handleLocalSubmit}
                        aria-label={inputValue.trim() ? "Send message" : "Message requires text"}
                        data-state="closed"
                        disabled={!inputValue.trim()}
                      >
                        <ArrowUp className="!size-5" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pr-2 sm:flex-row sm:items-center">
                      <div className="ml-[-7px] flex items-center gap-1">
                        <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 