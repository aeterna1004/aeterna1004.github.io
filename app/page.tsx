"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Heart, Clock, Camera } from "lucide-react"
import { IntroAnimation } from "@/components/intro-animation"
import { AnniversaryTimer } from "@/components/anniversary-timer"
import { FloatingHearts } from "@/components/floating-hearts"
import { LoveQuote } from "@/components/love-quote"
import { PhotoGallery } from "@/components/photo-gallery"
import { SparkleParticles } from "@/components/sparkle-particles"

type Tab = "timer" | "photos"

const TABS: { id: Tab; label: string; icon: typeof Clock }[] = [
  { id: "timer", label: "K\u1EC9 ni\u1EC7m", icon: Clock },
  { id: "photos", label: "H\u00ECnh \u1EA3nh", icon: Camera },
]

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("timer")

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(170deg, #fffbfa 0%, #fff6f4 40%, #fff0ed 100%)" }}
    >
      {!introComplete && <IntroAnimation onComplete={handleIntroComplete} />}

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[5%] right-[10%] w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-rose-100/30 blur-[80px]" />
        <div className="absolute bottom-[10%] left-[5%] w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-amber-50/40 blur-[70px]" />
      </div>

      <FloatingHearts />
      <SparkleParticles />

      {introComplete && (
        <motion.div
          className="relative z-20 flex flex-col items-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Top bar with tab navigation */}
          <nav className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/60 border-b border-rose-100/50">
            <div className="flex items-center justify-center gap-1 px-4 py-3 max-w-lg mx-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium font-sans transition-all duration-300 ${
                      isActive
                        ? "text-rose-700"
                        : "text-rose-400 hover:text-rose-500"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="tab-bg"
                        className="absolute inset-0 rounded-full bg-rose-50 border border-rose-200/60"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <Icon className="relative w-4 h-4" />
                    <span className="relative">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="w-full py-10 sm:py-14 md:py-16">
            {activeTab === "timer" && (
              <motion.div
                key="timer"
                className="flex flex-col items-center gap-12 sm:gap-16"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AnniversaryTimer />

                <div className="w-12 h-px bg-rose-200/50" />

                <LoveQuote />
              </motion.div>
            )}

            {activeTab === "photos" && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PhotoGallery />
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <footer className="flex flex-col items-center gap-3 pb-8 sm:pb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-rose-200/40" />
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <div className="w-8 h-px bg-rose-200/40" />
            </div>
            <p className="text-xs text-rose-400/50 font-sans tracking-wide">
              {"Nh\u1EADt Tr\u01B0\u1EDDng & C\u1EA9m Thu\u00FD"}
            </p>
          </footer>
        </motion.div>
      )}
    </main>
  )
}
