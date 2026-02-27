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
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 10 + 6,
        delay: Math.random() * 16,
        duration: Math.random() * 10 + 16,
        opacity: Math.random() * 0.08 + 0.03,
      }))
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
