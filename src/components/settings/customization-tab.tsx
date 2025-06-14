"use client"

import React, { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Badge } from "../ui/badge"

export default function CustomizationTab() {
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
    <div className="space-y-12">
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
    </div>
  )
} 