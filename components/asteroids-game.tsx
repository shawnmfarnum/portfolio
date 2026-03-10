"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

const W = 480
const H = 480
const SHIP_SIZE = 12
const TURN_SPEED = 0.08
const THRUST = 0.15
const FRICTION = 0.99
const BULLET_SPEED = 6
const BULLET_LIFE = 50 // frames
const MAX_BULLETS = 6

function beep(freq: number, ms: number) {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.frequency.value = freq; o.type = "square"; g.gain.value = 0.04
    o.start(); setTimeout(() => { o.stop(); ctx.close() }, ms)
  } catch {}
}

interface Ship { x: number; y: number; angle: number; vx: number; vy: number; invincible: number }
interface Bullet { x: number; y: number; vx: number; vy: number; life: number }
interface Asteroid { x: number; y: number; vx: number; vy: number; size: number; vertices: number[] }

function createAsteroid(x: number, y: number, size: number): Asteroid {
  const speed = (4 - size) * 0.8 + Math.random() * 0.5
  const angle = Math.random() * Math.PI * 2
  const vertices: number[] = []
  const numVerts = 8 + Math.floor(Math.random() * 5)
  for (let i = 0; i < numVerts; i++) {
    vertices.push(0.7 + Math.random() * 0.6) // radius variation
  }
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size,
    vertices,
  }
}

function asteroidRadius(a: Asteroid): number {
  return a.size * 14
}

interface GameState {
  ship: Ship
  bullets: Bullet[]
  asteroids: Asteroid[]
  score: number
  lives: number
  level: number
}

export function AsteroidsGame() {
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<"coin" | "play" | "over">("coin")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const keysRef = useRef<Set<string>>(new Set())
  const gameRef = useRef<GameState | null>(null)
  const canShootRef = useRef(true)

  const spawnAsteroids = useCallback((count: number, avoidCenter: boolean): Asteroid[] => {
    const asteroids: Asteroid[] = []
    for (let i = 0; i < count; i++) {
      let x: number, y: number
      do {
        x = Math.random() * W
        y = Math.random() * H
      } while (avoidCenter && Math.hypot(x - W / 2, y - H / 2) < 120)
      asteroids.push(createAsteroid(x, y, 3))
    }
    return asteroids
  }, [])

  const resetGame = useCallback(() => {
    gameRef.current = {
      ship: { x: W / 2, y: H / 2, angle: -Math.PI / 2, vx: 0, vy: 0, invincible: 120 },
      bullets: [],
      asteroids: spawnAsteroids(4, true),
      score: 0,
      lives: 3,
      level: 1,
    }
    setScore(0)
    setLives(3)
  }, [spawnAsteroids])

  useEffect(() => {
    const handler = () => { setActive(true); setPhase("coin") }
    window.addEventListener("asteroids-game", handler)
    return () => window.removeEventListener("asteroids-game", handler)
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

    const loop = () => {
      const g = gameRef.current!
      const keys = keysRef.current
      const ship = g.ship

      // Ship rotation
      if (keys.has("ArrowLeft") || keys.has("a")) ship.angle -= TURN_SPEED
      if (keys.has("ArrowRight") || keys.has("d")) ship.angle += TURN_SPEED

      // Thrust
      if (keys.has("ArrowUp") || keys.has("w")) {
        ship.vx += Math.cos(ship.angle) * THRUST
        ship.vy += Math.sin(ship.angle) * THRUST
      }

      // Friction
      ship.vx *= FRICTION
      ship.vy *= FRICTION

      // Move ship
      ship.x += ship.vx
      ship.y += ship.vy

      // Screen wrap
      if (ship.x < 0) ship.x += W
      if (ship.x > W) ship.x -= W
      if (ship.y < 0) ship.y += H
      if (ship.y > H) ship.y -= H

      // Invincibility countdown
      if (ship.invincible > 0) ship.invincible--

      // Shooting
      if ((keys.has(" ") || keys.has("z")) && canShootRef.current && g.bullets.length < MAX_BULLETS) {
        g.bullets.push({
          x: ship.x + Math.cos(ship.angle) * SHIP_SIZE,
          y: ship.y + Math.sin(ship.angle) * SHIP_SIZE,
          vx: Math.cos(ship.angle) * BULLET_SPEED + ship.vx * 0.3,
          vy: Math.sin(ship.angle) * BULLET_SPEED + ship.vy * 0.3,
          life: BULLET_LIFE,
        })
        beep(600, 30)
        canShootRef.current = false
        setTimeout(() => { canShootRef.current = true }, 150)
      }

      // Move bullets
      g.bullets.forEach(b => {
        b.x += b.vx
        b.y += b.vy
        b.life--
        // Wrap
        if (b.x < 0) b.x += W
        if (b.x > W) b.x -= W
        if (b.y < 0) b.y += H
        if (b.y > H) b.y -= H
      })
      g.bullets = g.bullets.filter(b => b.life > 0)

      // Move asteroids
      g.asteroids.forEach(a => {
        a.x += a.vx
        a.y += a.vy
        if (a.x < 0) a.x += W
        if (a.x > W) a.x -= W
        if (a.y < 0) a.y += H
        if (a.y > H) a.y -= H
      })

      // Bullet-asteroid collision
      const newAsteroids: Asteroid[] = []
      g.bullets.forEach(b => {
        g.asteroids.forEach(a => {
          const dist = Math.hypot(b.x - a.x, b.y - a.y)
          if (dist < asteroidRadius(a)) {
            b.life = 0
            a.size = 0 // Mark for removal
            g.score += (4 - a.size) * 25 + 25
            setScore(g.score)
            beep(200 + Math.random() * 300, 50)

            // Spawn smaller asteroids
            const origSize = Math.round(dist / 14) || 1
            if (origSize >= 2) {
              newAsteroids.push(createAsteroid(a.x, a.y, origSize - 1))
              newAsteroids.push(createAsteroid(a.x, a.y, origSize - 1))
            }
          }
        })
      })

      // Actually handle splitting properly
      const toSplit: Asteroid[] = []
      g.bullets = g.bullets.filter(b => {
        let hit = false
        g.asteroids.forEach(a => {
          if (a.size <= 0) return
          if (Math.hypot(b.x - a.x, b.y - a.y) < asteroidRadius(a)) {
            hit = true
            const points = (4 - a.size) * 25 + 25
            g.score += points
            setScore(g.score)
            beep(200 + a.size * 100, 50)
            if (a.size > 1) {
              toSplit.push(createAsteroid(a.x, a.y, a.size - 1))
              toSplit.push(createAsteroid(a.x, a.y, a.size - 1))
            }
            a.size = 0
          }
        })
        return !hit && b.life > 0
      })

      g.asteroids = g.asteroids.filter(a => a.size > 0)
      g.asteroids.push(...toSplit)

      // Ship-asteroid collision
      if (ship.invincible <= 0) {
        for (const a of g.asteroids) {
          if (Math.hypot(ship.x - a.x, ship.y - a.y) < asteroidRadius(a) + SHIP_SIZE * 0.6) {
            g.lives--
            setLives(g.lives)
            beep(80, 300)
            if (g.lives <= 0) {
              setPhase("over")
              return
            }
            // Reset ship position
            ship.x = W / 2
            ship.y = H / 2
            ship.vx = 0
            ship.vy = 0
            ship.invincible = 120
            break
          }
        }
      }

      // Next level
      if (g.asteroids.length === 0) {
        g.level++
        g.asteroids = spawnAsteroids(3 + g.level, true)
      }

      // ===== DRAW =====
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, W, H)

      // Stars
      ctx.fillStyle = "rgba(255,255,255,0.2)"
      for (let i = 0; i < 40; i++) {
        ctx.fillRect((i * 137.5) % W, (i * 97.3 + i * 13.7) % H, 1, 1)
      }

      // Ship (triangle)
      if (ship.invincible <= 0 || Math.floor(ship.invincible / 4) % 2 === 0) {
        ctx.save()
        ctx.translate(ship.x, ship.y)
        ctx.rotate(ship.angle)
        ctx.strokeStyle = "#00ff00"
        ctx.shadowColor = "#00ff00"
        ctx.shadowBlur = 6
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(SHIP_SIZE, 0)
        ctx.lineTo(-SHIP_SIZE * 0.7, -SHIP_SIZE * 0.6)
        ctx.lineTo(-SHIP_SIZE * 0.4, 0)
        ctx.lineTo(-SHIP_SIZE * 0.7, SHIP_SIZE * 0.6)
        ctx.closePath()
        ctx.stroke()

        // Thrust flame
        if (keys.has("ArrowUp") || keys.has("w")) {
          ctx.strokeStyle = "#ff6633"
          ctx.shadowColor = "#ff6633"
          ctx.beginPath()
          ctx.moveTo(-SHIP_SIZE * 0.5, -SHIP_SIZE * 0.25)
          ctx.lineTo(-SHIP_SIZE * (0.8 + Math.random() * 0.5), 0)
          ctx.lineTo(-SHIP_SIZE * 0.5, SHIP_SIZE * 0.25)
          ctx.stroke()
        }
        ctx.restore()
      }

      // Bullets
      ctx.fillStyle = "#fff"
      ctx.shadowColor = "#fff"
      ctx.shadowBlur = 4
      g.bullets.forEach(b => {
        ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3)
      })

      // Asteroids
      ctx.strokeStyle = "#aaa"
      ctx.shadowColor = "#aaa"
      ctx.shadowBlur = 3
      ctx.lineWidth = 1.5
      g.asteroids.forEach(a => {
        const r = asteroidRadius(a)
        ctx.beginPath()
        for (let i = 0; i < a.vertices.length; i++) {
          const angle = (i / a.vertices.length) * Math.PI * 2
          const vr = r * a.vertices[i]
          const px = a.x + Math.cos(angle) * vr
          const py = a.y + Math.sin(angle) * vr
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.stroke()
      })

      ctx.shadowBlur = 0

      // HUD
      ctx.fillStyle = "#00ff00"
      ctx.font = "14px monospace"
      ctx.fillText(`SCORE: ${g.score}`, 10, 20)
      ctx.fillText(`LEVEL: ${g.level}`, 10, 38)

      // Lives as mini ships
      for (let i = 0; i < g.lives; i++) {
        ctx.save()
        ctx.translate(W - 20 - i * 25, 20)
        ctx.rotate(-Math.PI / 2)
        ctx.strokeStyle = "#00ff00"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(8, 0)
        ctx.lineTo(-5, -4)
        ctx.lineTo(-3, 0)
        ctx.lineTo(-5, 4)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, phase, spawnAsteroids])

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
                <span className="text-xs font-mono text-green-400/60 uppercase tracking-wider">asteroids.exe</span>
              </div>
              <button onClick={close} className="text-xs font-mono text-white/30 hover:text-white/60">[ESC] QUIT</button>
            </div>

            <div className="relative border border-green-500/30 border-t-0 bg-black">
              <canvas ref={canvasRef} width={W} height={H} className="block" />

              {phase === "coin" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                  <p className="text-white font-mono text-3xl mb-2">☄️ ASTEROIDS</p>
                  <motion.p animate={{ opacity: [1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }} className="text-green-400 font-mono text-lg">INSERT COIN</motion.p>
                  <p className="text-green-400/40 font-mono text-xs mt-4">Press ENTER to start</p>
                  <p className="text-green-400/30 font-mono text-xs mt-1">←→ rotate • ↑ thrust • SPACE shoot</p>
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
