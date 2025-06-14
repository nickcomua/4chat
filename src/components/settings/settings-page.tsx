"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, SunMoon } from "lucide-react"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import ProfileSidebar from "./profile-sidebar"
import CustomizationTab from "./customization-tab"

export default function SettingsPage() {
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
          <Button variant="ghost" size="icon">
            <SunMoon className="h-4 w-4" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost">Sign out</Button>
        </div>
      </header>

      <div className="flex flex-grow flex-col gap-4 md:flex-row">
        <ProfileSidebar />

        {/* Main Content */}
        <div className="md:w-3/4 md:pl-12">
          <Tabs defaultValue="customization" className="space-y-6">
            <TabsList className="inline-flex h-9 items-center gap-1 rounded-lg bg-secondary/80 p-1 text-secondary-foreground no-scrollbar -mx-0.5 w-full justify-start overflow-auto md:w-fit">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
              <TabsTrigger value="history">History & Sync</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
            </TabsList>

            <TabsContent value="customization" className="space-y-12">
              <CustomizationTab />
            </TabsContent>

            <TabsContent value="account" className="space-y-8">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
                <p className="text-muted-foreground">Account management features coming soon.</p>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-8">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">History & Sync</h2>
                <p className="text-muted-foreground">Chat history and sync features coming soon.</p>
              </div>
            </TabsContent>

            <TabsContent value="models" className="space-y-8">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Models</h2>
                <p className="text-muted-foreground">Model configuration coming soon.</p>
              </div>
            </TabsContent>

            <TabsContent value="api-keys" className="space-y-8">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">API Keys</h2>
                <p className="text-muted-foreground">API key management coming soon.</p>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-8">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Attachments</h2>
                <p className="text-muted-foreground">Attachment settings coming soon.</p>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-8">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground">Contact information coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
