"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  return (
    <header className="border-b bg-primary-foreground px-6 shadow-md">
      <div className=" flex h-14 justify-between items-center max-w-7xl mx-auto">
        <div className="flex gap-4 items-center">
          <Link href="/" className="flex items-center font-semibold">
            <span className="text-primary text-2xl font-bold">GenResume</span>
          </Link>
          {isLoaded && (
            <span className="ml-2 text-lg font-semibold px-2 py-0.5 rounded-sm text-gray-500">
              Hi{" "}
              <span className="font-bold text-black"> {user?.firstName} </span>
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
