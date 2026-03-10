"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

function playBootSound() {
  try {
    const ctx = new AudioContext()
    const playNote = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = "square"
      gain.gain.value = 0.08
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + dur)
    }
    // Classic Game Boy "ba-ding!" two notes
    playNote(783.99, 0, 0.1) // G5
    playNote(1567.98, 0.15, 0.3) // G6
    setTimeout(() => ctx.close(), 1000)
  } catch {}
}

export function GameBoyBoot() {
  const [active, setActive] = useState(false)
  const [stage, setStage] = useState<"blank" | "logo-drop" | "ding" | "ready">("blank")

  useEffect(() => {
    const handler = () => {
      if (active) return
      setActive(true)
      setStage("blank")

      // Stage progression
      setTimeout(() => setStage("logo-drop"), 400)
      setTimeout(() => {
        setStage("ding")
        playBootSound()
      }, 1800)
      setTimeout(() => setStage("ready"), 2600)
      setTimeout(() => setActive(false), 4500)
    }
    window.addEventListener("gameboy-boot", handler)
    return () => window.removeEventListener("gameboy-boot", handler)
  }, [active])

  useEffect(() => {
    if (!active) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="gameboy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "#9bbc0f" }}
        >
          {/* Scan line overlay for CRT effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              background: "repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)",
            }}
          />

          <div className="text-center">
            {/* Nintendo logo drop animation */}
            {(stage === "logo-drop" || stage === "ding" || stage === "ready") && (
              <motion.div
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeIn" }}
              >
                {/* Nintendo-style logo bar (simplified) */}
                <div className="flex items-center justify-center mb-4">
                  <div
                    className="font-mono text-lg font-bold tracking-[0.15em] px-4 py-1 border-2"
                    style={{
                      color: "#0f380f",
                      borderColor: "#0f380f",
                    }}
                  >
                    Nintendo<span className="text-xs align-super">®</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Ding flash */}
            {stage === "ding" && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
                style={{ backgroundColor: "#e0f8d0" }}
              />
            )}

            {/* GAME BOY text */}
            {stage === "ready" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <p
                  className="font-mono text-4xl md:text-6xl font-bold tracking-[0.2em] mt-8"
                  style={{ color: "#0f380f" }}
                >
                  GAME BOY
                </p>
                <p
                  className="font-mono text-xs mt-2 tracking-[0.4em]"
                  style={{ color: "#306230" }}
                >
                  TM
                </p>
              </motion.div>
            )}

            {/* Decorative line */}
            {stage === "ready" && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-0.5 w-48 mx-auto mt-6"
                style={{ backgroundColor: "#306230" }}
              />
            )}
          </div>

          {/* Game Boy outer frame hint */}
          <div
            className="absolute inset-4 md:inset-16 border-4 rounded-lg pointer-events-none opacity-20"
            style={{ borderColor: "#0f380f" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
