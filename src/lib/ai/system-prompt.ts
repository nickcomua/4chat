import { PersonalPreferences } from "@/lib/types/settings"

/**
 * Generates a system prompt for AI based on user's personal preferences
 */
export function generateSystemPrompt(preferences: PersonalPreferences): string {
  const parts: string[] = []

  // Add name and occupation if provided
  if (preferences.name || preferences.occupation) {
    parts.push(`You are having a conversation with ${preferences.name}${preferences.occupation ? `, who is a ${preferences.occupation}` : ''}.`)
  }
  // Add additional info if provided
  if (preferences.additionalInfo) {
    parts.push(`Additional context about the user: ${preferences.additionalInfo}`)
  }
  
  // Add traits if provided
  if (preferences.traits.length > 0) {
    parts.push(`You should have the following traits: ${preferences.traits.join(', ')}.`)
  }


  // Add default instructions
//   parts.push(
//     "Please provide responses that are:",
//     "- Clear and concise",
//     "- Technically accurate",
//     "- Tailored to the user's background and expertise level",
//     "- Professional yet conversational in tone",
//     "- Focused on providing actionable insights and solutions"
//   )

  return parts.join('\n\n')
} 