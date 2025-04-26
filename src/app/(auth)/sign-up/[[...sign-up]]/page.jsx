import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-background p-8 rounded-2xl shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Create Your Account 🚀
          </h1>
          <p className="text-muted-foreground text-sm">
            Get started with your AI-powered resume builder.
          </p>
        </div>

        <SignUp path="/sign-up" routing="path" />
      </div>
    </div>
  );
}
