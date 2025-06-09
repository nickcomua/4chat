"use client"

import type React from "react"

import type { RefObject } from "react"
import type { Message } from "@/types/chat"
import { Settings2, SunMoon, ArrowUp, Globe, Paperclip, ChevronDown } from "lucide-react"
import Link from "next/link"
import MessageComponent from "@/components/message"
import WelcomeScreen from "@/components/welcome-screen"

interface ChatAreaProps {
  messages: Message[]
  inputValue: string
  textareaRef: RefObject<HTMLTextAreaElement>
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onPromptClick: (prompt: string) => void
  setInputValue: React.Dispatch<React.SetStateAction<string>>
}

export default function ChatArea({
  messages,
  inputValue,
  textareaRef,
  onInputChange,
  onSubmit,
  onPromptClick,
  setInputValue,
}: ChatAreaProps) {
  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
      {/* Chat Background */}
      <div className="absolute bottom-0 top-0 w-full overflow-hidden border-l border-t border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none sm:translate-y-3.5 sm:rounded-tl-xl">
        <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]"></div>
      </div>

      {/* Top Gradient */}
      <div className="absolute inset-x-3 top-0 z-10 box-content overflow-hidden border-b border-chat-border bg-gradient-noise-top/80 backdrop-blur-md transition-[transform,border] ease-snappy blur-fallback:bg-gradient-noise-top max-sm:hidden sm:h-3.5">
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
        <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-noise-top blur-fallback:hidden"></div>
      </div>

      {/* Top Right Corner */}
      <div className="absolute bottom-0 top-0 w-full">
        <div className="fixed right-2 top-2 z-20 max-sm:hidden" style={{ right: "var(--firefox-scrollbar, 0.5rem)" }}>
          <div className="flex flex-row items-center bg-gradient-noise-top text-muted-foreground gap-0.5 rounded-md p-1 transition-all rounded-bl-xl">
            <Link aria-label="Go to settings" role="button" data-state="closed" href="/settings/customization">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 size-8 rounded-bl-xl">
                <Settings2 className="size-4" />
              </button>
            </Link>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 group relative size-8"
              tabIndex={-1}
              data-state="closed"
            >
              <SunMoon className="absolute size-4" />
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          className="absolute inset-0 overflow-y-scroll sm:pt-3.5"
          style={{ paddingBottom: "144px", scrollbarGutter: "stable both-edges" }}
        >
          <div
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10"
          >
            {messages.length === 0 ? (
              <WelcomeScreen
                onPromptClick={(prompt) => {
                  setInputValue(prompt)
                  if (textareaRef.current) {
                    textareaRef.current.focus()
                  }
                }}
              />
            ) : (
              messages.map((message) => <MessageComponent key={message.id} message={message} />)
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="pointer-events-none absolute bottom-0 z-10 w-full px-2">
        <div className="relative mx-auto flex w-full max-w-3xl flex-col text-center">
          <div className="flex justify-center pb-4">
            <button className="justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:hover:bg-secondary/50 h-8 px-3 text-xs pointer-events-auto flex items-center gap-2 rounded-full border border-secondary/40 bg-[--chat-overlay] text-secondary-foreground/70 backdrop-blur-xl hover:bg-secondary">
              <span className="pb-0.5">Scroll to bottom</span>
              <ChevronDown className="-mr-1 h-4 w-4" />
            </button>
          </div>

          <div className="pointer-events-none">
            <div className="pointer-events-auto mx-auto w-fit">
              <div className="m-3 -mb-px flex justify-center">
                <div className="prose rounded-t-md border border-secondary/40 bg-chat-background/50 p-4 text-sm text-secondary-foreground/80 backdrop-blur-md blur-fallback:bg-chat-background">
                  Make sure you agree to our{" "}
                  <a
                    href="/terms-of-service"
                    className="text-foreground hover:text-primary dark:hover:text-muted-foreground"
                  >
                    Terms
                  </a>{" "}
                  and our{" "}
                  <a
                    href="/privacy-policy"
                    className="text-foreground hover:text-primary dark:hover:text-muted-foreground"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
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
                <form
                  className="relative flex w-full flex-col items-stretch gap-2 rounded-t-xl border border-b-0 border-white/70 bg-[--chat-input-background] px-3 pt-3 text-secondary-foreground outline outline-8 outline-[hsl(var(--chat-input-gradient)/0.5)] pb-safe-offset-3 max-sm:pb-6 sm:max-w-3xl dark:border-[hsl(0,0%,83%)]/[0.04] dark:bg-secondary/[0.045] dark:outline-chat-background/40"
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.1) 0px 80px 50px 0px, rgba(0, 0, 0, 0.07) 0px 50px 30px 0px, rgba(0, 0, 0, 0.06) 0px 30px 15px 0px, rgba(0, 0, 0, 0.04) 0px 15px 8px, rgba(0, 0, 0, 0.04) 0px 6px 4px, rgba(0, 0, 0, 0.02) 0px 2px 2px",
                  }}
                  onSubmit={onSubmit}
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
                        onChange={onInputChange}
                        ref={textareaRef}
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
                          type="submit"
                          aria-label={inputValue.trim() ? "Send message" : "Message requires text"}
                          data-state="closed"
                          disabled={!inputValue.trim()}
                        >
                          <ArrowUp className="!size-5" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 pr-2 sm:flex-row sm:items-center">
                        <div className="ml-[-7px] flex items-center gap-1">
                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-8 rounded-md text-xs relative gap-2 px-2 py-1.5 -mb-2 text-muted-foreground"
                            type="button"
                            id="radix-:r8:"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            data-state="closed"
                          >
                            <div className="text-left text-sm font-medium">Gemini 2.5 Flash</div>
                            <ChevronDown className="right-0 size-4" />
                          </button>

                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 px-3 text-xs -mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 py-1.5 pl-2 pr-2.5 text-muted-foreground max-sm:p-2"
                            aria-label="Web search not available on free plan"
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="radix-:ra:"
                            data-state="closed"
                          >
                            <Globe className="h-4 w-4" />
                            <span className="max-sm:hidden">Search</span>
                          </button>

                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs -mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 px-2 py-1.5 pr-2.5 text-muted-foreground max-sm:p-2"
                            aria-label="Attaching files is a subscriber-only feature"
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="radix-:rb:"
                            data-state="closed"
                          >
                            <Paperclip className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
