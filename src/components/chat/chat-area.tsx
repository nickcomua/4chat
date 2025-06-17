"use client"

import React, { useEffect, useState } from "react"
import { Chat, ChatAssistantMessageChunk, ChatAssistantMessage, ChatMessage, ChatUserMessage } from "@/lib/types/chat"
import { useFind, usePouch, useAllDocs } from 'use-pouchdb'
import TopBar from "@/components/layout/top-bar"
import MessageList from "./message-list"
import MessageInput from "./message-input"
import { ChatSettings } from "@/lib/types/settings"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { sendMessage } from "@/lib/ai/send"
import { Effect } from "effect"
import { TextPart, UserMessage } from "@effect/ai/AiInput"
import WelcomeScreen from "./welcome-screen"

export default function ChatArea() {
  const { id: chatId }: { id: string | undefined } = useParams()
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const chatsDb = usePouch<Chat>("chats")
  const messageDb = usePouch<ChatMessage>("messages")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]
  const selectedModel = profile?.modelSettings?.preferredModel ?? "gemini-2-0-flash"
  // const { rows: _messages, loading, error, state } = useAllDocs<ChatMessage>({
  //   db: "messages",
  //   startkey: `${chatId}_`,
  //   endkey: `${chatId}_\uffff`,
  //   include_docs: true,
  // })
  const { docs: _messages, loading, error, state } =
    useFind<ChatMessage>({
      db: "messages",
      // index: {
      //   fields: ["chatId", "index"]
      // },
      selector: { _id: { $gte: `${chatId}_`, $lte: `${chatId}_\uffff` } },
      sort: ["_id"],
    })

  const [chunks, setChunks] = useState<ChatAssistantMessageChunk[]>([])
  const [messages, setMessages] = useState<(ChatUserMessage | ChatAssistantMessage)[]>([])
  useEffect(() => {
    const [newChunks, _rests] = _messages.reduce((acc: [ChatAssistantMessageChunk[], (ChatUserMessage | ChatAssistantMessage)[]], row) => {
      if (row.type === "ChatAssistantMessageChunk" ) {
        acc[0].push(row)
      } else {
        acc[1].push(row)
      }
      return acc
    }, [[], []])
    const rests = _rests.toSorted((a, b) => Number(a._id.split("_")[1]) - Number(b._id.split("_")[1]))
    if (rests.findLast(row => newChunks?.[0]?._id.startsWith(row._id))) {
      setChunks([])
    } else {
      setChunks(newChunks)
    }
    setChunks(newChunks)
    setMessages(rests)
  }, [_messages])

  //  Object.values(Object.groupBy(_messages.map(row => row.doc!), row => row._id.split("_")[1]))
  // .map(v => v.length === 1 ? v[0] : ).toSorted((a, b) => Number(a._id.split("_")[1]) - Number(b._id.split("_")[1]))
  // (_messages, row => row.doc?._id)


  // _messages.filter(row => row.doc?.type !== "ChatAssistantMessageChunk")
  //  useFind<ChatMessage>({
  //   db: "messages",
  //   index: {
  //     fields: ["chatId", "index"]
  //   },
  //   selector: { chatId: chatId ?? "", index: { $gt: null } },
  //   sort: ["chatId", "index"],
  // })
  useEffect(() => {
    if (chatId && !messages.length && !loading) {
      router.push("/")
    }
  }, [chatId, messages, router])
  function onSubmit() {
    console.log(!inputValue.trim(), !profile?.userProfile?.userId, chunks.length)
    if (!inputValue.trim()) return false
    if (!profile?.userProfile?.userId) return false
    if (chunks.length) return false
    const newChatId = chatId ?? crypto.randomUUID()
    sendMessage({
      inputValue,
      chatId: newChatId,
      messages: messages,
      profile,
      selectedModel,
      userId: profile?.userProfile?.userId
    }).catch((error: Error) => {
      console.error(error)
      // toast.error(error.message)
    })
    setInputValue("")

    const p1 = messageDb.put(
      ChatUserMessage.make({
        _id: `${newChatId}_${messages.length}`,
        type: "ChatUserMessage",
        createdAt: +new Date(),
        ai: UserMessage.make({
          parts: [
            TextPart.make({
              text: inputValue,
            }),
          ],
        })
      }))

    if (newChatId !== chatId) {
      const p2 = chatsDb.put(Chat.make({
        _id: newChatId,
        name: inputValue.slice(0, 100),
        createdAt: +new Date(),
      }))
      Promise.all([p1, p2]).then(() => {
        router.push(`/chat/${newChatId}`)
      })
    }
    return true
  }

  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
      {/* Chat Background */}
      <div className="absolute bottom-0 top-0 w-full overflow-hidden border-l border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy max-sm:border-none"></div>

      {/* Content Container */}
      <div className="absolute bottom-0 top-0 w-full">
        {/* @todo move topbar to sidebar */}
        <TopBar />
        {messages.length !== 0 &&
          <MessageList messages={messages} chunks={chunks} />
        }
        {
          !chatId &&
          <WelcomeScreen onPromptClick={setInputValue} />
        }
      </div>

      {/* Input Area */}
      <MessageInput
        inputValue={inputValue}
        onInputChange={(e) => {
          setInputValue(e.target.value)
        }}
        onSubmit={onSubmit}
      />
    </main>
  )
} 