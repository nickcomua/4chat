"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFind, usePouch } from "use-pouchdb"
import { ChatSettings } from "@/lib/types/settings"
import { Skeleton } from "@/components/ui/skeleton"
import ThemeToggle from "@/components/layout/theme-toggle"

const settingsTabs = [
  { value: "account", label: "Account", path: "/settings/account" },
  { value: "customization", label: "Customization", path: "/settings/customization" },
  { value: "history", label: "History & Sync", path: "/settings/history" },
  { value: "models", label: "Models", path: "/settings/models" },
  { value: "api-keys", label: "API Keys", path: "/settings/api-keys" },
  { value: "attachments", label: "Attachments", path: "/settings/attachments" },
  { value: "contact", label: "Contact Us", path: "/settings/contact" },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const db = usePouch<ChatSettings>("profile")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]
  // Find the current tab based on pathname with more robust matching
  const getCurrentTab = () => {
    // First, try exact match
    const exactMatch = settingsTabs.find((tab) => pathname === tab.path)
    if (exactMatch) {
      return exactMatch.value
    }

    // If no exact match, try to match by checking if pathname starts with the tab path
    // This handles cases where there might be query parameters or other URL variations
    const partialMatch = settingsTabs.find((tab) => pathname.startsWith(tab.path))
    if (partialMatch) {
      return partialMatch.value
    }

    // Default to customization (which is the redirect destination from /settings)
    return "customization"
  }

  const currentTab = getCurrentTab()

  const handleTabChange = (value: string) => {
    const tab = settingsTabs.find((t) => t.value === value)
    if (tab) {
      router.push(tab.path)
    }
  }

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col overflow-y-auto px-4 pb-24 pt-safe-offset-6 md:px-6 lg:px-8">
      {/* Header */}
      <header className="flex items-center justify-between pb-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Button>
        </Link>
        <div className="flex flex-row items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost">Sign out</Button>
        </div>
      </header>

      <div className="flex flex-grow flex-col gap-4 md:flex-row">
        {/* Sidebar */}
        <div className="hidden space-y-8 md:block md:w-1/4">
          {/* Profile Section */}
          <div className={`relative text-center ${profile?.visualOptions?.hidePersonalInfo ? "blur-lg" : ""}`}>
            <img
              alt="Profile picture"
              width={160}
              height={160}
              className="mx-auto rounded-full transition-opacity duration-200"
              src={profile?.userProfile?.profilePicture ?? "/placeholder.svg?height=160&width=160"}
            />
            {profile?.userProfile?.name ?
              <h1 className="mt-4 text-2xl font-bold transition-opacity duration-200">{profile?.userProfile?.name ?? "First Second"}</h1>
              : <Skeleton className="mt-4 h-8 w-full" />}
            <div className="relative flex items-center justify-center">
              <p className="break-all text-muted-foreground transition-opacity duration-200"></p>
            </div>
            {profile?.userProfile?.email ?
              <p className="perspective-1000 group relative h-6 cursor-pointer break-all text-muted-foreground">
                <span className="absolute inset-0 transition-transform duration-300 [backface-visibility:hidden] [transform-style:preserve-3d] truncate group-hover:[transform:rotateX(180deg)]">
                  {profile?.userProfile?.email ?? "email@email.com"}
                </span>

                <span className="absolute inset-0 transition-transform duration-300 [backface-visibility:hidden] [transform-style:preserve-3d] [transform:rotateX(180deg)] group-hover:[transform:rotateX(0deg)]"
                  onClick={() => {
                    navigator.clipboard.writeText(profile?.userProfile?.userId ?? "user-id")
                  }}
                >
                  <span className="flex h-6 items-center justify-center gap-2 text-sm">
                    <span className="flex items-center gap-2">
                      Copy User ID
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
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                      </svg>
                    </span>
                  </span>
                </span>
              </p> : <div className="pt-1 pb-1"><Skeleton className="h-4 ml-3 mr-3" /></div>}
          </div>

          {/* Usage Stats */}
          {/* <div className="space-y-6 rounded-lg bg-card p-4"> @todo
            <div className="flex flex-row justify-between sm:flex-col sm:justify-between lg:flex-row lg:items-center">
              <span className="text-sm font-semibold">Message Usage</span>
              <div className="text-xs text-muted-foreground">
                <p>{profile?.usageStats?.used ?? "0"}</p>
              </div>
            </div>
          </div> */}

          {/* Keyboard Shortcuts */}
          {/* <div className="space-y-6 rounded-lg bg-card p-4"> @todo
            <span className="text-sm font-semibold">Keyboard Shortcuts</span>
            <div className="grid gap-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Search</span>
                <div className="flex gap-1">
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">⌘</kbd>
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">K</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Chat</span>
                <div className="flex gap-1">
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">⌘</kbd>
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">Shift</kbd>
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">O</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Toggle Sidebar</span>
                <div className="flex gap-1">
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">⌘</kbd>
                  <kbd className="rounded bg-background px-2 py-1 font-sans text-sm">B</kbd>
                </div>
              </div>
            </div>
          </div>*/}
        </div>

        {/* Main Content */}
        <div className="md:w-3/4 md:pl-12">
          <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="inline-flex h-9 items-center gap-1 rounded-lg bg-secondary/80 p-1 text-secondary-foreground no-scrollbar -mx-0.5 w-full justify-start md:w-fit">
              {settingsTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {children}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
