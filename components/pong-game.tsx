"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

const W = 480
const H = 320
const PADDLE_W = 10
const PADDLE_H = 60
const BALL_SIZE = 8
const PADDLE_SPEED = 5
const WIN_SCORE = 5

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

interface GameState {
  playerY: number
  aiY: number
  ballX: number
  ballY: number
  ballVx: number
  ballVy: number
  playerScore: number
  aiScore: number
  serving: boolean
  serveTimer: number
}

export function PongGame() {
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<"coin" | "play" | "over">("coin")
  const [displayScore, setDisplayScore] = useState({ player: 0, ai: 0 })
  const [winner, setWinner] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const keysRef = useRef<Set<string>>(new Set())
  const gameRef = useRef<GameState>({
    playerY: H / 2 - PADDLE_H / 2,
    aiY: H / 2 - PADDLE_H / 2,
    ballX: W / 2,
    ballY: H / 2,
    ballVx: 4,
    ballVy: 2,
    playerScore: 0,
    aiScore: 0,
    serving: true,
    serveTimer: 60,
  })

  const resetBall = useCallback((direction: number) => {
    const g = gameRef.current
    g.ballX = W / 2
    g.ballY = H / 2
    g.ballVx = 4 * direction
    g.ballVy = (Math.random() - 0.5) * 4
    g.serving = true
    g.serveTimer = 60
  }, [])

  const resetGame = useCallback(() => {
    const g = gameRef.current
    g.playerY = H / 2 - PADDLE_H / 2
    g.aiY = H / 2 - PADDLE_H / 2
    g.playerScore = 0
    g.aiScore = 0
    setDisplayScore({ player: 0, ai: 0 })
    setWinner("")
    resetBall(1)
  }, [resetBall])

  // Trigger event
  useEffect(() => {
    const handler = () => { setActive(true); setPhase("coin") }
    window.addEventListener("pong-game", handler)
    return () => window.removeEventListener("pong-game", handler)
  }, [])

  // Key tracking
  useEffect(() => {
    if (!active) return
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setActive(false); return }
      if (phase === "coin" && e.key === "Enter") { resetGame(); setPhase("play"); return }
      if (phase === "over" && e.key === "Enter") { resetGame(); setPhase("play"); return }
      keysRef.current.add(e.key)
    }
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key)
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up) }
  }, [active, phase, resetGame])

  // Game loop
  useEffect(() => {
    if (!active || phase !== "play") return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const loop = () => {
      const g = gameRef.current
      const keys = keysRef.current

      // Serve delay
      if (g.serving) {
        g.serveTimer--
        if (g.serveTimer <= 0) g.serving = false
      }

      // Player paddle movement
      if (keys.has("ArrowUp") || keys.has("w")) g.playerY = Math.max(0, g.playerY - PADDLE_SPEED)
      if (keys.has("ArrowDown") || keys.has("s")) g.playerY = Math.min(H - PADDLE_H, g.playerY + PADDLE_SPEED)

      // AI paddle movement (tracks ball with slight lag)
      const aiCenter = g.aiY + PADDLE_H / 2
      const aiSpeed = 3.5
      if (g.ballVx > 0) {
        if (aiCenter < g.ballY - 10) g.aiY += aiSpeed
        if (aiCenter > g.ballY + 10) g.aiY -= aiSpeed
      } else {
        // Return to center when ball moving away
        if (aiCenter < H / 2 - 5) g.aiY += aiSpeed * 0.5
        if (aiCenter > H / 2 + 5) g.aiY -= aiSpeed * 0.5
      }
      g.aiY = Math.max(0, Math.min(H - PADDLE_H, g.aiY))

      // Ball movement
      if (!g.serving) {
        g.ballX += g.ballVx
        g.ballY += g.ballVy

        // Top/bottom bounce
        if (g.ballY <= 0 || g.ballY >= H - BALL_SIZE) {
          g.ballVy = -g.ballVy
          g.ballY = Math.max(0, Math.min(H - BALL_SIZE, g.ballY))
          beep(300, 30)
        }

        // Player paddle collision (left)
        if (
          g.ballX <= 20 + PADDLE_W &&
          g.ballX >= 20 &&
          g.ballY + BALL_SIZE >= g.playerY &&
          g.ballY <= g.playerY + PADDLE_H
        ) {
          g.ballVx = Math.abs(g.ballVx) * 1.05
          const hitPos = (g.ballY + BALL_SIZE / 2 - g.playerY) / PADDLE_H
          g.ballVy = (hitPos - 0.5) * 8
          beep(600, 30)
        }

        // AI paddle collision (right)
        if (
          g.ballX + BALL_SIZE >= W - 20 - PADDLE_W &&
          g.ballX + BALL_SIZE <= W - 20 &&
          g.ballY + BALL_SIZE >= g.aiY &&
          g.ballY <= g.aiY + PADDLE_H
        ) {
          g.ballVx = -Math.abs(g.ballVx) * 1.05
          const hitPos = (g.ballY + BALL_SIZE / 2 - g.aiY) / PADDLE_H
          g.ballVy = (hitPos - 0.5) * 8
          beep(600, 30)
        }

        // Score (ball past paddles)
        if (g.ballX < 0) {
          g.aiScore++
          setDisplayScore({ player: g.playerScore, ai: g.aiScore })
          if (g.aiScore >= WIN_SCORE) {
            setWinner("CPU")
            beep(200, 500)
            setPhase("over")
            return
          }
          beep(150, 200)
          resetBall(1)
        }
        if (g.ballX > W) {
          g.playerScore++
          setDisplayScore({ player: g.playerScore, ai: g.aiScore })
          if (g.playerScore >= WIN_SCORE) {
            setWinner("You")
            beep(880, 300)
            setPhase("over")
            return
          }
          beep(150, 200)
          resetBall(-1)
        }

        // Cap ball speed
        g.ballVx = Math.sign(g.ballVx) * Math.min(Math.abs(g.ballVx), 10)
      }

      // Draw
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, W, H)

      // Center line
      ctx.strokeStyle = "rgba(255,255,255,0.2)"
      ctx.setLineDash([8, 8])
      ctx.beginPath()
      ctx.moveTo(W / 2, 0)
      ctx.lineTo(W / 2, H)
      ctx.stroke()
      ctx.setLineDash([])

      // Scores
      ctx.fillStyle = "rgba(255,255,255,0.3)"
      ctx.font = "48px monospace"
      ctx.textAlign = "center"
      ctx.fillText(String(g.playerScore), W / 4, 60)
      ctx.fillText(String(g.aiScore), (3 * W) / 4, 60)

      // Player paddle
      ctx.fillStyle = "#00ff00"
      ctx.shadowColor = "#00ff00"
      ctx.shadowBlur = 8
      ctx.fillRect(20, g.playerY, PADDLE_W, PADDLE_H)

      // AI paddle
      ctx.fillStyle = "#ff3333"
      ctx.shadowColor = "#ff3333"
      ctx.fillRect(W - 20 - PADDLE_W, g.aiY, PADDLE_W, PADDLE_H)

      // Ball
      ctx.fillStyle = "#fff"
      ctx.shadowColor = "#fff"
      ctx.shadowBlur = 10
      ctx.fillRect(g.ballX, g.ballY, BALL_SIZE, BALL_SIZE)

      ctx.shadowBlur = 0
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, phase, resetBall])

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
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-green-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-green-400/60 uppercase tracking-wider">pong.exe</span>
              </div>
              <button onClick={close} className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors">
                [ESC] QUIT
              </button>
            </div>

            <div className="relative border border-green-500/30 border-t-0 bg-black">
              <canvas ref={canvasRef} width={W} height={H} className="block" />

              {phase === "coin" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                  <p className="text-white font-mono text-3xl mb-2">🏓 PONG</p>
                  <motion.p
                    animate={{ opacity: [1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                    className="text-green-400 font-mono text-lg"
                  >
                    INSERT COIN
                  </motion.p>
                  <p className="text-green-400/40 font-mono text-xs mt-4">Press ENTER to start</p>
                  <p className="text-green-400/30 font-mono text-xs mt-1">↑↓ to move • First to {WIN_SCORE} wins</p>
                </div>
              )}

              {phase === "over" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                  <p className="text-yellow-400 font-mono text-3xl mb-2">{winner} WIN{winner === "You" ? "" : "S"}!</p>
                  <p className="text-white font-mono">{displayScore.player} - {displayScore.ai}</p>
                  <p className="text-green-400/40 font-mono text-xs mt-4">ENTER to retry • ESC to quit</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900 border border-green-500/30 border-t-0">
              <span className="text-xs font-mono text-green-400/50">YOU: {displayScore.player}</span>
              <span className="text-xs font-mono text-red-400/50">CPU: {displayScore.ai}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
