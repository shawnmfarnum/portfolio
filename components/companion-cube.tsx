"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const euthanizeQuotes = [
  "You euthanized your faithful Companion Cube more quickly than any test subject on record.",
  "The Enrichment Center reminds you that the Weighted Companion Cube cannot speak.",
  "Despite what the Companion Cube might tell you, it cannot love you back.",
  "The Companion Cube will never threaten to stab you and, in fact, cannot speak.",
]

export function CompanionCube() {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const cubeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => {
      setVisible(true)
      setPosition({
        x: window.innerWidth / 2 - 30,
        y: window.innerHeight / 2 - 30,
      })
      setMessage(null)
    }
    window.addEventListener("companion-cube", handler)
    return () => window.removeEventListener("companion-cube", handler)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true)
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [position])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    })
  }, [dragging])

  const handlePointerUp = useCallback(() => {
    setDragging(false)

    // Check if cube is off screen
    const margin = 20
    if (
      position.x < -margin ||
      position.y < -margin ||
      position.x > window.innerWidth - margin ||
      position.y > window.innerHeight - margin
    ) {
      setVisible(false)
      const quote = euthanizeQuotes[Math.floor(Math.random() * euthanizeQuotes.length)]
      setMessage(quote)

      // Speak it
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(quote)
        utterance.pitch = 1.3
        utterance.rate = 0.85
        utterance.volume = 0.7
        window.speechSynthesis.speak(utterance)
      }

      setTimeout(() => setMessage(null), 5000)
    }
  }, [position])

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={cubeRef}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="fixed z-[9990] cursor-grab active:cursor-grabbing select-none"
            style={{ left: position.x, top: position.y }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Companion Cube */}
            <div className="w-16 h-16 relative" style={{ filter: "drop-shadow(0 0 8px rgba(255,105,180,0.4))" }}>
              {/* Cube body */}
              <div className="w-full h-full border-2 border-pink-400/60 bg-gray-800 rounded-sm flex items-center justify-center relative overflow-hidden">
                {/* Corner details */}
                <div className="absolute top-0 left-0 w-3 h-3 border-b border-r border-pink-400/40" />
                <div className="absolute top-0 right-0 w-3 h-3 border-b border-l border-pink-400/40" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-t border-r border-pink-400/40" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-t border-l border-pink-400/40" />
                {/* Heart */}
                <span className="text-pink-400 text-xl">♥</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLaDOS message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] max-w-lg px-6 py-4 bg-black/90 border border-orange-500/30"
          >
            <p className="text-orange-400/60 font-mono text-[10px] uppercase tracking-widest mb-1">
              GLaDOS
            </p>
            <p className="text-white/80 font-mono text-sm leading-relaxed">
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
