"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "../../../components/ui/tabs"
import { Button } from "../../../components/ui/button"
import { Checkbox } from "../../../components/ui/checkbox"
import { Upload, Download, Trash2, Trash } from "lucide-react"

// Sample chat history data
const chatHistory = [
  {
    id: "1",
    title: "Funny Kings Day interview questions",
    date: "4/26/2025, 7:15:37 PM",
    selected: false,
  },
  {
    id: "2",
    title: "React component optimization tips",
    date: "4/25/2025, 3:22:15 PM",
    selected: false,
  },
  {
    id: "3",
    title: "TypeScript best practices discussion",
    date: "4/24/2025, 10:45:22 AM",
    selected: false,
  },
  {
    id: "4",
    title: "AI model comparison and analysis",
    date: "4/23/2025, 8:30:45 PM",
    selected: false,
  },
  {
    id: "5",
    title: "Database design patterns",
    date: "4/22/2025, 2:15:30 PM",
    selected: false,
  },
]

export default function HistoryPage() {
  const [chats, setChats] = useState(chatHistory)
  const [selectAll, setSelectAll] = useState(false)

  const selectedChats = chats.filter((chat) => chat.selected)
  const hasSelection = selectedChats.length > 0
  const allSelected = chats.length > 0 && selectedChats.length === chats.length

  const handleSelectAll = () => {
    const newSelectAll = !allSelected
    setSelectAll(newSelectAll)
    setChats(chats.map((chat) => ({ ...chat, selected: newSelectAll })))
  }

  const handleChatSelect = (chatId: string) => {
    setChats(chats.map((chat) => (chat.id === chatId ? { ...chat, selected: !chat.selected } : chat)))
  }

  const handleClearSelection = () => {
    setChats(chats.map((chat) => ({ ...chat, selected: false })))
    setSelectAll(false)
  }

  const handleExport = () => {
    // Export functionality would go here
    console.log("Exporting selected chats:", selectedChats)
  }

  const handleDelete = () => {
    // Delete functionality would go here
    console.log("Deleting selected chats:", selectedChats)
    setChats(chats.filter((chat) => !chat.selected))
  }

  const handleImport = () => {
    // Import functionality would go here
    console.log("Importing chats")
  }

  return (
    <Tabs defaultValue="history">
      <TabsContent value="history" className="space-y-12">
        <section className="space-y-2">
          <h2 className="text-2xl font-bold">Message History</h2>
          <div className="space-y-6">
            <p className="text-muted-foreground/80">
              Save your history as JSON, or import someone else's. Importing will NOT delete existing messages
            </p>
            <div className="space-y-2">
              <div className="">
                <div className="mb-2 flex h-10 items-end justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs flex items-center gap-2.5 px-4"
                        onClick={handleSelectAll}
                      >
                        <Checkbox checked={allSelected} className="h-4 w-4" />
                        <span className="hidden text-sm md:inline">Select All</span>
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-8 px-3 flex gap-1 whitespace-nowrap text-sm ${!hasSelection ? "invisible" : ""}`}
                      disabled={!hasSelection}
                      onClick={handleClearSelection}
                    >
                      Clear<span className="hidden md:inline"> Selection</span>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs flex items-center gap-2"
                      disabled={!hasSelection}
                      onClick={handleExport}
                    >
                      <Upload className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only md:not-sr-only">Export</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 px-3 text-xs flex items-center gap-2"
                      disabled={!hasSelection}
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only md:not-sr-only">Delete</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={handleImport}>
                      <Download className="h-4 w-4" />
                      <span className="hidden md:inline">Import</span>
                    </Button>
                  </div>
                </div>
                <ul
                  className="w-full divide-y overflow-y-scroll rounded border"
                  style={{ maxHeight: "calc(15rem)", minHeight: "calc(15rem)" }}
                >
                  {chats.map((chat) => (
                    <li
                      key={chat.id}
                      className="grid cursor-pointer grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-2 marker:px-4 hover:bg-muted/50"
                      style={{ minHeight: "2.5rem" }}
                      onClick={() => handleChatSelect(chat.id)}
                    >
                      <Checkbox
                        checked={chat.selected}
                        className="h-4 w-4 shrink-0"
                        onChange={() => handleChatSelect(chat.id)}
                      />
                      <span className="truncate">{chat.title}</span>
                      <span className="w-8"></span>
                      <span className="w-32 select-none text-right text-xs text-muted-foreground">{chat.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-fit space-y-2 border-0 border-muted-foreground/10">
          <h2 className="text-2xl font-bold">Danger Zone</h2>
          <div className="space-y-2">
            <p className="px-px py-1.5 text-sm text-muted-foreground/80">
              If your chats from before June 1st are missing, click this to bring them back. Contact support if you have
              issues.
            </p>
            <div className="flex flex-row gap-2">
              <Button variant="destructive">Restore old chats</Button>
            </div>
          </div>
          <div className="space-y-2 pt-6">
            <p className="px-px py-1.5 text-sm text-muted-foreground/80">
              Permanently delete your history from both your local device and our servers.
              <span className="mx-0.5 text-base font-medium">*</span>
            </p>
            <div className="flex flex-row gap-2">
              <Button
                variant="destructive"
                className="border border-red-800/20 bg-red-800/80 hover:bg-red-600 dark:bg-red-800/20 hover:dark:bg-red-800"
              >
                <Trash className="mr-2 h-5 w-5" />
                Delete Chat History
              </Button>
            </div>
          </div>
        </section>

        <p className="text-sm text-muted-foreground/40">
          <span className="mx-0.5 text-base font-medium">*</span>
          The retention policies of our LLM hosting partners may vary.
        </p>
      </TabsContent>
    </Tabs>
  )
}
