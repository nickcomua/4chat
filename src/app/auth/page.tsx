
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
      <div className="absolute left-4 top-4">
        <Link href="/">
          <Button
            variant="ghost"
            className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 h-9 px-4 py-2 flex items-center hover:bg-muted/40"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chat
          </Button>
        </Link>
      </div>

      {/* Welcome Header */}
      <h1 className="mb-5 h-5 text-xl font-bold text-foreground flex items-center">
        Welcome to
        <div className="-mt-1 ml-1.5 inline-block h-3.5 select-none">
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 247.7 53"
            className="size-full text-[--wordmark-color]"
          >
            <path
              fill="currentcolor"
              d="M205.6,50.3c1.9-1,3.5-2.2,4.7-3.6v4.4v0.4h0.4h7.7h0.4v-0.4V13.5v-0.4h-0.4h-7.7h-0.4v0.4v4.3c-1.2-1.4-2.8-2.6-4.6-3.5c-2.2-1.2-4.8-1.8-7.8-1.8c-3.3,0-6.3,0.8-9,2.5c-2.7,1.7-4.9,4-6.4,6.9l0,0c-1.6,3-2.4,6.4-2.4,10.2c0,3.8,0.8,7.3,2.4,10.3c1.6,3,3.7,5.4,6.4,7.1c2.7,1.7,5.7,2.6,8.9,2.6C200.6,52.1,203.3,51.5,205.6,50.3z M208.7,25.7l0.3,0.5c0.8,1.7,1.2,3.7,1.2,6c0,2.5-0.5,4.7-1.5,6.6c-1,1.9-2.4,3.3-4,4.2c-1.6,1-3.4,1.5-5.3,1.5c-1.9,0-3.6-0.5-5.3-1.5c-1.7-1-3-2.4-4-4.3c-1-1.9-1.5-4.1-1.5-6.6c0-2.5,0.5-4.7,1.5-6.5c1-1.8,2.3-3.2,4-4.1c1.6-1,3.4-1.4,5.3-1.4c1.9,0,3.7,0.5,5.3,1.4C206.4,22.5,207.7,23.9,208.7,25.7z"
            ></path>
            <path
              fill="currentcolor"
              d="M99.6,21.4L99.6,21.4l-0.3,0.5c-1.6,3-2.4,6.5-2.4,10.4s0.8,7.4,2.4,10.4c1.6,3,3.8,5.3,6.6,7c2.8,1.7,6,2.5,9.6,2.5c4.5,0,8.2-1.2,11.3-3.5c3-2.3,5.1-5.4,6.2-9.3l0.1-0.5h-0.5h-8.3H124l-0.1,0.3c-0.7,1.9-1.7,3.3-3.1,4.3c-1.4,0.9-3.1,1.4-5.3,1.4c-3,0-5.4-1.1-7.2-3.3l0,0c-1.8-2.2-2.7-5.3-2.7-9.3c0-4,0.9-7,2.7-9.2c1.8-2.2,4.2-3.2,7.2-3.2c2.2,0,3.9,0.5,5.3,1.5c1.4,1,2.4,2.4,3.1,4.2l0.1,0.3h0.3h8.3h0.5l-0.1-0.5c-1-4.1-3.1-7.3-6.1-9.5c-3-2.2-6.8-3.3-11.4-3.3c-3.6,0-6.8,0.8-9.6,2.5l0,0C103.2,16.4,101.1,18.6,99.6,21.4z"
            ></path>
            <g>
              <polygon
                fill="currentcolor"
                points="237.8,13.2 237.8,3.9 229.1,3.9 229.1,13.2 224.8,13.2 224.8,20.5 229.1,20.5 229.1,52.1 230,51.2 230,51.2 232,49.2 237.8,43.2 237.8,20.5 246.8,20.5 246.8,13.2"
              ></polygon>
              <path fill="currentcolor" d="M71.7,3.4H51.5l-7.1,7.2h18.8"></path>
              <path
                fill="currentcolor"
                d="M166.8,14.5l-0.1-0.1c-2.3-1.3-4.9-1.9-7.7-1.9c-2.4,0-4.6,0.5-6.7,1.3c-1.6,0.7-3,1.7-4.2,2.8V0.1l-8.6,8.8v42.7h8.6V30.1c0-3.2,0.8-5.7,2.4-7.3c1.6-1.7,3.7-2.5,6.4-2.5s4.8,0.8,6.4,2.5c1.6,1.7,2.3,4.2,2.3,7.4v21.4h8.5V29c0-3.5-0.6-6.4-1.9-8.9C170.8,17.6,169,15.7,166.8,14.5z"
              ></path>
              <path fill="currentcolor" d="M43,3.4H0v0.5l0,0v3.2v3.7h3.5l0,0h11.9v40.8H24V10.7h11.8L43,3.4z"></path>
            </g>
            <path
              fill="currentcolor"
              d="M71.9,25.4l-0.2-0.2h0c-2.2-2.3-5.3-3.7-9.1-4.2L73.4,9.8V3.4H54.8l-9.4,7.2h17.7L52.5,21.8v5.9h7c2.5,0,4.4,0.7,5.9,2.2c1.4,1.4,2.1,3.4,2.1,6.1c0,2.6-0.7,4.7-2.1,6.2c-1.4,1.5-3.4,2.2-5.9,2.2c-2.5,0-4.4-0.7-5.7-2c-1.4-1.4-2.1-3.1-2.3-5.2l0-0.5h-8.1l0,0.5c0.2,4.6,1.8,8.1,4.8,10.5c2.9,2.4,6.7,3.7,11.3,3.7c5,0,9-1.4,11.9-4.2c2.9-2.8,4.4-6.6,4.4-11.3C75.6,31.5,74.4,28,71.9,25.4z"
            ></path>
            <rect x="84.3" y="44.2" fill="currentcolor" width="6.9" height="6.9"></rect>
          </svg>
        </div>
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
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 px-4 py-2 h-14 w-full text-lg text-white backdrop-blur-sm transition-all hover:shadow-lg"
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
