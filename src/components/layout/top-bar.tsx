import React from "react"
import Link from "next/link"
import { Settings2 } from "lucide-react"
import ThemeToggle from "./theme-toggle"

export default function TopBar() {
  return (
    <div className="fixed right-2 top-2 z-20 max-sm:hidden" style={{ right: "var(--firefox-scrollbar, 0.5rem)" }}>
      <div className="flex flex-row items-center bg-gradient-noise-top text-muted-foreground gap-0.5 rounded-md p-1 transition-all rounded-bl-xl">
        <Link aria-label="Go to settings" role="button" data-state="closed" href="/settings/customization">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 size-8 rounded-bl-xl">
            <Settings2 className="size-4" />
          </button>
        </Link>
        <ThemeToggle />
      </div>
    </div>
  )
} 