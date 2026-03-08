"use client"

import { useEffect, useRef, useCallback } from "react"

const REAL_ROSE_COLORS = [
    { r: 255, g: 127, b: 127 }, // Light Coral
    { r: 255, g: 153, b: 153 }, // Soft Pink
    { r: 250, g: 128, b: 114 }, // Salmon
    { r: 220, g: 20, b: 60 },   // Crimson inner
    { r: 255, g: 105, b: 180 }, // Hot Pink highlights
]

const ROCKET_COLOR = { r: 255, g: 105, b: 180 }

interface RGB {
    r: number
    g: number
    b: number
}

interface BurstParticle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: RGB
    alpha: number
    decay: number
    phase: "burst" | "willow"
    trail: { x: number; y: number }[]
    swayOffset: number
}

interface Rocket {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: RGB
    alpha: number
    trail: { x: number; y: number }[]
    targetY: number
}

function getResponsiveScale(intensity: "high" | "low" = "low"): { quantityScale: number; sizeScale: number } {
    if (typeof window === "undefined") return { quantityScale: 1, sizeScale: 1 }

    if (window.innerWidth < 768) {
        // Điện thoại: Bắn nhanh (high) thì giảm còn một nửa (0.5), bắn chậm (low) thì giữ khá dày (0.8)
        const qScale = intensity === "high" ? 0.5 : 0.8;
        return { quantityScale: qScale, sizeScale: 0.75 }
    }
    if (window.innerWidth < 1024) {
        const qScale = intensity === "high" ? 0.75 : 0.8;
        return { quantityScale: qScale, sizeScale: 0.5 }
    }

    return { quantityScale: 1, sizeScale: 1 }
}

// Generate points for a 5-petal flower (made of 5 rotated hearts)
function getFlowerVelocity(index: number, total: number, speedMultiplier: number, scale: number): { vx: number; vy: number } {
    const countPerPetal = Math.floor(total / 5) || 1
    const petalIdx = Math.min(4, Math.floor(index / countPerPetal)) // Ensure it doesn't exceed 4
    const rotation = petalIdx * (Math.PI * 2 / 5)

    // t goes from 0 to 2pi smoothly along the edge of the heart
    const t = ((index % countPerPetal) / countPerPetal) * Math.PI * 2

    // Heart curve equations
    let x = 16 * Math.pow(Math.sin(t), 3)
    let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))

    // Scale heart to become a single petal
    x *= 0.6 * scale
    y *= 0.6 * scale

    // Shift the bottom tip of the heart (which is at y=17 originally) to the origin
    y -= 17 * 0.6 * scale

    // Rotate the petal around the origin
    const rx = x * Math.cos(rotation) - y * Math.sin(rotation)
    const ry = x * Math.sin(rotation) + y * Math.cos(rotation)

    return {
        vx: rx * speedMultiplier * 0.18,
        vy: ry * speedMultiplier * 0.18
    }
}

function createBurst(cx: number, cy: number, count: number, speedMultiplier: number): BurstParticle[] {
    const particles: BurstParticle[] = []

    const outerCount = Math.floor(count * 0.45)
    const innerCount = Math.floor(count * 0.25)
    const dustCount = count - outerCount - innerCount

    const baseDecayHeart = 0.003
    const baseDecayDust = 0.005

    // Outer Petals Layer
    for (let i = 0; i < outerCount; i++) {
        const vel = getFlowerVelocity(i, outerCount, speedMultiplier * 1.5, 1.0)
        particles.push({
            x: cx, y: cy,
            vx: vel.vx, vy: vel.vy,
            size: Math.random() * 2 + 1.5,
            color: REAL_ROSE_COLORS[Math.floor(Math.random() * REAL_ROSE_COLORS.length)],
            alpha: 1,
            decay: Math.random() * 0.002 + baseDecayHeart,
            phase: "burst",
            trail: [],
            swayOffset: Math.random() * Math.PI * 2
        })
    }

    // Inner Petals Layer (Smaller, rotated slightly for natural look)
    for (let i = 0; i < innerCount; i++) {
        // We add a tiny offset to the rotation inside getFlowerVelocity by shifting the index
        const vel = getFlowerVelocity(i, innerCount, speedMultiplier * 1.5, 0.4)
        particles.push({
            x: cx, y: cy,
            // Rotate the inner flower by half a petal (36 degrees = Math.PI / 5)
            vx: vel.vx * Math.cos(Math.PI / 5) - vel.vy * Math.sin(Math.PI / 5),
            vy: vel.vx * Math.sin(Math.PI / 5) + vel.vy * Math.cos(Math.PI / 5),
            size: Math.random() * 1.5 + 1.0,
            color: REAL_ROSE_COLORS[4], // Hot Pink highlight inner
            alpha: 1,
            decay: Math.random() * 0.002 + baseDecayHeart,
            phase: "burst",
            trail: [],
            swayOffset: Math.random() * Math.PI * 2
        })
    }

    // Dust particles
    for (let i = 0; i < dustCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * speedMultiplier * 1.8

        particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 1.5 + 0.5,
            color: REAL_ROSE_COLORS[Math.floor(Math.random() * REAL_ROSE_COLORS.length)],
            alpha: 1,
            decay: Math.random() * 0.003 + baseDecayDust,
            phase: "burst",
            trail: [],
            swayOffset: Math.random() * Math.PI * 2
        })
    }

    return particles
}

interface RoseFireworksProps {
    isActive: boolean
    intensity?: "high" | "low"
    slowInterval?: {
        minMs: number;
        maxMs: number;
        burstCount?: { min: number; max: number };
    }
    fastPhase?: { durationMs: number; minMs: number; maxMs: number; maxItems?: number }
    onComplete?: () => void
}

export function RoseFireworks({ isActive, intensity = "low", slowInterval, fastPhase, onComplete }: RoseFireworksProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rocketsRef = useRef<Rocket[]>([])
    const particlesRef = useRef<BurstParticle[]>([])
    const animFrameRef = useRef<number>(0)
    const lastLaunchRef = useRef<number>(0)
    const startTimeRef = useRef<number>(0)
    const isFirstActiveRef = useRef<boolean>(true)

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const dpr = window.devicePixelRatio || 1
        canvas.width = window.innerWidth * dpr
        canvas.height = window.innerHeight * dpr
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`
        const ctx = canvas.getContext("2d")
        if (ctx) ctx.scale(dpr, dpr)
    }, [])

    useEffect(() => {
        if (!isActive) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        if (isFirstActiveRef.current) {
            rocketsRef.current = []
            particlesRef.current = []
            startTimeRef.current = performance.now()
            isFirstActiveRef.current = false
        }

        const { quantityScale, sizeScale } = getResponsiveScale(intensity)

        const launchRocket = (side?: "left" | "right") => {
            const w = window.innerWidth
            const h = window.innerHeight

            const isLeftSide = side ? (side === "left") : Math.random() > 0.5
            let startX = isLeftSide
                ? w * 0.1 + Math.random() * (w * 0.3)
                : w * 0.6 + Math.random() * (w * 0.3)

            let arcVx = isLeftSide ? (Math.random() * 2 + 1) : -(Math.random() * 2 + 1)

            rocketsRef.current.push({
                x: startX,
                y: h + 10,
                vx: arcVx * sizeScale,
                vy: -(Math.random() * 5 + 13) * sizeScale,
                size: 2.5 * sizeScale,
                color: ROCKET_COLOR,
                alpha: 1,
                trail: [],
                targetY: h * 0.15 + Math.random() * h * 0.3
            })
        }

        if (intensity === "high") {
            launchRocket()
            setTimeout(() => launchRocket(), 300)
            setTimeout(() => launchRocket(), 600)
            setTimeout(() => launchRocket(), 1000)
            setTimeout(() => launchRocket(), 1500)
        } else {
            setTimeout(() => launchRocket(), 500)
        }

        let lastTime = performance.now()

        const animate = (timestamp: number) => {
            const w = window.innerWidth
            const h = window.innerHeight
            const elapsed = timestamp - startTimeRef.current
            const dt = Math.min(timestamp - lastTime, 50)
            lastTime = timestamp
            const dtRatio = dt / 16.66

            ctx.clearRect(0, 0, w, h)
            ctx.globalCompositeOperation = "source-over"

            let launchInterval = 9999999
            let maxRockets = 2

            if (intensity === "high") {
                const duration = fastPhase ? fastPhase.durationMs : 15000
                const isOpeningPhase = elapsed < duration

                if (isOpeningPhase) {
                    if (fastPhase) {
                        const range = fastPhase.maxMs - fastPhase.minMs
                        launchInterval = (fastPhase.minMs + Math.random() * range) / quantityScale
                        maxRockets = Math.max(1, Math.floor((fastPhase.maxItems || 6) * quantityScale))
                    } else {
                        launchInterval = (400 + Math.random() * 600) / quantityScale
                        maxRockets = Math.max(1, Math.floor(6 * quantityScale))
                    }
                } else {
                    launchInterval = (2000 + Math.random() * 1500) / quantityScale
                    maxRockets = Math.max(1, Math.floor(2 * quantityScale))
                }
            } else {
                if (slowInterval) {
                    const range = slowInterval.maxMs - slowInterval.minMs
                    launchInterval = (slowInterval.minMs + Math.random() * range) / quantityScale
                    const baseMax = slowInterval.burstCount ? slowInterval.burstCount.max + 1 : 1
                    maxRockets = Math.max(1, Math.floor(baseMax * quantityScale))
                } else {
                    launchInterval = (6000 + Math.random() * 4000) / quantityScale
                    maxRockets = 1
                }
            }

            if (timestamp - lastLaunchRef.current > launchInterval) {
                if (particlesRef.current.length < 3000) {
                    if (intensity === "low" && slowInterval?.burstCount) {
                        const count = Math.floor(Math.random() * (slowInterval.burstCount.max - slowInterval.burstCount.min + 1)) + slowInterval.burstCount.min
                        for (let i = 0; i < count; i++) {
                            setTimeout(() => {
                                if (rocketsRef.current.length < 10) {
                                    const side = i % 2 === 0 ? "left" : "right"
                                    launchRocket(side)
                                }
                            }, i * 450 + Math.random() * 200)
                        }
                    } else if (rocketsRef.current.length < maxRockets) {
                        launchRocket()
                    }
                }
                lastLaunchRef.current = timestamp
            }

            for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
                const r = rocketsRef.current[i]

                r.trail.push({ x: r.x, y: r.y })
                if (r.trail.length > 5) r.trail.shift()

                r.x += r.vx * dtRatio
                r.y += r.vy * dtRatio
                r.vy += 0.12 * dtRatio

                if (r.trail.length > 1) {
                    ctx.beginPath()
                    ctx.moveTo(r.trail[0].x, r.trail[0].y)
                    for (let j = 1; j < r.trail.length; j++) {
                        ctx.lineTo(r.trail[j].x, r.trail[j].y)
                    }
                    ctx.strokeStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, 1)`
                    ctx.lineWidth = r.size
                    ctx.lineCap = "round"
                    ctx.stroke()
                }

                ctx.beginPath()
                ctx.arc(r.x, r.y, r.size * 1.5, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, 1)`
                ctx.fill()

                if (r.vy >= -1 || r.y <= r.targetY) {
                    particlesRef.current.push(...createBurst(r.x, r.y, 450 * sizeScale, 3.5 * sizeScale))
                    rocketsRef.current.splice(i, 1)
                }
            }

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i]

                p.trail.push({ x: p.x, y: p.y })

                if (p.phase === "burst") {
                    if (p.trail.length > 4) p.trail.shift()

                    p.x += p.vx * dtRatio
                    p.y += p.vy * dtRatio

                    const drag = Math.pow(0.92, dtRatio)
                    p.vx *= drag
                    p.vy *= drag

                    if (Math.abs(p.vx) < 0.3 && Math.abs(p.vy) < 0.3) {
                        p.phase = "willow"
                    }
                } else {
                    if (p.trail.length > 8) p.trail.shift()

                    p.swayOffset += 0.03 * dtRatio
                    p.x += p.vx * dtRatio + Math.sin(p.swayOffset) * 0.4 * dtRatio
                    p.vy += 0.02 * dtRatio
                    if (p.vy > 1.8) p.vy = 1.8
                    p.y += p.vy * dtRatio
                }

                p.alpha -= p.decay * dtRatio

                let cr = p.color.r
                let cg = p.color.g
                let cb = p.color.b

                if (p.alpha < 0.6) {
                    const whiteFactor = (0.6 - p.alpha) / 0.6
                    cr = cr + (255 - cr) * whiteFactor
                    cg = cg + (255 - cg) * whiteFactor
                    cb = cb + (255 - cb) * whiteFactor
                }

                const rgbaCore = `rgba(${Math.floor(cr)}, ${Math.floor(cg)}, ${Math.floor(cb)}, ${p.alpha})`
                const rgbaTrail = `rgba(${Math.floor(cr)}, ${Math.floor(cg)}, ${Math.floor(cb)}, ${Math.min(1, p.alpha * 1.5)})`

                if (p.trail.length > 1 && p.alpha > 0) {
                    ctx.beginPath()
                    ctx.moveTo(p.trail[0].x, p.trail[0].y)
                    for (let j = 1; j < p.trail.length; j++) {
                        ctx.lineTo(p.trail[j].x, p.trail[j].y)
                    }
                    ctx.strokeStyle = rgbaTrail
                    ctx.lineWidth = p.size * 0.8
                    ctx.lineCap = "round"
                    ctx.stroke()
                }

                if (p.alpha > 0) {
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                    ctx.fillStyle = rgbaCore
                    ctx.fill()
                }

                if (p.alpha <= 0 || p.y > h + 50) {
                    particlesRef.current.splice(i, 1)
                }
            }

            ctx.globalCompositeOperation = "source-over"
            animFrameRef.current = requestAnimationFrame(animate)
        }

        animFrameRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animFrameRef.current)
            window.removeEventListener("resize", resizeCanvas)
            if (!isActive) {
                isFirstActiveRef.current = true
            }
        }
    }, [isActive, intensity, slowInterval, resizeCanvas])

    if (!isActive) return null

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[60] pointer-events-none"
            style={{ opacity: 1, pointerEvents: "none", transition: "opacity 1s ease-out" }}
        />
    )
}
