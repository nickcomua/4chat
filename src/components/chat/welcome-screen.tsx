import { Sparkles, Newspaper, Code, GraduationCap } from "lucide-react"

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void
}



const suggestedPrompts = [
  "How does AI work?",
  "Are black holes real?",
  "How am I?",
  'How many Rs are in the word "strawberry"?',
  "Do in some meaning your creator and my creator are same?",
  "42..... Why?",
]

export default function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  return (<div
    className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pt-safe-offset-40"
    style={{ paddingBottom: "144px", scrollbarGutter: "stable both-edges" }}
  >
    <div
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10"
    >
      <div className="flex h-[calc(100vh-20rem)] items-start justify-center">
        <div className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8">
          <h2 className="text-3xl font-semibold">How can I help you?</h2>

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
    </div>
  </div>)
}
