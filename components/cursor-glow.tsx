"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 150 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Only show on desktop
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    if (!mediaQuery.matches) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [cursorX, cursorY])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      animate={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Deep purple outer glow - matching reference background */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, oklch(0.45 0.2 290 / 0.08) 0%, transparent 60%)",
        }}
      />
      {/* Teal/cyan mid glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, oklch(0.75 0.15 185 / 0.07) 0%, transparent 55%)",
        }}
      />
      {/* Hot pink inner glow */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, oklch(0.65 0.28 340 / 0.1) 0%, transparent 50%)",
        }}
      />
      {/* Neon green accent dot */}
      <motion.div
        className="absolute w-[100px] h-[100px] rounded-full mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, oklch(0.8 0.25 145 / 0.06) 0%, transparent 40%)",
        }}
      />
    </motion.div>
  )
}
