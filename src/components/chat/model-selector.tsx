"use client"

import React, { useState } from "react"
import {
  ChevronDown,
  Search,
  Pin,
  Eye,
  FileText,
  Brain,
  FlaskConical,
  Gem,
  GlobeIcon,
  Filter,
  List,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const [modelSearchQuery, setModelSearchQuery] = useState("")
  const [modelSelectionView, setModelSelectionView] = useState<"favorites" | "all">("favorites")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showOnlyFreeModels, setShowOnlyFreeModels] = useState(false)

  const allFeatures = ["Fast", "Vision", "Search", "PDFs", "Reasoning", "Effort Control"]
  const featureIcons: { [key: string]: React.ElementType } = {
    Fast: Brain, // Using Brain as placeholder, adjust as needed
    Vision: Eye,
    Search: GlobeIcon,
    PDFs: FileText,
    Reasoning: Brain,
    "Effort Control": Brain, // Using Brain as placeholder
  }

  const favoriteModels = [
    {
      name: "Gemini 2.5 Flash",
      provider: "Google",
      features: ["Vision", "Search", "PDFs"],
    },
    {
      name: "Gemini 2.5 Pro",
      provider: "Google",
      features: ["Vision", "Search", "PDFs", "Reasoning"],
      experimental: true,
    },
    {
      name: "GPT ImageGen",
      provider: "OpenAI",
      features: ["Vision"],
      premium: true,
    },
    { name: "o4-mini", provider: "OpenAI", features: ["Vision", "Reasoning"] },
    {
      name: "Claude 4 Sonnet (Reasoning)",
      provider: "Anthropic",
      features: ["Vision", "PDFs", "Reasoning"],
      premium: true,
    },
    {
      name: "DeepSeek R1 (Llama Distilled)",
      provider: "DeepSeek",
      features: ["Reasoning"],
    },
  ]

  const allModels = [
    ...favoriteModels,
    {
      name: "Gemini 2.0 Flash",
      provider: "Google",
      features: ["Vision", "Search", "PDFs"],
    },
    { name: "GPT-4o", provider: "OpenAI", features: ["Vision"] },
    {
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      features: ["Vision", "PDFs"],
      premium: true,
    },
  ]

  const getFilteredModels = (models: typeof favoriteModels) => {
    return models
      .filter((model) => {
        if (!modelSearchQuery) return true
        return (
          model.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
          model.provider.toLowerCase().includes(modelSearchQuery.toLowerCase())
        )
      })
      .filter((model) => {
        if (activeFilters.length === 0) return true
        return activeFilters.every((filter) => model.features.includes(filter))
      })
      .filter((model) => {
        if (!showOnlyFreeModels) return true
        return !model.premium && !model.experimental
      })
  }

  const renderModelCard = (model: typeof favoriteModels[0]) => (
    <div key={model.name} className="group relative">
      <button
        className="group relative flex h-[148px] w-[108px] cursor-pointer flex-col items-start gap-0.5 overflow-hidden rounded-xl border border-chat-border/50 bg-sidebar/20 px-1 py-3 text-color-heading hover:bg-accent/30 hover:text-color-heading"
        onClick={() => {
          onModelChange(model.name)
          setIsModelDropdownOpen(false)
        }}
      >
        <div className="flex w-full flex-col items-center justify-center gap-1 font-medium transition-colors">
          <div className="size-7 text-[--model-primary] bg-muted rounded flex items-center justify-center">
            {model.provider.charAt(0)}
          </div>
          <div className="w-full text-center text-[--model-primary]">
            <div className="text-base font-semibold">{model.name.split(" ")[0]}</div>
            <div className="-mt-0.5 text-sm font-semibold">
              {model.name.split(" ").slice(1).join(" ")}
            </div>
          </div>
          {model.experimental && (
            <div className="absolute right-1.5 top-1.5 text-[--model-muted] opacity-80">
              <FlaskConical className="size-4" />
            </div>
          )}
          {model.premium && (
            <div className="absolute right-1.5 top-1.5 text-[--model-muted] opacity-80">
              <Gem className="size-4" />
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-3 flex w-full items-center justify-center gap-2">
          {model.features.map((feature) => (
            <div
              key={feature}
              className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-md text-[--color] dark:text-[--color-dark]"
            >
              <div className="absolute inset-0 bg-current opacity-20 dark:opacity-15"></div>
              {feature === "Vision" && <Eye className="h-4 w-4" />}
              {feature === "Search" && <GlobeIcon className="h-4 w-4" />}
              {feature === "PDFs" && <FileText className="h-4 w-4" />}
              {feature === "Reasoning" && <Brain className="h-4 w-4" />}
            </div>
          ))}
        </div>
      </button>
    </div>
  )

  return (
    <DropdownMenu open={isModelDropdownOpen} onOpenChange={setIsModelDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-8 rounded-md text-xs relative gap-2 px-2 py-1.5 -mb-2 text-muted-foreground"
          type="button"
        >
          <div className="text-left text-sm font-medium">{selectedModel}</div>
          <ChevronDown className="right-0 size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-50 min-w-[8rem] bg-popover text-popover-foreground shadow-md !outline !outline-1 !outline-chat-border/20 dark:!outline-white/5 relative overflow-hidden rounded-lg !border-none p-0 pb-11 pt-10 max-w-[calc(100vw-2rem)] transition-[height,width] ease-snappy max-sm:mx-4 sm:w-[640px] max-h-[calc(100vh-80px)] min-h-[300px]"
        side="top"
        align="start"
      >
        {/* Search Header */}
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

        {/* Models Grid */}
        <div className="max-h-full overflow-y-scroll px-1.5 sm:w-[640px] scroll-shadow">
          <div className="flex w-full flex-wrap justify-start gap-3.5 pb-4 pl-3 pr-2 pt-2.5">
            {modelSelectionView === "favorites" && (
              <>
                <div className="-mb-2 ml-0 flex w-full select-none items-center justify-start gap-1.5 text-color-heading">
                  <Pin className="mt-px size-4" />
                  Favorites
                </div>
                {getFilteredModels(favoriteModels).map(renderModelCard)}
              </>
            )}
            {modelSelectionView === "all" && (
              <>
                <div className="-mb-2 ml-2 mt-1 w-full select-none text-color-heading">All Models</div>
                {getFilteredModels(allModels).map(renderModelCard)}
              </>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div className="fixed inset-x-0 bottom-0 border-t border-chat-border bg-popover p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className={`text-xs px-2 py-1 rounded ${
                  modelSelectionView === "favorites"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setModelSelectionView("favorites")}
              >
                Favorites
              </button>
              <button
                className={`text-xs px-2 py-1 rounded ${
                  modelSelectionView === "all"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setModelSelectionView("all")}
              >
                All Models
              </button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 