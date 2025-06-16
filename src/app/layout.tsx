import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.scss"
import { Providers } from "@/components/providers/providers"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const authSession = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
export const viewport: Viewport = {
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
}