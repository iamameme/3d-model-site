"use client";
import { useEffect, useState } from "react"

export default function ConversionsCounter() {
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
    <div className="inline-block rounded-full bg-black/30 backdrop-blur-md px-4 py-2 border border-purple-500/30">
        <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        <p className="text-sm font-medium">
            <span className="text-purple-300">Total Conversions:</span>{" "}
            <span className="font-bold text-white">{count}</span>
        </p>
        </div>
    </div>
  )
}
