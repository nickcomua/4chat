"use client"

import { useState } from "react"
import { Rocket, Sparkles, Headset, Info, ArrowRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useFind, usePouch } from "use-pouchdb"
import { ChatSettings } from "@/types/settings"

export default function AccountPage() {
  const [copied, setCopied] = useState(false)

  const db = usePouch<ChatSettings>("profile")
  const { docs: profiles, loading } = useFind<ChatSettings>({
    db: "profile",
    selector: {
      _id: "0"
    }
  })
  const profile = profiles[0]

  const copyUserId = () => {
    navigator.clipboard.writeText(profile?.userProfile?.userId || "user_12345_abcdef")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // if (loading) {
  //   return (
  //     <div className="space-y-8">
  //       <div className="space-y-6">
  //         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
  //           <Skeleton className="h-8 w-48" />
  //         </div>

  //         <div className="grid gap-3 md:grid-cols-3">
  //           {[1, 2, 3].map((i) => (
  //             <div key={i} className="flex flex-col items-start rounded-lg border border-secondary/40 bg-card/30 px-6 py-4">
  //               <div className="mb-2 flex items-center">
  //                 <Skeleton className="mr-2 h-5 w-5" />
  //                 <Skeleton className="h-5 w-32" />
  //               </div>
  //               <Skeleton className="h-4 w-full" />
  //               <Skeleton className="h-4 w-3/4 mt-1" />
  //             </div>
  //           ))}
  //         </div>

  //         <Skeleton className="h-10 w-64" />
  //         <Skeleton className="h-4 w-full" />
  //       </div>

  //       {/* Usage Stats Loading */}
  //       <div className="space-y-6 rounded-lg bg-card p-4 md:hidden">
  //         <div className="flex flex-row justify-between">
  //           <Skeleton className="h-4 w-24" />
  //           <Skeleton className="h-4 w-20" />
  //         </div>
  //         <div className="space-y-6">
  //           {[1, 2].map((i) => (
  //             <div key={i} className="space-y-2">
  //               <div className="flex items-center justify-between">
  //                 <Skeleton className="h-4 w-16" />
  //                 <Skeleton className="h-4 w-12" />
  //               </div>
  //               <Skeleton className="h-2 w-full" />
  //               <Skeleton className="h-4 w-32" />
  //             </div>
  //           ))}
  //         </div>
  //         <Skeleton className="h-10 w-48 mx-auto" />
  //       </div>

  //       {/* Danger Zone Loading */}
  //       <div className="!mt-20">
  //         <div className="w-fit space-y-2">
  //           <Skeleton className="h-8 w-32" />
  //           <div className="space-y-6">
  //             <div className="space-y-2">
  //               <Skeleton className="h-4 w-80" />
  //               <Skeleton className="h-10 w-32" />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-8">

      {/* User Information Section */}

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Account Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            {profile?.userProfile?.name ?
              <p className="text-base">{profile.userProfile.name || "Not set"}</p>
              : <Skeleton className="h-4 mt-1 w-[50%]" />}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            {profile?.userProfile?.email ?
              <p className="text-base">{profile.userProfile.email || "Not set"}</p>
              : <Skeleton className="h-4 mt-1 w-[50%]" />}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Plan</label>
            {profile?.userProfile?.plan ?
              <p className="text-base capitalize">{profile.userProfile.plan || "Free"}</p>
              : <Skeleton className="h-4 mt-1 w-[50%]" />}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">User ID</label>
            <div className="flex items-center gap-2">
              {profile?.userProfile?.userId ?
                <p className="text-base font-mono text-sm">
                  {profile.userProfile.userId || "Not available"}
                </p>
                : <Skeleton className="h-4 mt-1 w-[50%]" />}
              <Button variant="outline" size="sm" onClick={copyUserId}>
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
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
    </div>
  )
}
