"use client"

import { useState } from "react"
import type { Message } from "@/types/chat"
import { RefreshCcw, SquarePen, Copy, Check, ArrowUpRight } from "lucide-react"
import { toast } from "sonner"
import { parseMarkdown } from "@/services/marked"
import { Effect } from "effect"
import DOMPurify from "isomorphic-dompurify"

interface MessageProps {
  message: Message
}

export default function MessageComponent({ message }: MessageProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setIsCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setIsCopied(false), 2000)
  }

  if (message.role === "user") {
    return (
      <div data-message-id={message._id} className="flex justify-end">
        <div
          role="article"
          aria-label="Your message"
          className="group relative inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left"
        >
          <span className="sr-only">Your message: </span>
          <div className="flex flex-col gap-3">
            <div className="prose prose-pink max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
              <p>{message.content}</p>
            </div>
          </div>
          <div className="absolute right-0 mt-5 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs h-8 w-8 rounded-lg p-0"
              aria-label="Retry message"
              data-action="retry"
              data-state="closed"
              type="button"
            >
              <div className="relative size-4">
                <RefreshCcw className="absolute inset-0" aria-hidden="true" />
                <span className="sr-only">Retry</span>
              </div>
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs h-8 w-8 rounded-lg p-0"
              aria-label="Edit message"
              data-state="closed"
            >
              <SquarePen className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs h-8 w-8 rounded-lg p-0"
              aria-label="Copy message"
              data-state="closed"
              onClick={copyToClipboard}
            >
              <div className="relative size-4">
                <Copy
                  className={`absolute inset-0 transition-all duration-200 ease-snappy ${isCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
                  aria-hidden="true"
                />
                <Check
                  className={`absolute inset-0 transition-all duration-200 ease-snappy ${isCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                  aria-hidden="true"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div data-message-id={message._id} className="flex justify-start">
        <div className="group relative w-full max-w-full break-words">
          <div
            role="article"
            aria-label="Assistant message"
            className="prose prose-pink max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0"
          >
            <span className="sr-only">Assistant Reply: </span>
            <p dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(
                parseMarkdown(message.content).pipe(Effect.runSync)
              )
            }} />
          </div>
          <div className="absolute left-0 -ml-0.5 mt-2 flex w-full flex-row justify-start gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100">
            <div className="flex w-full flex-row justify-between gap-1 sm:w-auto">
              <div className="flex items-center gap-1">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs h-8 w-8 rounded-lg p-0"
                  aria-label="Copy response to clipboard"
                  data-state="closed"
                  onClick={copyToClipboard}
                >
                  <div className="relative size-4">
                    <Copy
                      className={`absolute inset-0 transition-all duration-200 ease-snappy ${isCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
                      aria-hidden="true"
                    />
                    <Check
                      className={`absolute inset-0 transition-all duration-200 ease-snappy ${isCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                      aria-hidden="true"
                    />
                  </div>
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs h-8 w-8 rounded-lg p-0"
                  aria-label="Branch off message"
                  data-state="closed"
                  type="button"
                >
                  <div className="relative size-4">
                    <ArrowUpRight className="h-4 w-4 absolute inset-0 transition-all duration-200 ease-snappy scale-100 opacity-100" />
                    <Check
                      className="absolute inset-0 transition-all duration-200 ease-snappy scale-0 opacity-0"
                      aria-hidden="true"
                    />
                  </div>
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs h-8 w-8 rounded-lg p-0"
                  aria-label="Retry message"
                  data-action="retry"
                  data-state="closed"
                  type="button"
                >
                  <div className="relative size-4">
                    <RefreshCcw className="absolute inset-0" aria-hidden="true" />
                    <span className="sr-only">Retry</span>
                  </div>
                </button>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Gemini 2.5 Flash</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
