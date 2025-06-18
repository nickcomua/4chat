"use client"

import React, { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useFind, usePouch } from "use-pouchdb"
import { ChatSettings } from "@/lib/types/settings"
import { Schema } from "effect"

export default function CustomizationTab() {
  const [name, setName] = useState("")
  const [occupation, setOccupation] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [traits, setTraits] = useState<string[]>([])
  const [newTrait, setNewTrait] = useState("")
  const [hidePersonalInfo, setHidePersonalInfo] = useState(false)
  const [disableThematicBreaks, setDisableThematicBreaks] = useState(false)
  const [statsForNerds, setStatsForNerds] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [isSaving, setIsSaving] = useState(false)

  const db = usePouch<ChatSettings>("profile")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]

  // Load profile data when it becomes available
  useEffect(() => {
    if (profile) {
      setName(profile.personalPreferences?.name || "")
      setOccupation(profile.personalPreferences?.occupation || "")
      setAdditionalInfo(profile.personalPreferences?.additionalInfo || "")
      setTraits([...(profile.personalPreferences?.traits || [])])
      setHidePersonalInfo(profile.visualOptions?.hidePersonalInfo || false)
      setDisableThematicBreaks(profile.visualOptions?.disableThematicBreaks || false)
      setStatsForNerds(profile.visualOptions?.statsForNerds || false)
      setTheme(profile.visualOptions?.theme || "system")
    }
  }, [profile])

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

  const updatedProfile ={
    ...profile,
    personalPreferences: {
      name,
      occupation,
      additionalInfo,
      traits
    },
    visualOptions: {
      ...profile?.visualOptions ?? {},
      hidePersonalInfo,
      disableThematicBreaks,
      statsForNerds,
      theme
    },
    lastUpdated: new Date().toISOString()
  }
  const preferencesEquivalence = Schema.equivalence(ChatSettings)
  const savePreferences = async () => {
    if (!profile) return

    setIsSaving(true)
    try {

      await db.put(updatedProfile)
    } catch (error) {
      console.error("Error saving preferences:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* Personal Preferences */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Customize 4Chat</h2>
        <div className="grid gap-6 py-2">
          <div className="relative grid gap-2">
            <label className="text-base font-medium">What should 4Chat call you?</label>
            {profile?.personalPreferences ? (
              <>
                <Input
                  placeholder="Enter your name"
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <span className="pointer-events-none absolute bottom-2 right-2 text-xs font-normal text-muted-foreground">
                  {name.length}/50
                </span>
              </>
            ) : (
              <Skeleton className="h-10 w-full" />
            )}
          </div>

          <div className="relative grid gap-2">
            <label className="text-base font-medium">What do you do?</label>
            {profile?.personalPreferences ? (
              <>
                <Input
                  placeholder="Engineer, student, etc."
                  maxLength={100}
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
                <span className="pointer-events-none absolute bottom-2 right-2 text-xs font-normal text-muted-foreground">
                  {occupation.length}/100
                </span>
              </>
            ) : (
              <Skeleton className="h-10 w-full" />
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <label className="text-base font-medium">
                What traits should 4Chat have?
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  (up to 50, max 100 chars each)
                </span>
              </label>
            </div>
            {profile?.personalPreferences ? (
              <>
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
                  {Array.from(new Set([...suggestedTraits, ...traits])).map((trait) => (
                    traits.find(t => t === trait) ? (
                      <Badge key={trait} variant="default" className="cursor-pointer">
                        {trait}
                        <X className="ml-1 h-4 w-4" onClick={() => removeTrait(trait)} />
                      </Badge>

                    ) : (
                      <Badge
                        key={trait}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => addTrait(trait)}
                      >
                        {trait}
                        <Plus className="ml-1 h-4 w-4" />
                      </Badge>
                    )
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative grid gap-2">
            <label className="text-base font-medium">Anything else 4Chat should know about you?</label>
            {profile?.personalPreferences ? (
              <>
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
              </>
            ) : (
              <Skeleton className="h-24 w-full" />
            )}
          </div>
          <div className="flex items-center justify-between gap-x-1">
            <div className="space-y-0.5">
              <label className="font-medium text-base">Hide Personal Information</label>
              <p className="text-sm text-muted-foreground">Hides your name and email from the UI.</p>
            </div>
            {profile?.visualOptions ? (
              <Switch checked={hidePersonalInfo} onCheckedChange={setHidePersonalInfo} />
            ) : (
              <Skeleton className="h-6 w-11" />
            )}
          </div>
          <div className="flex flex-row items-center gap-2 justify-end">
            <Button
              onClick={savePreferences}
              disabled={isSaving || preferencesEquivalence({...profile,lastUpdated: ""}, {...updatedProfile,lastUpdated: "" })}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 