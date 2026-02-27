"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Heart } from "lucide-react"

// Combine maps so title is permanently associated with the specific photo
const PHOTO_DATA = [
  { src: "/photos/photo-1.jpg" }, // index 0: Always fixed
  { src: "/photos/photo-2.jpg" },
  { src: "/photos/photo-3.jpg" },
  { src: "/photos/photo-4.jpg" },
  { src: "/photos/photo-5.jpg" },
  { src: "/photos/photo-6.jpg" },
  { src: "/photos/photo-7.jpg" },
  { src: "/photos/photo-8.jpg" },
  { src: "/photos/photo-9.jpg" },
  { src: "/photos/photo-10.jpg" },
  { src: "/photos/photo-11.jpg" },
  { src: "/photos/photo-12.jpg" },
]

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
    // 1. Pick 1 random unique one for the spotlight
    const randomFeaturedIdx = Math.floor(Math.random() * PHOTO_DATA.length)
    const initialIndices: number[] = [randomFeaturedIdx]

    // 2. Pick 4 sequential available ones to fill the rest of the layout initially
    for (let i = 0; i < PHOTO_DATA.length; i++) {
      // Skip the one we already chose for spotlight
      if (i !== randomFeaturedIdx) {
        initialIndices.push(i)
      }
      // Stop when we have 5 items total (1 spotlight + 4 regular)
      if (initialIndices.length === 5) break;
    }

    setDisplayIndices(initialIndices)
    setMounted(true)
  }, [])

  // Random swap logic if there are more than 5 unique photos
  useEffect(() => {
    if (!mounted || displayIndices.length === 0) return;

    // Check if we have more *unique* photos than slots
    const uniqueSrcs = new Set(PHOTO_DATA.map(p => p.src)).size;
    if (uniqueSrcs <= 5) return

    const interval = setInterval(() => {
      setDisplayIndices(prev => {
        const next = [...prev]

        // Randomly choose one of the non-featured slots to swap (slots 1, 2, 3, or 4)
        // Math.floor(Math.random() * 4) + 1 generates exactly 1, 2, 3, or 4 uniformly
        const slotToReplace = Math.floor(Math.random() * 4) + 1

        // Get currently displayed image sources
        const currentlyDisplayedSrcs = prev.map(idx => PHOTO_DATA[idx]?.src)

        // Find photos that are NOT currently displayed and NOT the featured photo
        const currentFeaturedId = prev[FEATURED_SLOT_IDX]

        const availableIdxs = PHOTO_DATA
          .map((_, i) => i)
          .filter(i =>
            i !== currentFeaturedId &&
            !currentlyDisplayedSrcs.includes(PHOTO_DATA[i].src)
          )

        if (availableIdxs.length > 0) {
          // Pick a random available photo that guarantees visual uniqueness
          const newPhotoIdx = availableIdxs[Math.floor(Math.random() * availableIdxs.length)]
          next[slotToReplace] = newPhotoIdx
        }
        return next
      })
    }, 5500) // Slower swap: every 5.5 seconds

    return () => clearInterval(interval)
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
        <h2 className="font-serif text-2xl text-rose-700">Góc Kỷ Niệm</h2>
        <p className="text-sm font-sans text-rose-400 mt-1">Những khoảnh khắc yêu thương</p>
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
          {'"'}Bởi vì điều tuyệt vời nhất không nằm ở nơi ta đến, mà là người đồng hành cùng ta trên ngần ấy chặng đường.{'"'}
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
