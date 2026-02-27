"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const QUOTES = [
  "Anh kh\u00F4ng bi\u1EBFt y\u00EAu l\u00E0 g\u00EC, ch\u1EC9 bi\u1EBFt r\u1EB1ng thi\u1EBFu em l\u00E0 thi\u1EBFu t\u1EA5t c\u1EA3.",
  "B\u00EAn em, th\u1EDDi gian tr\u1EDF th\u00E0nh nh\u1EEFng c\u00E1nh hoa kh\u00F4ng bao gi\u1EDD t\u00E0n.",
  "M\u1ED7i ng\u00E0y b\u00EAn em \u0111\u1EC1u l\u00E0 m\u1ED9t h\u1EA1nh ph\u00FAc nh\u1ECF.",
  "Em l\u00E0 c\u00E2u tr\u1EA3 l\u1EDDi cho t\u1EA5t c\u1EA3 c\u00E2u h\u1ECFi c\u1EE7a tr\u00E1i tim anh.",
  "Kh\u00F4ng c\u1EA7n \u0111i xa, ch\u1EC9 c\u1EA7n \u0111\u01B0\u1EE3c \u1EDF b\u00EAn em.",
  "Y\u00EAu em l\u00E0 \u0111i\u1EC1u tuy\u1EC7t v\u1EDDi nh\u1EA5t anh t\u1EEBng l\u00E0m.",
  "B\u00EAn em, m\u1ED7i c\u01A1n m\u01B0a c\u0169ng tr\u1EDF n\u00EAn l\u00E3ng m\u1EA1n.",
  "Anh mu\u1ED1n \u0111\u01B0\u1EE3c l\u00E0 ng\u01B0\u1EDDi b\u00EAn em m\u1ED7i s\u00E1ng th\u1EE9c d\u1EADy.",
]

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
