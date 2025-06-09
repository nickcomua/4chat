"use client"

import { Sparkles, Newspaper, Code, GraduationCap } from "lucide-react"

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void
}

const categories = [
  { icon: Sparkles, label: "Create" },
  { icon: Newspaper, label: "Explore" },
  { icon: Code, label: "Code" },
  { icon: GraduationCap, label: "Learn" },
]

const suggestedPrompts = [
  "How does AI work?",
  "Are black holes real?",
  'How many Rs are in the word "strawberry"?',
  "What is the meaning of life?",
]

export default function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex h-[calc(100vh-20rem)] items-start justify-center">
      <div className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8">
        <h2 className="text-3xl font-semibold">How can I help you?</h2>

        <div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-evenly">
          {categories.map((category) => (
            <button
              key={category.label}
              className="justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
              data-selected="false"
            >
              <category.icon className="max-sm:block" size={16} />
              <div>{category.label}</div>
            </button>
          ))}
        </div>

        <div className="flex flex-col text-foreground">
          {suggestedPrompts.map((prompt, index) => (
            <div key={index} className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none">
              <button
                className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
                onClick={() => onPromptClick(prompt)}
              >
                <span>{prompt}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
