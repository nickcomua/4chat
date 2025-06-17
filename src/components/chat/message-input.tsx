"use client"

import React, { useEffect, useRef } from "react"
import { ArrowUp } from "lucide-react"
import ModelSelector from "./model-selector"
import { Button } from "@/components/ui/button"

interface MessageInputProps {
  inputValue: string
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => boolean
}

export default function MessageInput({
  inputValue,
  onInputChange,
  onSubmit,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])
  // Handle textarea auto-resize
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e)
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px"
      const scrollHeight = Math.min(textareaRef.current.scrollHeight, 240)
      textareaRef.current.style.height = `${scrollHeight}px`
    }
  }

  // Reset textarea height after submit
  const handleLocalSubmit = (e: React.FormEvent) => {
    if (!onSubmit(e)) return
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
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-2 pb-2">
      <div className="relative mx-auto flex w-full max-w-3xl flex-col">
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
                  <div className="-mr-0.5 -mt-0.5 flex items-center justify-center gap-2">
                    <Button
                      onClick={handleLocalSubmit}
                      disabled={!inputValue.trim()}
                      className="inline-flex h-9 w-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[rgb(162,59,103)] p-2 text-sm font-semibold text-pink-50 shadow transition-colors hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20"
                      aria-label={inputValue.trim() ? "Send message" : "Message requires text"}
                    >
                      <ArrowUp className="!size-5" />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 pr-2 sm:flex-row sm:items-center">
                    <div className="ml-[-7px] flex items-center gap-1">
                      <ModelSelector />
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