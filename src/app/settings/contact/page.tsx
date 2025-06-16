"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Mail, 
  MessageCircle, 
  Book, 
  Bug, 
  Heart, 
  ExternalLink,
  Send,
  Github,
  Twitter
} from "lucide-react"
import { useFind, usePouch } from "use-pouchdb"
import { ChatSettings } from "@/lib/types/settings"

// Discord icon component
const Discord = () => (
  <svg viewBox="0 0 256 199" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"/>
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
    title: "Bug Reports",
    description: "Report bugs or technical issues you've encountered.",
    icon: Bug,
    href: "https://github.com/t3chat/issues", // @todo
    isExternal: true,
  },
]

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/t3chat",
  },
  {
    name: "Twitter",
    icon: Twitter,
    href: "https://twitter.com/t3chat",
  },
  {
    name: "Discord",
    icon: Discord,
    href: "https://discord.gg/t3chat",
  },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: "",
    email: "",
  })

  const db = usePouch<ChatSettings>("profile")
  const { docs: profiles } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Form submitted:", formData)
      // Reset form after successful submission
      setFormData({
        subject: "",
        category: "",
        message: "",
        email: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Contact Us</h2>
        <p className="mt-2 text-muted-foreground">
          Need help? Have questions? We're here to assist you with T3 Chat.
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {contactOptions.map((option) => {
          const Icon = option.icon
          return (
            <a
              key={option.title}
              href={option.href}
              target={option.isExternal ? "_blank" : undefined}
              rel={option.isExternal ? "noopener noreferrer" : undefined}
              className="group rounded-lg border border-input p-6 transition-colors hover:bg-accent"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold group-hover:text-primary">{option.title}</h3>
                    {option.isExternal && (
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <details className="group rounded-lg border border-input p-4">
            <summary className="cursor-pointer font-medium group-open:text-primary">
              How do I add my own API keys?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Go to Settings → API Keys and add your keys from OpenAI, Anthropic, or Google. 
              Your keys are stored locally and never shared with our servers.
            </p>
          </details>
          
          <details className="group rounded-lg border border-input p-4">
            <summary className="cursor-pointer font-medium group-open:text-primary">
              Can I export my chat history?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Yes! Go to Settings → History & Sync to export your conversations in JSON, CSV, or text format.
            </p>
          </details>
          
          <details className="group rounded-lg border border-input p-4">
            <summary className="cursor-pointer font-medium group-open:text-primary">
              How do I customize my AI assistant?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Visit Settings → Customization to set your name, occupation, and preferred AI traits. 
              You can also adjust visual options and themes.
            </p>
          </details>
          
          <details className="group rounded-lg border border-input p-4">
            <summary className="cursor-pointer font-medium group-open:text-primary">
              Is my data secure?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Yes, your data is stored locally in your browser and synced securely. API keys are encrypted and never transmitted to our servers.
            </p>
          </details>
        </div>
      </div>

      {/* Social Links */}
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Connect with us</h3>
        <div className="flex justify-center gap-4">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-input bg-background transition-colors hover:bg-accent"
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{social.name}</span>
              </a>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground">
          Follow us for updates, tips, and community discussions.
        </p>
      </div>

      {/* Emergency Contact Info */}
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Emergency Support
            </h4>
            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
              For urgent issues or account security concerns, email us directly at{" "}
              <a 
                href="mailto:urgent@t3chat.com" 
                className="underline hover:no-underline"
              >
                urgent@t3chat.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
