"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

const COLS = 20
const ROWS = 20
const CELL = 16
const W = COLS * CELL
const H = ROWS * CELL
const TICK_MS = 120

type Dir = "up" | "down" | "left" | "right"
type Pos = { x: number; y: number }

function beep(freq: number, ms: number) {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.frequency.value = freq; o.type = "square"; g.gain.value = 0.06
    o.start(); setTimeout(() => { o.stop(); ctx.close() }, ms)
  } catch {}
}

export function SnakeGame() {
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<"coin" | "play" | "over">("coin")
  const [score, setScore] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const lastTickRef = useRef(0)
  const dirRef = useRef<Dir>("right")
  const nextDirRef = useRef<Dir>("right")
  const snakeRef = useRef<Pos[]>([])
  const foodRef = useRef<Pos>({ x: 10, y: 10 })
  const gameOverRef = useRef(false)

  const resetGame = useCallback(() => {
    const cx = Math.floor(COLS / 2)
    const cy = Math.floor(ROWS / 2)
    snakeRef.current = [
      { x: cx, y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ]
    dirRef.current = "right"
    nextDirRef.current = "right"
    gameOverRef.current = false
    setScore(0)
    placeFood()
  }, [])

  function placeFood() {
    const snake = snakeRef.current
    let pos: Pos
    do {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
    } while (snake.some(s => s.x === pos.x && s.y === pos.y))
    foodRef.current = pos
  }

  // Trigger event
  useEffect(() => {
    const handler = () => {
      setActive(true)
      setPhase("coin")
    }
    window.addEventListener("snake-game", handler)
    return () => window.removeEventListener("snake-game", handler)
  }, [])

  // Key handling
  useEffect(() => {
    if (!active) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setActive(false); return }
      if (phase === "coin" && e.key === "Enter") {
        resetGame()
        setPhase("play")
        return
      }
      if (phase === "over" && e.key === "Enter") {
        resetGame()
        setPhase("play")
        return
      }
      if (phase === "play") {
        const dir = dirRef.current
        if ((e.key === "ArrowUp" || e.key === "w") && dir !== "down") nextDirRef.current = "up"
        if ((e.key === "ArrowDown" || e.key === "s") && dir !== "up") nextDirRef.current = "down"
        if ((e.key === "ArrowLeft" || e.key === "a") && dir !== "right") nextDirRef.current = "left"
        if ((e.key === "ArrowRight" || e.key === "d") && dir !== "left") nextDirRef.current = "right"
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [active, phase, resetGame])

  // Game loop
  useEffect(() => {
    if (!active || phase !== "play") return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    lastTickRef.current = 0

    const loop = (time: number) => {
      if (gameOverRef.current) return

      // Tick-based movement
      if (time - lastTickRef.current >= TICK_MS) {
        lastTickRef.current = time
        dirRef.current = nextDirRef.current

        const snake = snakeRef.current
        const head = { ...snake[0] }
        const d = dirRef.current
        if (d === "up") head.y--
        if (d === "down") head.y++
        if (d === "left") head.x--
        if (d === "right") head.x++

        // Wall collision
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
          gameOverRef.current = true
          beep(150, 300)
          setPhase("over")
          return
        }

        // Self collision
        if (snake.some(s => s.x === head.x && s.y === head.y)) {
          gameOverRef.current = true
          beep(150, 300)
          setPhase("over")
          return
        }

        snake.unshift(head)

        // Food check
        const food = foodRef.current
        if (head.x === food.x && head.y === food.y) {
          beep(880, 50)
          setScore(prev => prev + 1)
          placeFood()
        } else {
          snake.pop()
        }
      }

      // Draw
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, W, H)

      // Grid lines (subtle)
      ctx.strokeStyle = "rgba(0, 255, 0, 0.05)"
      ctx.lineWidth = 0.5
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke()
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke()
      }

      // Food
      const food = foodRef.current
      ctx.fillStyle = "#ff3333"
      ctx.shadowColor = "#ff3333"
      ctx.shadowBlur = 8
      ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4)

      // Snake
      ctx.shadowColor = "#00ff00"
      ctx.shadowBlur = 6
      const snake = snakeRef.current
      snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? "#00ff00" : `rgba(0, ${200 - i * 3}, 0, 1)`
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
      })

      ctx.shadowBlur = 0
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, phase])

  const close = () => { setActive(false); cancelAnimationFrame(rafRef.current) }

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal chrome */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-green-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-green-400/60 uppercase tracking-wider">
                  snake.exe
                </span>
              </div>
              <button onClick={close} className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors">
                [ESC] QUIT
              </button>
            </div>

            {/* Game area */}
            <div className="relative border border-green-500/30 border-t-0 bg-black">
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                className="block"
                style={{ imageRendering: "pixelated" }}
              />

              {phase === "coin" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                  <p className="text-green-400 font-mono text-3xl mb-2">🐍 SNAKE</p>
                  <motion.p
                    animate={{ opacity: [1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                    className="text-green-400 font-mono text-lg"
                  >
                    INSERT COIN
                  </motion.p>
                  <p className="text-green-400/40 font-mono text-xs mt-4">Press ENTER to start</p>
                  <p className="text-green-400/30 font-mono text-xs mt-1">Arrow keys / WASD to move</p>
                </div>
              )}

              {phase === "over" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                  <p className="text-red-400 font-mono text-3xl mb-2">GAME OVER</p>
                  <p className="text-white font-mono text-lg">Score: {score}</p>
                  <p className="text-green-400/40 font-mono text-xs mt-4">ENTER to retry • ESC to quit</p>
                </div>
              )}
            </div>

            {/* Score bar */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900 border border-green-500/30 border-t-0">
              <span className="text-xs font-mono text-green-400/50">SCORE: {score}</span>
              <span className="text-xs font-mono text-green-400/30">↑↓←→ MOVE</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
