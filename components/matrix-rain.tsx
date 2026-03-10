"use client"

import { useEffect, useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"

export function MatrixRain() {
  const [active, setActive] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const handler = () => setActive(true)
    window.addEventListener("matrix-rain", handler)
    return () => window.removeEventListener("matrix-rain", handler)
  }, [])

  useEffect(() => {
    if (!active || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[];=+-"
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    // Randomize initial positions for more natural look
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.random() * -50
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Head of the stream is bright
        ctx.fillStyle = "#00ffc8"
        ctx.fillText(char, x, y)

        // Trail characters are dimmer green
        if (drops[i] > 0) {
          ctx.fillStyle = "rgba(0, 255, 200, 0.3)"
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize)
        }

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    // Auto-stop after 5 seconds
    const timeout = setTimeout(() => {
      setActive(false)
    }, 5000)

    return () => {
      cancelAnimationFrame(animRef.current)
      clearTimeout(timeout)
    }
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9998] pointer-events-none"
          onAnimationComplete={() => {
            if (!active) return
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#00ffc8] font-mono text-2xl md:text-4xl font-bold"
              style={{ textShadow: "0 0 20px rgba(0,255,200,0.5)" }}
            >
              WAKE UP, NEO...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
