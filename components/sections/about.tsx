"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useCallback, useState } from "react"
import { AnimatePresence } from "framer-motion"

// Warcraft peon-style escalating responses
const peonResponses = {
  calm: [
    { text: "Yes?", pitch: 0.8, rate: 0.9 },
    { text: "Hmm?", pitch: 0.8, rate: 0.9 },
    { text: "What is it?", pitch: 0.8, rate: 0.85 },
    { text: "Yes, my lord?", pitch: 0.75, rate: 0.85 },
    { text: "Your command?", pitch: 0.8, rate: 0.9 },
  ],
  annoyed: [
    { text: "Why do you keep touching me?", pitch: 0.85, rate: 1.0 },
    { text: "Stop poking me!", pitch: 0.9, rate: 1.1 },
    { text: "What is it now?", pitch: 0.9, rate: 1.05 },
    { text: "That's it, I'm not moving.", pitch: 0.85, rate: 1.0 },
    { text: "Are you still clicking?", pitch: 0.9, rate: 1.05 },
  ],
  rage: [
    { text: "WHAT?!", pitch: 1.2, rate: 1.4 },
    { text: "STOP IT!", pitch: 1.3, rate: 1.5 },
    { text: "ENOUGH ALREADY!", pitch: 1.2, rate: 1.3 },
    { text: "I SAID STOP POKING ME!", pitch: 1.1, rate: 1.3 },
    { text: "THAT DOES IT!", pitch: 1.3, rate: 1.5 },
  ],
}

function speak(text: string, pitch: number, rate: number) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.pitch = pitch
  utterance.rate = rate
  utterance.volume = 0.8
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v => v.name.includes("Daniel") || v.name.includes("Alex") || v.name.includes("Fred"))
  if (preferred) utterance.voice = preferred
  window.speechSynthesis.speak(utterance)
}

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const clicksRef = useRef<number[]>([])
  const cooldownRef = useRef(false)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [peonMessage, setPeonMessage] = useState<{ text: string; stage: "calm" | "annoyed" | "rage" } | null>(null)

  const handleProfileClick = useCallback(() => {
    const now = Date.now()
    clicksRef.current.push(now)
    clicksRef.current = clicksRef.current.filter(t => now - t < 3000)
    const count = clicksRef.current.length

    if (cooldownRef.current) return
    cooldownRef.current = true
    setTimeout(() => { cooldownRef.current = false }, 800)

    let stage: "calm" | "annoyed" | "rage"
    if (count >= 7) stage = "rage"
    else if (count >= 4) stage = "annoyed"
    else stage = "calm"

    const pool = peonResponses[stage]
    const response = pool[Math.floor(Math.random() * pool.length)]
    setPeonMessage({ text: response.text, stage })
    speak(response.text, response.pitch, response.rate)

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => setPeonMessage(null), 2500)
  }, [])

  return (
    <section id="about" className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          {/* Photo with cyberpunk overlay */}
          <div className="relative">
            <div
              onClick={handleProfileClick}
              className="bg-card border border-chart-2/30 overflow-hidden group hover:border-chart-2/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] cursor-pointer select-none">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 bg-secondary/80 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-chart-1 terminal-dot" />
                    <div className="w-2 h-2 bg-chart-4 terminal-dot" />
                    <div className="w-2 h-2 bg-chart-2 terminal-dot" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    profile.sys
                  </span>
                </div>
                <span className="text-xs font-mono text-chart-2/60">ACTIVE</span>
              </div>
              <div className="aspect-[4/5] bg-background/50 overflow-hidden relative">
                {/* Scanlines */}
                <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
                
                <div className="w-full h-full bg-gradient-to-br from-chart-1/5 via-transparent to-chart-2/5 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm font-mono">[ LOADING_IMAGE ]</span>
                </div>
                {/* Code overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/80 to-transparent">
                  <div className="font-mono text-xs space-y-0.5">
                    <p><span className="text-chart-1">{'>'}</span> <span className="text-chart-2">INIT</span> user.profile</p>
                    <p><span className="text-chart-1">{'>'}</span> MODE: <span className="text-chart-2">CREATIVE</span></p>
                    <p><span className="text-chart-1">{'>'}</span> STATUS: <span className="text-chart-2 animate-pulse">ONLINE</span></p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative neon border */}
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-chart-1/20 -z-10" />
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-chart-2/10 -z-20" />

            {/* Peon speech bubble */}
            <AnimatePresence>
              {peonMessage && (
                <motion.div
                  key={peonMessage.text}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    ...(peonMessage.stage === "rage" ? { x: [0, -3, 3, -3, 3, 0] } : {})
                  }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className={`absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-card border shadow-lg whitespace-nowrap z-10 ${
                    peonMessage.stage === "rage"
                      ? "border-chart-1/60 shadow-chart-1/20"
                      : peonMessage.stage === "annoyed"
                      ? "border-chart-4/40 shadow-chart-4/10"
                      : "border-chart-2/40 shadow-chart-2/10"
                  }`}
                >
                  <p className={`font-mono text-sm ${
                    peonMessage.stage === "rage"
                      ? "text-chart-1"
                      : peonMessage.stage === "annoyed"
                      ? "text-chart-4"
                      : "text-chart-2"
                  }`}>
                    {peonMessage.text}
                  </p>
                  {/* Speech bubble triangle */}
                  <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-card border-r border-b ${
                    peonMessage.stage === "rage"
                      ? "border-chart-1/60"
                      : peonMessage.stage === "annoyed"
                      ? "border-chart-4/40"
                      : "border-chart-2/40"
                  }`} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-chart-1/30 bg-chart-1/5"
            >
              <span className="w-1.5 h-1.5 bg-chart-1 terminal-dot animate-pulse" />
              <span className="text-chart-1 text-xs font-mono uppercase tracking-widest">
                USER_PROFILE
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-serif text-3xl md:text-4xl text-balance chromatic-text"
            >
              Bridging design and engineering — I speak both languages fluently.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4 text-muted-foreground leading-relaxed"
            >
              <p>
                I'm a UI/UX designer and software developer who believes the best 
                digital experiences happen when design and engineering work as one. 
                My background spans fintech, healthcare, and emerging tech — each 
                project teaching me something new about how people interact with 
                technology.
              </p>
              <p>
                Currently pursuing a Master's in Human–Computer Interaction & Design 
                at UC Irvine, where I'm sharpening my research methodology and systems 
                thinking. The academic rigor has given me new frameworks for understanding 
                user behavior, while my industry experience keeps me grounded in shipping 
                real products.
              </p>
              <p>
                My work is design-led but technically informed. I prototype in code, 
                build design systems, and ship production interfaces. I'm the designer 
                who can open a PR and the developer who sweats the details on spacing 
                and hierarchy.
              </p>
              <p 
                className="text-background/0 selection:text-chart-2 selection:bg-chart-2/10 text-xs font-mono cursor-default transition-colors"
                aria-hidden="true"
              >
                psst... you found the hidden text. try ⌘K and type &quot;admin&quot; 🕵️
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2 pt-4"
            >
              {["Fintech", "Healthcare", "Design Systems", "HCI Research"].map((tag, i) => (
                <span
                  key={tag}
                  className={`px-3 py-1 text-xs font-mono uppercase tracking-wider ${
                    i % 2 === 0
                      ? 'bg-chart-2/10 text-chart-2 border border-chart-2/30'
                      : 'bg-chart-1/10 text-chart-1 border border-chart-1/30'
                  }`}
                >
                  [{tag}]
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
