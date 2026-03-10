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

const VIDEO_ID = "RQy5EAP7Seg"

export function NinAlive() {
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

  // Atmospheric particle drift
  useEffect(() => {
    if (stage !== "intro") return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; size: number; vx: number; vy: number; alpha: number; pulse: number; pulseSpeed: number }[] = []

    // Pre-populate particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.1 - Math.random() * 0.4,
        alpha: Math.random() * 0.6,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.03,
      })
    }

    const startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const breathe = Math.sin(elapsed * 0.8) * 0.5 + 0.5

      // Slow fade trail
      ctx.fillStyle = `rgba(0, 0, 0, 0.06)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Central breathing glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, 300 + breathe * 100
      )
      gradient.addColorStop(0, `rgba(80, 20, 20, ${0.02 + breathe * 0.03})`)
      gradient.addColorStop(0.5, `rgba(40, 10, 10, ${0.01 + breathe * 0.01})`)
      gradient.addColorStop(1, "transparent")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      for (const p of particles) {
        p.x += p.vx + Math.sin(elapsed * 0.5 + p.pulse) * 0.15
        p.y += p.vy
        p.pulse += p.pulseSpeed
        const particleAlpha = p.alpha * (0.5 + Math.sin(p.pulse) * 0.5) * Math.min(elapsed * 0.5, 1)

        // Wrap around
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 80, 60, ${particleAlpha})`
        ctx.fill()

        // Soft glow around larger particles
        if (p.size > 1.5) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180, 60, 40, ${particleAlpha * 0.08})`
          ctx.fill()
        }
      }

      // Occasional subtle horizontal distortion
      if (Math.random() > 0.97) {
        const y = Math.random() * canvas.height
        const h = 1 + Math.random() * 2
        ctx.drawImage(canvas, 0, y, canvas.width, h, (Math.random() - 0.5) * 8, y, canvas.width, h)
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
      setTimeout(() => setStage("video"), 5000)
    }
    window.addEventListener("nin-alive", handler)
    return () => window.removeEventListener("nin-alive", handler)
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
        <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="fixed inset-0 z-[9999] bg-black">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Breathing pulse ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.4, 1, 1.3, 1],
                opacity: [0.1, 0.25, 0.08, 0.2, 0.1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-48 h-48 rounded-full border border-red-900/30"
              style={{ boxShadow: "0 0 60px rgba(120,30,20,0.15), inset 0 0 60px rgba(120,30,20,0.1)" }}
            />
          </div>

          {/* Title text fading in */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 0.5, letterSpacing: "0.3em" }}
              transition={{ delay: 1.5, duration: 2, ease: "easeOut" }}
              className="text-xs font-mono text-red-400/60 uppercase mb-4"
            >
              Ghosts VI: Locusts
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.35, y: 0 }}
              transition={{ delay: 2.2, duration: 2, ease: "easeOut" }}
              className="text-sm md:text-base font-mono text-red-300/40 tracking-[0.2em]"
            >
              AS ALIVE AS YOU NEED ME TO BE
            </motion.p>
          </div>

          {/* Minimal NIN mark */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ delay: 3 }} className="absolute bottom-8 right-8 text-[10px] font-mono text-red-500 tracking-[0.5em]">NIN</motion.p>
        </motion.div>
      )}

      {stage === "video" && (
        <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={handleClose}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-red-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600" /><div className="w-2.5 h-2.5 rounded-full bg-red-800" /><div className="w-2.5 h-2.5 rounded-full bg-red-950" /></div>
                <span className="text-xs font-mono text-red-400/60 uppercase tracking-wider">alive.exe</span>
              </div>
              <button onClick={handleClose} className="text-xs font-mono text-white/40 hover:text-white transition-colors px-2 py-1">[ESC] CLOSE</button>
            </div>
            <div className="relative bg-black border border-red-500/30 border-t-0"><div className="aspect-video"><div ref={playerContainerRef} className="w-full h-full" /></div></div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-red-500/30 border-t-0">
              <span className="text-xs font-mono text-red-400/40">💾 Nine Inch Nails — As Alive as You Need Me To Be</span>
              <span className="text-xs font-mono text-red-400/40">♪ Ghosts VI: Locusts (2020)</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
