"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"

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

  const currentTab = settingsTabs.find((tab) => pathname === tab.path)?.value || "account"

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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const html = document.documentElement
              const isDark = html.classList.contains("dark")
              if (isDark) {
                html.classList.remove("dark")
                localStorage.setItem("theme", "light")
              } else {
                html.classList.add("dark")
                localStorage.setItem("theme", "dark")
              }
            }}
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
              className="absolute size-4 rotate-0 scale-100 transition-all duration-200 dark:rotate-90 dark:scale-0"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
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
              className="absolute size-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost">Sign out</Button>
        </div>
      </header>

      <div className="flex flex-grow flex-col gap-4 md:flex-row">
        {/* Sidebar */}
        <div className="hidden space-y-8 md:block md:w-1/4">
          {/* Profile Section */}
          <div className="relative text-center">
            <img
              alt="Profile picture"
              width={160}
              height={160}
              className="mx-auto rounded-full transition-opacity duration-200"
              src="/placeholder.svg?height=160&width=160"
            />
            <h1 className="mt-4 text-2xl font-bold transition-opacity duration-200">Mykola Korrnichuk</h1>
            <div className="relative flex items-center justify-center">
              <p className="break-all text-muted-foreground transition-opacity duration-200"></p>
            </div>
            <p className="perspective-1000 group relative h-6 cursor-pointer break-all text-muted-foreground">
              <span className="absolute inset-0 transition-transform duration-300 [backface-visibility:hidden] [transform-style:preserve-3d] truncate group-hover:[transform:rotateX(180deg)]">
                kolyacom.ya@gmail.com
              </span>
              <span className="absolute inset-0 transition-transform duration-300 [backface-visibility:hidden] [transform-style:preserve-3d] [transform:rotateX(180deg)] group-hover:[transform:rotateX(0deg)]">
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
            </p>
            <Badge className="mt-2">Pro Plan</Badge>
          </div>

          {/* Usage Stats */}
          <div className="space-y-6 rounded-lg bg-card p-4">
            <div className="flex flex-row justify-between sm:flex-col sm:justify-between lg:flex-row lg:items-center">
              <span className="text-sm font-semibold">Message Usage</span>
              <div className="text-xs text-muted-foreground">
                <p>Resets 06/26/2025</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Standard</h3>
                  <span className="text-sm text-muted-foreground">53/1500</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: "3.53333%" }}></div>
                </div>
                <p className="text-sm text-muted-foreground">1447 messages remaining</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <h3 className="text-sm font-medium">Premium</h3>
                    <Button variant="ghost" size="icon" className="h-4 w-4">
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                      </svg>
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">49/100</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: "49%" }}></div>
                </div>
                <p className="text-sm text-muted-foreground">51 messages remaining</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Button className="border-reflect button-reflect bg-[rgb(162,59,103)] hover:bg-[#d56698] text-primary-foreground">
                Buy more premium credits
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
                  className="ml-2 h-3.5 w-3.5"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-6 rounded-lg bg-card p-4">
            <span className="text-sm font-semibold">Keyboard Shortcuts</span>
            <div className="grid gap-4">
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
          </div>
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
