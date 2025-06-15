"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Key, Eye, EyeOff, ExternalLink, Loader2 } from "lucide-react"
import { useFind, usePouch } from "use-pouchdb"
import { ChatSettings } from "@/types/settings"
import { toast } from "sonner"

interface ApiKeyProvider {
  id: string
  name: string
  placeholder: string
  consoleUrl: string
  consoleName: string
  models: string[]
  validate: (key: string) => Promise<boolean>
}

const providers: ApiKeyProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    placeholder: "sk-...",
    consoleUrl: "https://platform.openai.com/api-keys",
    consoleName: "OpenAI Platform",
    models: ["GPT-4", "GPT-3.5-turbo"],
    async validate(key: string) {
      const headers = { 'Authorization': `Bearer ${key}` }
      const res = await fetch("https://api.openai.com/v1/models", { method: 'GET', headers })
      return res.ok
    }
  },
  {
    id: "anthropic",
    name: "Anthropic",
    placeholder: "sk-ant-...",
    consoleUrl: "https://console.anthropic.com/settings/keys",
    consoleName: "Anthropic Console",
    models: ["Claude 3 Opus", "Claude 3 Sonnet", "Claude 3 Haiku"],
    async validate(key: string) {
      const headers = {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
      // POST is required for Anthropic, but we can send a minimal body
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: 'POST',
        headers,
        body: JSON.stringify({ model: 'claude-3-sonnet-2023-06-01', max_tokens: 1, messages: [{ role: 'user', content: 'Hello' }] })
      })
      return res.ok
    }
  },
  {
    id: "google",
    name: "Google AI",
    placeholder: "AI...",
    consoleUrl: "https://aistudio.google.com/app/apikey",
    consoleName: "Google AI Studio",
    models: ["Gemini Pro", "Gemini Pro Vision"],
    async validate(key: string) {
      const headers = { 'x-goog-api-key': key }
      const res = await fetch("https://generativelanguage.googleapis.com/v1/models" + `?key=${key}`, { method: 'GET', headers })
      return res.ok
    }
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    placeholder: "sk-or-...",
    consoleUrl: "https://openrouter.ai/keys",
    consoleName: "OpenRouter Dashboard",
    models: ["All models from major providers"],
    async validate(key: string) {
      const headers = { 'Authorization': `Bearer ${key}` }
      const res = await fetch("https://openrouter.ai/api/v1/key", { method: 'GET', headers })
      return res.ok
    }
  }
]

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [validatingKeys, setValidatingKeys] = useState<Record<string, boolean>>({})
  const [validKeys, setValidKeys] = useState<Record<string, boolean>>({})

  const db = usePouch<ChatSettings>("profile")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]

  // Load API keys from profile
  useEffect(() => {
    if (profile?.apiKeySettings) {
      setApiKeys(profile.apiKeySettings.providers || {})
      setValidKeys(profile.apiKeySettings.savedKeys || {})
    }
  }, [profile])

  const validateApiKey = async (providerId: string, key: string) => {
    if (!key) {
      setValidKeys(prev => ({ ...prev, [providerId]: false }))
      return false
    }
    setValidatingKeys(prev => ({ ...prev, [providerId]: true }))
    try {
      const provider = providers.find(p => p.id === providerId)
      if (!provider) throw new Error("Invalid provider")
      const isValid = await provider.validate(key)
      setValidKeys(prev => ({ ...prev, [providerId]: isValid }))
      return isValid
    } catch (error) {
      console.error(`Error validating ${providerId} API key:`, error)
      toast.error(`Failed to validate ${providerId} API key: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setValidKeys(prev => ({ ...prev, [providerId]: false }))
      return false
    } finally {
      setValidatingKeys(prev => ({ ...prev, [providerId]: false }))
    }
  }

  const handleKeyChange = async (providerId: string, value: string) => {
    // If clearing the key, update state and save immediately
    if (!value) {
      setApiKeys(prev => ({
        ...prev,
        [providerId]: ""
      }))
      setValidKeys(prev => ({
        ...prev,
        [providerId]: false
      }))

      if (!profile) return

      try {
        const updatedProfile: ChatSettings = {
          ...profile,
          apiKeySettings: {
            providers: {
              ...apiKeys,
              [providerId]: ""
            },
            savedKeys: {
              ...validKeys,
              [providerId]: false
            }
          },
          lastUpdated: new Date().toISOString()
        }

        await db.put(updatedProfile)
        toast.success(`${providers.find(p => p.id === providerId)?.name} API key removed`)
        return
      } catch (error) {
        console.error("Error clearing API key:", error)
        toast.error("Failed to clear API key")
        return
      }
    }

    // Update the input field immediately for responsiveness
    setApiKeys(prev => ({
      ...prev,
      [providerId]: value
    }))

    // Validate the key
    const isValid = await validateApiKey(providerId, value)
    if (!profile) return

    // Only save if the key is valid
    if (isValid) {
      try {
        const updatedProfile: ChatSettings = {
          ...profile,
          apiKeySettings: {
            providers: {
              ...apiKeys,
              [providerId]: value
            },
            savedKeys: {
              ...validKeys,
              [providerId]: true
            }
          },
          lastUpdated: new Date().toISOString()
        }

        await db.put(updatedProfile)
        toast.success(`${providers.find(p => p.id === providerId)?.name} API key validated and saved`)
      } catch (error) {
        console.error("Error saving API key:", error)
        toast.error("Failed to save API key")
      }
    } else {
      // If invalid, revert to the previously saved key
      setApiKeys(prev => ({
        ...prev,
        [providerId]: profile.apiKeySettings?.providers?.[providerId] || ""
      }))
      toast.error(`Invalid API key for ${providers.find(p => p.id === providerId)?.name}`)
    }
  }

  const toggleShowKey = (providerId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }))
  }

  const clearKey = async (providerId: string) => {
    await handleKeyChange(providerId, "")
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">API Keys</h2>
        <p className="mt-2 text-muted-foreground">
          Add your API keys to use models directly from their providers. Keys are stored locally and never shared.
        </p>
      </div>

      <div className="space-y-6">
        {providers.map((provider) => {
          const hasKey = Boolean(apiKeys[provider.id])
          const isVisible = showKeys[provider.id]
          const isValidating = validatingKeys[provider.id]
          const isValid = validKeys[provider.id]
          
          return (
            <div key={provider.id} className="rounded-lg border border-input p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Key className="h-6 w-6 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">{provider.name}</h3>
                </div>
                {hasKey && (
                  <Badge 
                    variant="secondary" 
                    className={
                      isValidating 
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        : isValid 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }
                  >
                    {isValidating ? "Validating..." : isValid ? "Connected" : "Invalid Key"}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Get your API key from{" "}
                <a 
                  href={provider.consoleUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  {provider.consoleName}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
              
              <div className="space-y-4">
                <div className="relative">
                  {profile?.apiKeySettings ? (
                    <Input
                      type={isVisible ? "text" : "password"}
                      placeholder={provider.placeholder}
                      value={apiKeys[provider.id] || ""}
                      onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                      className="pr-20"
                    />
                  ) : (
                    <Skeleton className="h-10 w-full" />
                  )}
                  {profile?.apiKeySettings && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {isValidating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleShowKey(provider.id)}
                          >
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          {hasKey && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs"
                              onClick={() => clearKey(provider.id)}
                            >
                              Clear
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {provider.models.map((model) => (
                    <Badge key={model} variant="outline" className="text-xs">
                      {model}
                    </Badge>
                  ))}
                </div>
                
                {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Key className="h-3 w-3" />
                  <span>Your API keys are stored locally and encrypted</span>
                </div> */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
