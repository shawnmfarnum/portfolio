"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const turretQuotes = [
  "Are you still there?",
  "I see you.",
  "Target acquired.",
  "Hello, friend.",
  "There you are.",
  "Searching...",
  "Who's there?",
  "Sentry mode activated.",
  "I don't blame you.",
  "Dispensing product.",
]

export function PortalTurret() {
  const [visible, setVisible] = useState(false)
  const [quote, setQuote] = useState("")
  const [side, setSide] = useState<"left" | "right">("right")
  const lastTrigger = useRef(0)
  const triggeredSections = useRef(new Set<string>())

  useEffect(() => {
    const sections = ["#about", "#work", "#process", "#testimonials", "#contact"]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${entry.target.id}`
          if (
            entry.isIntersecting &&
            !triggeredSections.current.has(id) &&
            Date.now() - lastTrigger.current > 8000 // Don't trigger too often
          ) {
            // ~30% chance to trigger per section
            if (Math.random() > 0.7) {
              triggeredSections.current.add(id)
              lastTrigger.current = Date.now()
              setSide(Math.random() > 0.5 ? "right" : "left")
              setQuote(turretQuotes[Math.floor(Math.random() * turretQuotes.length)])
              setVisible(true)

              // Speak it
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel()
                const utterance = new SpeechSynthesisUtterance(
                  turretQuotes[Math.floor(Math.random() * turretQuotes.length)]
                )
                utterance.pitch = 1.6
                utterance.rate = 0.8
                utterance.volume = 0.4
                const voices = window.speechSynthesis.getVoices()
                const femVoice = voices.find(v => v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Karen"))
                if (femVoice) utterance.voice = femVoice
                window.speechSynthesis.speak(utterance)
              }

              setTimeout(() => setVisible(false), 3000)
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    // Observe sections after mount
    const timer = setTimeout(() => {
      sections.forEach((sel) => {
        const el = document.querySelector(sel)
        if (el) observer.observe(el)
      })
    }, 2000)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: side === "right" ? 80 : -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: side === "right" ? 80 : -80, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className={`fixed top-1/2 -translate-y-1/2 z-[9990] ${
            side === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className={`flex items-center gap-2 ${side === "left" ? "flex-row-reverse" : ""}`}>
            {/* Speech bubble */}
            <div className="bg-black/80 border border-red-500/30 px-3 py-2 max-w-[180px]">
              <p className="text-red-400 font-mono text-xs leading-relaxed">
                {quote}
              </p>
            </div>

            {/* Turret ASCII */}
            <div
              className={`font-mono text-[10px] leading-none text-red-400/80 whitespace-pre ${
                side === "right" ? "text-right" : "text-left"
              }`}
            >
              {side === "right" ? (
                <>
                  {"  ╱▔▔╲  "}<br />
                  {" ╱ ◉◉ ╲ "}<br />
                  {"╱______╲"}<br />
                  {"│      │"}<br />
                  {"│  ██  │"}<br />
                  {"╰──┤├──╯"}<br />
                  {"  ╱  ╲   "}<br />
                  {" ╱    ╲  "}
                </>
              ) : (
                <>
                  {"  ╱▔▔╲  "}<br />
                  {" ╱ ◉◉ ╲ "}<br />
                  {"╱______╲"}<br />
                  {"│      │"}<br />
                  {"│  ██  │"}<br />
                  {"╰──┤├──╯"}<br />
                  {"  ╱  ╲   "}<br />
                  {" ╱    ╲  "}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
