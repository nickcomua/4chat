import type React from "react"
import { auth } from "@/lib/auth"
import ChatInterfaceClient from "./chat-interface-client"

export default async function ChatInterface() {
  const session = await auth()
  console.log("session", session)
  return <ChatInterfaceClient session={session} />
}
