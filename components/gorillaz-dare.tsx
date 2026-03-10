"use client"

import { useEffect, useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

const VIDEO_ID = "uAOR6ib95kQ"
const START_TIME = 52

const dareLines = ["IT'S DARE!", "IT'S COMING UP!", "IT'S COMING UP!", "IT'S COMING UP!", "IT'S DARE!"]

export function GorillazDare() {
  const [stage, setStage] = useState<"idle" | "intro" | "video">("idle")
  const [lineIndex, setLineIndex] = useState(0)

  const handleClose = useCallback(() => {
    setStage("idle")
  }, [])

  useEffect(() => {
    const handler = () => {
      if (stage !== "idle") return
      setLineIndex(0)
      setStage("intro")
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance("It's dare! It's coming up! It's coming up! It's dare!")
        utter.rate = 1.2; utter.pitch = 1.4; utter.volume = 0.6
        window.speechSynthesis.speak(utter)
      }
      setTimeout(() => setStage("video"), 3500)
    }
    window.addEventListener("dare-head", handler)
    return () => window.removeEventListener("dare-head", handler)
  }, [stage])

  useEffect(() => {
    if (stage !== "intro") return
    const interval = setInterval(() => setLineIndex((prev) => (prev + 1) % dareLines.length), 700)
    return () => clearInterval(interval)
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
        <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">
          <div className="text-center">
            <motion.div animate={{ y: [0, -20, 0, -15, 0], rotate: [0, -8, 5, -5, 0] }} transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }} className="mx-auto mb-6">
              <div className="relative w-24 h-24 bg-purple-900 border-2 border-purple-400 rounded-lg flex items-center justify-center mx-auto overflow-hidden" style={{ filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))" }}>
                <div className="text-center leading-tight">
                  <div className="flex justify-center gap-3"><div className="w-4 h-4 bg-white rounded-full" /><div className="w-4 h-4 bg-white rounded-full" /></div>
                  <div className="w-8 h-2 bg-white/80 mx-auto mt-2 rounded-sm" />
                </div>
                <div className="absolute -top-1 left-0 right-0 h-4 bg-purple-700 rounded-t-lg" />
              </div>
            </motion.div>
            <motion.p key={lineIndex} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl md:text-7xl font-mono font-bold text-purple-400" style={{ textShadow: "0 0 30px rgba(168,85,247,0.6)" }}>{dareLines[lineIndex]}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.5 }} className="text-white font-mono text-sm mt-6 tracking-[0.3em] uppercase">DARE — Gorillaz</motion.p>
          </div>
        </motion.div>
      )}

      {stage === "video" && (
        <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={handleClose}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-purple-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><div className="w-2.5 h-2.5 rounded-full bg-green-500" /></div>
                <span className="text-xs font-mono text-purple-400/60 uppercase tracking-wider">dare.exe</span>
              </div>
              <button onClick={handleClose} className="text-xs font-mono text-white/40 hover:text-white transition-colors px-2 py-1">[ESC] CLOSE</button>
            </div>
            <div className="relative bg-black border border-purple-500/30 border-t-0"><div className="aspect-video"><iframe src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&start=${START_TIME}`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen /></div></div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-purple-500/30 border-t-0">
              <span className="text-xs font-mono text-purple-400/40">🎤 Gorillaz — DARE</span>
              <span className="text-xs font-mono text-purple-400/40">♪ Demon Days (2005)</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
