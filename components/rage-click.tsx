"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

// Warcraft peon-style escalating responses
// Stage 0: Calm acknowledgements (1-3 rapid clicks)
// Stage 1: Getting annoyed (4-6 rapid clicks)
// Stage 2: Full rage (7+ rapid clicks)
const responses = {
  calm: [
    { text: "Yes?", pitch: 0.8, rate: 0.9 },
    { text: "Hmm?", pitch: 0.8, rate: 0.9 },
    { text: "What is it?", pitch: 0.8, rate: 0.85 },
    { text: "Yes, my lord?", pitch: 0.75, rate: 0.85 },
    { text: "Your command?", pitch: 0.8, rate: 0.9 },
  ],
  annoyed: [
    { text: "Why do you keep touching me?", pitch: 0.85, rate: 1.0 },
    { text: "Stop poking me!", pitch: 0.9, rate: 1.1 },
    { text: "What is it now?", pitch: 0.9, rate: 1.05 },
    { text: "That's it, I'm not moving.", pitch: 0.85, rate: 1.0 },
    { text: "Are you still clicking?", pitch: 0.9, rate: 1.05 },
  ],
  rage: [
    { text: "WHAT?!", pitch: 1.2, rate: 1.4 },
    { text: "STOP IT!", pitch: 1.3, rate: 1.5 },
    { text: "ENOUGH ALREADY!", pitch: 1.2, rate: 1.3 },
    { text: "I SAID STOP POKING ME!", pitch: 1.1, rate: 1.3 },
    { text: "THAT DOES IT!", pitch: 1.3, rate: 1.5 },
  ],
}

function speak(text: string, pitch: number, rate: number) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  // Cancel any current speech
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.pitch = pitch
  utterance.rate = rate
  utterance.volume = 0.8
  // Try to find a deeper/gruffer voice
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v => v.name.includes("Daniel") || v.name.includes("Alex") || v.name.includes("Fred"))
  if (preferred) utterance.voice = preferred
  window.speechSynthesis.speak(utterance)
}

export function RageClick() {
  const [message, setMessage] = useState<string | null>(null)
  const [stage, setStage] = useState<"calm" | "annoyed" | "rage">("calm")
  const clicksRef = useRef<number[]>([])
  const cooldownRef = useRef(false)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)

  const triggerResponse = useCallback((clickCount: number) => {
    let currentStage: "calm" | "annoyed" | "rage"
    if (clickCount >= 7) currentStage = "rage"
    else if (clickCount >= 4) currentStage = "annoyed"
    else currentStage = "calm"

    setStage(currentStage)

    const pool = responses[currentStage]
    const response = pool[Math.floor(Math.random() * pool.length)]

    setMessage(response.text)
    speak(response.text, response.pitch, response.rate)

    // Clear any existing hide timer
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      setMessage(null)
    }, 2500)
  }, [])

  useEffect(() => {
    const handleClick = () => {
      const now = Date.now()
      clicksRef.current.push(now)

      // Keep only clicks from the last 3 seconds
      clicksRef.current = clicksRef.current.filter(t => now - t < 3000)

      const count = clicksRef.current.length

      // Trigger at 3+ rapid clicks (like Warcraft)
      if (count >= 3 && !cooldownRef.current) {
        cooldownRef.current = true
        triggerResponse(count)
        // Short cooldown so speech doesn't overlap
        setTimeout(() => { cooldownRef.current = false }, 800)
      }
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [triggerResponse])

  const borderColor = stage === "rage"
    ? "border-chart-1/60 shadow-chart-1/20"
    : stage === "annoyed"
    ? "border-chart-4/40 shadow-chart-4/10"
    : "border-chart-2/40 shadow-chart-2/10"

  const textColor = stage === "rage"
    ? "text-chart-1"
    : stage === "annoyed"
    ? "text-chart-4"
    : "text-chart-2"

  const dotColor = stage === "rage"
    ? "bg-chart-1"
    : stage === "annoyed"
    ? "bg-chart-4"
    : "bg-chart-2"

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            ...(stage === "rage" ? { x: [0, -4, 4, -4, 4, 0] } : {})
          }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 bg-card border shadow-lg ${borderColor}`}
        >
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 terminal-dot animate-pulse ${dotColor}`} />
            <p className={`font-mono text-sm whitespace-nowrap ${textColor}`}>
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
