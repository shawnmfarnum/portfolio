"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

// YouTube IFrame API types
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

// GLaDOS quotes that can appear before the video
const gladosQuotes = [
  "This was a triumph.",
  "I'm making a note here: HUGE SUCCESS.",
  "It's hard to overstate my satisfaction.",
  "We do what we must because we can.",
  "For the good of all of us, except the ones who are dead.",
  "Look at me still talking when there's science to do.",
  "And believe me, I am still alive.",
]

export function PortalEasterEgg() {
  const [stage, setStage] = useState<"idle" | "glados" | "video">("idle")
  const [quote, setQuote] = useState("")
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
        videoId: "Y6ljFaKRTrI",
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event: YTStateChangeEvent) => {
            // YT.PlayerState.ENDED === 0
            if (event.data === 0) {
              handleClose()
            }
          },
        },
      })
    }

    // If API is already loaded, init immediately; otherwise wait
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
      const randomQuote = gladosQuotes[Math.floor(Math.random() * gladosQuotes.length)]
      setQuote(randomQuote)
      setStage("glados")

      // After showing the GLaDOS quote, open the video
      setTimeout(() => {
        setStage("video")
      }, 2500)
    }

    window.addEventListener("the-cake-is-a-lie", handler)
    return () => window.removeEventListener("the-cake-is-a-lie", handler)
  }, [stage])

  return (
    <AnimatePresence>
      {stage === "glados" && (
        <motion.div
          key="glados"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
        >
          {/* Aperture Science-style scanlines */}
          <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
          
          <div className="text-center px-6 max-w-2xl">
            {/* Aperture Science logo approximation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
              className="mb-8 mx-auto w-20 h-20 border-2 border-orange-400 rounded-full flex items-center justify-center"
              style={{ boxShadow: "0 0 30px rgba(255,165,0,0.3), inset 0 0 20px rgba(255,165,0,0.1)" }}
            >
              <div className="w-3 h-3 bg-orange-400 rounded-full" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-orange-400/60 font-mono text-xs uppercase tracking-[0.3em] mb-4"
            >
              Aperture Science Enrichment Center
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white font-mono text-xl md:text-2xl leading-relaxed"
              style={{ textShadow: "0 0 20px rgba(255,165,0,0.3)" }}
            >
              {quote}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-orange-400/40 font-mono text-xs mt-6"
            >
              — GLaDOS
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
          {/* Portal-style border glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Orange portal glow (top-left) */}
            <div
              className="absolute -top-16 -left-16 w-32 h-32 rounded-full opacity-40 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #ff6600 0%, transparent 70%)" }}
            />
            {/* Blue portal glow (bottom-right) */}
            <div
              className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full opacity-40 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #00a2ff 0%, transparent 70%)" }}
            />

            {/* Terminal chrome */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-orange-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                </div>
                <span className="text-xs font-mono text-orange-400/60 uppercase tracking-wider">
                  aperture_science://media/still_alive.exe
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-xs font-mono text-white/40 hover:text-white transition-colors px-2 py-1"
              >
                [ESC] CLOSE
              </button>
            </div>

            {/* Video embed via YouTube IFrame API */}
            <div className="relative bg-black border border-orange-500/30 border-t-0">
              <div className="aspect-video">
                <div ref={playerContainerRef} className="w-full h-full" />
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-orange-500/30 border-t-0">
              <span className="text-xs font-mono text-orange-400/40">
                The cake is a lie. The cake is a lie. The cake is a lie.
              </span>
              <span className="text-xs font-mono text-blue-400/40">
                ♪ Still Alive
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
