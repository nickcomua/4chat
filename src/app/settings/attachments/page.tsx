"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Image, File, Archive, Trash2, Upload, Settings } from "lucide-react"
import { useFind, usePouch } from "use-pouchdb"
import { ChatSettings } from "@/lib/types/settings"

interface Attachment {
  id: string
  name: string
  type: string
  size: string
  date: string
  selected: boolean
}

// Sample attachment data
const sampleAttachments: Attachment[] = [
  {
    id: "1",
    name: "project-requirements.pdf",
    type: "application/pdf",
    size: "2.4 MB",
    date: "2025-01-20",
    selected: false,
  },
  {
    id: "2",
    name: "design-mockup.png",
    type: "image/png",
    size: "1.8 MB",
    date: "2025-01-19",
    selected: false,
  },
  {
    id: "3",
    name: "data-export.csv",
    type: "text/csv",
    size: "856 KB",
    date: "2025-01-18",
    selected: false,
  },
  {
    id: "4",
    name: "code-samples.zip",
    type: "application/zip",
    size: "3.2 MB",
    date: "2025-01-17",
    selected: false,
  },
]

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return Image
  if (type === "application/pdf" || type.startsWith("text/")) return FileText
  if (type.includes("zip") || type.includes("archive")) return Archive
  return File
}

export default function AttachmentsPage() {
  return null // @todo
  const [attachments, setAttachments] = useState<Attachment[]>(sampleAttachments)
  const [maxFileSize, setMaxFileSize] = useState(10)
  const [allowedTypes, setAllowedTypes] = useState<string[]>([
    "image/*", "text/*", "application/pdf", "application/json"
  ])
  const [autoDelete, setAutoDelete] = useState(false)
  const [retentionDays, setRetentionDays] = useState(90)
  const [isSaving, setIsSaving] = useState(false)

  const db = usePouch<ChatSettings>("profile")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]

  // Load attachment settings from profile if available (commented out in schema)
  useEffect(() => {
    // if (profile?.attachmentSettings) {
    //   setMaxFileSize(profile.attachmentSettings.maxFileSize || 10)
    //   setAllowedTypes([...(profile.attachmentSettings.allowedFileTypes || [])])
    //   setAutoDelete(profile.attachmentSettings.autoDelete || false)
    //   setRetentionDays(profile.attachmentSettings.retentionDays || 90)
    // }
  }, [profile])

  const selectedAttachments = attachments.filter(attachment => attachment.selected)
  const hasSelection = selectedAttachments.length > 0

  const handleAttachmentSelect = (attachmentId: string) => {
    setAttachments(attachments.map(attachment => 
      attachment.id === attachmentId 
        ? { ...attachment, selected: !attachment.selected }
        : attachment
    ))
  }

  const handleSelectAll = () => {
    const allSelected = attachments.every(attachment => attachment.selected)
    setAttachments(attachments.map(attachment => ({
      ...attachment,
      selected: !allSelected
    })))
  }

  const handleDeleteSelected = () => {
    setAttachments(attachments.filter(attachment => !attachment.selected))
  }

  const saveAttachmentSettings = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      // Since attachmentSettings is commented out in the schema, 
      // we'll just simulate saving for now
      console.log("Saving attachment settings:", {
        maxFileSize,
        allowedTypes,
        autoDelete,
        retentionDays
      })

      // Uncomment when attachmentSettings are added back to schema
      // const updatedProfile = {
      //   ...profile,
      //   attachmentSettings: {
      //     maxFileSize,
      //     allowedFileTypes: allowedTypes,
      //     autoDelete,
      //     retentionDays
      //   },
      //   lastUpdated: new Date().toISOString()
      // }
      // await db.put(updatedProfile)
    } catch (error) {
      console.error("Error saving attachment settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Attachment Settings</h2>
        <p className="mt-2 text-muted-foreground">
          Manage how files and attachments are handled in your chats.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="font-medium text-base">Max File Size (MB)</label>
            <p className="text-sm text-muted-foreground">
              Maximum size allowed for file uploads.
            </p>
          </div>
          {profile ? (
            <Input
              type="number"
              min="1"
              max="100"
              value={maxFileSize}
              onChange={(e) => setMaxFileSize(parseInt(e.target.value) || 10)}
              className="w-24"
            />
          ) : (
            <Skeleton className="h-10 w-24" />
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-0.5">
            <label className="font-medium text-base">Allowed File Types</label>
            <p className="text-sm text-muted-foreground">
              Select which file types can be uploaded.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { label: "Images", value: "image/*" },
              { label: "Text Files", value: "text/*" },
              { label: "PDFs", value: "application/pdf" },
              { label: "JSON", value: "application/json" },
              { label: "CSV", value: "text/csv" },
              { label: "Archives", value: "application/zip" }
            ].map(({ label, value }) => (
              <div key={value} className="flex items-center space-x-2">
                {profile ? (
                  <Checkbox
                    checked={allowedTypes.includes(value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAllowedTypes([...allowedTypes, value])
                      } else {
                        setAllowedTypes(allowedTypes.filter(type => type !== value))
                      }
                    }}
                  />
                ) : (
                  <Skeleton className="h-4 w-4" />
                )}
                <label className="text-sm">{label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="font-medium text-base">Auto Delete Old Files</label>
            <p className="text-sm text-muted-foreground">
              Automatically delete attachments after a certain period.
            </p>
          </div>
          {profile ? (
            <Switch checked={autoDelete} onCheckedChange={setAutoDelete} />
          ) : (
            <Skeleton className="h-6 w-11" />
          )}
        </div>

        {autoDelete && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="font-medium text-base">Retention Period (Days)</label>
              <p className="text-sm text-muted-foreground">
                How long to keep attachments before deletion.
              </p>
            </div>
            {profile ? (
              <Select value={retentionDays.toString()} onValueChange={(value) => setRetentionDays(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="180">180 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Skeleton className="h-10 w-32" />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={saveAttachmentSettings} disabled={isSaving}>
          <Settings className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Current Attachments */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Current Attachments</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="h-8"
            >
              Select All
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!hasSelection}
                className="h-8"
              >
                <Upload className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={!hasSelection}
                onClick={handleDeleteSelected}
                className="h-8"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="rounded border">
            {attachments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No attachments found
              </div>
            ) : (
              attachments.map((attachment) => {
                const FileIcon = getFileIcon(attachment.type)
                return (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-4 border-b border-input p-4 last:border-0"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleAttachmentSelect(attachment.id)}
                  >
                    <Checkbox
                      checked={attachment.selected}
                      onChange={() => handleAttachmentSelect(attachment.id)}
                      className="h-4 w-4 shrink-0"
                    />

                    <div className="flex flex-1 items-center justify-between overflow-hidden">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-input text-muted-foreground/80">
                          <FileIcon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{attachment.name}</p>
                          <p className="text-sm text-muted-foreground">{attachment.type}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{attachment.size}</p>
                        <p>{attachment.date}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Storage Info */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <File className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Storage Information
            </h4>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Attachments are stored locally in your browser. Large files may impact performance. 
              Consider enabling auto-delete for better storage management.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
