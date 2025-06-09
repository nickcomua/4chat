"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, SunMoon, Copy, Info, ArrowRight, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [name, setName] = useState("")
  const [occupation, setOccupation] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [traits, setTraits] = useState<string[]>([])
  const [newTrait, setNewTrait] = useState("")
  const [boringTheme, setBoringTheme] = useState(false)
  const [hidePersonalInfo, setHidePersonalInfo] = useState(false)
  const [disableThematicBreaks, setDisableThematicBreaks] = useState(false)
  const [statsForNerds, setStatsForNerds] = useState(false)

  const suggestedTraits = ["friendly", "witty", "concise", "curious", "empathetic", "creative", "patient"]

  const addTrait = (trait: string) => {
    if (trait && !traits.includes(trait) && traits.length < 50) {
      setTraits([...traits, trait])
      setNewTrait("")
    }
  }

  const removeTrait = (trait: string) => {
    setTraits(traits.filter((t) => t !== trait))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      addTrait(newTrait)
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
          <Button variant="ghost" size="icon">
            <SunMoon className="h-4 w-4" />
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
              {/* Personal Preferences */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Customize T3 Chat</h2>
                <form className="grid gap-6 py-2">
                  <div className="relative grid gap-2">
                    <label className="text-base font-medium">What should T3 Chat call you?</label>
                    <Input
                      placeholder="Enter your name"
                      maxLength={50}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <span className="pointer-events-none absolute bottom-2 right-2 text-xs font-normal text-muted-foreground">
                      {name.length}/50
                    </span>
                  </div>

                  <div className="relative grid gap-2">
                    <label className="text-base font-medium">What do you do?</label>
                    <Input
                      placeholder="Engineer, student, etc."
                      maxLength={100}
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                    />
                    <span className="pointer-events-none absolute bottom-2 right-2 text-xs font-normal text-muted-foreground">
                      {occupation.length}/100
                    </span>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <label className="text-base font-medium">
                        What traits should T3 Chat have?
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          (up to 50, max 100 chars each)
                        </span>
                      </label>
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="Type a trait and press Enter or Tab..."
                        maxLength={100}
                        value={newTrait}
                        onChange={(e) => setNewTrait(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                      <span className="pointer-events-none absolute bottom-2 right-2 text-xs font-normal text-muted-foreground">
                        {traits.length}/50
                      </span>
                    </div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {suggestedTraits.map((trait) => (
                        <Badge
                          key={trait}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => addTrait(trait)}
                        >
                          {trait}
                          <Plus className="ml-1 h-4 w-4" />
                        </Badge>
                      ))}
                    </div>
                    {traits.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {traits.map((trait) => (
                          <Badge key={trait} variant="default" className="cursor-pointer">
                            {trait}
                            <X className="ml-1 h-4 w-4" onClick={() => removeTrait(trait)} />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative grid gap-2">
                    <label className="text-base font-medium">Anything else T3 Chat should know about you?</label>
                    <Textarea
                      placeholder="Interests, values, or preferences to keep in mind"
                      maxLength={3000}
                      className="min-h-[100px]"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                    <span className="pointer-events-none absolute bottom-2 right-2 text-xs font-normal text-muted-foreground">
                      {additionalInfo.length}/3000
                    </span>
                  </div>

                  <div className="flex flex-row items-center gap-2 justify-end">
                    <Button type="submit" disabled={!name && !occupation && !additionalInfo}>
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </div>

              {/* Visual Options */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Visual Options</h2>
                <div className="space-y-6 py-2">
                  <div className="flex items-center justify-between gap-x-1">
                    <div className="space-y-0.5">
                      <label className="font-medium text-base">Boring Theme</label>
                      <p className="text-sm text-muted-foreground">
                        If you think the pink is too much, turn this on to tone it down.
                      </p>
                    </div>
                    <Switch checked={boringTheme} onCheckedChange={setBoringTheme} />
                  </div>

                  <div className="flex items-center justify-between gap-x-1">
                    <div className="space-y-0.5">
                      <label className="font-medium text-base">Hide Personal Information</label>
                      <p className="text-sm text-muted-foreground">Hides your name and email from the UI.</p>
                    </div>
                    <Switch checked={hidePersonalInfo} onCheckedChange={setHidePersonalInfo} />
                  </div>

                  <div className="flex items-center justify-between gap-x-1">
                    <div className="space-y-0.5">
                      <label className="font-medium text-base">Disable Thematic Breaks</label>
                      <p className="text-sm text-muted-foreground">
                        Hides horizontal lines in chat messages. (Some browsers have trouble rendering these, turn off
                        if you have bugs with duplicated lines)
                      </p>
                    </div>
                    <Switch checked={disableThematicBreaks} onCheckedChange={setDisableThematicBreaks} />
                  </div>

                  <div className="flex items-center justify-between gap-x-1">
                    <div className="space-y-0.5">
                      <label className="font-medium text-base">Stats for Nerds</label>
                      <p className="text-sm text-muted-foreground">
                        Enables more insights into message stats including tokens per second, time to first token, and
                        estimated tokens in the message.
                      </p>
                    </div>
                    <Switch checked={statsForNerds} onCheckedChange={setStatsForNerds} />
                  </div>

                  {/* Font Preview */}
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Fonts Preview</h3>
                    <div className="rounded-lg border border-dashed border-input p-4">
                      <div className="prose prose-pink max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                        <div className="flex justify-end">
                          <div className="group relative inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left">
                            Can you write me a simple hello world program?
                          </div>
                        </div>
                        <div className="mb-2 mt-4">
                          <div className="max-w-[80%]">Sure, here you go:</div>
                        </div>
                        <div className="relative flex w-full flex-col pt-9">
                          <div className="absolute inset-x-0 top-0 flex h-9 items-center rounded-t bg-secondary px-4 py-2 text-sm text-secondary-foreground">
                            <span className="font-mono">typescript</span>
                          </div>
                          <div className="bg-chat-accent text-sm font-[450] text-secondary-foreground rounded-b border">
                            <pre className="p-4 overflow-auto">
                              <code>{`function greet(name: string) {
  console.log(\`Hello, \${name}!\`);
  return true;
}`}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
