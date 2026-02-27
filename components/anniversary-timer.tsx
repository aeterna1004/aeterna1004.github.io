"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

const ANNIVERSARY_DATE = new Date("2020-04-10T16:50:00")

interface TimeUnit {
  value: number
  label: string
}

function calculateTimeDiff(startDate: Date): TimeUnit[] {
  const now = new Date()
  let diff = now.getTime() - startDate.getTime()

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  diff -= years * 1000 * 60 * 60 * 24 * 365.25

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44))
  diff -= months * 1000 * 60 * 60 * 24 * 30.44

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  diff -= days * 1000 * 60 * 60 * 24

  const hours = Math.floor(diff / (1000 * 60 * 60))
  diff -= hours * 1000 * 60 * 60

  const minutes = Math.floor(diff / (1000 * 60))
  diff -= minutes * 1000 * 60

  const seconds = Math.floor(diff / 1000)

  return [
    { value: years, label: "N\u0103m" },
    { value: months, label: "Th\u00E1ng" },
    { value: days, label: "Ng\u00E0y" },
    { value: hours, label: "Gi\u1EDD" },
    { value: minutes, label: "Ph\u00FAt" },
    { value: seconds, label: "Gi\u00E2y" },
  ]
}

export function AnniversaryTimer() {
  const [timeUnits, setTimeUnits] = useState<TimeUnit[]>(() =>
    calculateTimeDiff(ANNIVERSARY_DATE)
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setTimeUnits(calculateTimeDiff(ANNIVERSARY_DATE))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return <div className="h-[200px] sm:h-[240px]" />
  }

  return (
    <section className="flex flex-col items-center gap-8 sm:gap-10 px-4 w-full max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-rose-700 text-center text-balance">
          {"Nh\u1EADt Tr\u01B0\u1EDDng & C\u1EA9m Thu\u00FD"}
        </h1>
        <p className="text-sm sm:text-base text-rose-400 font-sans">
          {"B\u00EAn nhau \u0111\u01B0\u1EE3c"}
        </p>
      </motion.div>

      {/* Timer grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 w-full">
        {timeUnits.map((unit, i) => (
          <motion.div
            key={unit.label}
            className="flex flex-col items-center gap-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <div className="w-full aspect-square flex items-center justify-center rounded-2xl bg-white/80 border border-rose-100/60 shadow-sm">
              <span className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-rose-600 tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-rose-400/70 font-sans font-medium">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Date info */}
      <motion.div
        className="flex items-center gap-2 text-xs sm:text-sm text-rose-400/60 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Heart className="w-3 h-3 fill-rose-300 text-rose-300" />
        <span>{"T\u1EEB ng\u00E0y 10/04/2020"}</span>
      </motion.div>
    </section>
  )
}
