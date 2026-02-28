"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Heart } from "lucide-react"

import { PHOTO_DATA, GALLERY_TITLE, GALLERY_SUBTITLE, GALLERY_BOTTOM_QUOTE } from "@/lib/constants"

// The slot in the bento grid that holds the featured image
const FEATURED_SLOT_IDX = 0;

// Bento-box layout definitions optimized for a symmetrical 5-photo collage
const BENTO_CLASSES = [
  "col-span-2 sm:col-span-2 row-span-2 aspect-[3/4] sm:aspect-[4/5]", // 0: Main spotlight (Center)
  "col-span-1 sm:col-span-1 row-span-1 aspect-[4/5]",                 // 1: Small side
  "col-span-1 sm:col-span-1 row-span-1 aspect-[4/5]",                 // 2: Small side
  "col-span-1 sm:col-span-1 row-span-1 aspect-[4/5]",                 // 3: Small side
  "col-span-1 sm:col-span-1 row-span-1 aspect-[4/5]",                 // 4: Small side
]

export function PhotoGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Wait to initialize on mount to prevent hydration mismatch with random math
  const [displayIndices, setDisplayIndices] = useState<number[]>([])

  useEffect(() => {
    // Helper function to pick 5 random unique indices
    const pickFiveRandomPhotos = () => {
      const selectedIndices: number[] = []
      const availableIndices = Array.from({ length: PHOTO_DATA.length }, (_, i) => i)

      while (selectedIndices.length < 5 && availableIndices.length > 0) {
        const randIndex = Math.floor(Math.random() * availableIndices.length)
        const chosenPhotoIdx = availableIndices[randIndex]

        selectedIndices.push(chosenPhotoIdx)
        availableIndices.splice(randIndex, 1) // Remove so we don't pick it again
      }

      return selectedIndices
    }

    // Initial load
    setDisplayIndices(pickFiveRandomPhotos())
    setMounted(true)
  }, [])

  // =========================================================================
  // ANIMATION TIMERS:
  // 1. Random 1 small photo: every 5s ± 1.5s
  // 2. Random all 4 small photos: every 20s + 0-4s
  // 3. Random large photo: every 50s
  // 4. Random all 5 photos: every 90s (1p30s)
  // =========================================================================
  useEffect(() => {
    if (!mounted || displayIndices.length === 0) return;
    const uniqueSrcs = new Set(PHOTO_DATA.map(p => p.src)).size;
    if (uniqueSrcs <= 5) return;

    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;
    let timeout3: NodeJS.Timeout;
    let timeout4: NodeJS.Timeout;

    // Helper to get available photos not currently shown
    const getAvailableIndices = (currentIndices: number[], excludeIdxs: number[] = []) => {
      const currentlyDisplayedSrcs = currentIndices.map(idx => PHOTO_DATA[idx]?.src)
      let available = PHOTO_DATA
        .map((_, i) => i)
        .filter(i => !excludeIdxs.includes(i) && !currentlyDisplayedSrcs.includes(PHOTO_DATA[i]?.src))

      // Fallback if we run out of unique photos
      if (available.length === 0) {
        available = Array.from({ length: PHOTO_DATA.length }, (_, i) => i).filter(i => !excludeIdxs.includes(i))
      }
      return available;
    }

    // 1. Đổi 1 ảnh nhỏ tuần tự (khoảng 3.5s đến 6.5s)
    // Dùng 1 bộ đếm duy nhất nhưng lần lượt xoay vòng qua 4 ô để đảm bảo chúng không bao giờ lật cùng một lúc
    let currentSlotToSwap = 1;
    const scheduleSingleSmallSwap = () => {
      const delay = 5000 + (Math.random() * 3000 - 1500) // 5s ± 1.5s
      timeout1 = setTimeout(() => {
        setDisplayIndices(prev => {
          const next = [...prev]
          const slotToReplace = currentSlotToSwap;

          // Chuyển sang ô tiếp theo cho lần lật sau (1 -> 2 -> 3 -> 4 -> vòng lại 1)
          currentSlotToSwap = currentSlotToSwap >= 4 ? 1 : currentSlotToSwap + 1;

          const availableIdxs = getAvailableIndices(prev, [prev[FEATURED_SLOT_IDX]])

          if (availableIdxs.length > 0) {
            next[slotToReplace] = availableIdxs[Math.floor(Math.random() * availableIdxs.length)]
          }
          return next
        })
        scheduleSingleSmallSwap()
      }, delay)
    }

    // 2. Đổi cả 4 ảnh nhỏ (20s + ngẫu nhiên 0-4s)
    const scheduleFourSmallSwap = () => {
      const delay = 20000 + Math.random() * 4000 // 20s + 0-4s
      timeout2 = setTimeout(() => {
        setDisplayIndices(prev => {
          const next = [...prev]
          const availableIdxs = getAvailableIndices(prev, [prev[FEATURED_SLOT_IDX]])

          // Trộn mảng available
          for (let i = availableIdxs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableIdxs[i], availableIdxs[j]] = [availableIdxs[j], availableIdxs[i]]
          }

          let availCount = 0;
          for (let slot = 1; slot <= 4; slot++) {
            if (availCount < availableIdxs.length) {
              next[slot] = availableIdxs[availCount]
              availCount++
            }
          }
          return next
        })
        scheduleFourSmallSwap()
      }, delay)
    }

    // 3. Đổi ảnh lớn (cố định 50s)
    const scheduleLargeSwap = () => {
      timeout3 = setTimeout(() => {
        setDisplayIndices(prev => {
          const next = [...prev]
          const availableIdxs = getAvailableIndices(prev)

          if (availableIdxs.length > 0) {
            next[FEATURED_SLOT_IDX] = availableIdxs[Math.floor(Math.random() * availableIdxs.length)]
          }
          return next
        })
        scheduleLargeSwap()
      }, 50000)
    }

    // 4. Đổi toàn bộ 5 ảnh (cố định 90s - 1 phút 30 giây)
    const scheduleRefreshAll = () => {
      timeout4 = setTimeout(() => {
        setDisplayIndices(prev => {
          const newIndices: number[] = []
          let candidates = getAvailableIndices(prev)

          if (candidates.length < 5) {
            candidates = Array.from({ length: PHOTO_DATA.length }, (_, i) => i)
          }

          while (newIndices.length < 5 && candidates.length > 0) {
            const randIndex = Math.floor(Math.random() * candidates.length)
            newIndices.push(candidates[randIndex])
            candidates.splice(randIndex, 1)
          }

          if (newIndices.length < 5) return prev;
          return newIndices
        })
        scheduleRefreshAll()
      }, 90000)
    }

    // Khởi động cascader
    scheduleSingleSmallSwap() // Chỉ gọi 1 luồng duy nhất
    scheduleFourSmallSwap()
    scheduleLargeSwap()
    scheduleRefreshAll()

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      clearTimeout(timeout4)
    }
  }, [mounted, displayIndices.length])

  const goPrev = useCallback(() => {
    if (lightbox === null) return
    setLightbox(lightbox === 0 ? PHOTO_DATA.length - 1 : lightbox - 1)
  }, [lightbox])

  const goNext = useCallback(() => {
    if (lightbox === null) return
    setLightbox(lightbox === PHOTO_DATA.length - 1 ? 0 : lightbox + 1)
  }, [lightbox])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightbox === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null)
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, goPrev, goNext])

  // Lock scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [lightbox])

  if (!mounted) return null

  return (
    <section className="flex flex-col items-center gap-8 px-4 w-full max-w-4xl mx-auto">

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-serif text-2xl text-rose-700">{GALLERY_TITLE}</h2>
        <p className="text-sm font-sans text-rose-400 mt-1">{GALLERY_SUBTITLE}</p>
      </motion.div>

      {/* Dynamic Bento Box Gallery - Grid optimized for 5 items */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 w-full">
        {displayIndices.map((photoIdx, i) => {
          const photoInfo = PHOTO_DATA[photoIdx];

          return (
            <motion.div
              key={`slot-${i}`}
              className={`group relative overflow-hidden rounded-2xl bg-rose-50 border border-rose-100 shadow-sm ${BENTO_CLASSES[i]}`}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={photoIdx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => setLightbox(photoIdx)}
                >
                  <Image
                    src={photoInfo.src}
                    alt="Gallery photo"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Overlay hover effect (subtle darkening) */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Quote to finish the block and balance layout at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-6 md:p-8 rounded-2xl bg-white/40 border border-rose-100/60 backdrop-blur-sm w-full max-w-2xl text-center"
      >
        <p className="text-base sm:text-lg font-serif text-rose-800 italic leading-relaxed">
          {'"'}{GALLERY_BOTTOM_QUOTE}{'"'}
        </p>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => { e.stopPropagation(); setLightbox(null) }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Prev Button */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-2 sm:left-6 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-2 sm:right-6 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Image Container */}
            <motion.div
              key={lightbox} // Force re-animation on photo change
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="relative w-full max-w-lg aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={PHOTO_DATA[lightbox].src}
                alt="Popup photo"
                fill
                className="object-contain" // object-contain ensures no cropping in lightbox
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />


            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
