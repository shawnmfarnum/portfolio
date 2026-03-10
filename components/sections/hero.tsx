"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { ArrowDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/data"
import { useEffect, useState } from "react"

const skillsList = [
  // Development
  "Three.js", "Node.js", "HTML5", "CSS", "JavaScript", "Bootstrap", "HTML", "HTML + CSS",
  "Front-End Development", "Web Development", "Web Standards",
  // Design & UX
  "User Interface Design", "Interaction Design", "UX Design", "User Experience Design",
  "User Experience (UX)", "Usability", "Wireframing", "User Flows", "User Persona's",
  "Prototyping", "Interactive Prototyping", "Software Prototyping", "A/B Testing",
  "Web Design", "Graphic Design", "Logo Design", "Graphics",
  // Tools
  "Photoshop", "Adobe Creative Suite", "Adobe Illustrator", "Adobe InDesign", "Adobe Photoshop",
  "Sketch App", "Lean Canvas",
  // Marketing & Social
  "Online Marketing", "Social Media", "Social Media Marketing", "Social Networking",
  "Creative Marketing", "Facebook", "Digital Photography",
  // Business & Problem Solving
  "Entrepreneur", "Creative Problem Solving", "Problem Solving", "Communication",
  "Web Project Management", "Website Building", "User Requirements",
  // IT
  "Information Technology", "IT Service Management", "IT Operations", "Service Desk",
  "Troubleshooting", "Computer Hardware", "Mac OS X",
]

// Distribute skills across the full background
const codeSnippets = skillsList.map((skill, i) => {
  // Pseudo-random distribution using golden ratio offset
  const golden = 0.618033
  const topPercent = ((i * golden * 37) % 82) + 6
  const leftPercent = ((i * golden * 53 + i * 7) % 85) + 3
  const colors = ["text-chart-2/25", "text-chart-1/20", "text-chart-3/25", "text-chart-2/20", "text-chart-1/25", "text-chart-3/20"]
  return {
    code: skill,
    top: `${topPercent}%`,
    left: `${leftPercent}%`,
    delay: (i * 0.15) % 3,
    color: colors[i % colors.length],
  }
})

function FloatingCode() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
      {codeSnippets.map((snippet, i) => (
        <motion.div
          key={i}
          className={`absolute font-mono text-xs ${snippet.color} code-float`}
          style={{
            top: snippet.top,
            left: snippet.left,
            right: snippet.right,
            bottom: snippet.bottom,
            animationDelay: `${snippet.delay}s`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 + snippet.delay * 0.3 }}
        >
          {snippet.code}
        </motion.div>
      ))}
    </div>
  )
}

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setShowCursor(false), 2000)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span className="font-mono">
      {displayText}
      {showCursor && <span className="text-accent animate-pulse">|</span>}
    </span>
  )
}

function CyberpunkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base grid */}
      <div className="absolute inset-0 grid-bg" />
      
      {/* Animated cyber grid */}
      <div className="absolute inset-0 cyber-grid" />
      
      {/* Scanlines CRT effect */}
      <div className="absolute inset-0 scanlines" />
      
      {/* Scan line sweep */}
      <div className="scan-line" />
      
      {/* Neon pink orb - top right */}
      <motion.div
        className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--neon-pink) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Neon cyan orb - bottom left */}
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--neon-cyan) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Purple accent orb - center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--neon-purple) 0%, var(--neon-indigo) 40%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Neon green accent orb - small, top left */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[200px] h-[200px] rounded-full opacity-25 blur-2xl"
        style={{
          background: "radial-gradient(circle, var(--neon-green) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Horizon line glow - with green accent */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-green), var(--neon-pink), var(--neon-green), var(--neon-cyan), transparent)",
          boxShadow: "0 0 20px var(--neon-cyan), 0 0 40px var(--neon-pink)",
        }}
      />
    </div>
  )
}

export function Hero() {
  const scrollToWork = () => {
    const element = document.querySelector("#work")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden noise-overlay crt-flicker"
    >
      <CyberpunkBackground />
      <FloatingCode />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 mb-10 neon-border bg-background/50 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-2 terminal-dot" />
          </span>
          <span className="text-chart-2 text-sm font-mono tracking-wider uppercase">
            <TypewriterText text="SYSTEM ONLINE // READY FOR INPUT" />
          </span>
        </motion.div>

        {/* Main title with chromatic effect */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight mb-6 text-balance glitch-hover chromatic-text"
        >
          <span className="text-gradient">{siteConfig.name}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 text-pretty"
        >
          {siteConfig.tagline}
        </motion.p>
        
        {/* Code comment with neon styling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-10"
        >
          <span className="text-sm font-mono px-3 py-1 bg-chart-1/10 text-chart-1 border border-chart-1/30">
            {"/* BRIDGING DESIGN & ENGINEERING */"}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={scrollToWork}
            size="lg"
            className="group cyber-button bg-chart-2 text-background hover:bg-chart-2/90 px-8 font-mono uppercase tracking-wider"
          >
            <span className="relative z-10 flex items-center">
              {"[ VIEW_WORK ]"}
              <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="px-8 font-mono uppercase tracking-wider neon-border-pink hover:bg-chart-1/10"
          >
            <a href={siteConfig.resumeUrl} download>
              <Download className="mr-2 h-4 w-4" />
              {"DOWNLOAD.EXE"}
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator - retro style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-chart-2/60 tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-px h-6 bg-gradient-to-b from-chart-2 to-transparent" />
          <div className="w-2 h-2 rotate-45 border-b border-r border-chart-2" />
        </motion.div>
      </motion.div>
    </section>
  )
}
