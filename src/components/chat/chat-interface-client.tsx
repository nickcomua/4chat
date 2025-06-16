
import type React from "react"
import Sidebar from "@/components/layout/sidebar"
import ChatArea from "@/components/chat/chat-area"


export default function ChatInterfaceClient() {
  return (
    <div
      className="group/sidebar-wrapper min-h-pwa flex w-full"
      style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}
    >
      <Sidebar />

      <ChatArea/>
    </div>
  )
} 