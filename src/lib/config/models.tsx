import { Eye, FileText, Globe, Brain, Settings2, Zap, Gem, Key, FlaskConical } from "lucide-react"

export interface ModelFeature {
    name: string
    icon: React.ComponentType<any>
    color: string
    darkColor: string
}

export const features: Record<string, ModelFeature> = {
    vision: { name: "Vision", icon: Eye, color: "hsl(168 54% 52%)", darkColor: "hsl(168 54% 74%)" },
    pdfs: { name: "PDFs", icon: FileText, color: "hsl(237 55% 57%)", darkColor: "hsl(237 75% 77%)" },
    search: { name: "Search", icon: Globe, color: "hsl(208 56% 52%)", darkColor: "hsl(208 56% 74%)" },
    reasoning: { name: "Reasoning", icon: Brain, color: "hsl(263 58% 53%)", darkColor: "hsl(263 58% 75%)" },
    effort: { name: "Effort Control", icon: Settings2, color: "hsl(304 44% 51%)", darkColor: "hsl(304 44% 72%)" },
    fast: { name: "Fast", icon: Zap, color: "hsl(46 77% 52%)", darkColor: "hsl(46 77% 79%)" },
}

export interface Model {
    id: string
    name: string
    provider: string
    description: string
    enabled: boolean
    features: string[]
    icon: React.ComponentType<any>
    providers: Record<string, string>
}

// Import all model icons
import { GeminiIcon } from "@/components/icons/providers/gemini"
import { OpenAIIcon } from "@/components/icons/providers/openai"
import { AnthropicIcon } from "@/components/icons/providers/anthropic"
import { MetaIcon } from "@/components/icons/providers/meta"
import { DeepSeekIcon } from "@/components/icons/providers/deepseek"
import { GrokIcon } from "@/components/icons/providers/grok"
import { QwenIcon } from "@/components/icons/providers/qwen"

export const initialModels: Model[] = [
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