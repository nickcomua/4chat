"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, FileText, Globe, Brain, Settings2, Zap, Gem, Key, FlaskConical, Link, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useFind, usePouch } from "use-pouchdb"
import { ChatSettings } from "@/lib/types/settings"
import { initialModels } from "@/lib/config/models"

interface ModelFeature {
  name: string
  icon: React.ComponentType<any>
  color: string
  darkColor: string
}

interface Model {
  id: string
  name: string
  provider: string
  description: string
  enabled: boolean
  features: string[]
  badges?: ("premium" | "experimental" | "api-key")[]
  icon: React.ComponentType<any>
  providers: Record<string, string>
}

const features: Record<string, ModelFeature> = {
  vision: { name: "Vision", icon: Eye, color: "hsl(168 54% 52%)", darkColor: "hsl(168 54% 74%)" },
  pdfs: { name: "PDFs", icon: FileText, color: "hsl(237 55% 57%)", darkColor: "hsl(237 75% 77%)" },
  search: { name: "Search", icon: Globe, color: "hsl(208 56% 52%)", darkColor: "hsl(208 56% 74%)" },
  reasoning: { name: "Reasoning", icon: Brain, color: "hsl(263 58% 53%)", darkColor: "hsl(263 58% 75%)" },
  effort: { name: "Effort Control", icon: Settings2, color: "hsl(304 44% 51%)", darkColor: "hsl(304 44% 72%)" },
  fast: { name: "Fast", icon: Zap, color: "hsl(46 77% 52%)", darkColor: "hsl(46 77% 79%)" },
}


export default function ModelsPage() {
  // const [models, setModels] = useState<Model[]>(initialModels)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const db = usePouch<ChatSettings>("profile")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]

  // Load model preferences from profile
  const models = profile?.modelSettings?.favoriteModels ? initialModels.map(model => ({
    ...model,
    enabled: profile.modelSettings.favoriteModels.includes(model.id)
  })) : initialModels

  // useEffect(() => {
  //   if (profile?.modelSettings) {
  //     const favoriteModels = profile.modelSettings.favoriteModels || []
  //     setModels(prevModels => 
  //       prevModels.map(model => ({
  //         ...model,
  //         enabled: favoriteModels.includes(model.id)
  //       }))
  //     )
  //   }
  // }, [profile])

  const toggleModel = (modelId: string) => {
    saveModelPreferences(models.map(model => model.id === modelId ? { ...model, enabled: !model.enabled } : model))
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    )
  }

  const selectRecommended = () => {
    const recommendedModels = ["gemini-2.5-flash", "o4-mini", "claude-4-sonnet-reasoning", "deepseek-r1-llama-distilled"]
    saveModelPreferences(models.map(model => recommendedModels.includes(model.id) ? { ...model, enabled: true } : model))
  }

  const unselectAll = () => {
    saveModelPreferences(models.map(model => ({ ...model, enabled: false })))
  }

  const saveModelPreferences = async (models: Model[]) => {

    try {
      const enabledModels = models.filter(model => model.enabled).map(model => model.id)

      const updatedProfile = {
        ...profile,
        modelSettings: {
          ...profile.modelSettings,
          favoriteModels: enabledModels,
          preferredModel: enabledModels[0] || "gemini-2.5-flash"
        },
        lastUpdated: new Date().toISOString()
      }

      await db.put(updatedProfile)
    } catch (error) {
      console.error("Error saving model preferences:", error)
    }
  }

  const filteredModels = models.filter((model) => {
    // First check if the model is premium and we're only showing free plan models
    // if (model.badges?.some(badge => badge === "premium" || badge === "api-key")) {
    //   return false
    // }

    // Then check if any features are selected
    if (selectedFeatures.length > 0) {
      // A model should only be shown if it has ALL selected features
      return selectedFeatures.every((feature) => model.features.includes(feature))
    }

    // If no filters are applied, show all models
    return true
  })

  // Safety check to ensure models array exists
  if (!models || !Array.isArray(models)) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading models...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Available Models</h2>
        <p className="mt-2 text-sm text-muted-foreground/80 sm:text-base">
          Choose which models appear in your model selector. This won't affect existing conversations.
        </p>
      </div>

      <div className="flex w-full flex-row items-baseline justify-between gap-3 sm:items-center sm:gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap text-sm">
                Filter by features
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50 min-w-[8rem] overflow-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-md !outline !outline-1 !outline-chat-border/20 dark:!outline-white/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 transform-origin w-56">
              {Object.entries(features).map(([key, feature]) => {
                const Icon = feature.icon
                const isSelected = selectedFeatures.includes(key)

                return (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={isSelected}
                    onClick={(e) => { e.preventDefault(); toggleFeature(key) }}
                    className="relative cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent/30 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-md text-[--color] dark:text-[--color-dark]"
                        style={
                          {
                            "--color": feature.color,
                            "--color-dark": feature.darkColor,
                          } as React.CSSProperties
                        }
                      >
                        <div className="absolute inset-0 opacity-20 dark:opacity-15" style={{ backgroundColor: 'var(--color)' }}></div>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{feature.name}</span>
                    </div>
                    <span className="flex h-3.5 w-3.5 items-center justify-center">
                      {isSelected && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-4 w-4">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={selectRecommended} className="text-xs sm:text-sm">
            Select Recommended Models
          </Button>
          <Button variant="outline" size="sm" onClick={unselectAll} className="text-xs sm:text-sm">
            Unselect All
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full space-y-4 overflow-y-auto sm:h-[65vh] sm:min-h-[670px]">
          {filteredModels.map((model) => {
            const Icon = model.icon
            return (
              <div key={model.id} className="relative flex flex-col rounded-lg border border-input p-3 sm:p-4">
                <div className="flex w-full items-start gap-4">
                  <div className="relative h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10">
                    <Icon />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold sm:text-base">{model.name}</h3>
                          {/* {model.badges?.map((badge) => {
                            const badgeConfig = {
                              premium: { icon: Gem, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
                              experimental: { icon: FlaskConical, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20" },
                              "api-key": { icon: Key, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20" },
                            }[badge]

                            if (!badgeConfig) return null

                            const BadgeIcon = badgeConfig.icon
                            return (
                              <div
                                key={badge}
                                className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${badgeConfig.color} ${badgeConfig.bg}`}
                              >
                                <BadgeIcon className="h-3 w-3" />
                                <span className="capitalize">{badge === "api-key" ? "API Key" : badge}</span>
                              </div>
                            )
                          })} */}
                        </div>
                        <p className="text-xs text-muted-foreground sm:text-sm">{model.provider}</p>
                        <p className="text-xs text-muted-foreground/80 sm:text-sm">{model.description}</p>
                      </div>
                      {profile?.modelSettings ? (
                        <Switch
                          checked={model.enabled}
                          onCheckedChange={() => toggleModel(model.id)}
                          className="ml-4 flex-shrink-0"
                        />
                      ) : (
                        <Skeleton className="ml-4 h-6 w-11 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {model.features.map((featureKey) => {
                        const feature = features[featureKey]
                        if (!feature) return null

                        const Icon = feature.icon
                        return (
                          <div
                            key={featureKey}
                            className="relative flex items-center gap-1.5 rounded-md px-2 py-1 text-[--color] dark:text-[--color-dark]"
                            style={
                              {
                                "--color": feature.color,
                                "--color-dark": feature.darkColor,
                              } as React.CSSProperties
                            }
                          >
                            <div className="absolute inset-0 rounded-md opacity-10 dark:opacity-15" style={{ backgroundColor: 'var(--color)' }}></div>
                            <Icon className="h-3 w-3" />
                            <span className="text-xs font-medium">{feature.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
