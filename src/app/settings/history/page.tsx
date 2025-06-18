"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Upload, Download, Trash2, Trash, Settings } from "lucide-react"
import { useFind, usePouch } from "use-pouchdb"
import { ChatSettings } from "@/lib/types/settings"
import { Chat, ChatMessage } from "@/lib/types/chat"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function HistoryPage() {
  const [selectAll, setSelectAll] = useState(false)
  const [selectedChatIds, setSelectedChatIds] = useState<Set<string>>(new Set())
  const [enableSync, setEnableSync] = useState(true)
  const [autoExport, setAutoExport] = useState(false)
  const [retentionDays, setRetentionDays] = useState<string>("unlimited")
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "txt">("json")
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const router = useRouter()
  const chatsDb: PouchDB.Database<Chat> = usePouch("chats")
  const messagesDb: PouchDB.Database<ChatMessage> = usePouch("messages")

  const { docs: chats } = useFind<Chat>({
    db: "chats",
    selector: {
      createdAt: { $gte: null }
    },
    index: {
      fields: ["createdAt"]
    },
    sort: ["createdAt"]
  })

  const db = usePouch<ChatSettings>("profile")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]

  // Load history settings from profile
  useEffect(() => {
    if (profile?.historySettings) {
      setEnableSync(profile.historySettings.enableSync || true)
      setAutoExport(profile.historySettings.autoExport || false)
      setRetentionDays(profile.historySettings.retentionDays ? profile.historySettings.retentionDays.toString() : "unlimited")
      setExportFormat(profile.historySettings.exportFormat || "json")
    }
  }, [profile])

  const filteredChats = chats
    .filter(chat => {
      if (!chat) return false
      if (!searchValue) return true
      return chat.name.toLowerCase().includes(searchValue.toLowerCase())
    })
    .sort((a, b) => (b?.createdAt || 0) - (a?.createdAt || 0)) || []

  const selectedChats = filteredChats.filter(chat => selectedChatIds.has(chat._id))
  const hasSelection = selectedChats.length > 0
  const allSelected = filteredChats.length > 0 && selectedChats.length === filteredChats.length

  const handleSelectAll = () => {
    const newSelectAll = !allSelected
    setSelectAll(newSelectAll)
    if (newSelectAll) {
      setSelectedChatIds(new Set(filteredChats.map(chat => chat._id)))
    } else {
      setSelectedChatIds(new Set())
    }
  }

  const handleChatSelect = (chatId: string) => {
    setSelectedChatIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chatId)) {
        newSet.delete(chatId)
      } else {
        newSet.add(chatId)
      }
      return newSet
    })
  }

  const handleClearSelection = () => {
    setSelectedChatIds(new Set())
    setSelectAll(false)
  }

  // const handleExport = () => {
  //   // Export functionality would go here
  //   console.log("Exporting selected chats:", selectedChats)
  // }

  const handleDelete = async () => {
    try {
      // Delete selected chats and their messages
      for (const chat of selectedChats) {
        await chatsDb.remove(chat)
        const ids = await messagesDb.find({
          selector: { _id: { $gte: `${chat._id}_`, $lte: `${chat._id}_\uffff` } },
        })
        await messagesDb.bulkDocs(ids.docs.map(doc => ({
          _id: doc._id,
          _rev: doc._rev,
          _deleted: true
        }) as unknown as ChatMessage))
      }
      setShowDeleteDialog(false)
      handleClearSelection()
      toast.success('Selected chats deleted successfully')
    } catch (error) {
      console.error('Failed to delete chats:', error)
      toast.error('Failed to delete chats')
    }
  }

  // const handleImport = () => {
  //   // Import functionality would go here
  //   console.log("Importing chats")
  // }

  // const saveHistorySettings = async () => {
  //   if (!profile) return

  //   setIsSaving(true)
  //   try {
  //     const updatedProfile = {
  //       ...profile,
  //       historySettings: {
  //         enableSync,
  //         autoExport,
  //         retentionDays: retentionDays === "unlimited" ? null : parseInt(retentionDays),
  //         exportFormat
  //       },
  //       lastUpdated: new Date().toISOString()
  //     }

  //     await db.put(updatedProfile)
  //     toast.success('Settings saved successfully')
  //   } catch (error) {
  //     console.error("Error saving history settings:", error)
  //     toast.error('Failed to save settings')
  //   } finally {
  //     setIsSaving(false)
  //   }
  // }

  return (
    <div className="space-y-12">
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Chats</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the selected chats? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Message History */}
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">Message History</h2>
        <div className="space-y-6">
          <p className="text-muted-foreground/80">
            Save your history as {exportFormat.toUpperCase()}, or import someone else's. Importing will NOT delete existing messages
          </p>
          <div className="space-y-2">
            <div className="">
              <div className="mb-2 flex h-10 items-end justify-between gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-md border border-input bg-background px-4 text-xs font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 cursor-pointer"
                      onClick={handleSelectAll}
                    >
                      <Checkbox checked={allSelected} className="h-4 w-4" />
                      <span className="hidden text-sm md:inline">Select All</span>
                    </div>
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
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs flex items-center gap-2"
                    disabled={!hasSelection}
                    onClick={handleExport}
                  > @todo
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only md:not-sr-only">Export</span>
                  </Button> */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 px-3 text-xs flex items-center gap-2"
                    disabled={!hasSelection}
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only md:not-sr-only">Delete</span>
                  </Button>
                  {/* <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={handleImport}>
                    <Download className="h-4 w-4" /> @todo
                    <span className="hidden md:inline">Import</span>
                  </Button>  */}
                </div>
              </div>
              <ul
                className="w-full divide-y overflow-y-scroll rounded border"
                style={{ maxHeight: "calc(15rem)", minHeight: "calc(15rem)" }}
              >
                {filteredChats.map((chat) => (
                  <li
                    key={chat._id}
                    className="grid cursor-pointer grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-2 marker:px-4 hover:bg-muted/50"
                    style={{ minHeight: "2.5rem" }}
                    onClick={() => handleChatSelect(chat._id)}
                  >
                    <Checkbox
                      checked={selectedChatIds.has(chat._id)}
                      className="h-4 w-4 shrink-0"
                      onChange={() => handleChatSelect(chat._id)}
                    />
                    <span className="truncate">{chat.name}</span>
                    <span className="w-8"></span>
                    <span className="w-32 select-none text-right text-xs text-muted-foreground text-nowrap">
                      {new Date(chat.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="w-fit space-y-2 border-0 border-muted-foreground/10">
        <h2 className="text-2xl font-bold">Danger Zone</h2>
        <div className="space-y-2 pt-6">
          <p className="px-px py-1.5 text-sm text-muted-foreground/80">
            Permanently delete your history from both your local device and our servers.
            <span className="mx-0.5 text-base font-medium">*</span>
          </p>
          <div className="flex flex-row gap-2">
            <Button
              variant="destructive"
              className="border border-red-800/20 bg-red-800/80 hover:bg-red-600 dark:bg-red-800/20 hover:dark:bg-red-800"
              onClick={() => {
                handleSelectAll()
                setShowDeleteDialog(true)
              }}
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
    </div>
  )
}
