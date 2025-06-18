
import type React from "react"
import Sidebar from "@/components/layout/sidebar"
import ChatArea from "@/components/chat/chat-area"
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"


export default async function ChatInterfaceClient({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: chatId } = await params
  const authSession = await auth();
  if (!authSession) {
    redirect("/auth")
  }
  return (
    <div
      className="group/sidebar-wrapper min-h-pwa flex w-full"
      style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}
    >
      <Sidebar chatId={chatId} />

      <ChatArea chatId={chatId} />
    </div>
  )
} 