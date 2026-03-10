"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA",
]

export function KonamiEasterEgg() {
  const [sequence, setSequence] = useState<string[]>([])
  const [activated, setActivated] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const newSequence = [...sequence, e.code].slice(-KONAMI_CODE.length)
    setSequence(newSequence)

    if (newSequence.length === KONAMI_CODE.length &&
        newSequence.every((key, i) => key === KONAMI_CODE[i])) {
      setActivated(true)
      setTimeout(() => setActivated(false), 4000)
    }
  }, [sequence])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
        >
          {/* Glitch overlay */}
          <div className="absolute inset-0 bg-chart-2/5 animate-pulse" />
          
          {/* Scanline burst */}
          <div className="absolute inset-0 scanlines opacity-60" />
          
          {/* Glitch text */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center relative"
          >
            <div className="relative">
              <h2 className="text-6xl md:text-8xl font-mono font-bold text-chart-2 chromatic-text" style={{ textShadow: "0 0 40px var(--neon-cyan), 0 0 80px var(--neon-cyan)" }}>
                SYSTEM
              </h2>
              <h2 className="text-6xl md:text-8xl font-mono font-bold text-chart-1 chromatic-text" style={{ textShadow: "0 0 40px var(--neon-pink), 0 0 80px var(--neon-pink)" }}>
                HACKED
              </h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-chart-2/80 font-mono text-sm mt-4 uppercase tracking-widest"
            >
              {'> '}You found the secret. Nice work, netrunner.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
