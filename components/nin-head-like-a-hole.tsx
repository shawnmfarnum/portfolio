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

const VIDEO_ID = "UkR7PvpDpaU"

const lyrics = ["HEAD LIKE A HOLE", "BLACK AS YOUR SOUL", "I'D RATHER DIE", "THAN GIVE YOU CONTROL"]

export function NinHeadLikeAHole() {
  const [stage, setStage] = useState<"idle" | "intro" | "video">("idle")
  const playerRef = useRef<YTPlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.destroy() } catch {}
      playerRef.current = null
    }
    setStage("idle")
  }, [])

  useEffect(() => {
    const handler = () => {
      if (stage !== "idle") return
      setStage("intro")
      setTimeout(() => setStage("video"), 3500)
    }
    window.addEventListener("head-like-a-hole", handler)
    return () => window.removeEventListener("head-like-a-hole", handler)
  }, [stage])

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
      if (!playerContainerRef.current) return
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: VIDEO_ID,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (event: YTStateChangeEvent) => {
            if (event.data === 0) handleClose()
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
    if (stage === "idle") return
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose() }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [stage, handleClose])

  return (
    <AnimatePresence>
      {stage === "intro" && (
        <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] pointer-events-none">
          {/* VHS distortion */}
          <motion.div animate={{ x: [0, -3, 2, -1, 3, 0], opacity: [0.4, 0.6, 0.3, 0.5, 0.4] }} transition={{ duration: 0.3, repeat: Infinity }} className="absolute inset-0" style={{ background: "repeating-linear-gradient(transparent, transparent 2px, rgba(255,0,0,0.05) 2px, rgba(255,0,0,0.05) 4px)" }} />
          <motion.div animate={{ x: [0, 4, -2, 3, -4, 0] }} transition={{ duration: 0.15, repeat: Infinity }} className="absolute inset-0 mix-blend-screen opacity-30" style={{ background: "rgba(255,0,0,0.1)" }} />
          <motion.div animate={{ x: [0, -4, 2, -3, 4, 0] }} transition={{ duration: 0.15, repeat: Infinity }} className="absolute inset-0 mix-blend-screen opacity-30" style={{ background: "rgba(0,0,255,0.1)" }} />

          {/* Crack lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2
              const len = 60 + Math.random() * 40
              const x2 = 50 + Math.cos(angle) * len
              const y2 = 50 + Math.sin(angle) * len
              const mid1 = 15 + Math.random() * 10
              const mx = 50 + Math.cos(angle) * mid1 + (Math.random() - 0.5) * 8
              const my = 50 + Math.sin(angle) * mid1 + (Math.random() - 0.5) * 8
              return <motion.path key={i} d={`M50,50 Q${mx},${my} ${x2},${y2}`} fill="none" stroke="white" strokeWidth="0.3" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 0.8, 0.4] }} transition={{ duration: 0.5, delay: i * 0.03 }} />
            })}
          </svg>

          {/* Impact point */}
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.6] }} transition={{ duration: 0.4 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full" style={{ boxShadow: "0 0 40px white, 0 0 80px white" }} />

          {/* Lyrics */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {lyrics.map((line, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 10, scaleX: 1.2 }} animate={{ opacity: 1, y: 0, scaleX: 1 }} transition={{ delay: 0.3 + i * 0.4 }} className="text-2xl md:text-4xl font-mono font-bold tracking-[0.2em]" style={{ color: "white", textShadow: "0 0 20px rgba(255,0,0,0.8), 3px 0 rgba(255,0,0,0.5), -3px 0 rgba(0,255,255,0.5)", mixBlendMode: "difference" }}>{line}</motion.p>
            ))}
          </div>

          <motion.div animate={{ opacity: [0, 0.1, 0, 0.15, 0, 0.05, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ delay: 2 }} className="absolute bottom-8 right-8 text-xs font-mono text-white tracking-[0.5em]">NIN</motion.p>
        </motion.div>
      )}

      {stage === "video" && (
        <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={handleClose}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-red-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600" /><div className="w-2.5 h-2.5 rounded-full bg-red-800" /><div className="w-2.5 h-2.5 rounded-full bg-red-950" /></div>
                <span className="text-xs font-mono text-red-400/60 uppercase tracking-wider">head_like_a_hole.exe</span>
              </div>
              <button onClick={handleClose} className="text-xs font-mono text-white/40 hover:text-white transition-colors px-2 py-1">[ESC] CLOSE</button>
            </div>
            <div className="relative bg-black border border-red-500/30 border-t-0"><div className="aspect-video"><div ref={playerContainerRef} className="w-full h-full" /></div></div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-red-500/30 border-t-0">
              <span className="text-xs font-mono text-red-400/40">🔩 Nine Inch Nails — Head Like a Hole</span>
              <span className="text-xs font-mono text-red-400/40">♪ Pretty Hate Machine (1989)</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
