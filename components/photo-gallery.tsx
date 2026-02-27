"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Heart } from "lucide-react"

const PHOTOS = [
  "/photos/photo-1.jpg",
  "/photos/photo-2.jpg",
  "/photos/photo-3.jpg",
  "/photos/photo-4.jpg",
  "/photos/photo-5.jpg",
  "/photos/photo-6.jpg",
]

const CAPTIONS = [
  "Ho\u00E0ng h\u00F4n b\u00EAn nhau",
  "Gi\u1EEFa v\u01B0\u1EDDn hoa lung linh",
  "M\u01B0a r\u01A1i c\u0169ng ch\u1EB3ng ng\u1EA1i",
  "Khi\u00EAu v\u0169 d\u01B0\u1EDBi \u00E1nh \u0111\u00E8n",
  "\u0110\u00EAm sao l\u00E3ng m\u1EA1n",
  "G\u00F3c nh\u1ECF b\u00ECnh y\u00EAn",
]

export function PhotoGallery() {
  const [featured, setFeatured] = useState(0)
  const [direction, setDirection] = useState(1)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto rotate featured
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setFeatured((p) => (p + 1) % PHOTOS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goPrev = useCallback(() => {
    if (lightbox === null) return
    setLightbox(lightbox === 0 ? PHOTOS.length - 1 : lightbox - 1)
  }, [lightbox])

  const goNext = useCallback(() => {
    if (lightbox === null) return
    setLightbox(lightbox === PHOTOS.length - 1 ? 0 : lightbox + 1)
  }, [lightbox])

  // Keyboard nav
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

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [lightbox])

  if (!mounted) return null

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 120 : -120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -120 : 120, opacity: 0 }),
  }

  return (
    <section className="flex flex-col items-center gap-8 sm:gap-10 px-4 w-full max-w-3xl mx-auto">
      {/* Featured photo - auto rotates */}
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] max-w-xl mx-auto rounded-2xl overflow-hidden bg-white shadow-md border border-rose-100/50">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={featured}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => setLightbox(featured)}
          >
            <Image
              src={PHOTOS[featured]}
              alt={CAPTIONS[featured]}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 95vw, 640px"
              priority={featured === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-sm sm:text-base text-white text-center font-sans">
                {CAPTIONS[featured]}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <button
          onClick={() => { setDirection(-1); setFeatured((p) => (p === 0 ? PHOTOS.length - 1 : p - 1)) }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/70 backdrop-blur-sm text-rose-600 hover:bg-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setDirection(1); setFeatured((p) => (p + 1) % PHOTOS.length) }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/70 backdrop-blur-sm text-rose-600 hover:bg-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > featured ? 1 : -1); setFeatured(i) }}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === featured ? "white" : "rgba(255,255,255,0.4)",
                transform: i === featured ? "scale(1.5)" : "scale(1)",
              }}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full">
        {PHOTOS.map((photo, i) => (
          <motion.button
            key={i}
            onClick={() => setLightbox(i)}
            className={`group relative aspect-square overflow-hidden rounded-xl bg-white border shadow-sm transition-all duration-300 ${i === featured
                ? "border-rose-300 ring-2 ring-rose-200/50"
                : "border-rose-100/40 hover:border-rose-200"
              }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label={CAPTIONS[i]}
          >
            <Image
              src={photo}
              alt={CAPTIONS[i]}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 33vw, 200px"
            />
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={(e) => { e.stopPropagation(); setLightbox(null) }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-rose-600 hover:bg-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-3 z-10 p-2 rounded-full bg-white/80 text-rose-600 hover:bg-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-3 z-10 p-2 rounded-full bg-white/80 text-rose-600 hover:bg-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={PHOTOS[lightbox]}
                alt={CAPTIONS[lightbox]}
                fill
                className="object-contain bg-white"
                sizes="(max-width: 768px) 95vw, 640px"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-3 h-3 text-white fill-white/80" />
                  <p className="text-sm text-white font-sans text-center">
                    {CAPTIONS[lightbox]}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
