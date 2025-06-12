"use client"

import type React from "react"

import type { RefObject } from "react"
import type { Message } from "@/types/chat"
import {
  Settings2,
  ArrowUp,
  GlobeIcon,
  Paperclip,
  ChevronDown,
  Search,
  Pin,
  Eye,
  FileText,
  Brain,
  Gem,
  FlaskConical,
  Filter,
  ChevronLeft,
  Zap,
  List,
} from "lucide-react"
import Link from "next/link"
import MessageComponent from "@/components/message"
import WelcomeScreen from "@/components/welcome-screen"
import { useState, useRef, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface ChatAreaProps {
  messages: Message[]
  inputValue: string
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onPromptClick: (prompt: string) => void
  setInputValue: React.Dispatch<React.SetStateAction<string>>
}

export default function ChatArea({
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  onPromptClick,
  setInputValue,
}: ChatAreaProps) {
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

  // Handle prompt click with focus
  const handleLocalPromptClick = (prompt: string) => {
    onPromptClick(prompt)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Reset textarea height after submit
  const handleLocalSubmit = (e: React.FormEvent) => {
    onSubmit(e)
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px"
    }
  }

  const [selectedModel, setSelectedModel] = useState("Gemini 2.5 Flash")
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const [modelSearchQuery, setModelSearchQuery] = useState("")
  const [modelSelectionView, setModelSelectionView] = useState<"favorites" | "all">("favorites")

  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showOnlyFreeModels, setShowOnlyFreeModels] = useState(false)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)

  const allFeatures = ["Fast", "Vision", "Search", "PDFs", "Reasoning", "Effort Control"]
  const featureIcons: { [key: string]: React.ElementType } = {
    Fast: Zap,
    Vision: Eye,
    Search: GlobeIcon,
    PDFs: FileText,
    Reasoning: Brain,
    "Effort Control": Settings2,
  }

  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
      {/* Chat Background */}
      <div className="absolute bottom-0 top-0 w-full overflow-hidden border-l border-t border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none sm:translate-y-3.5 sm:rounded-tl-xl"></div>

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
              onClick={() => {
                const html = document.documentElement
                const isDark = html.classList.contains("dark")
                if (isDark) {
                  html.classList.remove("dark")
                  localStorage.setItem("theme", "light")
                } else {
                  html.classList.add("dark")
                  localStorage.setItem("theme", "dark")
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-sun absolute size-4 rotate-0 scale-100 transition-all duration-200 dark:rotate-90 dark:scale-0"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-moon absolute size-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
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
                onPromptClick={handleLocalPromptClick}
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
                  onSubmit={handleLocalSubmit}
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
                          <DropdownMenu open={isModelDropdownOpen} onOpenChange={setIsModelDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-8 rounded-md text-xs relative gap-2 px-2 py-1.5 -mb-2 text-muted-foreground"
                                type="button"
                              >
                                <div className="text-left text-sm font-medium">{selectedModel}</div>
                                <ChevronDown className="right-0 size-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="z-50 min-w-[8rem] bg-popover text-popover-foreground shadow-md !outline !outline-1 !outline-chat-border/20 dark:!outline-white/5 relative overflow-hidden rounded-lg !border-none p-0 pb-11 pt-10 max-w-[calc(100vw-2rem)] transition-[height,width] ease-snappy max-sm:mx-4 sm:w-[640px] max-h-[calc(100vh-80px)] min-h-[300px]"
                              side="top"
                              align="start"
                            >
                              {/* Search Header */}
                              <div className="fixed inset-x-4 top-0 rounded-t-lg bg-popover px-3.5 pt-0.5 sm:inset-x-0">
                                <div className="flex items-center">
                                  <Search className="ml-px mr-3 !size-4 text-muted-foreground/75" />
                                  <input
                                    role="searchbox"
                                    aria-label="Search models"
                                    placeholder="Search models..."
                                    className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
                                    value={modelSearchQuery}
                                    onChange={(e) => setModelSearchQuery(e.target.value)}
                                  />
                                </div>
                                <div className="border-b border-chat-border px-3"></div>
                              </div>

                              {/* Models Grid */}
                              <div className="max-h-full overflow-y-scroll px-1.5 sm:w-[640px] scroll-shadow">
                                <div className="flex w-full flex-wrap justify-start gap-3.5 pb-4 pl-3 pr-2 pt-2.5">
                                  {modelSelectionView === "favorites" && (
                                    <>
                                      <div className="-mb-2 ml-0 flex w-full select-none items-center justify-start gap-1.5 text-color-heading">
                                        <Pin className="mt-px size-4" />
                                        Favorites
                                      </div>
                                      {[
                                        {
                                          name: "Gemini 2.5 Flash",
                                          provider: "Google",
                                          features: ["Vision", "Search", "PDFs"],
                                        },
                                        {
                                          name: "Gemini 2.5 Pro",
                                          provider: "Google",
                                          features: ["Vision", "Search", "PDFs", "Reasoning"],
                                          experimental: true,
                                        },
                                        {
                                          name: "GPT ImageGen",
                                          provider: "OpenAI",
                                          features: ["Vision"],
                                          premium: true,
                                        },
                                        { name: "o4-mini", provider: "OpenAI", features: ["Vision", "Reasoning"] },
                                        {
                                          name: "Claude 4 Sonnet (Reasoning)",
                                          provider: "Anthropic",
                                          features: ["Vision", "PDFs", "Reasoning"],
                                          premium: true,
                                        },
                                        {
                                          name: "DeepSeek R1 (Llama Distilled)",
                                          provider: "DeepSeek",
                                          features: ["Reasoning"],
                                        },
                                      ]
                                        .filter((model) => {
                                          if (!modelSearchQuery) return true
                                          return (
                                            model.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
                                            model.provider.toLowerCase().includes(modelSearchQuery.toLowerCase())
                                          )
                                        })
                                        .filter((model) => {
                                          if (activeFilters.length === 0) return true
                                          return activeFilters.every((filter) => model.features.includes(filter))
                                        })
                                        .filter((model) => {
                                          if (!showOnlyFreeModels) return true
                                          return !model.premium && !model.experimental // Adjust as needed
                                        })
                                        .map((model) => (
                                          <div key={model.name} className="group relative">
                                            <button
                                              className="group relative flex h-[148px] w-[108px] cursor-pointer flex-col items-start gap-0.5 overflow-hidden rounded-xl border border-chat-border/50 bg-sidebar/20 px-1 py-3 text-color-heading hover:bg-accent/30 hover:text-color-heading"
                                              onClick={() => {
                                                setSelectedModel(model.name)
                                                setIsModelDropdownOpen(false)
                                              }}
                                            >
                                              <div className="flex w-full flex-col items-center justify-center gap-1 font-medium transition-colors">
                                                <div className="size-7 text-[--model-primary] bg-muted rounded flex items-center justify-center">
                                                  {model.provider.charAt(0)}
                                                </div>
                                                <div className="w-full text-center text-[--model-primary]">
                                                  <div className="text-base font-semibold">
                                                    {model.name.split(" ")[0]}
                                                  </div>
                                                  <div className="-mt-0.5 text-sm font-semibold">
                                                    {model.name.split(" ").slice(1).join(" ")}
                                                  </div>
                                                </div>
                                                {model.experimental && (
                                                  <div className="absolute right-1.5 top-1.5 text-[--model-muted] opacity-80">
                                                    <FlaskConical className="size-4" />
                                                  </div>
                                                )}
                                                {model.premium && (
                                                  <div className="absolute right-1.5 top-1.5 text-[--model-muted] opacity-80">
                                                    <Gem className="size-4" />
                                                  </div>
                                                )}
                                              </div>
                                              <div className="absolute inset-x-0 bottom-3 flex w-full items-center justify-center gap-2">
                                                {model.features.map((feature) => (
                                                  <div
                                                    key={feature}
                                                    className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-md text-[--color] dark:text-[--color-dark]"
                                                  >
                                                    <div className="absolute inset-0 bg-current opacity-20 dark:opacity-15"></div>
                                                    {feature === "Vision" && <Eye className="h-4 w-4" />}
                                                    {feature === "Search" && <GlobeIcon className="h-4 w-4" />}
                                                    {feature === "PDFs" && <FileText className="h-4 w-4" />}
                                                    {feature === "Reasoning" && <Brain className="h-4 w-4" />}
                                                  </div>
                                                ))}
                                              </div>
                                            </button>
                                          </div>
                                        ))}
                                    </>
                                  )}
                                  {modelSelectionView === "all" && (
                                    <>
                                      <div className="-mb-2 ml-2 mt-1 w-full select-none text-color-heading">
                                        All Models
                                      </div>
                                      {[
                                        ...[
                                          {
                                            name: "Gemini 2.5 Flash",
                                            provider: "Google",
                                            features: ["Vision", "Search", "PDFs"],
                                          },
                                          {
                                            name: "Gemini 2.5 Pro",
                                            provider: "Google",
                                            features: ["Vision", "Search", "PDFs", "Reasoning"],
                                            experimental: true,
                                          },
                                          {
                                            name: "GPT ImageGen",
                                            provider: "OpenAI",
                                            features: ["Vision"],
                                            premium: true,
                                          },
                                          { name: "o4-mini", provider: "OpenAI", features: ["Vision", "Reasoning"] },
                                          {
                                            name: "Claude 4 Sonnet (Reasoning)",
                                            provider: "Anthropic",
                                            features: ["Vision", "PDFs", "Reasoning"],
                                            premium: true,
                                          },
                                          {
                                            name: "DeepSeek R1 (Llama Distilled)",
                                            provider: "DeepSeek",
                                            features: ["Reasoning"],
                                          },
                                        ],
                                        ...[
                                          {
                                            name: "Gemini 2.0 Flash",
                                            provider: "Google",
                                            features: ["Vision", "Search", "PDFs"],
                                          },
                                          { name: "GPT-4o", provider: "OpenAI", features: ["Vision"] },
                                          {
                                            name: "Claude 3.5 Sonnet",
                                            provider: "Anthropic",
                                            features: ["Vision", "PDFs"],
                                            premium: true,
                                          },
                                        ],
                                      ]
                                        .filter((model) => {
                                          if (!modelSearchQuery) return true
                                          return (
                                            model.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
                                            model.provider.toLowerCase().includes(modelSearchQuery.toLowerCase())
                                          )
                                        })
                                        .filter((model) => {
                                          if (activeFilters.length === 0) return true
                                          return activeFilters.every((filter) => model.features.includes(filter))
                                        })
                                        .filter((model) => {
                                          if (!showOnlyFreeModels) return true
                                          return !model.premium && !model.experimental
                                        })
                                        .map((model) => (
                                          <div key={model.name} className="group relative">
                                            <button
                                              className="group relative flex h-[148px] w-[108px] cursor-pointer flex-col items-start gap-0.5 overflow-hidden rounded-xl border border-chat-border/50 bg-sidebar/20 px-1 py-3 text-color-heading hover:bg-accent/30 hover:text-color-heading"
                                              onClick={() => {
                                                setSelectedModel(model.name)
                                                setIsModelDropdownOpen(false)
                                              }}
                                            >
                                              <div className="flex w-full flex-col items-center justify-center gap-1 font-medium transition-colors">
                                                <div className="size-7 text-[--model-primary] bg-muted rounded flex items-center justify-center">
                                                  {model.provider.charAt(0)}
                                                </div>
                                                <div className="w-full text-center text-[--model-primary]">
                                                  <div className="text-base font-semibold">
                                                    {model.name.split(" ")[0]}
                                                  </div>
                                                  <div className="-mt-0.5 text-sm font-semibold">
                                                    {model.name.split(" ").slice(1).join(" ")}
                                                  </div>
                                                </div>
                                                {model.experimental && (
                                                  <div className="absolute right-1.5 top-1.5 text-[--model-muted] opacity-80">
                                                    <FlaskConical className="size-4" />
                                                  </div>
                                                )}
                                                {model.premium && (
                                                  <div className="absolute right-1.5 top-1.5 text-[--model-muted] opacity-80">
                                                    <Gem className="size-4" />
                                                  </div>
                                                )}
                                              </div>
                                              <div className="absolute inset-x-0 bottom-3 flex w-full items-center justify-center gap-2">
                                                {model.features.map((feature) => (
                                                  <div
                                                    key={feature}
                                                    className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-md text-[--color] dark:text-[--color-dark]"
                                                  >
                                                    <div className="absolute inset-0 bg-current opacity-20 dark:opacity-15"></div>
                                                    {feature === "Vision" && <Eye className="h-4 w-4" />}
                                                    {feature === "Search" && <GlobeIcon className="h-4 w-4" />}
                                                    {feature === "PDFs" && <FileText className="h-4 w-4" />}
                                                    {feature === "Reasoning" && <Brain className="h-4 w-4" />}
                                                  </div>
                                                ))}
                                              </div>
                                            </button>
                                          </div>
                                        ))}
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Footer */}
                              <div className="fixed inset-x-4 bottom-0 flex items-center justify-between rounded-b-lg bg-popover pb-1 pl-1 pr-2.5 pt-1.5 sm:inset-x-0">
                                <div className="absolute inset-x-3 top-0 border-b border-chat-border"></div>
                                <button
                                  className="justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-9 px-4 py-2 flex items-center gap-2 pl-2 text-sm text-muted-foreground"
                                  onClick={() => {
                                    setModelSelectionView((prev) => (prev === "favorites" ? "all" : "favorites"))
                                  }}
                                  aria-label={
                                    modelSelectionView === "favorites"
                                      ? "Switch to all models view"
                                      : "Switch to favorites view"
                                  }
                                >
                                  {modelSelectionView === "favorites" ? (
                                    <>
                                      {/* Icon for "All Models" (e.g., List or ChevronRight) */}
                                      <List className="h-4 w-4" />
                                      <span>All Models</span>
                                    </>
                                  ) : (
                                    <>
                                      {/* Icon for "Favorites" (e.g., Pin or ChevronLeft as in screenshot) */}
                                      <ChevronLeft className="h-4 w-4" />
                                      <span>Favorites</span>
                                    </>
                                  )}
                                </button>
                                <DropdownMenu open={isFilterDropdownOpen} onOpenChange={setIsFilterDropdownOpen}>
                                  <DropdownMenuTrigger asChild>
                                    <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-8 rounded-md text-xs relative gap-2 px-2 text-muted-foreground">
                                      <Filter className="h-4 w-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-56" side="top" align="end">
                                    {allFeatures.map((feature) => {
                                      const IconComponent = featureIcons[feature]
                                      return (
                                        <DropdownMenuCheckboxItem
                                          key={feature}
                                          checked={activeFilters.includes(feature)}
                                          onCheckedChange={(checked) => {
                                            setActiveFilters((prev) =>
                                              checked ? [...prev, feature] : prev.filter((f) => f !== feature),
                                            )
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            {IconComponent && (
                                              <div
                                                className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-md"
                                                style={
                                                  {
                                                    "--color-dark": "hsl(46 77% 79%)",
                                                    "--color": "hsl(46 77% 52%)",
                                                  } as React.CSSProperties
                                                }
                                              >
                                                <div className="absolute inset-0 bg-current opacity-20 dark:opacity-15"></div>
                                                <IconComponent className="h-4 w-4" />
                                              </div>
                                            )}
                                            <span>{feature}</span>
                                          </div>
                                        </DropdownMenuCheckboxItem>
                                      )
                                    })}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem
                                      checked={showOnlyFreeModels}
                                      onCheckedChange={setShowOnlyFreeModels}
                                    >
                                      Only show free plan models
                                    </DropdownMenuCheckboxItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 px-3 text-xs -mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 py-1.5 pl-2 pr-2.5 text-muted-foreground max-sm:p-2"
                            aria-label="Web search not available on free plan"
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="radix-:ra:"
                            data-state="closed"
                          >
                            <GlobeIcon className="h-4 w-4" />
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
