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

const VIDEO_ID = "mDsqpeiTqg8"

const fragments = [
  "THERE IS NO YOU",
  "THERE IS ONLY ME",
  "I'M BECOMING LESS DEFINED",
  "AS DAYS GO BY",
  "FADING AWAY",
  "WELL YOU CAN TRY",
]

export function NinOnly() {
  const [stage, setStage] = useState<"idle" | "intro" | "video">("idle")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const playerRef = useRef<YTPlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    if (playerRef.current) {
      try { playerRef.current.destroy() } catch {}
      playerRef.current = null
    }
    setStage("idle")
  }, [])

  // Digital decomposition canvas effect
  useEffect(() => {
    if (stage !== "intro") return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const pixels: { x: number; y: number; size: number; vx: number; vy: number; color: string; life: number }[] = []
    const startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      ctx.fillStyle = `rgba(0, 0, 0, ${0.15 + elapsed * 0.02})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Spawn pixel fragments that scatter outward
      if (elapsed < 3) {
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 1 + Math.random() * 4
          pixels.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2 + (Math.random() - 0.5) * 200,
            size: 2 + Math.random() * 6,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: Math.random() > 0.5 ? `rgba(255, ${Math.floor(Math.random() * 60)}, ${Math.floor(Math.random() * 60)}, ${0.4 + Math.random() * 0.6})` : `rgba(${Math.floor(Math.random() * 60)}, 255, 255, ${0.3 + Math.random() * 0.5})`,
            life: 1,
          })
        }
      }

      // Update and draw pixels
      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.005
        if (p.life <= 0) { pixels.splice(i, 1); continue }
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }
      ctx.globalAlpha = 1

      // Horizontal glitch lines
      if (Math.random() > 0.85) {
        const y = Math.random() * canvas.height
        const h = 1 + Math.random() * 4
        const offset = (Math.random() - 0.5) * 40
        ctx.drawImage(canvas, 0, y, canvas.width, h, offset, y, canvas.width, h)
      }

      // RGB split flicker
      if (Math.random() > 0.92) {
        ctx.globalCompositeOperation = "lighter"
        ctx.fillStyle = "rgba(255, 0, 0, 0.03)"
        ctx.fillRect(3, 0, canvas.width, canvas.height)
        ctx.fillStyle = "rgba(0, 255, 255, 0.03)"
        ctx.fillRect(-3, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = "source-over"
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(rafRef.current)
  }, [stage])

  useEffect(() => {
    const handler = () => {
      if (stage !== "idle") return
      setStage("intro")
      setTimeout(() => setStage("video"), 4000)
    }
    window.addEventListener("nin-only", handler)
    return () => window.removeEventListener("nin-only", handler)
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
        <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999]">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Scanlines overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.4) 1px, rgba(0,0,0,0.4) 2px)" }} />

          {/* Text fragments that glitch in */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
            {fragments.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: (i % 2 === 0 ? -1 : 1) * 100, scaleX: 2 }}
                animate={{
                  opacity: [0, 0.9, 0.4, 0.8, 0.6],
                  x: [(i % 2 === 0 ? -1 : 1) * 100, (i % 2 === 0 ? 5 : -5), (i % 2 === 0 ? -3 : 3), 0],
                  scaleX: [2, 1.1, 0.98, 1],
                }}
                transition={{ delay: 0.3 + i * 0.45, duration: 0.6, ease: "easeOut" }}
                className="text-lg md:text-2xl font-mono font-bold tracking-[0.15em]"
                style={{
                  color: i < 2 ? "#ff2222" : "#aaaaaa",
                  textShadow: `0 0 20px rgba(255,0,0,0.5), ${i % 2 === 0 ? "3" : "-3"}px 0 rgba(0,255,255,0.4)`,
                  mixBlendMode: "screen",
                }}
              >
                {text}
              </motion.p>
            ))}
          </div>

          {/* Central glitch burst */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0, 0.3, 0, 0.1, 0] }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 60%)" }}
          />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} transition={{ delay: 2.5 }} className="absolute bottom-8 right-8 text-[10px] font-mono text-red-400 tracking-[0.5em] uppercase">NIN — Only</motion.p>
        </motion.div>
      )}

      {stage === "video" && (
        <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={handleClose}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-red-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600" /><div className="w-2.5 h-2.5 rounded-full bg-red-800" /><div className="w-2.5 h-2.5 rounded-full bg-red-950" /></div>
                <span className="text-xs font-mono text-red-400/60 uppercase tracking-wider">only.exe</span>
              </div>
              <button onClick={handleClose} className="text-xs font-mono text-white/40 hover:text-white transition-colors px-2 py-1">[ESC] CLOSE</button>
            </div>
            <div className="relative bg-black border border-red-500/30 border-t-0"><div className="aspect-video"><div ref={playerContainerRef} className="w-full h-full" /></div></div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-red-500/30 border-t-0">
              <span className="text-xs font-mono text-red-400/40">👁 Nine Inch Nails — Only</span>
              <span className="text-xs font-mono text-red-400/40">♪ With Teeth (2005)</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
