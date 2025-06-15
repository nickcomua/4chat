"use client"

import type React from "react"
import { useState } from "react"
import { PanelLeft } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import ChatArea from "./chat-area"
import type { Message } from "@/types/chat"
import PouchDB from "pouchdb";
import { usePouch } from "use-pouchdb";


export default function ChatInterfaceClient() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div
      className="group/sidebar-wrapper min-h-pwa flex w-full"
      style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}
    >
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Sidebar Toggle Button */}
      <div className="pointer-events-auto fixed left-2 z-50 flex flex-row gap-0.5 p-1 top-safe-offset-2">
        <div className="duration-250 pointer-events-none absolute inset-0 right-auto -z-10 w-10 rounded-md bg-transparent backdrop-blur-sm transition-[background-color,width] delay-0 max-sm:delay-125 max-sm:duration-125 max-sm:w-[6.75rem] max-sm:bg-sidebar/50"></div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 z-10 h-8 w-8 text-muted-foreground"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>
      </div>

      {/* Chat Area */}
      <ChatArea
      />
    </div>
  )
} 