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
import { ChatSettings } from "@/types/settings"

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

const GeminiIcon = () => (
  <svg className="h-full w-full" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z"></path>
  </svg>
)

const OpenAIIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="118 120 480 480" fill="currentColor" className="h-full w-full"><path d="M304.246 295.411V249.828C304.246 245.989 305.687 243.109 309.044 241.191L400.692 188.412C413.167 181.215 428.042 177.858 443.394 177.858C500.971 177.858 537.44 222.482 537.44 269.982C537.44 273.34 537.44 277.179 536.959 281.018L441.954 225.358C436.197 222 430.437 222 424.68 225.358L304.246 295.411ZM518.245 472.945V364.024C518.245 357.304 515.364 352.507 509.608 349.149L389.174 279.096L428.519 256.543C431.877 254.626 434.757 254.626 438.115 256.543L529.762 309.323C556.154 324.679 573.905 357.304 573.905 388.971C573.905 425.436 552.315 459.024 518.245 472.941V472.945ZM275.937 376.982L236.592 353.952C233.235 352.034 231.794 349.154 231.794 345.315V239.756C231.794 188.416 271.139 149.548 324.4 149.548C344.555 149.548 363.264 156.268 379.102 168.262L284.578 222.964C278.822 226.321 275.942 231.119 275.942 237.838V376.986L275.937 376.982ZM360.626 425.922L304.246 394.255V327.083L360.626 295.416L417.002 327.083V394.255L360.626 425.922ZM396.852 571.789C376.698 571.789 357.989 565.07 342.151 553.075L436.674 498.374C442.431 495.017 445.311 490.219 445.311 483.499V344.352L485.138 367.382C488.495 369.299 489.936 372.179 489.936 376.018V481.577C489.936 532.917 450.109 571.785 396.852 571.785V571.789ZM283.134 464.79L191.486 412.01C165.094 396.654 147.343 364.029 147.343 332.362C147.343 295.416 169.415 262.309 203.48 248.393V357.791C203.48 364.51 206.361 369.308 212.117 372.665L332.074 442.237L292.729 464.79C289.372 466.707 286.491 466.707 283.134 464.79ZM277.859 543.48C223.639 543.48 183.813 502.695 183.813 452.314C183.813 448.475 184.294 444.636 184.771 440.797L279.295 495.498C285.051 498.856 290.812 498.856 296.568 495.498L417.002 425.927V471.509C417.002 475.349 415.562 478.229 412.204 480.146L320.557 532.926C308.081 540.122 293.206 543.48 277.854 543.48H277.859ZM396.852 600.576C454.911 600.576 503.37 559.313 514.41 504.612C568.149 490.696 602.696 440.315 602.696 388.976C602.696 355.387 588.303 322.762 562.392 299.25C564.791 289.173 566.231 279.096 566.231 269.024C566.231 200.411 510.571 149.067 446.274 149.067C433.322 149.067 420.846 150.984 408.37 155.305C386.775 134.192 357.026 120.758 324.4 120.758C266.342 120.758 217.883 162.02 206.843 216.721C153.104 230.637 118.557 281.018 118.557 332.357C118.557 365.946 132.95 398.571 158.861 422.083C156.462 432.16 155.022 442.237 155.022 452.309C155.022 520.922 210.682 572.266 274.978 572.266C287.931 572.266 300.407 570.349 312.883 566.028C334.473 587.141 364.222 600.576 396.852 600.576Z"></path></svg>
)

const AnthropicIcon = () => (
  <svg className="h-full w-full" viewBox="0 0 46 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M32.73 0h-6.945L38.45 32h6.945L32.73 0ZM12.665 0 0 32h7.082l2.59-6.72h13.25l2.59 6.72h7.082L19.929 0h-7.264Zm-.702 19.337 4.334-11.246 4.334 11.246h-8.668Z"></path>
  </svg>
)

const MetaIcon = () => (
  <svg className="h-full w-full" viewBox="0 0 256 171" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><title>Meta</title><path d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82 3.677 5.947 9.16 8.466 14.751 8.466 7.211 0 13.808-1.79 26.52-19.372 10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927 0-23.52-5.484-49.623-17.564-68.273-8.574-13.23-19.684-21.313-31.907-21.313-13.22 0-23.859 9.97-35.815 27.75-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07-14.2 18.91-26.324 26.076-42.287 26.076-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148l27.651.988Z"></path><path d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0 85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49 6.802 8.243 11.565 10.7 17.752 10.7 15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363-11.395 0-21.49-2.475-32.654-13.007-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428-10.923 0-20.2 7.666-27.963 19.39L21.802 33.206Z"></path><path d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39-10.976 16.568-17.698 41.245-17.698 64.944 0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148 0 83.772 7.514 55.24 21.802 33.206 34.48 13.666 52.774 0 73.757 0l-.445 27.802Z"></path></svg>
)

const DeepSeekIcon = () => (
  <svg className="h-full w-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><title>DeepSeek</title><path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"></path></svg>
)

const GrokIcon = () => (
  <svg viewBox="0 0 33 32" className="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g><path d="M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466"></path></g></svg>)

const QwenIcon = () => (
  <svg className="h-full w-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><title>Qwen</title><path d="M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z"></path></svg>)

const initialModels: Model[] = [
  {
    id: "gemini-2-0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Google's flagship model, known for speed and accuracy (and also web search!).",
    enabled: false,
    features: ["vision", "pdfs", "search"],
    icon: GeminiIcon,
    providers: {
      openrouter: "google/gemini-2.0-flash-001"
    }
  },
  {
    id: "gemini-2-0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    provider: "Google",
    description: "Similar to 2.0 Flash, but even faster.",
    enabled: false,
    features: ["fast", "vision", "pdfs"],
    icon: GeminiIcon,
    providers: {
      openrouter: "google/gemini-2.0-flash-lite-001"
    }
  },
  {
    id: "gemini-2-5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    description: "Google's latest fast model, known for speed and accuracy (and also web search!).",
    enabled: true,
    features: ["vision", "pdfs", "search"],
    icon: GeminiIcon,
    providers: {
      openrouter: "google/gemini-2.5-flash-preview"
    }
  },
  {
    id: "gemini-2-5-flash-thinking",
    name: "Gemini 2.5 Flash (Thinking)",
    provider: "Google",
    description: "Google's latest fast model, but now it can think!",
    enabled: false,
    features: ["vision", "pdfs", "search", "effort"],
    icon: GeminiIcon,
    providers: {
      openrouter: "google/gemini-2.5-flash-preview:thinking"
    }
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    description: "Google's most advanced model, excelling at complex reasoning and problem-solving.",
    enabled: true,
    features: ["vision", "pdfs", "search", "reasoning", "effort"],
    icon: GeminiIcon,
    providers: {
      openrouter: "google/gemini-2.5-pro-preview"
    }
  },
  {
    id: "gpt-imagegen",
    name: "GPT ImageGen",
    provider: "OpenAI",
    description: "OpenAI's latest and greatest image generation model, using lots of crazy tech like custom tools for text and reflections.",
    enabled: true,
    features: ["vision", "image-generation"],
    icon: OpenAIIcon,
    providers: {}
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o-mini",
    provider: "OpenAI",
    description: "Like gpt-4o, but faster.",
    enabled: false,
    features: ["vision"],
    icon: OpenAIIcon,
    providers: {
      openrouter: "openai/gpt-4o-mini"
    }
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "OpenAI's flagship non-reasoning model.",
    enabled: false,
    features: ["vision"],
    icon: OpenAIIcon,
    providers: {
      openrouter: "openai/gpt-4o"
    }
  },
  {
    id: "gpt-4-1",
    name: "GPT-4.1",
    provider: "OpenAI",
    description: "GPT-4.1 is a flagship large language model optimized for advanced instruction following, real-world software engineering, and long-context reasoning.",
    enabled: false,
    features: ["vision"],
    icon: OpenAIIcon,
    providers: {
      openrouter: "openai/gpt-4.1"
    }
  },
  {
    id: "gpt-4-1-mini",
    name: "GPT-4.1 Mini",
    provider: "OpenAI",
    description: "GPT-4.1 Mini is a mid-sized model delivering performance competitive with GPT-4o at substantially lower latency.",
    enabled: false,
    features: ["vision"],
    icon: OpenAIIcon,
    providers: {
      openrouter: "openai/gpt-4.1-mini"
    }
  },
  {
    id: "gpt-4-1-nano",
    name: "GPT-4.1 Nano",
    provider: "OpenAI",
    description: "For tasks that demand low latency, GPT‑4.1 nano is the fastest model in the GPT-4.1 series.",
    enabled: false,
    features: ["vision"],
    icon: OpenAIIcon,
    providers: {
      openrouter: "openai/gpt-4.1-nano"
    }
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    description: "A small, fast, super smart reasoning model.",
    enabled: false,
    features: ["reasoning", "effort"],
    icon: OpenAIIcon,
    providers: {
      openrouter: "openai/o3-mini"
    }
  },
  {
    id: "o4-mini",
    name: "o4-mini",
    provider: "OpenAI",
    description: "A small, fast, even smarter reasoning model.",
    enabled: true,
    features: ["vision", "reasoning", "effort"],
    icon: OpenAIIcon,
    providers: {
      openrouter: "openai/o4-mini"
    }
  },
  {
    id: "o3",
    name: "o3",
    provider: "OpenAI",
    description: "o3 is a well-rounded and powerful model across domains.",
    enabled: false,
    features: ["vision", "effort", "reasoning"],
    icon: OpenAIIcon,
    providers: {
      openrouter: "openai/o3"
    }
  },
  {
    id: "o3-pro",
    name: "o3 Pro",
    provider: "OpenAI",
    description: "The o3 series of models are trained with reinforcement learning to think before they answer and perform complex reasoning.",
    enabled: false,
    features: ["vision", "effort", "reasoning", "pdfs"],
    icon: OpenAIIcon,
    providers: {
      openrouter: "openai/o3-pro"
    }
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Smart model for complex problems.",
    enabled: false,
    features: ["vision", "pdfs"],
    icon: AnthropicIcon,
    providers: {
      openrouter: "anthropic/claude-3.5-sonnet"
    }
  },
  {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    provider: "Anthropic",
    description: "The last gen model from Anthropic.",
    enabled: false,
    features: ["vision", "pdfs"],
    icon: AnthropicIcon,
    providers: {
      openrouter: "anthropic/claude-3.7-sonnet"
    }
  },
  {
    id: "claude-3-7-sonnet-reasoning",
    name: "Claude 3.7 Sonnet (Reasoning)",
    provider: "Anthropic",
    description: "The last gen model from Anthropic (but you can make it think).",
    enabled: false,
    features: ["vision", "pdfs", "reasoning", "effort"],
    icon: AnthropicIcon,
    providers: {
      openrouter: "anthropic/claude-3.7-sonnet:thinking"
    }
  },
  {
    id: "claude-4-sonnet",
    name: "Claude 4 Sonnet",
    provider: "Anthropic",
    description: "The latest model from Anthropic.",
    enabled: false,
    features: ["vision", "pdfs"],
    icon: AnthropicIcon,
    providers: {
      openrouter: "anthropic/claude-sonnet-4"
    }
  },
  {
    id: "claude-4-sonnet-reasoning",
    name: "Claude 4 Sonnet (Reasoning)",
    provider: "Anthropic",
    description: "The latest model from Anthropic (but you can make it think).",
    enabled: true,
    features: ["vision", "pdfs", "reasoning", "effort"],
    icon: AnthropicIcon,
    providers: {
      openrouter: "anthropic/claude-sonnet-4"
    }
  },
  {
    id: "claude-4-opus",
    name: "Claude 4 Opus",
    provider: "Anthropic",
    description: "The latest and greatest from Anthropic.",
    enabled: false,
    features: ["vision", "pdfs", "reasoning"],
    icon: AnthropicIcon,
    providers: {
      openrouter: "anthropic/claude-opus-4"
    }
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70b",
    provider: "Meta",
    description: "Industry-leading speed in an open source model.",
    enabled: false,
    features: ["fast"],
    icon: MetaIcon,
    providers: {
      openrouter: "meta-llama/llama-3.3-70b-instruct"
    }
  },
  {
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    provider: "Meta",
    description: "Llama 4 Scout 17B Instruct (16E) is a mixture-of-experts (MoE) language model developed by Meta, activating 17 billion parameters out of a total of 109B.",
    enabled: false,
    features: ["vision"],
    icon: MetaIcon,
    providers: {
      openrouter: "meta-llama/llama-4-scout"
    }
  },
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "Meta",
    description: "Llama 4 Maverick 17B Instruct (128E) is a high-capacity multimodal language model from Meta, built on a mixture-of-experts (MoE) architecture with 128 experts and 17 billion active parameters per forward pass (400B total).",
    enabled: false,
    features: ["vision"],
    icon: MetaIcon,
    providers: {
      openrouter: "meta-llama/llama-4-maverick"
    }
  },
  {
    id: "deepseek-v3-fireworks",
    name: "DeepSeek v3 (Fireworks)",
    provider: "DeepSeek",
    description: "DeepSeek's groundbreaking direct prediction model.",
    enabled: false,
    features: [],
    icon: DeepSeekIcon,
    providers: {}
  },
  {
    id: "deepseek-v3-0324",
    name: "DeepSeek v3 (0324)",
    provider: "DeepSeek",
    description: "DeepSeek V3, a 685B-parameter, mixture-of-experts model, is the latest iteration of the flagship chat model family from the DeepSeek team.",
    enabled: false,
    features: [],
    icon: DeepSeekIcon,
    providers: {
      openrouter: "deepseek/deepseek-chat-v3-0324"
    }
  },
  {
    id: "deepseek-r1-openrouter",
    name: "DeepSeek R1 (OpenRouter)",
    provider: "DeepSeek",
    description: "The open source reasoning model that shook the whole industry.",
    enabled: false,
    features: ["reasoning"],
    icon: DeepSeekIcon,
    providers: {
      openrouter: "deepseek/deepseek-r1"
    }
  },
  {
    id: "deepseek-r1-0528",
    name: "DeepSeek R1 (0528)",
    provider: "DeepSeek",
    description: "The open source reasoning model that shook the whole industry.",
    enabled: false,
    features: ["reasoning"],
    icon: DeepSeekIcon,
    providers: {
      openrouter: "deepseek/deepseek-r1-0528"
    }
  },
  {
    id: "deepseek-r1-llama-distilled",
    name: "DeepSeek R1 (Llama Distilled)",
    provider: "DeepSeek",
    description: "It's like normal R1, but WAY faster and slightly dumber.",
    enabled: true,
    features: ["fast", "reasoning"],
    icon: DeepSeekIcon,
    providers: {
      openrouter: "deepseek/deepseek-r1-distill-llama-8b"
    }
  },
  {
    id: "deepseek-r1-qwen-distilled",
    name: "DeepSeek R1 (Qwen Distilled)",
    provider: "DeepSeek",
    description: "Similar to the Llama distilled model, but distilled on Qwen 32b instead.",
    enabled: false,
    features: ["reasoning"],
    icon: DeepSeekIcon,
    providers: {
      openrouter: "deepseek/deepseek-r1-distill-qwen-32b"
    }
  },
  {
    id: "grok-3",
    name: "Grok 3",
    provider: "xAI",
    description: "xAI's flagship model that excels at data extraction, coding, and text summarization.",
    enabled: false,
    features: [],
    icon: GrokIcon,
    providers: {
      openrouter: "x-ai/grok-3-beta"
    }
  },
  {
    id: "grok-3-mini",
    name: "Grok 3 Mini",
    provider: "xAI",
    description: "A lightweight model that thinks before responding.",
    enabled: false,
    features: ["reasoning", "effort"],
    icon: GrokIcon,
    providers: {
      openrouter: "x-ai/grok-3-mini-beta"
    }
  },
  {
    id: "qwen-qwq-32b",
    name: "Qwen qwq-32b",
    provider: "Qwen",
    description: "A surprisingly smart reasoning model that punches way above its weight.",
    enabled: false,
    features: ["reasoning"],
    icon: QwenIcon,
    providers: {
      openrouter: "qwen/qwq-32b"
    }
  },
  {
    id: "qwen-2-5-32b",
    name: "Qwen 2.5 32b",
    provider: "Qwen",
    description: "The other really good open source model from China.",
    enabled: false,
    features: ["fast", "vision"],
    icon: QwenIcon,
    providers: {
      openrouter: "qwen/qwen2.5-vl-32b-instruct"
    }
  },
  {
    id: "gpt-4-5",
    name: "GPT-4.5",
    provider: "OpenAI",
    description: "The best model for writing.",
    enabled: false,
    features: ["vision"],
    icon: OpenAIIcon,
    providers: {
      openrouter: "openai/gpt-4.5-preview"
    }
  },
]

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
  console.log("models", models)

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
    if (model.badges?.some(badge => badge === "premium" || badge === "api-key")) {
      return false
    }

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
                        <div className="absolute inset-0 bg-current opacity-20 dark:opacity-15"></div>
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
                          {model.badges?.map((badge) => {
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
                          })}
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
                            <div className="absolute inset-0 rounded-md bg-current opacity-10 dark:opacity-15"></div>
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
