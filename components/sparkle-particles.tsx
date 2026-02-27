"use client"

import { useEffect, useState } from "react"

interface Sparkle {
  id: number
  top: number
  left: number
  size: number
  delay: number
  duration: number
  color: string
}

const COLORS = [
  "oklch(0.82 0.08 10 / 0.4)",
  "oklch(0.88 0.05 30 / 0.35)",
  "oklch(0.78 0.10 350 / 0.3)",
]

export function SparkleParticles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    setSparkles(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        delay: Math.random() * 12,
        duration: Math.random() * 4 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    )
  }, [])

  if (sparkles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
