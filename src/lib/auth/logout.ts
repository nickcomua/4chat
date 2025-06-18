"use server"

import { signOut } from "@/lib/auth/auth"
import { redirect } from "next/navigation"

export async function signInOut() {
    await signOut()
    redirect("/auth")
}