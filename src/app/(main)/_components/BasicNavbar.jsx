"use client";
import Logo from "@/app/landingComponents/Logo";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function BasicNavbar() {
  return (
    <header className="bg-white shadow-md py-3 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">

        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center font-semibold">
            <span className="text-primary text-2xl font-bold">
              <Logo />
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
