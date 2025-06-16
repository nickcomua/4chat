"use client"

import React, { useState } from "react"
import { ChevronDown, Search, Star, Info, ImagePlus, Gem, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFind, usePouch } from "use-pouchdb"
import { ChatSettings } from "@/lib/types/settings"
import { features, initialModels } from "@/lib/config/models"

export default function ModelSelector() {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const [modelSearchQuery, setModelSearchQuery] = useState("")
  const profileDb = usePouch("profile")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]
  const selectedModel = profile?.modelSettings?.preferredModel ?? "gemini-2-0-flash"
  const onModelChange = (modelId: string) => {
    profileDb.put({
      ...profile,
      _id: "0",
      modelSettings: { ...profile?.modelSettings, 
        preferredModel: modelId }
    })
  }
  const favoriteModels = profile?.modelSettings?.favoriteModels || []

  const getFilteredModels = () => {
    if (!profile?.modelSettings?.favoriteModels) return []
    return favoriteModels.filter((modelId) => {
      if (!modelSearchQuery) return true
      return modelId.toLowerCase().includes(modelSearchQuery.toLowerCase())
    })
  }

  const renderModelItem = (modelId: string) => {
    const model = initialModels.find(m => m.id === modelId)
    const modelFeatures = model?.features || []
    const modelName = model?.name || modelId
    const provider = model?.provider || ""
    const Icon = model?.icon

    return (
      <div
        key={modelId}
        role="menuitem"
        className="relative cursor-default select-none rounded-sm text-sm outline-none transition-colors focus:bg-accent/30 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 group flex flex-col items-start gap-1 p-3"
        tabIndex={-1}
        data-orientation="vertical"
        data-radix-collection-item=""
        onClick={() => {
          onModelChange(modelId)
          setIsModelDropdownOpen(false)
        }}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 pr-2 font-medium text-muted-foreground transition-colors">
            {Icon && <div className="h-4 w-4">
              <Icon />
            </div>}
            <span className="w-fit text-nowrap">{modelName}</span>
            <button className="p-1.5" data-state="closed">
              <Info className="size-3 text-color-heading" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {modelFeatures.map((featureKey) => {
              const feature = features[featureKey]
              if (!feature) return null

              const FeatureIcon = feature.icon
              return (
                <div
                  key={featureKey}
                  className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-md text-[--color] dark:text-[--color-dark]"
                  data-state="closed"
                  style={{
                    "--color-dark": feature.darkColor,
                    "--color": feature.color
                  } as React.CSSProperties}
                >
                  <div className="absolute inset-0 bg-current opacity-20 dark:opacity-15"></div>
                  <FeatureIcon className="h-4 w-4" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu open={isModelDropdownOpen} onOpenChange={setIsModelDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-8 rounded-md text-xs relative gap-2 px-2 text-muted-foreground"
          type="button"
        >
          <div className="text-left text-sm font-medium">{initialModels.find(m => m.id === selectedModel)?.name}</div>
          <ChevronDown className="right-0 size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          height: Math.min(getFilteredModels().length * 40 + 36 + 46, 1448),
        }}
        className="z-50 min-w-[8rem] bg-popover text-popover-foreground shadow-md !outline !outline-1 !outline-chat-border/20 dark:!outline-white/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 transform-origin relative overflow-hidden rounded-lg !border-none p-0 pt-10 max-w-[calc(100vw-2rem)] transition-[height,width] ease-snappy max-sm:mx-4 sm:w-[420px] sm:rounded-lg max-h-[calc(100vh-80px)]"
        side="top"
        align="start"
      >
        <div className="fixed inset-x-4 top-0 rounded-t-lg bg-popover px-3.5 pt-0.5 sm:inset-x-0">
          <div className="flex items-center">
            <Search className="ml-px mr-3 !size-4 text-muted-foreground/75" />
            <input
              role="searchbox"
              aria-label="Search models"
              placeholder="Search models..."
              className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
              value={modelSearchQuery}
              onChange={(e) => setModelSearchQuery(e.target.value)}
            />
          </div>
          <div className="border-b border-chat-border px-3"></div>
        </div>

        <div className="max-h-full overflow-y-scroll px-1.5 scroll-shadow">
          {getFilteredModels().map(renderModelItem)}
        </div>

        {/* <div className="fixed inset-x-4 bottom-0 flex items-center justify-between rounded-b-lg bg-popover pb-1 pl-1 pr-2.5 pt-1.5 sm:inset-x-0">
          <div className="absolute inset-x-3 top-0 border-b border-chat-border"></div>
          <button className="justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-9 px-4 py-2 flex items-center gap-2 pl-2 text-sm text-muted-foreground">
            <ChevronDown className="h-4 w-4" /> Show all
          </button> */}
        {/* <button @todo
            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-8 rounded-md text-xs relative gap-2 px-2 text-muted-foreground"
            type="button"
          >
            <Filter className="h-4 w-4" />
          </button> */}
        {/* </div> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 