"use client"

import { useState } from "react"
import { RefreshCcw, SquarePen, Copy, Check, ArrowUpRight } from "lucide-react"
import { toast } from "sonner"
import { MarkdownRenderer } from "@/lib/services/marked"
import { cn } from "@/lib/utils"
import type { ClassValue } from "clsx"
import { AiResponse } from "@effect/ai/AiResponse"
import { ChatAssistantMessageError } from "@/lib/types/chat"

export function UserMessage({ id, text, className, onRetry, onEdit }: { id: string, text: string, className?: ClassValue, onRetry?: () => void, onEdit?: () => void }) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setIsCopied(false), 2000)
  }
  return (
    <div data-message-id={id} className={cn("flex justify-end", className)}>
      <div
        role="article"
        aria-label="Your message"
        className="group relative inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left"
      >
        <span className="sr-only">Your message: </span>
        <div className="flex flex-col gap-3">
          <div className="prose prose-pink max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
            <MarkdownRenderer content={text.replaceAll("\n", "\n\n")} />
          </div>
        </div>
        <div className="absolute right-0 mt-5 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100">
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs h-8 w-8 rounded-lg p-0"
            aria-label="Retry message"
            data-action="retry"
            data-state="closed"
            type="button"
            onClick={onRetry}
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
            onClick={onEdit}
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
}

export function AssistantMessage({ id, text, className, onRetry, errors }: { id: string, text: string, className?: ClassValue, onRetry?: () => void, errors?: ChatAssistantMessageError[] }) {
  const [isCopied, setIsCopied] = useState(false)
  // const stats = ai.parts.filter(part => part._tag === "FinishPart").map(part => part.usage).at(0) @todo
  // console.log(stats)
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div data-message-id={id} className={cn("flex justify-start", className)}>
      <div className="group relative w-full max-w-full break-words">
        {errors && errors.length > 0 && (
          <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {errors.map((error, i) => (
              <div key={error._id} className={cn(i > 0 && "mt-2")}>
                {error.error}
              </div>
            ))}
          </div>
        )}
        <div
          role="article"
          aria-label="Assistant message"
          className="prose prose-pink max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0"
        >
          <MarkdownRenderer content={text} />
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
              {/* <button
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
              </button> */}
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs h-8 w-8 rounded-lg p-0"
                aria-label="Retry message"
                data-action="retry"
                data-state="closed"
                type="button"
                onClick={onRetry}
              >
                <div className="relative size-4">
                  <RefreshCcw className="absolute inset-0" aria-hidden="true" />
                  <span className="sr-only">Retry</span>
                </div>
              </button>
              {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Gemini 2.5 Flash</span> @todo
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

