"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export function LightFlash() {
  const [stage, setStage] = useState<"idle" | "flash" | "scream" | "recover">("idle")

  useEffect(() => {
    const handler = () => {
      if (stage !== "idle") return
      setStage("flash")
      
      // Brief white flash
      setTimeout(() => setStage("scream"), 300)
      // Show the message
      setTimeout(() => setStage("recover"), 2000)
      // Back to normal
      setTimeout(() => setStage("idle"), 2500)
    }

    window.addEventListener("let-there-be-light", handler)
    return () => window.removeEventListener("let-there-be-light", handler)
  }, [stage])

  return (
    <AnimatePresence>
      {stage === "flash" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-white"
        />
      )}
      {stage === "scream" && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 200 }}
            className="text-center"
          >
            <p className="text-6xl md:text-8xl font-bold text-black font-mono">
              MY EYES!
            </p>
            <p className="text-lg text-gray-600 font-mono mt-4">
              ...returning to dark mode
            </p>
          </motion.div>
        </motion.div>
      )}
      {stage === "recover" && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-white"
        />
      )}
    </AnimatePresence>
  )
}
