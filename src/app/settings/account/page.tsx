"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "../../../components/ui/tabs"
import { Rocket, Sparkles, Headset, Info, ArrowRight, Copy } from "lucide-react"
import { Button } from "../../../components/ui/button"

export default function AccountPage() {
  const [copied, setCopied] = useState(false)

  const copyUserId = () => {
    navigator.clipboard.writeText("user_12345_abcdef")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Tabs defaultValue="account">
      <TabsContent value="account" className="space-y-8">
        {/* Pro Plan Benefits */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-center text-2xl font-bold md:text-left">Pro Plan Benefits</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col items-start rounded-lg border border-secondary/40 bg-card/30 px-6 py-4">
              <div className="mb-2 flex items-center">
                <Rocket className="mr-2 h-5 w-5 text-primary" />
                <span className="text-base font-semibold">Access to All Models</span>
              </div>
              <p className="text-sm text-muted-foreground/80">
                Get access to our full suite of models including Claude, o3-mini-high, and more!
              </p>
            </div>

            <div className="flex flex-col items-start rounded-lg border border-secondary/40 bg-card/30 px-6 py-4">
              <div className="mb-2 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                <span className="text-base font-semibold">Generous Limits</span>
              </div>
              <p className="text-sm text-muted-foreground/80">
                Receive <b>1500 standard credits</b> per month, plus <b>100 premium credits</b>* per month.
              </p>
            </div>

            <div className="flex flex-col items-start rounded-lg border border-secondary/40 bg-card/30 px-6 py-4">
              <div className="mb-2 flex items-center">
                <Headset className="mr-2 h-5 w-5 text-primary" />
                <span className="text-base font-semibold">Priority Support</span>
              </div>
              <p className="text-sm text-muted-foreground/80">
                Get faster responses and dedicated assistance from the T3 team whenever you need help!
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <Button className="w-full md:w-64">Manage Subscription</Button>
          </div>

          <p className="text-sm text-muted-foreground/60">
            <span className="mx-0.5 text-base font-medium">*</span>
            Premium credits are used for GPT Image Gen, Claude Sonnet, and Grok 3. Additional Premium credits can be
            purchased separately.
          </p>
        </div>

        {/* Mobile Usage Stats */}
        <div className="space-y-6 rounded-lg bg-card p-4 md:hidden">
          <div className="flex flex-row justify-between sm:flex-col sm:justify-between lg:flex-row lg:items-center">
            <span className="text-sm font-semibold">Message Usage</span>
            <div className="text-xs text-muted-foreground">
              <p>Resets 06/26/2025</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Standard</h3>
                <span className="text-sm text-muted-foreground">53/1500</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: "3.53333%" }}></div>
              </div>
              <p className="text-sm text-muted-foreground">1447 messages remaining</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <h3 className="text-sm font-medium">Premium</h3>
                  <Button variant="ghost" size="icon" className="h-4 w-4">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">49/100</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: "49%" }}></div>
              </div>
              <p className="text-sm text-muted-foreground">51 messages remaining</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Button className="border-reflect button-reflect bg-[rgb(162,59,103)] hover:bg-[#d56698] text-primary-foreground">
              Buy more premium credits
              <ArrowRight className="-mr-1 !size-3.5" />
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="!mt-20">
          <div className="w-fit space-y-2 border-0 border-muted-foreground/10">
            <h2 className="text-2xl font-bold">Danger Zone</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="px-px py-1.5 text-sm text-muted-foreground/80">
                  Permanently delete your account and all associated data.
                </p>
                <div className="flex flex-row gap-2">
                  <Button
                    variant="destructive"
                    className="border border-red-800/20 bg-red-800/80 hover:bg-red-600 dark:bg-red-800/20 hover:dark:bg-red-800"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information - Mobile */}
        <div className="mt-8 block md:hidden">
          <div className="w-fit space-y-2">
            <h2 className="text-2xl font-bold">Support Information</h2>
            <div className="space-y-2">
              <p className="px-px py-1.5 text-sm text-muted-foreground/80">
                Your user ID may be requested by our support team to help resolve issues.
              </p>
              <Button variant="outline" className="flex items-center gap-2" onClick={copyUserId}>
                <span>{copied ? "Copied!" : "Copy ID"}</span>
                <Copy className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
