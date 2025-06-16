"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, LogIn, X, Pin, PanelLeft } from "lucide-react"
import { Chat, ChatMessage } from "@/lib/types/chat"
import { usePouch, useAllDocs, useFind } from "use-pouchdb"
import { ChatSettings } from "@/lib/types/settings"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"



interface ChatGroup {
  label: string
  icon?: React.ReactNode
  chats: PouchDB.Core.ExistingDocument<Chat>[]
}

interface ChatItemProps {
  chat: Chat
  isActive?: boolean
  onPin?: () => void
  onDelete?: () => void
}

function ChatItem({ chat, isActive, onPin, onDelete }: ChatItemProps) {
  return (
    <span data-state="closed" style={{ userSelect: "none" }}>
      <li data-sidebar="menu-item" className="group/menu-item relative">
        <Link
          className={`group/link relative flex h-9 w-full items-center overflow-hidden rounded-lg px-2 py-1 text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring hover:focus-visible:bg-sidebar-accent ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
          href={`/chat/${chat._id}`}
        >
          <div className="relative flex w-full items-center">
            <button data-state="closed" className="w-full">
              <div className="relative w-full flex items-center">
                {chat.pinned && (
                  <Pin className="size-3 mr-1 text-muted-foreground" />
                )}
                <input
                  aria-label="Thread title"
                  aria-describedby="thread-title-hint"
                  aria-readonly="true"
                  readOnly
                  tabIndex={-1}
                  className="hover:truncate-none h-full w-full rounded bg-transparent px-1 py-1 text-sm text-muted-foreground outline-none pointer-events-none cursor-pointer overflow-hidden truncate"
                  title={chat.name}
                  type="text"
                  value={chat.name}
                />
              </div>
            </button>
            <div className="pointer-events-auto absolute -right-1 bottom-0 top-0 z-50 flex translate-x-full items-center justify-end text-muted-foreground transition-transform group-hover/link:translate-x-0 group-hover/link:bg-sidebar-accent">
              <div className="pointer-events-none absolute bottom-0 right-[100%] top-0 h-12 w-8 bg-gradient-to-l from-sidebar-accent to-transparent opacity-0 group-hover/link:opacity-100"></div>
              <button
                className={`rounded-md p-1.5 hover:bg-muted/40 ${chat.pinned ? 'text-primary' : ''}`}
                tabIndex={-1}
                data-action="pin-thread"
                aria-label={chat.pinned ? "Unpin thread" : "Pin thread"}
                data-state="closed"
                onClick={(e) => {
                  e.preventDefault()
                  onPin?.()
                }}
              >
                <Pin className="size-4" />
              </button>
              <button
                className="rounded-md p-1.5 hover:bg-destructive/50 hover:text-destructive-foreground"
                tabIndex={-1}
                data-action="thread-delete"
                aria-label="Delete thread"
                data-state="closed"
                onClick={(e) => {
                  e.preventDefault()
                  onDelete?.()
                }}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </Link>
      </li>
    </span>
  )
}

export default function Sidebar() {
  const inputeRef = useRef<HTMLInputElement>(null)
  const chatsDb: PouchDB.Database<Chat> = usePouch("chats")
  const messagesDb: PouchDB.Database<ChatMessage> = usePouch("messages")
  const { id: chatId }: { id: string | undefined } = useParams()
  const { docs: chats } = useFind<Chat>({
    db: "chats", selector: {
      _id: { $gte: null }
    }
  })
  const router = useRouter()
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles?.[0]
  const [isOpen, setIsOpen] = useState(true)
  const [searchValue, setSearchValue] = useState("")

  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  const sevenDays = 7 * oneDay
  const thirtyDays = 30 * oneDay

  const groups: ChatGroup[] = [
    { label: "Pinned", icon: <Pin className="-ml-0.5 mr-1 mt-px !size-3" />, chats: [] },
    { label: "Today", chats: [] },
    { label: "Yesterday", chats: [] },
    { label: "Last 7 Days", chats: [] },
    { label: "Last 30 Days", chats: [] },
    { label: "Older", chats: [] }
  ]

  const filteredChats = chats
    .filter(chat => {
      if (!chat) return false
      if (!searchValue) return true
      return chat.name.toLowerCase().includes(searchValue.toLowerCase())
    })
    .sort((a, b) => (b?.createdAt || 0) - (a?.createdAt || 0)) || []

  filteredChats.forEach(chat => {
    if (!chat) return

    if (chat.pinned) {
      groups[0].chats.push(chat)
      return
    }

    const age = now - chat.createdAt
    if (age < oneDay) {
      groups[1].chats.push(chat)
    } else if (age < 2 * oneDay) {
      groups[2].chats.push(chat)
    } else if (age < sevenDays) {
      groups[3].chats.push(chat)
    } else if (age < thirtyDays) {
      groups[4].chats.push(chat)
    } else {
      groups[5].chats.push(chat)
    }
  })

  const nonEmptyGroups = groups.filter(group => group.chats.length > 0)

  return isOpen ? <>
    <div className="pointer-events-auto fixed left-2 z-150 flex flex-row gap-0.5 p-1 top-safe-offset-2">
      <div className="duration-250 pointer-events-none absolute inset-0 right-auto -z-10 w-10 rounded-md bg-transparent backdrop-blur-sm transition-[background-color,width] delay-0 max-sm:delay-125 max-sm:duration-125 max-sm:w-[6.75rem] max-sm:bg-sidebar/50"></div>
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 z-10 h-8 w-8 text-muted-foreground"
        onClick={() => { setIsOpen(!isOpen) }}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-4 w-4" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
    </div>
    <div className="absolute left-64 inset-x-3 top-0 z-10 box-content overflow-hidden border-b border-chat-border bg-gradient-noise-top/80 backdrop-blur-md transition-[transform,border] ease-snappy blur-fallback:bg-gradient-noise-top max-sm:hidden sm:h-3.5">
      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
      <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent blur-fallback:hidden"></div>
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-noise-top blur-fallback:hidden"></div>
    </div>
    <div
      className={`group peer ${isOpen ? "block" : "hidden"} text-sidebar-foreground md:block`}
      data-state={isOpen ? "expanded" : "collapsed"}
      data-collapsible=""
      data-variant="inset"
      data-side="left"
    >
      <div className="relative h-svh w-[var(--sidebar-width)] bg-transparent ease-snappy group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:md:w-[var(--sidebar-width-icon)] group-data-[side=right]:rotate-180 transition-[width]"></div>
      <div className="fixed inset-y-0 h-svh w-[var(--sidebar-width)] transition-[transform,opacity,width] ease-snappy md:flex left-0 group-data-[state=expanded]:translate-x-0 group-data-[state=collapsed]:-translate-x-full group-data-[state=collapsed]:md:translate-x-0 group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:md:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)] p-2 group z-50 border-none">
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          {/* Sidebar Header */}
          <div
            data-sidebar="header"
            className="flex flex-col gap-2 relative m-1 mb-0 space-y-1 p-0 !pt-safe"
          >
            <h1 className="flex h-8 shrink-0 items-center justify-center text-lg text-muted-foreground transition-opacity delay-75 duration-75">
              <Link
                className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground"
                href="/"
              >
                <span className="ml-2">C4 Chat</span>
              </Link>
            </h1>
            <div className="px-1">
              <Link
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold text-primary-foreground shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 px-4 py-2 w-full select-none text-sm"
                href="/"
              >
                <span className="w-full select-none text-center" data-state="closed">
                  New Chat
                </span>
              </Link>
            </div>
            <div className="border-b border-chat-border px-3">
              <div className="flex items-center">
                <Search className="-ml-[3px] mr-3 !size-4 text-muted-foreground" />
                <input
                  ref={inputeRef}
                  role="searchbox"
                  aria-label="Search threads"
                  placeholder="Search your threads..."
                  className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div
            data-sidebar="content"
            className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden small-scrollbar scroll-shadow relative pb-2"
          >
            <div style={{ overflow: "anchor", flex: "0 0 auto", position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", width: "100%", left: 0, top: 0, visibility: "visible" }}>
                {nonEmptyGroups.map((group, index) => (
                  <SidebarGroup key={index} label={group.label} icon={group.icon}>
                    {group.chats.map(chat => (
                      <ChatItem
                        key={chat._id}
                        chat={chat}
                        isActive={chat._id === chatId}
                        onPin={async () => {
                          try {
                            const doc = await chatsDb.get(chat._id)
                            await chatsDb.put({
                              ...doc,
                              pinned: !doc.pinned
                            })
                          } catch (error) {
                            console.error('Failed to pin/unpin chat:', error)
                          }
                        }}
                        onDelete={async () => {
                          try {
                            await chatsDb.remove(chat)
                            await messagesDb.find({
                              selector: { chatId: chatId ?? "", index: { $gt: null } },
                              sort: ["chatId", "index"],
                            }).then(docs =>
                              Promise.all(docs.docs.map(doc => messagesDb.remove(doc)))
                            )
                            if (chatId === chat._id) {
                              router.push("/")
                            }
                          } catch (error) {
                            console.error('Failed to delete chat:', error)
                            toast.error('Failed to delete chat')
                          }
                        }}
                      />
                    ))}
                  </SidebarGroup>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div
            data-sidebar="footer"
            className="flex flex-col gap-2 m-0 p-2 pt-0"
          >
            {profile?.userProfile ? (
              <Link
                aria-label="Go to settings"
                role="button"
                className="flex select-none flex-row items-center justify-between gap-3 rounded-lg px-3 py-3 hover:bg-sidebar-accent focus:bg-sidebar-accent focus:outline-2"
                href="/settings/customization"
              >
                <div className="flex w-full min-w-0 flex-row items-center gap-3">
                  <Image
                    alt={profile.userProfile.name ?? "Profile picture"}
                    src={profile.userProfile.profilePicture ?? "/placeholder.svg"}
                    width={32}
                    height={32}
                    className={`h-8 w-8 rounded-full ring-1 ring-muted-foreground/20 ${profile.visualOptions?.hidePersonalInfo ? "blur-sm" : ""}`}
                    unoptimized={profile.userProfile.profilePicture?.startsWith('https://lh3.googleusercontent.com')}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      img.src = "/placeholder.svg"
                    }}
                  />
                  <div className={`flex min-w-0 flex-col text-foreground ${profile.visualOptions?.hidePersonalInfo ? "blur-sm" : ""}`}>
                    <span className="truncate text-sm font-medium">{profile.userProfile.name}</span>
                    <span className="text-xs">{profile.userProfile.email}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                aria-label="Login"
                role="button"
                className="flex w-full select-none items-center gap-4 rounded-lg p-4 text-muted-foreground hover:bg-sidebar-accent"
                href="/auth"
              >
                <LogIn className="size-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Resize Handle */}
          {/* @todo when name will be generated by ai */}
          {/* <div
            className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-border/50 transition-colors"
            onMouseDown={(e) => {
              e.preventDefault()
              const startX = e.clientX
              const startWidth = Number.parseInt(
                getComputedStyle(document.documentElement).getPropertyValue("--sidebar-width"),
              )

              const handleMouseMove = (e: MouseEvent) => {
                const newWidth = Math.max(200, Math.min(400, startWidth + (e.clientX - startX)))
                document.documentElement.style.setProperty("--sidebar-width", `${newWidth}px`)
              }

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
              }

              document.addEventListener("mousemove", handleMouseMove)
              document.addEventListener("mouseup", handleMouseUp)
            }}
          /> */}
        </div>
      </div>
    </div>
  </>
    : <div className="pointer-events-auto fixed left-2 z-50 flex flex-row gap-0.5 p-1 top-safe-offset-2">
      <div className="pointer-events-none absolute inset-0 right-auto -z-10 rounded-md backdrop-blur-sm transition-[background-color,width] delay-125 duration-125 w-[6.75rem] bg-sidebar/50 blur-fallback:bg-sidebar max-sm:delay-125 max-sm:duration-125 max-sm:w-[6.75rem] max-sm:bg-sidebar/50" />
      <button
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 z-10 h-8 w-8 text-muted-foreground"
        data-sidebar="trigger"
        onClick={() => setIsOpen(true)}
      >
        <PanelLeft className="h-4 w-4" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
      <button
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 duration-250 size-8 translate-x-0 text-muted-foreground opacity-100 transition-[transform,opacity] delay-150"
        onClick={() => {
          setIsOpen(true)
          requestAnimationFrame(() => {
            inputeRef?.current?.focus()
          })
        }}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </button>
      <Link
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 size-8 translate-x-0 text-muted-foreground opacity-100 transition-[transform,opacity] delay-150 duration-150"
        href="/"
        data-discover="true"
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
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        <span className="sr-only">New Thread</span>
      </Link>
    </div>



}

interface SidebarGroupProps {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}

function SidebarGroup({ label, icon, children }: SidebarGroupProps) {
  return (
    <div data-sidebar="group" className="relative flex w-full min-w-0 flex-col p-2">
      <div
        data-sidebar="group-label"
        className="flex h-8 shrink-0 select-none items-center rounded-md text-xs font-medium outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-snappy focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 px-1.5 text-color-heading"
      >
        {icon}
        <span>{label}</span>
      </div>
      <div data-sidebar="group-content" className="w-full text-sm">
        <ul data-sidebar="menu" className="flex w-full min-w-0 flex-col gap-1">
          {children}
        </ul>
      </div>
    </div>
  )
}
