"use client"

import type React from "react"

import { useState, useRef } from "react"
import Sidebar from "@/components/sidebar"
import ChatArea from "@/components/chat-area"
import type { Message } from "@/types/chat"

export default function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "262b6550-5ab9-44ab-946e-c87a8536f351",
      content: "hi",
      role: "user",
    },
    {
      id: "520bdc07-5b47-408f-8637-e47634200681",
      content: "Hello! How can I help you today?",
      role: "assistant",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${scrollHeight}px`
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      role: "user",
    }

    setMessages([...messages, userMessage])
    setInputValue("")

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px"
    }

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: "I'm an AI assistant. How can I help you today?",
        role: "assistant",
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  return (
    <div
      className="group/sidebar-wrapper min-h-pwa flex w-full"
      style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}
    >
      {/* Background */}
      <div className="absolute inset-0 dark:bg-sidebar !fixed z-0">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "var(--light-bg-gradient)",
          }}
        ></div>
        <div
          className="dark:block hidden absolute inset-0 opacity-40"
          style={{
            backgroundImage: "var(--dark-bg-gradient)",
          }}
        ></div>
        <div className="absolute inset-0 bg-noise"></div>
        <div className="absolute inset-0 bg-black/40 dark:block hidden"></div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Sidebar Toggle Button */}
      <div className="pointer-events-auto fixed left-2 z-50 flex flex-row gap-0.5 p-1 top-safe-offset-2">
        <div className="duration-250 pointer-events-none absolute inset-0 right-auto -z-10 w-10 rounded-md bg-transparent backdrop-blur-sm transition-[background-color,width] delay-0 max-sm:delay-125 max-sm:duration-125 max-sm:w-[6.75rem] max-sm:bg-sidebar/50"></div>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 z-10 h-8 w-8 text-muted-foreground"
          onClick={toggleSidebar}
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
            className="lucide lucide-panel-left"
          >
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M9 3v18"></path>
          </svg>
          <span className="sr-only">Toggle Sidebar</span>
        </button>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 duration-250 size-8 translate-x-0 text-muted-foreground opacity-100 transition-[transform,opacity] delay-150 sm:pointer-events-none sm:-translate-x-[2.125rem] sm:opacity-0 sm:delay-0 sm:duration-150">
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
            className="lucide lucide-search"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <span className="sr-only">Search</span>
        </button>
        <a
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 size-8 translate-x-0 text-muted-foreground opacity-100 transition-[transform,opacity] delay-150 duration-150 sm:pointer-events-none sm:-translate-x-[2.125rem] sm:opacity-0 sm:delay-0 sm:duration-150"
          href="/"
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
            className="lucide lucide-plus"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          <span className="sr-only">New Thread</span>
        </a>
      </div>

      {/* Chat Area */}
      <ChatArea
        messages={messages}
        inputValue={inputValue}
        textareaRef={textareaRef}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onPromptClick={handlePromptClick}
      />
    </div>
  )
}
