"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Portal {
  x: number
  y: number
  color: "orange" | "blue"
}

export function PortalTransition() {
  const [portals, setPortals] = useState<Portal[]>([])
  const activeRef = useRef(false)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a[href^='#']") as HTMLAnchorElement | null
      if (!link || activeRef.current) return

      const href = link.getAttribute("href")
      if (!href || !href.startsWith("#")) return

      const destination = document.querySelector(href)
      if (!destination) return

      e.preventDefault()
      activeRef.current = true

      // Get click position for orange portal
      const orangeX = e.clientX
      const orangeY = e.clientY

      // Get destination position for blue portal
      const destRect = destination.getBoundingClientRect()
      const blueX = window.innerWidth / 2
      const blueY = destRect.top + window.scrollY > window.scrollY
        ? Math.min(destRect.top, window.innerHeight / 2)
        : window.innerHeight / 2

      // Show orange portal at click
      setPortals([{ x: orangeX, y: orangeY, color: "orange" }])

      // After brief delay, scroll and show blue portal
      setTimeout(() => {
        destination.scrollIntoView({ behavior: "smooth" })

        setPortals([
          { x: orangeX, y: orangeY, color: "orange" },
          { x: blueX, y: blueY, color: "blue" },
        ])
      }, 400)

      // Clean up
      setTimeout(() => {
        setPortals([])
        activeRef.current = false
      }, 1200)
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9995]">
      <AnimatePresence>
        {portals.map((portal, i) => (
          <motion.div
            key={`${portal.color}-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: portal.x, top: portal.y }}
          >
            {/* Outer glow */}
            <div
              className="w-24 h-36 rounded-[50%] absolute -inset-2 blur-xl opacity-40"
              style={{
                background: portal.color === "orange"
                  ? "radial-gradient(ellipse, #ff6600, transparent 70%)"
                  : "radial-gradient(ellipse, #00a2ff, transparent 70%)",
              }}
            />
            {/* Portal ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-32 rounded-[50%] relative"
              style={{
                border: `3px solid ${portal.color === "orange" ? "#ff6600" : "#00a2ff"}`,
                boxShadow: portal.color === "orange"
                  ? "0 0 20px rgba(255,102,0,0.6), inset 0 0 15px rgba(255,102,0,0.2)"
                  : "0 0 20px rgba(0,162,255,0.6), inset 0 0 15px rgba(0,162,255,0.2)",
              }}
            >
              {/* Inner swirl */}
              <div
                className="absolute inset-2 rounded-[50%] opacity-30"
                style={{
                  background: portal.color === "orange"
                    ? "radial-gradient(ellipse, #ff8833 0%, transparent 60%)"
                    : "radial-gradient(ellipse, #33bbff 0%, transparent 60%)",
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
