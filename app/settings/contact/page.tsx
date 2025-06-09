"use client"

import type React from "react"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Sparkles, Bug, CircleAlert, Shield, ScrollText } from "lucide-react"

// Discord icon component
const DiscordIcon = () => (
  <svg
    viewBox="0 0 256 199"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    fill="currentColor"
    className="h-5 w-5 text-primary"
  >
    <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"></path>
  </svg>
)

interface ContactOption {
  title: string
  description: string
  icon: React.ComponentType<any>
  href: string
  isExternal?: boolean
  isEmail?: boolean
}

const contactOptions: ContactOption[] = [
  {
    title: "Have a cool feature idea?",
    description: "Vote on upcoming features or suggest your own",
    icon: Sparkles,
    href: "/sso/featurebase",
    isExternal: true,
  },
  {
    title: "Found a non-critical bug?",
    description: "UI glitches or formatting issues? Report them here :)",
    icon: Bug,
    href: "/sso/featurebase",
    isExternal: true,
  },
  {
    title: "Having account or billing issues?",
    description: "Email us for priority support - support@ping.gg",
    icon: CircleAlert,
    href: "mailto:support@ping.gg",
    isEmail: true,
  },
  {
    title: "Want to join the community?",
    description: "Come hang out in our Discord! Chat with the team and other users",
    icon: DiscordIcon,
    href: "https://discord.gg/xHdCpcPHRE",
    isExternal: true,
  },
  {
    title: "Privacy Policy",
    description: "Read our privacy policy and data handling practices",
    icon: Shield,
    href: "/privacy-policy",
    isExternal: true,
  },
  {
    title: "Terms of Service",
    description: "Review our terms of service and usage guidelines",
    icon: ScrollText,
    href: "/terms-of-service",
    isExternal: true,
  },
]

export default function ContactPage() {
  return (
    <Tabs defaultValue="contact">
      <TabsContent value="contact" className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">We're here to help!</h2>
          <p className=""></p>

          <div className="space-y-4 md:max-w-lg">
            {contactOptions.map((option, index) => {
              const Icon = option.icon
              const linkProps = {
                className: "block rounded-lg border border-secondary p-4 transition-colors hover:bg-secondary/40",
                ...(option.isExternal && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                }),
                ...(option.href.startsWith("/sso/featurebase") && {
                  "data-discover": "true",
                }),
              }

              return (
                <a key={index} href={option.href} {...linkProps}>
                  <div className="flex items-center gap-4">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">{option.title}</h3>
                      <p className="text-sm text-muted-foreground/80">{option.description}</p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
