"use client"

import { useEffect, useRef, useCallback } from "react"

// RGB values for interpolation (Real firework coloring)
const ROMANTIC_COLORS = [
    { r: 244, g: 63, b: 94 },   // rose-500 (vibrant pink)
    { r: 225, g: 29, b: 72 },   // rose-600 (crimson)
    { r: 190, g: 18, b: 60 },   // rose-700 (ruby)
    { r: 159, g: 18, b: 57 },   // rose-800 (deep ruby)
    { r: 217, g: 70, b: 239 },  // fuchsia-500 (magenta)
    { r: 192, g: 38, b: 211 },  // fuchsia-600
]

// Default rocket color (Crimson)
const ROCKET_COLOR = { r: 225, g: 29, b: 72 }

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

function getResponsiveScale(): { quantityScale: number; sizeScale: number } {
    if (typeof window === "undefined") return { quantityScale: 1, sizeScale: 1 }

    // Điện thoại: Giảm số lượng 50%, Kích thước to hơn 50%
    if (window.innerWidth < 768) return { quantityScale: 0.25, sizeScale: 0.75 }

    // Máy tính bảng: Giảm số lượng 50%, Kích thước giữ nguyên
    if (window.innerWidth < 1024) return { quantityScale: 0.5, sizeScale: 0.25 }

    // Máy tính: Giữ nguyên 100%
    return { quantityScale: 1, sizeScale: 1 }
}

// Generate points for a heart shape
function getHeartBurstVelocity(index: number, total: number, speedMultiplier: number): { vx: number; vy: number } {
    const angle = (index / total) * Math.PI * 2

    // Heart curve equations
    const x = 16 * Math.pow(Math.sin(angle), 3)
    const y = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle))

    // Normalize and scale (bigger heart)
    return {
        vx: x * speedMultiplier * 0.18,
        vy: y * speedMultiplier * 0.18
    }
}

function createBurst(cx: number, cy: number, count: number, speedMultiplier: number): BurstParticle[] {
    const particles: BurstParticle[] = []

    // 70% heart outline, 30% dust
    const heartCount = Math.floor(count * 0.7)
    const dustCount = count - heartCount

    // Slower decay for a more romantic, lingering "weeping willow" feeling
    const baseDecayHeart = 0.004
    const baseDecayDust = 0.005

    // Heart particles
    for (let i = 0; i < heartCount; i++) {
        const vel = getHeartBurstVelocity(i, heartCount, speedMultiplier * 1.5)
        particles.push({
            x: cx,
            y: cy,
            vx: vel.vx,
            vy: vel.vy,
            size: Math.random() * 2 + 1.5,
            color: ROMANTIC_COLORS[Math.floor(Math.random() * ROMANTIC_COLORS.length)],
            alpha: 1,
            decay: Math.random() * 0.003 + baseDecayHeart, // Falls much slower now
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
            color: ROMANTIC_COLORS[Math.floor(Math.random() * ROMANTIC_COLORS.length)],
            alpha: 1,
            decay: Math.random() * 0.003 + baseDecayDust,
            phase: "burst",
            trail: [],
            swayOffset: Math.random() * Math.PI * 2
        })
    }

    return particles
}

interface RomanticFireworksProps {
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

export function RomanticFireworks({ isActive, intensity = "low", slowInterval, fastPhase, onComplete }: RomanticFireworksProps) {
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

        // Chỉ xóa trạng thái cũ nếu đây là lần đầu tiên được kích hoạt (isActive: false -> true)
        // Nếu chỉ đổi intensity (Nhanh <-> Chậm), chúng ta giữ nguyên để pháo hoa đang bay không bị mất
        if (isFirstActiveRef.current) {
            rocketsRef.current = []
            particlesRef.current = []
            startTimeRef.current = performance.now()
            isFirstActiveRef.current = false
        }

        const { quantityScale, sizeScale } = getResponsiveScale()

        const launchRocket = (side?: "left" | "right") => {
            const w = window.innerWidth
            const h = window.innerHeight

            // Launch from sides to frame the center
            const isLeftSide = side ? (side === "left") : Math.random() > 0.5
            let startX = isLeftSide
                ? w * 0.1 + Math.random() * (w * 0.3)  // Trái: 10% - 40%
                : w * 0.6 + Math.random() * (w * 0.3)  // Phải: 60% - 90%

            // Arch inward
            let arcVx = isLeftSide ? (Math.random() * 2 + 1) : -(Math.random() * 2 + 1)

            rocketsRef.current.push({
                x: startX,
                y: h + 10,
                vx: arcVx * sizeScale,
                vy: -(Math.random() * 4 + 11) * sizeScale, // Bắn cao hơn và nhanh hơn nếu sizeScale to
                size: 2.5 * sizeScale,
                color: ROCKET_COLOR,
                alpha: 1,
                trail: [],
                targetY: h * 0.1 + Math.random() * h * 0.3 // Explode high around timer
            })
        }

        // INITIAL BARRAGE: 4 massive opening shots to celebrate the exact anniversary moment
        // Only trigger this barrage if we are precisely at the high-intensity hour G!
        if (intensity === "high") {
            launchRocket()
            setTimeout(() => launchRocket(), 300)
            setTimeout(() => launchRocket(), 600)
            setTimeout(() => launchRocket(), 1000)
            setTimeout(() => launchRocket(), 1500) // The "grand finale" of the opening
        } else {
            // Optional: Start with just 1 rocket gracefully if it's the ambient phase
            setTimeout(() => launchRocket(), 500)
        }

        let lastTime = performance.now()

        const animate = (timestamp: number) => {
            const w = window.innerWidth
            const h = window.innerHeight
            const elapsed = timestamp - startTimeRef.current

            // Delta time calculation for Frame-Rate Independence
            // Caps max delta at 50ms to prevent massive jumps if tab is inactive
            const dt = Math.min(timestamp - lastTime, 50)
            lastTime = timestamp
            const dtRatio = dt / 16.66 // Baseline 60fps is 16.66ms per frame

            ctx.clearRect(0, 0, w, h)
            ctx.globalCompositeOperation = "source-over"

            // PACING LOGIC
            let launchInterval = 9999999
            let maxRockets = 2

            if (intensity === "high") {
                // Sử dụng cấu hình từ constant nếu có, nếu không thì mặc định 15s mở màn xối xả
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
                    // Sau khi hết hạn fastPhase thì hạ nhiệt dần nhưng vẫn duy trì ở mức vừa phải làm nền
                    launchInterval = (2000 + Math.random() * 1500) / quantityScale
                    maxRockets = Math.max(1, Math.floor(2 * quantityScale))
                }
            } else {
                if (slowInterval) {
                    const range = slowInterval.maxMs - slowInterval.minMs
                    launchInterval = (slowInterval.minMs + Math.random() * range) / quantityScale
                    // Nếu có burstCount, cho phép số lượng rocket tối đa cao hơn để chứa đủ chùm
                    const baseMax = slowInterval.burstCount ? slowInterval.burstCount.max + 1 : 1
                    maxRockets = Math.max(1, Math.floor(baseMax * quantityScale))
                } else {
                    launchInterval = (6000 + Math.random() * 4000) / quantityScale
                    maxRockets = 1
                }
            }

            if (timestamp - lastLaunchRef.current > launchInterval) {
                if (particlesRef.current.length < 400) {
                    if (intensity === "low" && slowInterval?.burstCount) {
                        // BẮN THEO ĐỢT (BURST): Bắn một chùm nhiều quả cùng lúc (staggered)
                        // Đảm bảo không bắn chung một chỗ bằng cách đảo bên (Trái/Phải)
                        const count = Math.floor(Math.random() * (slowInterval.burstCount.max - slowInterval.burstCount.min + 1)) + slowInterval.burstCount.min
                        for (let i = 0; i < count; i++) {
                            setTimeout(() => {
                                if (rocketsRef.current.length < 10) { // Giới hạn an toàn
                                    const side = i % 2 === 0 ? "left" : "right"
                                    launchRocket(side)
                                }
                            }, i * 450 + Math.random() * 200) // Giãn cách nhẹ giữa các quả trong chùm
                        }
                    } else if (rocketsRef.current.length < maxRockets) {
                        // BẮN ĐƠN (STREAM): Bắn từng quả một (hoặc nhanh liên tục ở high intensity)
                        launchRocket()
                    }
                }
                lastLaunchRef.current = timestamp
            }

            // Update Rockets
            for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
                const r = rocketsRef.current[i]

                // Only record trail every frame is fine, or we can cap trail length.
                r.trail.push({ x: r.x, y: r.y })
                if (r.trail.length > 5) r.trail.shift()

                r.x += r.vx * dtRatio
                r.y += r.vy * dtRatio
                r.vy += 0.12 * dtRatio // Gravity

                // Draw rocket trail
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

                // Rocket head
                ctx.beginPath()
                ctx.arc(r.x, r.y, r.size * 1.5, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, 1)`
                ctx.fill()

                if (r.vy >= -1 || r.y <= r.targetY) {
                    // Use a blend for particle count: some fixed, some scaled.
                    // sizeScale on mobile is 1.5, so 110 * 1.5 = 165 particles.
                    particlesRef.current.push(...createBurst(r.x, r.y, 110 * sizeScale, 3 * sizeScale))
                    rocketsRef.current.splice(i, 1)
                }
            }

            // Update Particles
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i]

                p.trail.push({ x: p.x, y: p.y })

                if (p.phase === "burst") {
                    if (p.trail.length > 4) p.trail.shift()

                    p.x += p.vx * dtRatio
                    p.y += p.vy * dtRatio

                    // Exponential drag mathematically scaled by timeframe
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
                    p.vy += 0.02 * dtRatio // Float down acceleration
                    if (p.vy > 1.8) p.vy = 1.8 // Gentle terminal velocity
                    p.y += p.vy * dtRatio
                }

                p.alpha -= p.decay * dtRatio

                // MAGIC FADE TO WHITE
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

                // Draw Willow Line 
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

                // Solid glowing core
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
            // Khi isActive chuyển sang false, ta reset lại flag để lần sau có hiệu ứng mới
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
