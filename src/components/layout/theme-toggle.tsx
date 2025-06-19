import { Moon, Sun } from "lucide-react"
import React, { useEffect } from "react"
import { toast } from "sonner"

export default function ThemeToggle() {
  // const handleThemeToggle = () => {
  //   const html = document.documentElement
  //   const isDark = html.classList.contains("dark")
  //   if (isDark) {
  //     html.classList.remove("dark")
  //     localStorage.setItem("theme", "light")
  //   } else {
  //     html.classList.add("dark")
  //     localStorage.setItem("theme", "dark")
  //   }
  // }
  useEffect(() => {
    document?.documentElement.classList.add("dark")
    localStorage?.setItem("theme", "dark")
  }, [])

  return (
    <button
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 group relative size-8"
      tabIndex={-1}
      data-state="closed"
      onClick={() => {
        toast.info("We don't have a light mode.\n Install the BrightReader extension to get it.")
      }}
    >
      <Sun className="absolute size-4 rotate-0 transition-all duration-200 dark:rotate-90 dark:scale-0 scale-100" />
      <Moon className="absolute size-4 dark:rotate-0 transition-all duration-200 rotate-90 dark:scale-100 scale-0" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
} 