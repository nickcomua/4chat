import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth/auth"
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"

// Google logo component
const GoogleIcon = () => (
  <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d={"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}    ></path>
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    ></path>
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    ></path>
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    ></path>
  </svg>
)

export default async function AuthPage() {
  const currentAuth = await auth()
  if (currentAuth?.user?.id) {
    redirect("/")
  }
  async function signInWithGoogle() {
    "use server"
    await signIn("google", { redirectTo: "/" })
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      {/* Background */}
      <div className="absolute inset-0 -z-50 bg-background dark:bg-sidebar !fixed">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
        radial-gradient(closest-corner at 120px 36px, rgba(255, 255, 255, 0.17), rgba(255, 255, 255, 0)), 
        linear-gradient(rgb(254, 247, 255) 15%, rgb(244, 214, 250))
      `,
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-40 hidden dark:block"
          style={{
            backgroundImage: `
        radial-gradient(closest-corner at 120px 36px, rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), 
        linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9))
      `,
          }}
        ></div>
        <div className="absolute inset-0 bg-noise"></div>
        <div className="absolute inset-0 bg-black/40 dark:block hidden"></div>
      </div>

      {/* Back to Chat Button */}
      {/* <div className="absolute left-4 top-4">
        <Link href="/">
          <Button
            variant="ghost"
            className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-9 px-4 py-2 flex items-center hover:bg-muted/40"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chat
          </Button>
        </Link>
      </div> */}

      {/* Welcome Header */}
      <h1 className="mb-5 h-5 text-xl font-bold text-foreground flex items-center">
        Welcome to 4Chat
      </h1>

      {/* Description */}
      <div className="mb-8 text-center text-muted-foreground">
        <p>Sign in below (we'll increase your message limits if you do 😉)</p>
      </div>

      {/* Google Sign In Button */}
      <div className="w-full max-w-sm">
        <form action={signInWithGoogle}>
          <Button
            type="submit"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect bg-primary p-2 font-semibold text-primary-foreground shadow hover:bg-primary/90 active:bg-primary/80 disabled:hover:bg-primary disabled:active:bg-primary dark:bg-[oklch(0.707_0.1406_90.77)] dark:text-[oklch(0.2_0.0102_242.05)] dark:hover:bg-[oklch(0.607_0.1406_90.77)] dark:active:bg-[oklch(0.507_0.1406_90.77)] disabled:dark:hover:bg-[oklch(0.707_0.1406_90.77)] disabled:dark:active:bg-[oklch(0.707_0.1406_90.77)] px-4 py-2 h-14 w-full text-lg"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>
      </div>

      {/* Terms and Privacy */}
      <div className="mt-6 text-center text-sm text-muted-foreground/60">
        <p>
          By continuing, you agree to our{" "}
          <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground dark:hover:text-white">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground dark:hover:text-white">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
