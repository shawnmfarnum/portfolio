"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface YTPlayer {
  destroy: () => void
}

interface YTStateChangeEvent {
  data: number
}

interface YTPlayerOptions {
  videoId: string
  playerVars?: Record<string, number | string>
  events?: {
    onStateChange?: (event: YTStateChangeEvent) => void
  }
}

declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer
    }
    onYouTubeIframeAPIReady: () => void
  }
}

const rickLines = [
  "We're no strangers to love...",
  "You know the rules and so do I.",
  "A full commitment's what I'm thinking of.",
  "You wouldn't get this from any other guy.",
  "Never gonna give you up!",
]

export function RickRoll() {
  const [stage, setStage] = useState<"idle" | "intro" | "video">("idle")
  const [line, setLine] = useState("")
  const playerRef = useRef<YTPlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.destroy() } catch {}
      playerRef.current = null
    }
    setStage("idle")
  }, [])

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script")
      tag.id = "yt-iframe-api"
      tag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)
    }
  }, [])

  // Initialize player when video stage is reached
  useEffect(() => {
    if (stage !== "video" || !playerContainerRef.current) return

    const initPlayer = () => {
      playerRef.current = new window.YT.Player(playerContainerRef.current!, {
        videoId: "dQw4w9WgXcQ",
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event: YTStateChangeEvent) => {
            if (event.data === 0) {
              handleClose()
            }
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch {}
        playerRef.current = null
      }
    }
  }, [stage, handleClose])

  useEffect(() => {
    const handler = () => {
      if (stage !== "idle") return
      const randomLine = rickLines[Math.floor(Math.random() * rickLines.length)]
      setLine(randomLine)
      setStage("intro")

      setTimeout(() => {
        setStage("video")
      }, 2000)
    }

    window.addEventListener("rick-roll", handler)
    return () => window.removeEventListener("rick-roll", handler)
  }, [stage])

  // ESC to close
  useEffect(() => {
    if (stage === "idle") return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [stage, handleClose])

  return (
    <AnimatePresence>
      {stage === "intro" && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
        >
          <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
          <div className="text-center px-6 max-w-2xl">
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="text-6xl mb-6"
            >
              🎤
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white font-mono text-xl md:text-2xl leading-relaxed italic"
              style={{ textShadow: "0 0 20px rgba(255,100,50,0.4)" }}
            >
              {line}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-orange-400/40 font-mono text-xs mt-4"
            >
              — Rick Astley
            </motion.p>
          </div>
        </motion.div>
      )}

      {stage === "video" && (
        <motion.div
          key="video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal chrome */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-orange-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-orange-400/60 uppercase tracking-wider">
                  definitely_not_a_trick.exe
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-xs font-mono text-white/40 hover:text-white transition-colors px-2 py-1"
              >
                [ESC] CLOSE
              </button>
            </div>

            {/* Video embed */}
            <div className="relative bg-black border border-orange-500/30 border-t-0">
              <div className="aspect-video">
                <div ref={playerContainerRef} className="w-full h-full" />
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-orange-500/30 border-t-0">
              <span className="text-xs font-mono text-orange-400/40">
                You just got Rick Rolled. 🕺
              </span>
              <span className="text-xs font-mono text-red-400/40">
                ♪ Never Gonna Give You Up
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
