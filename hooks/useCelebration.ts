"use client"

import { useEffect, useState } from "react"
import {
    ANNIVERSARY_DATE,
    CELEBRATION_RULES,
    CelebrationEffect,
    CelebrationRule,
} from "@/lib/constants"

export interface ActiveCelebration {
    effect: CelebrationEffect
    intensity: "high" | "low"
    slowInterval?: {
        minMs: number;
        maxMs: number;
        burstCount?: { min: number; max: number };
    }
    fastPhase?: { durationMs: number; minMs: number; maxMs: number; maxItems?: number }
    customSubtitle?: string
    customQuotes?: string[]
}

// Convert rule trigger into a precise start Date for the current year/month
function getTriggerStart(rule: CelebrationRule, now: Date): Date | null {
    if (rule.trigger.type === "test") {
        return now
    }

    const year = now.getFullYear()

    if (rule.trigger.type === "anniversary-year" || rule.trigger.type === "anniversary-month") {
        const annivDate = new Date(ANNIVERSARY_DATE)
        const month = rule.trigger.type === "anniversary-month" ? now.getMonth() : annivDate.getMonth()
        return new Date(year, month, annivDate.getDate(), annivDate.getHours(), annivDate.getMinutes(), 0)
    } else if (rule.trigger.type === "custom-date") {
        const [day, month] = rule.trigger.date.split("/").map(Number)
        const timeStr = rule.trigger.time || "00:00"
        const [hours, minutes] = timeStr.split(":").map(Number)
        return new Date(year, month - 1, day, hours, minutes, 0)
    }
    return null
}

function getMatchedEffects(currentScreen: string): ActiveCelebration[] {
    const now = new Date()
    const activeResults: ActiveCelebration[] = []

    for (const rule of CELEBRATION_RULES) {
        const triggerStart = getTriggerStart(rule, now)
        if (!triggerStart) continue

        const durationHours = "durationHours" in rule.trigger ? (rule.trigger.durationHours || 24) : 24
        const durationMs = durationHours * 60 * 60 * 1000

        const elapsedMs = now.getTime() - triggerStart.getTime()

        // Check if current time is within the celebration window
        if (elapsedMs >= 0 && elapsedMs < durationMs) {

            // Chế độ "Đại tiệc" (Nhanh) kích hoạt dựa trên thời gian thực tế của fastPhase
            const fastDuration = rule.fastPhase?.durationMs || 15000
            const isGrandOpeningTime = elapsedMs <= fastDuration

            let finalIntensity: "high" | "low" | null = null

            if (isGrandOpeningTime) {
                if (rule.highIntensityScreens?.includes(currentScreen)) {
                    finalIntensity = "high"
                } else if (rule.lowIntensityScreens?.includes(currentScreen)) {
                    finalIntensity = "low" // Fallback if screen allows low but not high
                }
            } else {
                if (rule.lowIntensityScreens?.includes(currentScreen)) {
                    finalIntensity = "low"
                }
            }

            if (finalIntensity) {
                // Avoid duplicates
                if (!activeResults.find(e => e.effect === rule.effect)) {
                    activeResults.push({
                        effect: rule.effect,
                        intensity: finalIntensity,
                        slowInterval: rule.slowInterval,
                        fastPhase: rule.fastPhase,
                        customSubtitle: rule.birthdayMaster
                            ? `Mừng sinh nhật ${rule.birthdayMaster.name} tròn ${now.getFullYear() - rule.birthdayMaster.year} tuổi`
                            : rule.customSubtitle,
                        customQuotes: rule.customQuotes
                    })
                }
            }
        }
    }

    return activeResults
}

export function useCelebration(currentScreen: string) {
    const [activeEffects, setActiveEffects] = useState<ActiveCelebration[]>([])

    useEffect(() => {
        // Continuous evaluation every second without hardcoded stop/start timers
        const checkEffects = () => {
            const newEffects = getMatchedEffects(currentScreen)

            // Deep compare to prevent unnecessary state updates
            setActiveEffects(prev => {
                if (prev.length !== newEffects.length) return newEffects
                for (let i = 0; i < prev.length; i++) {
                    if (prev[i].effect !== newEffects[i].effect || prev[i].intensity !== newEffects[i].intensity) {
                        return newEffects
                    }
                }
                return prev
            })
        }

        // Check immediately on mount/screen map
        checkEffects()

        const intervalId = setInterval(checkEffects, 1000)

        return () => clearInterval(intervalId)
    }, [currentScreen])

    // Provide a stop function to force clear if needed manually
    const stop = () => setActiveEffects([])

    return { activeEffects, stop }
}
