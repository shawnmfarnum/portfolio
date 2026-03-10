"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

const VIDEO_ID = "1V_xRb0x9aw"
const START_TIME = 16

const BAR_COUNT = 32
const COLORS = ["#ff00ff", "#00ffff", "#ff6600", "#00ff00", "#ff0066", "#6600ff", "#ffff00", "#ff3399"]

export function GorillazVisualizer() {
  const [stage, setStage] = useState<"idle" | "intro" | "video">("idle")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const handleClose = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setStage("idle")
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = canvas.width, h = canvas.height, t = Date.now() / 1000
    ctx.clearRect(0, 0, w, h)
    const barWidth = w / BAR_COUNT
    for (let i = 0; i < BAR_COUNT; i++) {
      const height = (Math.sin(t * 3 + i * 0.5) * 0.5 + 0.5) * (Math.sin(t * 1.7 + i * 0.3) * 0.3 + 0.7) * (Math.cos(t * 0.8 + i * 0.7) * 0.2 + 0.8) * h * 0.85
      const color = COLORS[i % COLORS.length]
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 8
      const x = i * barWidth + 2, bw = barWidth - 4, blockSize = 6, gap = 2
      for (let y = h; y > h - height; y -= blockSize + gap) ctx.fillRect(x, y - blockSize, bw, blockSize)
    }
    ctx.shadowBlur = 0
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (stage === "intro" && canvasRef.current) rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [stage, animate])

  useEffect(() => {
    const handler = () => {
      if (stage !== "idle") return
      setStage("intro")
      setTimeout(() => setStage("video"), 4000)
    }
    window.addEventListener("gorillaz-visualizer", handler)
    return () => window.removeEventListener("gorillaz-visualizer", handler)
  }, [stage])

  useEffect(() => {
    if (stage === "idle") return
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose() }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [stage, handleClose])

  return (
    <AnimatePresence>
      {stage === "intro" && (
        <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center">
          <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-mono text-purple-400/60 uppercase tracking-[0.4em] mb-6">◈ Gorillaz Audio Spectrum ◈</motion.p>
          <div className="relative border border-purple-500/20 bg-black p-1">
            <canvas ref={canvasRef} width={640} height={300} className="block" style={{ width: 640, height: 300 }} />
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)" }} />
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-xs font-mono text-cyan-400/40 mt-6">♪ Loading Clint Eastwood...</motion.p>
        </motion.div>
      )}

      {stage === "video" && (
        <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={handleClose}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-purple-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><div className="w-2.5 h-2.5 rounded-full bg-green-500" /></div>
                <span className="text-xs font-mono text-purple-400/60 uppercase tracking-wider">clint_eastwood.exe</span>
              </div>
              <button onClick={handleClose} className="text-xs font-mono text-white/40 hover:text-white transition-colors px-2 py-1">[ESC] CLOSE</button>
            </div>
            <div className="relative bg-black border border-purple-500/30 border-t-0"><div className="aspect-video"><iframe src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&start=${START_TIME}`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen /></div></div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-purple-500/30 border-t-0">
              <span className="text-xs font-mono text-purple-400/40">🎵 Gorillaz — Clint Eastwood</span>
              <span className="text-xs font-mono text-purple-400/40">♪ Gorillaz (2001)</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
