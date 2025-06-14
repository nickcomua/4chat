"use client"

import React from "react"
import { Copy, Info, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

export default function ProfileSidebar() {
  return (
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
                <Copy className="h-4 w-4 text-muted-foreground" />
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
                  <Info className="h-4 w-4 text-muted-foreground" />
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
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
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
  )
} 