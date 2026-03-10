"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const caveJohnsonQuotes = [
  {
    text: "When life gives you lemons, don't make lemonade. Make life take the lemons back! Get mad! I don't want your damn lemons! What am I supposed to do with these?!",
    followUp: "Demand to see life's manager! Make life rue the day it thought it could give Cave Johnson lemons!"
  },
  {
    text: "Alright, I've been thinking. When life gives you lemons? Don't make lemonade. Make life take the lemons back!",
    followUp: "I'm gonna get my engineers to invent a combustible lemon that burns your house down!"
  },
  {
    text: "Science isn't about WHY. It's about WHY NOT. Why is so much of our science dangerous? Why not marry safe science if you love it so much?",
    followUp: "In fact, why not invent a special safety door that won't hit you in the butt on the way out, because you are fired."
  },
  {
    text: "All right, I've been thinking. When life gives you lemons? Don't make lemonade.",
    followUp: "I'm the man who's gonna burn your house down! With the lemons! I'm gonna get my engineers to invent a combustible lemon that burns your house down!"
  },
  {
    text: "The bean counters told me we literally could not afford to buy seven dollars' worth of moon rocks, much less seventy million.",
    followUp: "Bought 'em anyway. Ground 'em up, mixed 'em into a gel. And guess what? Ground-up moon rocks are pure poison."
  },
  {
    text: "If you're allergic to a thing, it's best not to put that thing in your mouth, particularly if the thing is cats.",
    followUp: "— Cave Johnson, we're done here."
  },
  {
    text: "Just a heads up: We're gonna have a superconductor turned up full blast and pointed at you for the duration of this next test.",
    followUp: "I'll be honest, we're throwing science at the wall here to see what sticks. No idea what it'll do."
  },
]

export function CaveJohnson() {
  const [active, setActive] = useState(false)
  const [quoteData, setQuoteData] = useState(caveJohnsonQuotes[0])
  const [showFollowUp, setShowFollowUp] = useState(false)

  useEffect(() => {
    const handler = () => {
      const randomQuote = caveJohnsonQuotes[Math.floor(Math.random() * caveJohnsonQuotes.length)]
      setQuoteData(randomQuote)
      setShowFollowUp(false)
      setActive(true)

      // Speak it
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(randomQuote.text)
        utterance.pitch = 0.7
        utterance.rate = 1.05
        utterance.volume = 0.8
        const voices = window.speechSynthesis.getVoices()
        const deep = voices.find(v => v.name.includes("Daniel") || v.name.includes("Alex") || v.name.includes("Fred"))
        if (deep) utterance.voice = deep

        utterance.onend = () => {
          setShowFollowUp(true)
          // Speak follow-up after a beat
          setTimeout(() => {
            const followUp = new SpeechSynthesisUtterance(randomQuote.followUp)
            followUp.pitch = 0.75
            followUp.rate = 1.15
            followUp.volume = 0.9
            if (deep) followUp.voice = deep
            window.speechSynthesis.speak(followUp)
          }, 500)
        }

        window.speechSynthesis.speak(utterance)
      } else {
        setTimeout(() => setShowFollowUp(true), 3000)
      }

      setTimeout(() => setActive(false), 12000)
    }

    window.addEventListener("cave-johnson", handler)
    return () => window.removeEventListener("cave-johnson", handler)
  }, [])

  const handleClose = () => {
    window.speechSynthesis?.cancel()
    setActive(false)
  }

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-6"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="max-w-2xl w-full bg-gray-950 border border-orange-500/30 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-orange-950/30 border-b border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-orange-400/40 flex items-center justify-center bg-orange-950/50">
                  <span className="text-orange-400 text-xs font-bold">CJ</span>
                </div>
                <div>
                  <p className="text-orange-400 font-mono text-sm font-bold">Cave Johnson</p>
                  <p className="text-orange-400/40 font-mono text-[10px] uppercase tracking-widest">CEO, Aperture Science</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-orange-400/30 hover:text-orange-400 transition-colors font-mono text-xs"
              >
                [×]
              </button>
            </div>

            {/* Quote content */}
            <div className="p-6 space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/90 font-mono text-sm md:text-base leading-relaxed"
              >
                &ldquo;{quoteData.text}&rdquo;
              </motion.p>

              <AnimatePresence>
                {showFollowUp && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-orange-400 font-mono text-sm md:text-base leading-relaxed font-bold"
                  >
                    &ldquo;{quoteData.followUp}&rdquo;
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-orange-500/20 flex items-center justify-between">
              <span className="text-orange-400/20 font-mono text-[10px]">
                APERTURE SCIENCE MOTIVATIONAL DIVISION
              </span>
              <span className="text-orange-400/20 font-mono text-[10px]">
                🍋 LEMONS.EXE
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
