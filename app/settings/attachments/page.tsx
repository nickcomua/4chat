"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { File, ExternalLink, Trash, ImageIcon, FileText, Music, Video, Archive } from "lucide-react"

interface Attachment {
  id: string
  name: string
  type: string
  size: string
  url: string
  uploadDate: string
  selected: boolean
}

// Sample attachment data
const initialAttachments: Attachment[] = [
  {
    id: "1",
    name: "pasted-1.txt",
    type: "text/plain",
    size: "2.3 KB",
    url: "https://utfs.io/f/IN4OjmY4wMHBmVpXxmvpu9Wa06GPs5MZzXBNcr4EFIHfToxe",
    uploadDate: "2025-01-09",
    selected: false,
  },
  {
    id: "2",
    name: "project-requirements.pdf",
    type: "application/pdf",
    size: "1.2 MB",
    url: "https://example.com/file2",
    uploadDate: "2025-01-08",
    selected: false,
  },
  {
    id: "3",
    name: "screenshot-2025.png",
    type: "image/png",
    size: "456 KB",
    url: "https://example.com/file3",
    uploadDate: "2025-01-07",
    selected: false,
  },
  {
    id: "4",
    name: "data-analysis.csv",
    type: "text/csv",
    size: "89 KB",
    url: "https://example.com/file4",
    uploadDate: "2025-01-06",
    selected: false,
  },
  {
    id: "5",
    name: "presentation.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "3.4 MB",
    url: "https://example.com/file5",
    uploadDate: "2025-01-05",
    selected: false,
  },
]

export default function AttachmentsPage() {
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments)

  const selectedAttachments = attachments.filter((attachment) => attachment.selected)
  const hasSelection = selectedAttachments.length > 0
  const allSelected = attachments.length > 0 && selectedAttachments.length === attachments.length

  const handleSelectAll = () => {
    const newSelectAll = !allSelected
    setAttachments(attachments.map((attachment) => ({ ...attachment, selected: newSelectAll })))
  }

  const handleAttachmentSelect = (attachmentId: string) => {
    setAttachments(
      attachments.map((attachment) =>
        attachment.id === attachmentId ? { ...attachment, selected: !attachment.selected } : attachment,
      ),
    )
  }

  const handleClearSelection = () => {
    setAttachments(attachments.map((attachment) => ({ ...attachment, selected: false })))
  }

  const handleDeleteAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== attachmentId))
  }

  const handleDeleteSelected = () => {
    setAttachments(attachments.filter((attachment) => !attachment.selected))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    if (type.startsWith("audio/")) return Music
    if (type.includes("pdf") || type.includes("document") || type.includes("text")) return FileText
    if (type.includes("zip") || type.includes("archive")) return Archive
    return File
  }

  const formatFileSize = (size: string) => {
    return size
  }

  return (
    <Tabs defaultValue="attachments">
      <TabsContent value="attachments" className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Attachments</h2>
            <p className="mt-2 text-sm text-muted-foreground/80 sm:text-base">
              Manage your uploaded files and attachments. Note that deleting files here will remove them from the
              relevant threads, but not delete the threads. This may lead to unexpected behavior if you delete a file
              that is still being used in a thread.
            </p>
          </div>

          <div className="flex flex-col gap-2">
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
                    <span className="text-sm">
                      <span className="hidden md:inline">Select All</span>
                      <span className="md:hidden">All</span>
                    </span>
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

              {hasSelection && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 px-3 text-xs flex items-center gap-2 border border-red-800/20 bg-red-800/80 hover:bg-red-600 dark:bg-red-800/20 hover:dark:bg-red-800"
                  onClick={handleDeleteSelected}
                >
                  <Trash className="h-4 w-4" />
                  <span className="hidden md:inline">Delete Selected ({selectedAttachments.length})</span>
                  <span className="md:hidden">Delete ({selectedAttachments.length})</span>
                </Button>
              )}
            </div>

            <div className="relative overflow-x-hidden overflow-y-scroll rounded-lg border border-input">
              <div className="no-scrollbar h-[250px] overflow-y-auto md:h-[calc(100vh-360px)] md:min-h-[670px]">
                {attachments.length === 0 ? (
                  <div className="flex h-full items-center justify-center p-8">
                    <div className="text-center">
                      <File className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No attachments</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Upload files in your conversations to see them here.
                      </p>
                    </div>
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

                            <div className="flex min-w-0 flex-col">
                              <div className="flex min-w-0 items-center gap-2">
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex min-w-0 items-center gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span className="truncate text-sm text-foreground group-hover:underline">
                                    {attachment.name}
                                  </span>
                                  <ExternalLink className="hidden h-4 w-4 shrink-0 text-muted-foreground/80 group-hover:text-muted-foreground sm:inline-block" />
                                </a>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                                <span>{attachment.type}</span>
                                <span>•</span>
                                <span>{attachment.size}</span>
                                <span>•</span>
                                <span>{new Date(attachment.uploadDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-9 w-9 border border-red-800/20 bg-red-800/80 hover:bg-red-600 dark:bg-red-800/20 hover:dark:bg-red-800"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAttachment(attachment.id)
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
