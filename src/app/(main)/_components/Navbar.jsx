"use client";
import Logo from "@/app/landingComponents/Logo";
import { UserButton, useUser } from "@clerk/nextjs";
import { MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center font-semibold">
            <span className="text-primary text-2xl font-bold">
              <Logo />
            </span>
          </Link>
        </div>

        {/* Right Side: Nav + Hi + UserButton */}
        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              FAQ
            </a>
            {/* Show Sign Up Free only if not logged in */}
            {!user && (
              <Link href="/sign-up" legacyBehavior>
                <a className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition">
                  Sign Up Free
                </a>
              </Link>
            )}
          </nav>

          {/* Desktop User Button (only if logged in) */}
          {isLoaded && user && (
            <div className="ml-10 hidden md:flex items-center gap-2">
              <UserButton />
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t mt-2">
          <div className="px-4 py-4 flex flex-col space-y-4">
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 font-medium py-2 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-blue-600 font-medium py-2 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-blue-600 font-medium py-2 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-blue-600 font-medium py-2 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            {/* Show Sign Up Free only if not logged in */}
            {!user && (
              <Link href="/sign-up" legacyBehavior>
                <a className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition w-full">
                  Sign Up Free
                </a>
              </Link>
            )}
            {/* UserButton for mobile, only if logged in */}
            {isLoaded && user && (
              <div className="pt-2">
                <UserButton />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
