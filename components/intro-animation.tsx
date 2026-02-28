"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntroAnimationProps {
  onComplete: () => void
  onPlayAudio: () => void
}

export function IntroAnimation({ onComplete, onPlayAudio }: IntroAnimationProps) {
  const [phase, setPhase] = useState(0)
  const [hasClicked, setHasClicked] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1100),
      setTimeout(() => setPhase(3), 1900),
      setTimeout(() => setPhase(4), 2800), // Show the button earlier
      // Removed the auto-complete timeout so it waits for user interaction
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <AnimatePresence>
      {!hasClicked && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: "transparent" }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "anticipate" }}
        >
          {/* Soft radial glow */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(251,207,208,0.4) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center gap-5 sm:gap-7 px-6">
            {/* Heart ring SVG */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.6, type: "spring", bounce: 0.35 }}
              className="relative"
            >
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                className="w-20 h-20 sm:w-24 sm:h-24"
              >
                {/* Outer ring of small hearts */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180)
                  const cx = 50 + 38 * Math.cos(angle)
                  const cy = 50 + 38 * Math.sin(angle)
                  return (
                    <motion.g
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
                      transition={{ delay: 0.05 * i + 0.2, duration: 0.3 }}
                    >
                      <path
                        d={`M${cx},${cy - 2.5} C${cx - 2.5},${cy - 5} ${cx - 5},${cy - 2} ${cx},${cy + 1.5} C${cx + 5},${cy - 2} ${cx + 2.5},${cy - 5} ${cx},${cy - 2.5}Z`}
                        fill={i % 3 === 0 ? "#e8888d" : i % 3 === 1 ? "#f0a5a8" : "#f4bec0"}
                      />
                    </motion.g>
                  )
                })}
                {/* Center heart */}
                <motion.path
                  d="M50,38 C44,28 32,30 32,40 C32,52 50,62 50,62 C50,62 68,52 68,40 C68,30 56,28 50,38Z"
                  fill="#d4616a"
                  initial={{ scale: 0 }}
                  animate={phase >= 1 ? { scale: 1 } : {}}
                  transition={{ delay: 0.5, duration: 0.4, type: "spring", bounce: 0.4 }}
                  style={{ transformOrigin: "50px 48px" }}
                />
              </svg>
            </motion.div>

            {/* Name: Nhat Truong */}
            <motion.h1
              className="font-sans text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center"
              style={{ color: "#c44d56" }}
              initial={{ opacity: 0, x: -40 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {"Nh\u1EADt Tr\u01B0\u1EDDng"}
            </motion.h1>

            {/* Ampersand */}
            <motion.span
              className="font-sans text-xl sm:text-2xl font-light"
              style={{ color: "#e8a0a5" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              &
            </motion.span>

            {/* Name: Cam Thuy */}
            <motion.h1
              className="font-sans text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center"
              style={{ color: "#c44d56" }}
              initial={{ opacity: 0, x: 40 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {"C\u1EA9m Thu\u00FD"}
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              className="flex flex-col items-center gap-3 mt-2"
              initial={{ opacity: 0, y: 16 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-px" style={{ backgroundColor: "#e8c0c3" }} />
                <svg width="12" height="12" viewBox="0 0 12 12" fill="#d4616a">
                  <path d="M6,2 C4,0 1,0.5 1,3 C1,6 6,9 6,9 C6,9 11,6 11,3 C11,0.5 8,0 6,2Z" />
                </svg>
                <div className="w-10 h-px" style={{ backgroundColor: "#e8c0c3" }} />
              </div>
              <p
                className="text-xs sm:text-sm font-sans tracking-[0.2em] uppercase"
                style={{ color: "#d09095" }}
              >
                {"Chuy\u1EC7n t\u00ECnh y\u00EAu c\u1EE7a ch\u00FAng m\u00ECnh"}
              </p>
            </motion.div>

            {/* Interactive Enter Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => {
                setHasClicked(true)
                onPlayAudio() // Explicit binding to trigger playback on ONLY this button
                setTimeout(onComplete, 800) // Delay to let exit animation finish
              }}
              className="mt-8 px-8 py-3 rounded-full bg-white/60 hover:bg-white/80 backdrop-blur-md border border-rose-200/50 text-rose-600 font-sans font-medium tracking-wide shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              Bắt đầu trải nghiệm
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
