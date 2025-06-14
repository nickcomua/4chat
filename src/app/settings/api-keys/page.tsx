"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "../../../components/ui/tabs"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { Key } from "lucide-react"

interface ApiKeyProvider {
  id: string
  name: string
  placeholder: string
  consoleUrl: string
  consoleName: string
  models: string[]
}

const apiProviders: ApiKeyProvider[] = [
  {
    id: "anthropic",
    name: "Anthropic API Key",
    placeholder: "sk-ant-...",
    consoleUrl: "https://console.anthropic.com/account/keys",
    consoleName: "Anthropic's Console",
    models: [
      "Claude 3.5 Sonnet",
      "Claude 3.7 Sonnet",
      "Claude 3.7 Sonnet (Reasoning)",
      "Claude 4 Opus",
      "Claude 4 Sonnet",
      "Claude 4 Sonnet (Reasoning)",
    ],
  },
  {
    id: "openai",
    name: "OpenAI API Key",
    placeholder: "sk-...",
    consoleUrl: "https://platform.openai.com/api-keys",
    consoleName: "OpenAI's Dashboard",
    models: ["GPT-4.5", "o3"],
  },
  {
    id: "google",
    name: "Google API Key",
    placeholder: "AIza...",
    consoleUrl: "https://console.cloud.google.com/apis/credentials",
    consoleName: "Google Cloud Console",
    models: [
      "Gemini 2.0 Flash",
      "Gemini 2.0 Flash Lite",
      "Gemini 2.5 Flash",
      "Gemini 2.5 Flash (Thinking)",
      "Gemini 2.5 Pro",
    ],
  },
]

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    anthropic: "",
    openai: "",
    google: "",
  })

  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({
    anthropic: false,
    openai: false,
    google: false,
  })

  const handleApiKeyChange = (providerId: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [providerId]: value,
    }))
    // Reset saved state when key changes
    setSavedKeys((prev) => ({
      ...prev,
      [providerId]: false,
    }))
  }

  const handleSaveApiKey = (providerId: string) => {
    // Here you would typically save to your backend
    console.log(`Saving API key for ${providerId}:`, apiKeys[providerId])

    // Simulate save success
    setSavedKeys((prev) => ({
      ...prev,
      [providerId]: true,
    }))

    // Reset saved state after 2 seconds
    setTimeout(() => {
      setSavedKeys((prev) => ({
        ...prev,
        [providerId]: false,
      }))
    }, 2000)
  }

  return (
    <Tabs defaultValue="api-keys">
      <TabsContent value="api-keys" className="space-y-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold">API Keys</h2>
            <p className="text-sm text-muted-foreground">
              Bring your own API keys for select models. Messages sent using your API keys will not count towards your
              monthly limits.
            </p>
          </div>

          <div className="space-y-6">
            {apiProviders.map((provider) => (
              <div key={provider.id} className="space-y-4 rounded-lg border border-input p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      <h3 className="font-semibold">{provider.name}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">Used for the following models:</p>

                <div className="flex flex-wrap gap-2">
                  {provider.models.map((model) => (
                    <Badge key={model} variant="secondary" className="rounded-full px-2 py-1 text-xs">
                      {model}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder={provider.placeholder}
                      value={apiKeys[provider.id]}
                      onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                      className="w-full"
                    />
                    <p className="prose prose-pink text-xs text-muted-foreground">
                      Get your API key from{" "}
                      <a
                        href={provider.consoleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline hover:underline"
                      >
                        {provider.consoleName}
                      </a>
                    </p>
                  </div>

                  <div className="flex w-full justify-end gap-2">
                    <Button
                      onClick={() => handleSaveApiKey(provider.id)}
                      disabled={!apiKeys[provider.id].trim()}
                      className="bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary"
                    >
                      {savedKeys[provider.id] ? "Saved!" : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
