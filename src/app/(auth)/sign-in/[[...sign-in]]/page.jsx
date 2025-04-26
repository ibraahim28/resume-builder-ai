import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-background p-8 rounded-2xl shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome 👋</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to continue building your resume with AI.
          </p>
        </div>

        <SignIn path="/sign-in" routing="path" />
      </div>
    </div>
  )
}
