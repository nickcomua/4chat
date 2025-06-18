import { Schema } from "effect"

// Model Feature Schema
export const ModelFeature = Schema.Struct({
  name: Schema.String,
  icon: Schema.String, // Icon component name as string for serialization
  color: Schema.String,
  darkColor: Schema.String
})
export type ModelFeature = typeof ModelFeature.Type

// Model Schema with badges as union type
const ModelBadge = Schema.Union(
  Schema.Literal("premium"),
  Schema.Literal("experimental"),
  Schema.Literal("api-key")
)

export const Model = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  provider: Schema.String,
  description: Schema.String,
  enabled: Schema.Boolean,
  features: Schema.Array(Schema.String),
  badges: Schema.optional(Schema.Array(ModelBadge)),
  icon: Schema.String // Icon component name as string
})
export type Model = typeof Model.Type

// API Key Provider Schema
export const ApiKeyProvider = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  placeholder: Schema.String,
  consoleUrl: Schema.String,
  consoleName: Schema.String,
  models: Schema.Array(Schema.String)
})
export type ApiKeyProvider = typeof ApiKeyProvider.Type

// Chat History Schema
export const ChatHistory = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  date: Schema.String,
  selected: Schema.Boolean
})
export type ChatHistory = typeof ChatHistory.Type

// Attachment Schema
export const Attachment = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  type: Schema.String,
  size: Schema.String,
  url: Schema.String,
  uploadDate: Schema.String,
  selected: Schema.Boolean
})
export type Attachment = typeof Attachment.Type

// Contact Option Schema
export const ContactOption = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  icon: Schema.String, // Icon component name as string
  href: Schema.String,
  isExternal: Schema.optional(Schema.Boolean),
  isEmail: Schema.optional(Schema.Boolean)
})
export type ContactOption = typeof ContactOption.Type

// Usage Stats Schema
// const UsageStatsDetails = Schema.Struct({
//   used: Schema.Number,
//   total: Schema.Number,
//   remaining: Schema.Number,
//   resetDate: Schema.String
// })

export const UsageStats = Schema.Struct({
    used: Schema.Number,
//   standard: UsageStatsDetails,
//   premium: UsageStatsDetails
})
export type UsageStats = typeof UsageStats.Type

// User Plan Schema
const UserPlan = Schema.Union(
  Schema.Literal("free"),
  Schema.Literal("pro")
)

// User Profile Schema
export const UserProfile = Schema.Struct({
  name: Schema.String,
  email: Schema.String,
  userId: Schema.String,
  profilePicture: Schema.String,
  plan: UserPlan
})
export type UserProfile = typeof UserProfile.Type

// Personal Preferences Schema with validation
export const PersonalPreferences = Schema.Struct({
  name: Schema.String.pipe(Schema.maxLength(50)),
  occupation: Schema.String.pipe(Schema.maxLength(100)),
  additionalInfo: Schema.String.pipe(Schema.maxLength(3000)),
  // What traits should AI have?
  traits: Schema.Array(Schema.String).pipe(Schema.maxItems(50))
})
export type PersonalPreferences = typeof PersonalPreferences.Type

// Theme Schema
const Theme = Schema.Union(
  Schema.Literal("light"),
  Schema.Literal("dark"),
  Schema.Literal("system")
)

// Visual Options Schema
export const VisualOptions = Schema.Struct({
//   boringTheme: Schema.Boolean,
  hidePersonalInfo: Schema.Boolean,
  disableThematicBreaks: Schema.Boolean,
  statsForNerds: Schema.Boolean,
  theme: Theme
})
export type VisualOptions = typeof VisualOptions.Type

// Export Format Schema
const ExportFormat = Schema.Union(
  Schema.Literal("json"),
  Schema.Literal("csv"),
  Schema.Literal("txt")
)

// History Settings Schema
export const HistorySettings = Schema.Struct({
  enableSync: Schema.Boolean,
  autoExport: Schema.Boolean,
  retentionDays: Schema.NullOr(Schema.Number), // null for unlimited
  exportFormat: ExportFormat
})
export type HistorySettings = typeof HistorySettings.Type

// Model Settings Schema
export const ModelSettings = Schema.Struct({
  favoriteModels: Schema.Array(Schema.String),
//   selectedFeatures: Schema.Array(Schema.String),
//   showOnlyFreePlan: Schema.Boolean,
  preferredModel: Schema.NullOr(Schema.String)
})
export type ModelSettings = typeof ModelSettings.Type

// API Key Settings Schema
export const ApiKeySettings = Schema.Struct({
  providers: Schema.Record({ key: Schema.String, value: Schema.String }), // provider id -> api key
  savedKeys: Schema.Record({ key: Schema.String, value: Schema.Boolean }) // provider id -> saved status
})
export type ApiKeySettings = typeof ApiKeySettings.Type

// Attachment Settings Schema
export const AttachmentSettings = Schema.Struct({
  maxFileSize: Schema.Number.pipe(Schema.positive()), // in MB
  allowedFileTypes: Schema.Array(Schema.String),
  autoDelete: Schema.Boolean,
  retentionDays: Schema.Number.pipe(Schema.positive())
})
export type AttachmentSettings = typeof AttachmentSettings.Type

// Notification Settings Schema
export const NotificationSettings = Schema.Struct({
  emailNotifications: Schema.Boolean,
  browserNotifications: Schema.Boolean,
  chatNotifications: Schema.Boolean,
  systemNotifications: Schema.Boolean
})
export type NotificationSettings = typeof NotificationSettings.Type

// Privacy Settings Schema
export const PrivacySettings = Schema.Struct({
  dataSharing: Schema.Boolean,
  analyticsOptOut: Schema.Boolean,
  thirdPartyIntegrations: Schema.Boolean
})
export type PrivacySettings = typeof PrivacySettings.Type

// Keyboard Shortcuts Schema
export const KeyboardShortcuts = Schema.Struct({
  search: Schema.String,
  newChat: Schema.String,
  toggleSidebar: Schema.String,
  sendMessage: Schema.String,
  clearChat: Schema.String
})
export type KeyboardShortcuts = typeof KeyboardShortcuts.Type

// Main settings schema that combines all settings
export const ChatSettings = Schema.Struct({
  _id: Schema.String,
  // User & Account
  userProfile: UserProfile,
  usageStats: UsageStats,
  
  // Customization
  personalPreferences: PersonalPreferences,
  visualOptions: VisualOptions,
  
  // Chat & History
  historySettings: HistorySettings,
  
  // Models & AI
  modelSettings: ModelSettings,
  
  // API Integration
  apiKeySettings: ApiKeySettings,
  
  // File Management
//   attachmentSettings: AttachmentSettings,
  
  // System Preferences
//   notificationSettings: NotificationSettings,
//   privacySettings: PrivacySettings,
//   keyboardShortcuts: KeyboardShortcuts,
  
  // Metadata
  version: Schema.String,
  lastUpdated: Schema.String
})
export type ChatSettings = typeof ChatSettings.Type

// Default settings object that conforms to the schema
export const defaultChatSettings: ChatSettings = {
  _id: "0",
  userProfile: {
    name: "",
    email: "",
    userId: "",
    profilePicture: "/placeholder.svg?height=160&width=160",
    plan: "free"
  },
  
  usageStats: {
    // standard: {
      used: 0,
    //   total: 1500,
    //   remaining: 1500,
    //   resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    // },
    // premium: {
    //   used: 0,
    //   total: 100,
    //   remaining: 100,
    //   resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    // }
  },
  
  personalPreferences: {
    name: "",
    occupation: "",
    additionalInfo: "",
    traits: []
  },
  
  visualOptions: {
    // boringTheme: false,
    hidePersonalInfo: false,
    disableThematicBreaks: false,
    statsForNerds: false,
    theme: "system"
  },
  
  historySettings: {
    enableSync: true,
    autoExport: false,
    retentionDays: null, // unlimited
    exportFormat: "json"
  },
  
  modelSettings: {
    favoriteModels: [
      "gemini-2-5-flash",
      "o4-mini",
      "claude-4-sonnet-reasoning",
      "deepseek-r1-llama-distilled"
    ],
    // selectedFeatures: [],
    // showOnlyFreePlan: false,
    preferredModel: "gemini-2-5-flash"
  },
  
  apiKeySettings: {
    providers: {
      anthropic: "",
      openai: "",
      google: ""
    },
    savedKeys: {
      anthropic: false,
      openai: false,
      google: false
    }
  },
  
//   attachmentSettings: {
//     maxFileSize: 10, // 10MB
//     allowedFileTypes: [
//       "image/*",
//       "text/*",
//       "application/pdf",
//       "application/json",
//       "application/csv",
//       "application/vnd.openxmlformats-officedocument.*"
//     ],
//     autoDelete: false,
//     retentionDays: 90
//   },
  
//   notificationSettings: {
//     emailNotifications: true,
//     browserNotifications: false,
//     chatNotifications: true,
//     systemNotifications: true
//   },
  
//   privacySettings: {
//     dataSharing: false,
//     analyticsOptOut: false,
//     thirdPartyIntegrations: true
//   },
  
//   keyboardShortcuts: {
//     search: "⌘+K",
//     newChat: "⌘+Shift+O",
//     toggleSidebar: "⌘+B",
//     sendMessage: "Enter",
//     clearChat: "⌘+Delete"
//   },
  
  version: "1.0.0",
  lastUpdated: new Date().toISOString()
}

// Helper functions for settings management using Effect Schema
export const mergeSettings = (
  currentSettings: Partial<ChatSettings>,
  newSettings: Partial<ChatSettings>
): ChatSettings => {
  const merged = {
    ...defaultChatSettings,
    ...currentSettings,
    ...newSettings,
    lastUpdated: new Date().toISOString()
  }
  
  // Validate the merged settings using Effect Schema
  return Schema.decodeUnknownSync(ChatSettings)(merged)
}

export const validateSettings = (settings: unknown): boolean => {
  try {
    Schema.decodeUnknownSync(ChatSettings)(settings)
    return true
  } catch {
    return false
  }
}

export const parseSettings = (settings: unknown): ChatSettings | null => {
  try {
    return Schema.decodeUnknownSync(ChatSettings)(settings)
  } catch {
    return null
  }
}

export const exportSettings = (settings: ChatSettings): string => {
  // Validate before export
  const validatedSettings = Schema.decodeUnknownSync(ChatSettings)(settings)
  return JSON.stringify(validatedSettings, null, 2)
}

export const importSettings = (settingsJson: string): ChatSettings | null => {
  try {
    const parsed = JSON.parse(settingsJson)
    return Schema.decodeUnknownSync(ChatSettings)(parsed)
  } catch {
    return null
  }
}

// Partial settings schemas for individual updates
export const PersonalPreferencesUpdate = Schema.partial(PersonalPreferences)
export const VisualOptionsUpdate = Schema.partial(VisualOptions)
export const ModelSettingsUpdate = Schema.partial(ModelSettings)
export const ApiKeySettingsUpdate = Schema.partial(ApiKeySettings)

// Feature definitions that match the model features
export const modelFeatures: Record<string, ModelFeature> = {
  vision: { name: "Vision", icon: "Eye", color: "hsl(168 54% 52%)", darkColor: "hsl(168 54% 74%)" },
  pdfs: { name: "PDFs", icon: "FileText", color: "hsl(237 55% 57%)", darkColor: "hsl(237 75% 77%)" },
  search: { name: "Search", icon: "Globe", color: "hsl(208 56% 52%)", darkColor: "hsl(208 56% 74%)" },
  reasoning: { name: "Reasoning", icon: "Brain", color: "hsl(263 58% 53%)", darkColor: "hsl(263 58% 75%)" },
  effort: { name: "Effort Control", icon: "Settings2", color: "hsl(304 44% 51%)", darkColor: "hsl(304 44% 72%)" },
  fast: { name: "Fast", icon: "Zap", color: "hsl(46 77% 52%)", darkColor: "hsl(46 77% 79%)" }
}

// API providers configuration
export const apiProviders: ApiKeyProvider[] = [
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
      "Claude 4 Sonnet (Reasoning)"
    ]
  },
  {
    id: "openai",
    name: "OpenAI API Key",
    placeholder: "sk-...",
    consoleUrl: "https://platform.openai.com/api-keys",
    consoleName: "OpenAI's Dashboard",
    models: ["GPT-4.5", "o3"]
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
      "Gemini 2.5 Pro"
    ]
  }
]

// Validation helpers for specific settings sections
export const validatePersonalPreferences = (data: unknown) => {
  try {
    return Schema.decodeUnknownSync(PersonalPreferences)(data)
  } catch (error) {
    throw new Error(`Invalid personal preferences: ${error}`)
  }
}

export const validateModelSettings = (data: unknown) => {
  try {
    return Schema.decodeUnknownSync(ModelSettings)(data)
  } catch (error) {
    throw new Error(`Invalid model settings: ${error}`)
  }
}

export const validateApiKeySettings = (data: unknown) => {
  try {
    return Schema.decodeUnknownSync(ApiKeySettings)(data)
  } catch (error) {
    throw new Error(`Invalid API key settings: ${error}`)
  }
}

// Brand types for enhanced type safety
export const UserId = Schema.String.pipe(Schema.brand("UserId"))
export const ModelId = Schema.String.pipe(Schema.brand("ModelId"))
export const ApiKey = Schema.String.pipe(Schema.brand("ApiKey"))

export type UserId = typeof UserId.Type
export type ModelId = typeof ModelId.Type
export type ApiKey = typeof ApiKey.Type 