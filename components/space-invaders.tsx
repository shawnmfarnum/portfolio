"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

const W = 480
const H = 400
const ALIEN_COLS = 8
const ALIEN_ROWS = 4
const ALIEN_W = 28
const ALIEN_H = 20
const ALIEN_GAP_X = 12
const ALIEN_GAP_Y = 10
const PLAYER_W = 32
const PLAYER_H = 16
const BULLET_W = 3
const BULLET_H = 10
const PLAYER_SPEED = 5
const BULLET_SPEED = 7
const ALIEN_BULLET_SPEED = 3

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

interface Alien { x: number; y: number; alive: boolean; row: number }
interface Bullet { x: number; y: number; active: boolean }

interface GameState {
  playerX: number
  aliens: Alien[]
  playerBullets: Bullet[]
  alienBullets: Bullet[]
  alienDx: number
  alienSpeed: number
  moveTimer: number
  shootTimer: number
  score: number
  lives: number
}

export function SpaceInvaders() {
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<"coin" | "play" | "over">("coin")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const keysRef = useRef<Set<string>>(new Set())
  const gameRef = useRef<GameState | null>(null)

  const initAliens = useCallback((): Alien[] => {
    const aliens: Alien[] = []
    const startX = (W - ALIEN_COLS * (ALIEN_W + ALIEN_GAP_X)) / 2
    for (let r = 0; r < ALIEN_ROWS; r++) {
      for (let c = 0; c < ALIEN_COLS; c++) {
        aliens.push({
          x: startX + c * (ALIEN_W + ALIEN_GAP_X),
          y: 40 + r * (ALIEN_H + ALIEN_GAP_Y),
          alive: true,
          row: r,
        })
      }
    }
    return aliens
  }, [])

  const resetGame = useCallback(() => {
    gameRef.current = {
      playerX: W / 2 - PLAYER_W / 2,
      aliens: initAliens(),
      playerBullets: [],
      alienBullets: [],
      alienDx: 1,
      alienSpeed: 1,
      moveTimer: 0,
      shootTimer: 0,
      score: 0,
      lives: 3,
    }
    setScore(0)
    setLives(3)
  }, [initAliens])

  useEffect(() => {
    const handler = () => { setActive(true); setPhase("coin") }
    window.addEventListener("space-invaders", handler)
    return () => window.removeEventListener("space-invaders", handler)
  }, [])

  useEffect(() => {
    if (!active) return
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setActive(false); return }
      if ((phase === "coin" || phase === "over") && e.key === "Enter") { resetGame(); setPhase("play"); return }
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
    let canShoot = true

    const loop = () => {
      const g = gameRef.current!
      const keys = keysRef.current

      // Player movement
      if (keys.has("ArrowLeft") || keys.has("a")) g.playerX = Math.max(0, g.playerX - PLAYER_SPEED)
      if (keys.has("ArrowRight") || keys.has("d")) g.playerX = Math.min(W - PLAYER_W, g.playerX + PLAYER_SPEED)

      // Player shooting
      if ((keys.has(" ") || keys.has("ArrowUp")) && canShoot) {
        g.playerBullets.push({ x: g.playerX + PLAYER_W / 2 - BULLET_W / 2, y: H - 40, active: true })
        beep(800, 30)
        canShoot = false
        setTimeout(() => { canShoot = true }, 300)
      }

      // Move player bullets
      g.playerBullets.forEach(b => { if (b.active) b.y -= BULLET_SPEED })
      g.playerBullets = g.playerBullets.filter(b => b.y > -BULLET_H)

      // Alien movement
      g.moveTimer++
      const aliveCount = g.aliens.filter(a => a.alive).length
      const moveInterval = Math.max(5, 30 - (ALIEN_COLS * ALIEN_ROWS - aliveCount))

      if (g.moveTimer >= moveInterval) {
        g.moveTimer = 0
        let hitEdge = false

        g.aliens.forEach(a => {
          if (!a.alive) return
          a.x += g.alienDx * 12
          if (a.x <= 0 || a.x + ALIEN_W >= W) hitEdge = true
        })

        if (hitEdge) {
          g.alienDx = -g.alienDx
          g.aliens.forEach(a => { if (a.alive) a.y += 12 })
        }
      }

      // Alien shooting
      g.shootTimer++
      if (g.shootTimer > 60) {
        g.shootTimer = 0
        const aliveAliens = g.aliens.filter(a => a.alive)
        if (aliveAliens.length > 0) {
          const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)]
          g.alienBullets.push({ x: shooter.x + ALIEN_W / 2, y: shooter.y + ALIEN_H, active: true })
        }
      }

      // Move alien bullets
      g.alienBullets.forEach(b => { if (b.active) b.y += ALIEN_BULLET_SPEED })
      g.alienBullets = g.alienBullets.filter(b => b.y < H)

      // Collision: player bullets vs aliens
      g.playerBullets.forEach(b => {
        if (!b.active) return
        g.aliens.forEach(a => {
          if (!a.alive) return
          if (b.x < a.x + ALIEN_W && b.x + BULLET_W > a.x && b.y < a.y + ALIEN_H && b.y + BULLET_H > a.y) {
            a.alive = false
            b.active = false
            g.score += (ALIEN_ROWS - a.row) * 10
            setScore(g.score)
            beep(440 + a.row * 100, 50)
          }
        })
      })

      // Collision: alien bullets vs player
      g.alienBullets.forEach(b => {
        if (!b.active) return
        if (b.x > g.playerX && b.x < g.playerX + PLAYER_W && b.y + BULLET_H > H - 30 && b.y < H - 30 + PLAYER_H) {
          b.active = false
          g.lives--
          setLives(g.lives)
          beep(150, 200)
          if (g.lives <= 0) {
            setPhase("over")
            return
          }
        }
      })

      // Check if aliens reached bottom
      const lowestAlien = g.aliens.filter(a => a.alive).reduce((max, a) => Math.max(max, a.y + ALIEN_H), 0)
      if (lowestAlien >= H - 50) {
        setPhase("over")
        return
      }

      // Win check
      if (g.aliens.every(a => !a.alive)) {
        g.aliens = initAliens()
        g.alienSpeed++
      }

      // Draw
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, W, H)

      // Stars
      ctx.fillStyle = "rgba(255,255,255,0.3)"
      for (let i = 0; i < 30; i++) {
        const sx = (i * 137.5 + Date.now() * 0.001) % W
        const sy = (i * 97.3) % H
        ctx.fillRect(sx, sy, 1, 1)
      }

      // Aliens
      g.aliens.forEach(a => {
        if (!a.alive) return
        const colors = ["#ff3333", "#ff6633", "#ffcc33", "#33ff33"]
        ctx.fillStyle = colors[a.row]
        ctx.shadowColor = colors[a.row]
        ctx.shadowBlur = 4

        // Simple pixel alien shape
        const s = 4 // pixel size
        const cx = a.x + ALIEN_W / 2
        const cy = a.y + ALIEN_H / 2
        // Body
        ctx.fillRect(cx - s * 2, cy - s, s * 4, s * 2)
        // Head
        ctx.fillRect(cx - s, cy - s * 2, s * 2, s)
        // Arms
        ctx.fillRect(cx - s * 3, cy - s, s, s * 2)
        ctx.fillRect(cx + s * 2, cy - s, s, s * 2)
        // Legs
        ctx.fillRect(cx - s * 2, cy + s, s, s)
        ctx.fillRect(cx + s, cy + s, s, s)
      })

      // Player
      ctx.fillStyle = "#00ff00"
      ctx.shadowColor = "#00ff00"
      ctx.shadowBlur = 6
      ctx.fillRect(g.playerX, H - 30, PLAYER_W, PLAYER_H)
      // Cannon
      ctx.fillRect(g.playerX + PLAYER_W / 2 - 2, H - 36, 4, 6)

      // Player bullets
      ctx.fillStyle = "#00ffff"
      ctx.shadowColor = "#00ffff"
      g.playerBullets.forEach(b => {
        if (b.active) ctx.fillRect(b.x, b.y, BULLET_W, BULLET_H)
      })

      // Alien bullets
      ctx.fillStyle = "#ff6633"
      ctx.shadowColor = "#ff6633"
      g.alienBullets.forEach(b => {
        if (b.active) ctx.fillRect(b.x, b.y, BULLET_W, BULLET_H)
      })

      // Lives
      ctx.shadowBlur = 0
      ctx.fillStyle = "#00ff00"
      ctx.font = "10px monospace"
      for (let i = 0; i < g.lives; i++) {
        ctx.fillRect(10 + i * 20, H - 12, 12, 8)
      }

      ctx.shadowBlur = 0
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, phase, initAliens])

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
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-green-500/30 border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-green-400/60 uppercase tracking-wider">space_invaders.exe</span>
              </div>
              <button onClick={close} className="text-xs font-mono text-white/30 hover:text-white/60">[ESC] QUIT</button>
            </div>

            <div className="relative border border-green-500/30 border-t-0 bg-black">
              <canvas ref={canvasRef} width={W} height={H} className="block" />

              {phase === "coin" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                  <p className="text-green-400 font-mono text-3xl mb-2">👾 SPACE INVADERS</p>
                  <motion.p animate={{ opacity: [1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }} className="text-green-400 font-mono text-lg">INSERT COIN</motion.p>
                  <p className="text-green-400/40 font-mono text-xs mt-4">Press ENTER to start</p>
                  <p className="text-green-400/30 font-mono text-xs mt-1">←→ move • SPACE shoot</p>
                </div>
              )}

              {phase === "over" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                  <p className="text-red-400 font-mono text-3xl mb-2">GAME OVER</p>
                  <p className="text-white font-mono">Score: {score}</p>
                  <p className="text-green-400/40 font-mono text-xs mt-4">ENTER to retry • ESC to quit</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900 border border-green-500/30 border-t-0">
              <span className="text-xs font-mono text-green-400/50">SCORE: {score}</span>
              <span className="text-xs font-mono text-green-400/30">LIVES: {lives}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
