"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function SpaceCore() {
  const [visible, setVisible] = useState(false)
  const [flying, setFlying] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handler = () => {
      setFlying(false)
      setVisible(true)
      // Position in bottom-right corner
      setPosition({
        x: window.innerWidth - 80,
        y: window.innerHeight - 80,
      })
    }
    window.addEventListener("space-core", handler)
    return () => window.removeEventListener("space-core", handler)
  }, [])

  // Gentle floating animation
  useEffect(() => {
    if (!visible || flying) return
    let t = 0
    const baseX = window.innerWidth - 80
    const baseY = window.innerHeight - 80
    intervalRef.current = setInterval(() => {
      t += 0.05
      setPosition({
        x: baseX + Math.sin(t) * 8,
        y: baseY + Math.cos(t * 0.7) * 6,
      })
    }, 50)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [visible, flying])

  const handleClick = () => {
    if (flying) return
    setFlying(true)

    // Speak "SPAAACE!"
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const phrases = [
        "SPAAACE!",
        "I'm in space!",
        "Space space space!",
        "Gotta go to space!",
        "Space! So much space! Need to see it all!",
        "Oh oh oh! Space!",
      ]
      const phrase = phrases[Math.floor(Math.random() * phrases.length)]
      const utterance = new SpeechSynthesisUtterance(phrase)
      utterance.pitch = 1.8
      utterance.rate = 1.4
      utterance.volume = 0.8
      window.speechSynthesis.speak(utterance)
    }

    // Fly across the screen
    const startX = position.x
    const startY = position.y
    const angle = Math.random() * Math.PI * 2
    const speed = 15
    let frame = 0

    const flyInterval = setInterval(() => {
      frame++
      setPosition({
        x: startX + Math.cos(angle) * speed * frame,
        y: startY + Math.sin(angle) * speed * frame - frame * 2, // Slight upward arc
      })

      // Off screen? Done
      if (
        startX + Math.cos(angle) * speed * frame < -100 ||
        startX + Math.cos(angle) * speed * frame > window.innerWidth + 100 ||
        startY + Math.sin(angle) * speed * frame < -100 ||
        startY + Math.sin(angle) * speed * frame > window.innerHeight + 100
      ) {
        clearInterval(flyInterval)
        setVisible(false)
        setFlying(false)
      }
    }, 16)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, rotate: -360 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="fixed z-[9990] cursor-pointer select-none"
          style={{ left: position.x, top: position.y }}
          onClick={handleClick}
        >
          <div
            className={`w-14 h-14 rounded-full border-2 border-blue-400/60 bg-gray-900 flex items-center justify-center relative overflow-hidden ${
              flying ? "animate-spin" : ""
            }`}
            style={{
              boxShadow: "0 0 15px rgba(0,162,255,0.4), inset 0 0 10px rgba(0,162,255,0.1)",
            }}
          >
            {/* Core "eye" */}
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ boxShadow: "0 0 8px rgba(0,162,255,0.8)" }} />
            </div>
            {/* Ring details */}
            <div className="absolute inset-1 rounded-full border border-blue-400/20" />
          </div>
          {!flying && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 text-blue-400 font-mono text-[10px] whitespace-nowrap"
            >
              click me...
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
