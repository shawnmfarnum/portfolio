"use client"

import { useEffect, useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

const VIDEO_ID = "HyHNuVaZJ-k"
const START_TIME = 16

const laughText = ["HA", "HA", "HA", "HA", "HA", "HA", "HA", "HA"]

export function GorillazFeelGood() {
  const [stage, setStage] = useState<"idle" | "intro" | "video">("idle")

  const handleClose = useCallback(() => {
    setStage("idle")
  }, [])

  useEffect(() => {
    const handler = () => {
      if (stage !== "idle") return
      setStage("intro")
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance("Ha ha ha ha ha ha ha ha")
        utter.rate = 1.4; utter.pitch = 0.3; utter.volume = 0.7
        window.speechSynthesis.speak(utter)
      }
      setTimeout(() => setStage("video"), 3000)
    }
    window.addEventListener("feel-good-inc", handler)
    return () => window.removeEventListener("feel-good-inc", handler)
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
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
        >
          <motion.div
            initial={{ x: "-120%", y: 60 }}
            animate={{ x: "120vw", y: -40 }}
            transition={{ duration: 7, ease: "linear" }}
            className="absolute top-1/3"
          >
            <div className="relative opacity-20">
              <div className="w-48 h-20 bg-white/30 rounded-[50%] relative">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-2 h-16 bg-white/40" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute -top-20 left-1/2 -translate-x-1/2">
                  <div className="w-0.5 h-10 bg-white/50 absolute -top-5 left-0" />
                  <div className="w-10 h-0.5 bg-white/50 absolute top-0 -left-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>
          <div className="text-center z-10">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 12 }} className="flex flex-wrap items-center justify-center gap-3 md:gap-5 px-8">
              {laughText.map((word, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 30, rotate: -10 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.2 + i * 0.12, type: "spring", damping: 10 }} className="text-5xl md:text-7xl lg:text-8xl font-bold font-mono" style={{ color: "#ff00ff", textShadow: "0 0 30px rgba(255,0,255,0.6), 0 0 60px rgba(255,0,255,0.3)" }}>{word}</motion.span>
              ))}
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.5 }} className="text-white font-mono text-sm mt-8 tracking-[0.3em] uppercase">Feel Good Inc. — Gorillaz</motion.p>
          </div>
        </motion.div>
      )}

      {stage === "video" && (
        <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={handleClose}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-purple-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><div className="w-2.5 h-2.5 rounded-full bg-green-500" /></div>
                <span className="text-xs font-mono text-purple-400/60 uppercase tracking-wider">feel_good_inc.exe</span>
              </div>
              <button onClick={handleClose} className="text-xs font-mono text-white/40 hover:text-white transition-colors px-2 py-1">[ESC] CLOSE</button>
            </div>
            <div className="relative bg-black border border-purple-500/30 border-t-0"><div className="aspect-video"><iframe src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&start=${START_TIME}`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen /></div></div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-purple-500/30 border-t-0">
              <span className="text-xs font-mono text-purple-400/40">🏝️ Gorillaz — Feel Good Inc.</span>
              <span className="text-xs font-mono text-purple-400/40">♪ Demon Days (2005)</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
