"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

import { ANNIVERSARY_DATE, ANNIVERSARY_DISPLAY_TEXT } from "@/lib/constants"

const START_DATE = new Date(ANNIVERSARY_DATE)
interface TimeUnit {
  value: number
  label: string
}

function calculateTimeDiff(startDate: Date): TimeUnit[] {
  const now = new Date()

  let years = now.getFullYear() - startDate.getFullYear()
  let months = now.getMonth() - startDate.getMonth()
  let days = now.getDate() - startDate.getDate()
  let hours = now.getHours() - startDate.getHours()
  let minutes = now.getMinutes() - startDate.getMinutes()
  let seconds = now.getSeconds() - startDate.getSeconds()

  if (seconds < 0) {
    seconds += 60
    minutes--
  }
  if (minutes < 0) {
    minutes += 60
    hours--
  }
  if (hours < 0) {
    hours += 24
    days--
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
    months--
  }
  if (months < 0) {
    months += 12
    years--
  }

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
    calculateTimeDiff(START_DATE)
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setTimeUnits(calculateTimeDiff(START_DATE))
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
        <p className="text-sm sm:text-base text-rose-400 font-sans opacity-90">
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
            <div className="w-full aspect-square flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-rose-100/60">
              <span className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums text-rose-600">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-sans font-medium opacity-80 text-rose-400">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Date info */}
      <motion.div
        className="flex items-center gap-2 text-xs sm:text-sm font-sans opacity-80 text-rose-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Heart className="w-3 h-3 fill-rose-300 text-rose-300" />
        <span>{ANNIVERSARY_DISPLAY_TEXT}</span>
      </motion.div>
    </section>
  )
}
