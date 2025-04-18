"use client";
import { useEffect, useState } from "react"



export default function Hero() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    getCount();
  }, [])

  async function getCount() {
    const resp = await fetch("/api/counter");
    const json = await resp.json();
    setCount(json.count);
  }

  return (
    <div className="py-6">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 style={{ height: 60 }} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
          Transparent 2D to Flat 3D Converter
        </h1>
        <h3 style={{ height: 60 }} className="text-l md:text-xl bg-clip-text">
          No AI! Just Algorithms
        </h3>

        <div className="mt-4 inline-block rounded-full bg-black/30 backdrop-blur-md px-4 py-2 border border-purple-500/30">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-sm font-medium">
              <span className="text-purple-300">Total Conversions:</span>{" "}
              <span className="font-bold text-white">{count}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
