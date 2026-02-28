"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Heart, Clock, Camera } from "lucide-react"
import { IntroAnimation } from "@/components/intro-animation"
import { AnniversaryTimer } from "@/components/anniversary-timer"
import { FloatingHearts } from "@/components/floating-hearts"
import { LoveQuote } from "@/components/love-quote"
import { PhotoGallery } from "@/components/photo-gallery"
import { SparkleParticles } from "@/components/sparkle-particles"
import { BackgroundMusic, BackgroundMusicRef } from "@/components/background-music"

type Tab = "timer" | "photos"

const TABS: { id: Tab; label: string; icon: typeof Clock }[] = [
  { id: "timer", label: "Th\u1EDDi gian", icon: Clock },
  { id: "photos", label: "K\u1EC9 ni\u1EC7m", icon: Camera },
]

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("timer")
  const [bgVariation, setBgVariation] = useState(0)
  const bgMusicRef = useRef<BackgroundMusicRef>(null)

  useEffect(() => {
    // Pick a random variation between 0 and 4 on mount
    setBgVariation(Math.floor(Math.random() * 5))
  }, [])

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  const handlePlayAudio = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.playAudio()
    }
  }, [])

  // Curated elegant, modern background gradients - Very light, soft pastel romantic themes
  const bgGradients = [
    "linear-gradient(170deg, #fffbfa 0%, #fff0ed 40%, #ffe4de 100%)", // 0: Soft Peach & Rose
    "linear-gradient(170deg, #fbfdf9 0%, #f0f6ea 40%, #e2eed6 100%)", // 1: Matcha Mint
    "linear-gradient(170deg, #fcfbfe 0%, #f2eff9 40%, #e4def2 100%)", // 2: Lavender Mist
    "linear-gradient(170deg, #f9fdfd 0%, #edf7f8 40%, #dceff1 100%)", // 3: Morning Sky
    "linear-gradient(170deg, #FFFCF7 0%, #FFF7E8 40%, #FFE9BA 100%)", // 4: Vanilla Cream
  ]

  // Corresponding elegant ambient glows based on the background
  const ambientGlows = [
    { top: "bg-rose-200/40", bottom: "bg-orange-100/40" },  // Soft Peach
    { top: "bg-green-200/30", bottom: "bg-emerald-100/30" }, // Matcha Mint
    { top: "bg-purple-200/40", bottom: "bg-fuchsia-100/30" }, // Lavender Mist
    { top: "bg-cyan-200/30", bottom: "bg-blue-100/30" },    // Morning Sky
    { top: "bg-yellow-200/40", bottom: "bg-amber-100/30" },   // Vanilla Cream
  ]



  return (
    <main
      className="relative min-h-screen overflow-hidden transition-colors duration-1000 ease-in-out"
      style={{ background: bgGradients[bgVariation] }}
    >
      {!introComplete && <IntroAnimation onComplete={handleIntroComplete} onPlayAudio={handlePlayAudio} />}

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000" aria-hidden="true">
        <div className={`absolute top-[5%] right-[10%] w-48 h-48 sm:w-72 sm:h-72 rounded-full ${ambientGlows[bgVariation].top} blur-[80px]`} />
        <div className={`absolute bottom-[10%] left-[5%] w-40 h-40 sm:w-64 sm:h-64 rounded-full ${ambientGlows[bgVariation].bottom} blur-[70px]`} />
      </div>

      <FloatingHearts />
      <SparkleParticles />
      <BackgroundMusic ref={bgMusicRef} />

      {introComplete && (
        <motion.div
          className="relative z-20 flex flex-col items-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Top bar with tab navigation */}
          <nav className="sticky top-0 z-40 w-full">
            <div className="flex items-center justify-center gap-1 px-4 py-3 max-w-lg mx-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium font-sans transition-all duration-300 ${isActive
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
          {activeTab === "timer" && (
            <footer className="flex flex-col items-center gap-3 pb-8 sm:pb-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-rose-200/40" />
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 opacity-80" />
                <div className="w-8 h-px bg-rose-200/40" />
              </div>
              <p className="text-xs text-rose-400/50 font-sans tracking-wide">
                {"Nh\u1EADt Tr\u01B0\u1EDDng & C\u1EA9m Thu\u00FD"}
              </p>
            </footer>
          )}
        </motion.div>
      )}
    </main>
  )
}
