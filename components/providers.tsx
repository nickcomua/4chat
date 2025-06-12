"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { CouchDBSessionProvider } from "./couchdb-session-provider"

interface ProvidersProps {
  children: React.ReactNode;
  // authSession: any; // Auth.js session object
}

export function Providers({ children }: ProvidersProps) {
  return (
    <CouchDBSessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </CouchDBSessionProvider>
  )
} 