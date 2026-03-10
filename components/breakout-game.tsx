"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

const W = 480
const H = 400
const BRICK_COLS = 10
const BRICK_ROWS = 6
const BRICK_W = 40
const BRICK_H = 14
const BRICK_GAP = 4
const PADDLE_W = 64
const PADDLE_H = 10
const BALL_SIZE = 6
const PADDLE_SPEED = 6
const BALL_BASE_SPEED = 4

const BRICK_COLORS = ["#ff3333", "#ff6633", "#ffaa33", "#ffff33", "#33ff33", "#33ffff"]

function beep(freq: number, ms: number) {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.frequency.value = freq; o.type = "square"; g.gain.value = 0.05
    o.start(); setTimeout(() => { o.stop(); ctx.close() }, ms)
  } catch {}
}

interface Brick { x: number; y: number; alive: boolean; color: string; row: number }

interface GameState {
  paddleX: number
  ballX: number
  ballY: number
  ballVx: number
  ballVy: number
  bricks: Brick[]
  score: number
  lives: number
  launched: boolean
}

export function BreakoutGame() {
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<"coin" | "play" | "over" | "win">("coin")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const keysRef = useRef<Set<string>>(new Set())
  const gameRef = useRef<GameState | null>(null)

  const initBricks = useCallback((): Brick[] => {
    const bricks: Brick[] = []
    const totalW = BRICK_COLS * (BRICK_W + BRICK_GAP) - BRICK_GAP
    const startX = (W - totalW) / 2
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: startX + c * (BRICK_W + BRICK_GAP),
          y: 40 + r * (BRICK_H + BRICK_GAP),
          alive: true,
          color: BRICK_COLORS[r],
          row: r,
        })
      }
    }
    return bricks
  }, [])

  const resetGame = useCallback(() => {
    gameRef.current = {
      paddleX: W / 2 - PADDLE_W / 2,
      ballX: W / 2 - BALL_SIZE / 2,
      ballY: H - 50,
      ballVx: BALL_BASE_SPEED * (Math.random() > 0.5 ? 1 : -1),
      ballVy: -BALL_BASE_SPEED,
      bricks: initBricks(),
      score: 0,
      lives: 3,
      launched: false,
    }
    setScore(0)
    setLives(3)
  }, [initBricks])

  useEffect(() => {
    const handler = () => { setActive(true); setPhase("coin") }
    window.addEventListener("breakout-game", handler)
    return () => window.removeEventListener("breakout-game", handler)
  }, [])

  useEffect(() => {
    if (!active) return
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setActive(false); return }
      if ((phase === "coin" || phase === "over" || phase === "win") && e.key === "Enter") { resetGame(); setPhase("play"); return }
      keysRef.current.add(e.key)
    }
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key)
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up) }
  }, [active, phase, resetGame])

  useEffect(() => {
    if (!active || phase !== "play") return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const loop = () => {
      const g = gameRef.current!
      const keys = keysRef.current

      // Paddle movement
      if (keys.has("ArrowLeft") || keys.has("a")) g.paddleX = Math.max(0, g.paddleX - PADDLE_SPEED)
      if (keys.has("ArrowRight") || keys.has("d")) g.paddleX = Math.min(W - PADDLE_W, g.paddleX + PADDLE_SPEED)

      // Launch ball
      if (!g.launched) {
        g.ballX = g.paddleX + PADDLE_W / 2 - BALL_SIZE / 2
        g.ballY = H - 50
        if (keys.has(" ") || keys.has("ArrowUp")) {
          g.launched = true
          g.ballVx = BALL_BASE_SPEED * (Math.random() > 0.5 ? 1 : -1)
          g.ballVy = -BALL_BASE_SPEED
        }
      } else {
        // Ball movement
        g.ballX += g.ballVx
        g.ballY += g.ballVy

        // Wall bounces
        if (g.ballX <= 0 || g.ballX + BALL_SIZE >= W) {
          g.ballVx = -g.ballVx
          g.ballX = Math.max(0, Math.min(W - BALL_SIZE, g.ballX))
          beep(300, 20)
        }
        if (g.ballY <= 0) {
          g.ballVy = -g.ballVy
          g.ballY = 0
          beep(300, 20)
        }

        // Ball falls below paddle
        if (g.ballY + BALL_SIZE >= H) {
          g.lives--
          setLives(g.lives)
          beep(150, 200)
          if (g.lives <= 0) {
            setPhase("over")
            return
          }
          g.launched = false
        }

        // Paddle collision
        if (
          g.ballY + BALL_SIZE >= H - 35 &&
          g.ballY + BALL_SIZE <= H - 25 &&
          g.ballX + BALL_SIZE >= g.paddleX &&
          g.ballX <= g.paddleX + PADDLE_W
        ) {
          const hitPos = (g.ballX + BALL_SIZE / 2 - g.paddleX) / PADDLE_W
          g.ballVx = (hitPos - 0.5) * BALL_BASE_SPEED * 2.5
          g.ballVy = -Math.abs(g.ballVy)
          // Slight speed increase
          const speed = Math.sqrt(g.ballVx * g.ballVx + g.ballVy * g.ballVy)
          const maxSpeed = 8
          if (speed > maxSpeed) {
            g.ballVx = (g.ballVx / speed) * maxSpeed
            g.ballVy = (g.ballVy / speed) * maxSpeed
          }
          beep(600, 30)
        }

        // Brick collision
        g.bricks.forEach(b => {
          if (!b.alive) return
          if (
            g.ballX + BALL_SIZE > b.x &&
            g.ballX < b.x + BRICK_W &&
            g.ballY + BALL_SIZE > b.y &&
            g.ballY < b.y + BRICK_H
          ) {
            b.alive = false
            g.score += (BRICK_ROWS - b.row) * 10
            setScore(g.score)
            beep(440 + b.row * 80, 40)

            // Determine bounce direction
            const overlapLeft = g.ballX + BALL_SIZE - b.x
            const overlapRight = b.x + BRICK_W - g.ballX
            const overlapTop = g.ballY + BALL_SIZE - b.y
            const overlapBottom = b.y + BRICK_H - g.ballY
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

            if (minOverlap === overlapTop || minOverlap === overlapBottom) {
              g.ballVy = -g.ballVy
            } else {
              g.ballVx = -g.ballVx
            }
          }
        })

        // Win check
        if (g.bricks.every(b => !b.alive)) {
          setPhase("win")
          beep(880, 300)
          return
        }
      }

      // Draw
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, W, H)

      // Bricks
      g.bricks.forEach(b => {
        if (!b.alive) return
        ctx.fillStyle = b.color
        ctx.shadowColor = b.color
        ctx.shadowBlur = 4
        ctx.fillRect(b.x, b.y, BRICK_W, BRICK_H)
        // Highlight
        ctx.fillStyle = "rgba(255,255,255,0.2)"
        ctx.fillRect(b.x, b.y, BRICK_W, 2)
      })

      // Paddle
      ctx.fillStyle = "#00ffff"
      ctx.shadowColor = "#00ffff"
      ctx.shadowBlur = 8
      ctx.fillRect(g.paddleX, H - 35, PADDLE_W, PADDLE_H)

      // Ball
      ctx.fillStyle = "#fff"
      ctx.shadowColor = "#fff"
      ctx.shadowBlur = 10
      ctx.fillRect(g.ballX, g.ballY, BALL_SIZE, BALL_SIZE)

      // "Space to launch" text
      if (!g.launched) {
        ctx.shadowBlur = 0
        ctx.fillStyle = "rgba(255,255,255,0.4)"
        ctx.font = "12px monospace"
        ctx.textAlign = "center"
        ctx.fillText("SPACE to launch", W / 2, H - 60)
        ctx.textAlign = "start"
      }

      // Lives
      ctx.shadowBlur = 0
      for (let i = 0; i < g.lives; i++) {
        ctx.fillStyle = "#00ffff"
        ctx.fillRect(10 + i * 18, H - 12, 10, 6)
      }

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
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-cyan-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-cyan-400/60 uppercase tracking-wider">breakout.exe</span>
              </div>
              <button onClick={close} className="text-xs font-mono text-white/30 hover:text-white/60">[ESC] QUIT</button>
            </div>

            <div className="relative border border-cyan-500/30 border-t-0 bg-black">
              <canvas ref={canvasRef} width={W} height={H} className="block" />

              {phase === "coin" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                  <p className="text-cyan-400 font-mono text-3xl mb-2">🧱 BREAKOUT</p>
                  <motion.p animate={{ opacity: [1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }} className="text-cyan-400 font-mono text-lg">INSERT COIN</motion.p>
                  <p className="text-cyan-400/40 font-mono text-xs mt-4">Press ENTER to start</p>
                  <p className="text-cyan-400/30 font-mono text-xs mt-1">←→ move • SPACE launch</p>
                </div>
              )}

              {phase === "over" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                  <p className="text-red-400 font-mono text-3xl mb-2">GAME OVER</p>
                  <p className="text-white font-mono">Score: {score}</p>
                  <p className="text-cyan-400/40 font-mono text-xs mt-4">ENTER to retry • ESC to quit</p>
                </div>
              )}

              {phase === "win" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                  <p className="text-yellow-400 font-mono text-3xl mb-2">🎉 YOU WIN!</p>
                  <p className="text-white font-mono">Score: {score}</p>
                  <p className="text-cyan-400/40 font-mono text-xs mt-4">ENTER to play again • ESC to quit</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900 border border-cyan-500/30 border-t-0">
              <span className="text-xs font-mono text-cyan-400/50">SCORE: {score}</span>
              <span className="text-xs font-mono text-cyan-400/30">LIVES: {lives}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
