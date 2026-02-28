"use client"

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react"
import { MUSIC_TRACKS, MUSIC_VOLUME } from "@/lib/constants"

// Helper to shuffle an array without mutating the original
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

export interface BackgroundMusicRef {
    playAudio: () => void;
}

export const BackgroundMusic = forwardRef<BackgroundMusicRef>((props, ref) => {
    const [playlist, setPlaylist] = useState<string[]>([])
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Expose the play method to the parent
    useImperativeHandle(ref, () => ({
        playAudio: () => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true)
                }).catch(e => console.warn("Audio play failed", e))
            }
        }
    }))

    // 1. Initialize shuffled playlist on mount
    useEffect(() => {
        if (MUSIC_TRACKS && MUSIC_TRACKS.length > 0) {
            setPlaylist(shuffleArray(MUSIC_TRACKS))
        }
    }, [])

    const currentTrack = playlist[currentTrackIndex] || null
    // Preload the next track so it transitions instantly
    const nextTrack = playlist.length > 0 ? playlist[(currentTrackIndex + 1) % playlist.length] : null

    // 2. Playback logic & Volume control
    const attemptPlay = useCallback(async () => {
        if (!audioRef.current || !currentTrack) return

        try {
            audioRef.current.volume = MUSIC_VOLUME
            await audioRef.current.play()
            setIsPlaying(true)
        } catch (error) {
            // Browser blocked autoplay. We wait for user interaction asynchronously.
            setIsPlaying(false)
        }
    }, [currentTrack])

    // Try to play immediately when the track loads or changes
    useEffect(() => {
        if (currentTrack) {
            attemptPlay()
        }
    }, [currentTrack, attemptPlay])

    // Update volume if constant changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = MUSIC_VOLUME
        }
    }, [])

    // 4. Handle end of track to go to the next song
    const handleTrackEnded = () => {
        if (playlist.length > 0) {
            setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)
        }
    }

    if (!currentTrack) return null

    return (
        <>
            {/* Main Audio Element */}
            <audio
                ref={audioRef}
                src={currentTrack}
                onEnded={handleTrackEnded}
                preload="auto"
                autoPlay
            />

            {/* Hidden Preload Element for the next track */}
            {nextTrack && (
                <link rel="preload" href={nextTrack} as="audio" />
            )}
        </>
    )
})

BackgroundMusic.displayName = "BackgroundMusic"
