"use client"

import { useEffect, useRef } from "react"
import { ChevronDown, Download } from "lucide-react"

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  // Create a subtle parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!titleRef.current) return

      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Calculate mouse position as a percentage of the viewport
      const x = clientX / innerWidth - 0.5
      const y = clientY / innerHeight - 0.5

      // Apply subtle transform based on mouse position
      titleRef.current.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0) rotateX(${y * 5}deg) rotateY(${-x * 5}deg)`
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const scrollToUpload = () => {
    const uploadSection = document.getElementById("upload-section")
    if (uploadSection) {
      const yOffset = -120; // Negative = scrolls up
      const y = uploadSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
      //uploadSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToDownload = () => {
    const downloadSection = document.getElementById("download")
    if (downloadSection) {
      const yOffset = -40; // Negative = scrolls up
      const y = downloadSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  return (
    <div className="py-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-32 h-32 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/3 w-8 h-8 border-2 border-purple-500/20 rounded-md rotate-45"></div>
        <div className="absolute bottom-1/4 left-1/3 w-6 h-6 border-2 border-pink-500/20 rounded-full"></div>
        <div
          className="absolute top-1/2 right-1/4 w-4 h-4 bg-blue-500/20 rounded-full animate-ping"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="perspective-1000">
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold relative inline-block transition-transform duration-300 ease-out"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="relative inline-block">
              {/* Glowing text with gradient */}
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 
                drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]"
              >
                PNG to Flat 3D Converter
              </span>

              {/* Text shadow/glow effect */}
              <span className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 blur-sm -z-10">
              PNG to Flat 3D Converter
              </span>

              {/* Highlight effect */}
              <span className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-md rounded-lg -z-20"></span>
            </span>
          </h1>

          {/* Animated underline */}
          <div className="h-0.5 w-0 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mt-1 animate-expand"></div>

          <p className="mt-3 text-gray-300 max-w-2xl mx-auto relative">
          This <span className="text-purple-300 font-semibold">free</span> site uses algorithms and <span className="text-purple-300 font-semibold">NO AI</span> to convert any PNG with a
            transparent background to a flat 3D model. 
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={scrollToUpload}
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-500 hover:to-blue-600 
              text-white px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:shadow-xl"
              aria-label="Try it out below"
            >
              <span className="font-medium">Try it out below</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>

            <button
              onClick={scrollToDownload}
              className="group flex items-center gap-2 bg-gradient-to-r from-pink-600/80 to-pink-700/80 hover:from-pink-500 hover:to-pink-600 
              text-white px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-pink-500/20 hover:shadow-xl"
              aria-label="Download Blender plugin"
            >
              <span className="font-medium">Download Blender plugin</span>
              <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
