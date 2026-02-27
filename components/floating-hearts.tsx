"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"

interface FloatingHeart {
  id: number
  left: number
  size: number
  delay: number
  duration: number
  opacity: number
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([])

  useEffect(() => {
    setHearts(
      Array.from({ length: 6 }, (_, i) => {
        // Evaluate into 6 columns (0 to 5) to guarantee an even spread across the screen
        const columnWidth = 100 / 6
        const left = i * columnWidth + Math.random() * (columnWidth * 0.8)

        return {
          id: i,
          left: left,
          size: Math.random() * 8 + 12, // Size between 12px and 20px (about 1.5x+)
          delay: Math.random() * 15, // Stagger animations widely so they don't rise as a wall
          duration: Math.random() * 8 + 12,
          opacity: Math.random() * 0.12 + 0.04,
        }
      })
    )
  }, [])

  if (hearts.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.left}%`,
            animation: `float-heart ${h.duration}s ease-in-out ${h.delay}s infinite`,
            opacity: h.opacity,
          }}
        >
          <Heart
            className="text-rose-400 fill-rose-400"
            style={{ width: h.size, height: h.size }}
          />
        </div>
      ))}
    </div>
  )
}
