"use client"
import React, { useEffect, useState, } from "react"
import { Chat, ChatAssistantMessageChunk, ChatAssistantMessage, ChatMessage, ChatUserMessage, ChatAssistantMessageError } from "@/lib/types/chat"
import { useFind, usePouch, useDoc } from 'use-pouchdb'
import TopBar from "@/components/layout/top-bar"
import MessageList from "./message-list"
import MessageInput from "./message-input"
import { ChatSettings } from "@/lib/types/settings"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
// import { sendMessage } from "@/lib/ai/send"
import { Effect, Schema } from "effect"
import { TextPart, UserMessage } from "@effect/ai/AiInput"
import WelcomeScreen from "./welcome-screen"

const sendMessageWorkflow = async (params: {
  hash: string
  chat: Chat
  messages: (ChatUserMessage | ChatAssistantMessage)[]
  profile: ChatSettings
  selectedModel: string
}, abortSignal: AbortSignal | null = null) => {
  const response = await fetch("/api/ai/send", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json"
    },
    signal: abortSignal
  })
  if (!response.ok) {
    throw new Error("Failed to send message")
  }
  return response.json()
}

export default function ChatArea({ chatId }: { chatId: string }) {
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [editMode, setEditMode] = useState<number | null>(null)
  const chatsDb = usePouch<Chat>("chats")
  const { doc: chat } = useDoc<Chat>(chatId, { db: "chats" })
  const messageDb = usePouch<ChatMessage>("messages")
  const { doc: profile } = useDoc<ChatSettings>("0", { db: "profile" })
  const selectedModel = profile?.modelSettings?.preferredModel ?? "gemini-2-0-flash"
  // const { rows: _messages, loading, error, state } = useAllDocs<ChatMessage>({
  //   db: "messages",
  //   startkey: `${chatId}_`,
  //   endkey: `${chatId}_\uffff`,
  //   include_docs: true,
  // })
  const { docs: _chunk } =
    useFind<ChatAssistantMessageChunk>({
      db: "messages",
      selector: { _id: { $gte: `${chatId}_chank_`, $lte: `${chatId}_chank_\uffff` } },
      sort: ["_id"],
    })
  const { docs: errors } =
    useFind<ChatAssistantMessageError>({
      db: "messages",
      selector: { _id: { $gte: `${chatId}_error_`, $lte: `${chatId}_error_\uffff` } },
      sort: ["_id"],
    })
  const { docs: _messages, loading, error, state } =
    useFind<ChatAssistantMessage | ChatUserMessage>({
      db: "messages",
      // index: {
      //   fields: ["chatId", "index"]
      // },
      selector: { _id: { $gte: `${chatId}_message_`, $lte: `${chatId}_message_\uffff` } },
      sort: ["_id"],
    })

  const [chunks, setChunks] = useState<ChatAssistantMessageChunk[]>([])
  const [messages, setMessages] = useState<(ChatUserMessage | ChatAssistantMessage)[]>([])
  const [fakeMessage, setFakeMessage] = useState<ChatUserMessage | null>(null)
  useEffect(() => {
    const rests = _messages.toSorted((a, b) => Number(a._id.split("_")[2]) - Number(b._id.split("_")[2]))
    if (rests.findLast(row => _chunk?.[0]?._id.startsWith(row._id))) {
      console.error("chunks should never hit", _chunk)
      setChunks([])
    } else {
      setChunks(_chunk.toSorted((a, b) => Number(a._id.split("_")[3]) - Number(b._id.split("_")[3])))
    }
    setMessages(rests)
  }, [_messages, _chunk])

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
    if (chatId && !_messages.length && !loading) {
      router.push("/")
    }
  }, [chatId, messages, router])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editMode !== null) {
        setEditMode(null)
        setInputValue("")
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [editMode])

  function onSubmit() {
    if (!inputValue.trim()) return false
    if (!profile?.userProfile?.userId) return false
    if (chunks.length) return false
    if (messages.at(-1)?.type === "ChatUserMessage" && editMode === null) return false
    const newChatId = chatId ?? crypto.randomUUID()
    let chatPromise: Promise<PouchDB.Core.Response | undefined> = Promise.resolve(undefined)
    let newChat: Chat | undefined
    if (!chat) {
      newChat = {
        _id: newChatId,
        name: inputValue.slice(0, 100),
        status: "active",
        createdAt: +new Date(),
      }
      chatPromise = chatsDb.put(newChat)
    }

    if (editMode !== null) {
      // We're editing an existing message
      const message = Schema.encodeSync(ChatUserMessage)({
        _id: messages[editMode]._id,
        _rev: messages[editMode]._rev,
        type: "ChatUserMessage" as const,
        createdAt: +new Date(),
        ai: UserMessage.make({
          parts: [
            TextPart.make({
              text: inputValue,
            }),
          ],
        })
      })

      messageDb.put(message)
      // .then(() => {
      // Delete all messages after the edited one
      const toDelete = messages.slice(editMode + 1)
      messageDb.bulkDocs(toDelete.map(row => ({
        _id: row._id,
        _rev: row._rev,
        _deleted: true
      }) as unknown as ChatMessage))
      // })
      // .then(() => {
      // Regenerate AI response
      const updatedMessages = messages.slice(0, editMode + 1)
      updatedMessages[editMode] = message


      sendMessageWorkflow({
        chat: (chat as Chat),
        messages: updatedMessages,
        profile,
        selectedModel,
        hash: newChatId + (new Date().toISOString())
      }).then(async (data) => {
        console.log(data)
      })


      // })
      // .then(() => {
      setEditMode(null)
      setInputValue("")
      // })
      // .catch(console.error)

      return true
    }


    const message = Schema.encodeSync(ChatUserMessage)({
      _id: `${newChatId}_message_${messages.length}`,
      type: "ChatUserMessage" as const,
      createdAt: +new Date(),
      ai: UserMessage.make({
        parts: [
          TextPart.make({
            text: inputValue,
          }),
        ],
      })
    })

    chatPromise.then(async (resp) => {
      sendMessageWorkflow({
        chat: (chat as Chat) ?? { ...newChat, _rev: resp?.rev, _id: newChatId },
        messages: [...messages, message],
        profile,
        selectedModel,
        hash: newChatId + (new Date().toISOString())
      }).then(async (data) => {
        console.log(data)
      })
    })

      .then(async (data) => {
        console.log(data)
      })
      .catch((error: Error) => {
        console.error(error)
        // toast.error(error.message)
      })
    setInputValue("")

    const putMessagePromise = messageDb.put(message)

    if (newChatId !== chatId) {
      setFakeMessage(message)
      putMessagePromise.then(() => {
        router.push(`/chat/${newChatId}`)
      })
    }

    return true
  }

  function onRetry(messageId: string) {
    if (!profile?.userProfile?.userId) return false
    if (chunks.length) return false
    if (messages.at(-1)?.type === "ChatUserMessage") return false
    const index = Number(messageId.split("_")[2])
    console.log(index)
    const sendMessagesStart = messages.slice(0, index)
    const sendMessages = messages[index]
    console.assert(sendMessagesStart.length % 2 === 0)
    const toDelete = messages.slice(index + 1)
    console.assert(toDelete.length % 2 === 1)
    const toDeleteErrors = errors.filter(({ _id }) => Number(_id.split('_')[2]) >= index)
    messageDb.bulkDocs([...toDelete, ...toDeleteErrors].map(row => ({
      _id: row._id,
      _rev: row._rev,
      _deleted: true
    }) as unknown as ChatMessage));

    sendMessageWorkflow({
      chat: (chat as Chat),
      messages: [...sendMessagesStart, {
        ...sendMessages,
        createdAt: +new Date(),
      } as ChatUserMessage],
      profile,
      selectedModel,
      hash: chatId + (new Date().toISOString())
    }).then(console.log)
      .catch(console.error)
  }

  function onEdit(messageId: string) {
    if (!profile?.userProfile?.userId) return false
    if (chunks.length) return false
    if (messages.at(-1)?.type === "ChatUserMessage") return false
    const index = Number(messageId.split("_")[2])
    setEditMode(index)
    setInputValue(messages.at(index)?.ai.parts.find(part => part._tag === "TextPart")?.text ?? "")
    // setInputValue(messages.at(index)?.ai.parts.find(part => part._tag === "TextPart")?.text ?? "")
    // const toDelete = messages.slice(index)
    // messageDb.bulkDocs(toDelete.map(row => ({
    //   _id: row._id,
    //   _rev: row._rev,
    //   _deleted: true
    // }) as unknown as ChatMessage))
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
          <MessageList
            messages={editMode !== null ? messages.slice(0, editMode + 1) : messages}
            errors={errors}
            chunks={chunks}
            onRetry={onRetry}
            onEdit={onEdit}
            editMode={editMode}
          />
        }
        {
          !chatId &&
          (fakeMessage ?
            <MessageList messages={[fakeMessage]} chunks={[]} errors={[]} />
            : <WelcomeScreen onPromptClick={setInputValue} />)
        }
      </div>

      {/* Input Area */}
      <MessageInput
        inputValue={inputValue}
        onInputChange={(e) => {
          setInputValue(e.target.value)
        }}
        onSubmit={onSubmit}
        isEditing={editMode !== null}
        onCancelEdit={() => {
          setEditMode(null)
          setInputValue("")
        }}
      />
    </main>
  )
} 