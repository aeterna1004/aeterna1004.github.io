"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { QUOTES } from "@/lib/constants"

export function LoveQuote() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((p) => (p + 1) % QUOTES.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="flex flex-col items-center gap-4 px-6 sm:px-10 w-full max-w-xl mx-auto">
      <div className="relative min-h-[56px] sm:min-h-[68px] flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            className="font-serif text-base sm:text-lg md:text-xl text-center text-rose-600/70 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {`\u201C${QUOTES[idx]}\u201D`}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  )
}
