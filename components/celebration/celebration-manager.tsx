"use client"

import { CelebrationEffect } from "@/lib/constants"
import { RomanticFireworks } from "./romantic-fireworks"
import { ActiveCelebration } from "@/hooks/useCelebration"

const EFFECT_COMPONENTS: Record<CelebrationEffect, React.FC<any>> = {
    "romantic-fireworks": RomanticFireworks,
}

interface CelebrationManagerProps {
    activeEffects: ActiveCelebration[]
}

export function CelebrationManager({ activeEffects }: CelebrationManagerProps) {
    if (activeEffects.length === 0) return null

    return (
        <>
            {activeEffects.map(({ effect, intensity, slowInterval, fastPhase }) => {
                const Component = EFFECT_COMPONENTS[effect]
                if (!Component) return null
                return <Component key={effect} isActive={true} intensity={intensity} slowInterval={slowInterval} fastPhase={fastPhase} />
            })}
        </>
    )
}
