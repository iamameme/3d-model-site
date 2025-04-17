"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-black/20 border-b border-purple-500/20">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">3D</span>
            </div>
            <Link
              href="/"
              className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
            >
              2D to 3D Converter
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#faq" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Register
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden p-4 bg-black/30 backdrop-blur-lg">
          <nav className="flex flex-col space-y-4">
            <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#faq" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
