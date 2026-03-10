"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface Achievement {
  event: string
  name: string
  description: string
  points: number
  icon: string
}

const ACHIEVEMENTS: Achievement[] = [
  { event: "barrel-roll", name: "Do a Barrel Roll!", description: "Performed a barrel roll", points: 10, icon: "🔄" },
  { event: "matrix-rain", name: "Follow the White Rabbit", description: "Entered the Matrix", points: 15, icon: "🐇" },
  { event: "let-there-be-light", name: "MY EYES!", description: "Let there be light", points: 10, icon: "☀️" },
  { event: "the-cake-is-a-lie", name: "The Cake Is a Lie", description: "Portal: Still Alive", points: 20, icon: "🎂" },
  { event: "companion-cube", name: "Companion Cube", description: "Summoned the weighted cube", points: 15, icon: "💗" },
  { event: "cave-johnson", name: "When Life Gives You Lemons", description: "Heard Cave Johnson speak", points: 15, icon: "🍋" },
  { event: "space-core", name: "SPAAACE!", description: "Launched the space core", points: 10, icon: "🌌" },
  { event: "rick-roll", name: "Never Gonna Give You Up", description: "Got Rick Rolled", points: 20, icon: "🕺" },
  { event: "feel-good-inc", name: "Feel Good Inc.", description: "Ha ha ha ha ha ha", points: 15, icon: "🏝️" },
  { event: "gorillaz-visualizer", name: "Demon Days", description: "Watched the visualizer", points: 10, icon: "🎵" },
  { event: "dare-head", name: "It's DARE!", description: "It's coming up!", points: 10, icon: "🎤" },
  { event: "head-like-a-hole", name: "Head Like a Hole", description: "Black as your soul", points: 15, icon: "🔩" },
  { event: "nin-only", name: "Only", description: "There is no you, there is only me", points: 15, icon: "👁" },
  { event: "nin-alive", name: "As Alive", description: "Drifted through Ghosts VI", points: 20, icon: "🫁" },
  { event: "gameboy-boot", name: "Press Start", description: "Game Boy boot sequence", points: 10, icon: "🎮" },
  { event: "snake-game", name: "Sssssnake", description: "Played Snake", points: 15, icon: "🐍" },
  { event: "space-invaders", name: "Invaders Must Die", description: "Defended Earth", points: 15, icon: "👾" },
  { event: "pong-game", name: "Classic Pong", description: "Old school gaming", points: 15, icon: "🏓" },
  { event: "breakout-game", name: "Break Free", description: "Smashed some bricks", points: 15, icon: "🧱" },
  { event: "asteroids-game", name: "Space Cowboy", description: "Destroyed asteroids", points: 15, icon: "☄️" },
]

const MILESTONES = [
  { count: 5, name: "Easter Egg Hunter", description: "Found 5 easter eggs", points: 50, icon: "🥚" },
  { count: 10, name: "Secret Agent", description: "Found 10 easter eggs", points: 100, icon: "🕵️" },
  { count: 15, name: "Master Hacker", description: "Found 15 easter eggs", points: 150, icon: "👨‍💻" },
  { count: 20, name: "Completionist", description: "Found ALL easter eggs!", points: 200, icon: "🏆" },
]

const STORAGE_KEY = "portfolio-achievements"

function getUnlocked(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

function saveUnlocked(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {}
}

interface ToastData {
  id: string
  name: string
  description: string
  points: number
  icon: string
}

export function AchievementSystem() {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const unlockedRef = useRef<Set<string>>(new Set())
  const milestonesRef = useRef<Set<number>>(new Set())

  // Load from localStorage on mount
  useEffect(() => {
    unlockedRef.current = getUnlocked()
  }, [])

  const showToast = useCallback((toast: ToastData) => {
    setToasts((prev) => [...prev, toast])
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id))
    }, 4000)
  }, [])

  const checkMilestones = useCallback((count: number) => {
    for (const m of MILESTONES) {
      if (count >= m.count && !milestonesRef.current.has(m.count)) {
        milestonesRef.current.add(m.count)
        setTimeout(() => {
          showToast({
            id: `milestone-${m.count}`,
            name: m.name,
            description: m.description,
            points: m.points,
            icon: m.icon,
          })
        }, 1500) // Slight delay after the regular achievement
      }
    }
  }, [showToast])

  // Listen for all achievement events
  useEffect(() => {
    const handlers: Array<{ event: string; handler: () => void }> = []

    for (const achievement of ACHIEVEMENTS) {
      const handler = () => {
        if (unlockedRef.current.has(achievement.event)) return

        unlockedRef.current.add(achievement.event)
        saveUnlocked(unlockedRef.current)

        // Play achievement sound
        try {
          const ctx = new AudioContext()
          const playNote = (freq: number, start: number, dur: number) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.frequency.value = freq
            osc.type = "sine"
            gain.gain.setValueAtTime(0.06, ctx.currentTime + start)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
            osc.start(ctx.currentTime + start)
            osc.stop(ctx.currentTime + start + dur)
          }
          // Xbox-style "bloop bloop" achievement sound
          playNote(587.33, 0, 0.15)
          playNote(880, 0.12, 0.15)
          playNote(1174.66, 0.24, 0.3)
          setTimeout(() => ctx.close(), 1000)
        } catch {}

        showToast({
          id: achievement.event,
          name: achievement.name,
          description: achievement.description,
          points: achievement.points,
          icon: achievement.icon,
        })

        checkMilestones(unlockedRef.current.size)
      }

      window.addEventListener(achievement.event, handler)
      handlers.push({ event: achievement.event, handler })
    }

    return () => {
      for (const { event, handler } of handlers) {
        window.removeEventListener(event, handler)
      }
    }
  }, [showToast, checkMilestones])

  return (
    <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 400, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 400, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="pointer-events-auto"
          >
            {/* Xbox 360-style achievement toast */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-green-500/40 px-4 py-3 min-w-[320px] shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              {/* Achievement icon */}
              <div className="w-12 h-12 bg-green-900/40 border border-green-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                {toast.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-green-400 font-mono text-[10px] uppercase tracking-[0.3em]">
                  🔓 Achievement Unlocked
                </p>
                <p className="text-white font-mono text-sm font-bold truncate">
                  {toast.name}
                </p>
                <p className="text-gray-400 font-mono text-xs truncate">
                  {toast.description}
                </p>
              </div>

              {/* Points */}
              <div className="text-right flex-shrink-0">
                <p className="text-green-400 font-mono text-lg font-bold">
                  {toast.points}
                </p>
                <p className="text-green-400/50 font-mono text-[9px] uppercase">
                  pts
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
