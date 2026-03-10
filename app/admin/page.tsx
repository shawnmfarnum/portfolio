"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const bootSequence = [
  { text: "BIOS v4.2.0 — POST CHECK", delay: 0, color: "text-chart-2" },
  { text: "Memory: 32768 MB OK", delay: 200, color: "text-muted-foreground" },
  { text: "Detecting hardware... done", delay: 400, color: "text-muted-foreground" },
  { text: "Loading kernel modules...", delay: 700, color: "text-muted-foreground" },
  { text: "", delay: 900, color: "" },
  { text: "███ SHAWN_OS v2.0.26 ███", delay: 1000, color: "text-chart-2 font-bold text-lg" },
  { text: "Securing connection... ████████████ OK", delay: 1300, color: "text-chart-2" },
  { text: "Authenticating... ACCESS GRANTED", delay: 1700, color: "text-chart-1" },
  { text: "", delay: 1900, color: "" },
  { text: "root@shawn-os:~# cat /var/log/system.log", delay: 2100, color: "text-chart-2" },
  { text: "", delay: 2300, color: "" },
  { text: "[2026-03-09 08:00:01] BOOT: System initialized", delay: 2400, color: "text-muted-foreground" },
  { text: "[2026-03-09 08:00:02] NET: Portfolio server started on :443", delay: 2600, color: "text-muted-foreground" },
  { text: "[2026-03-09 08:00:03] AUTH: SSL certificates loaded", delay: 2800, color: "text-muted-foreground" },
  { text: "[2026-03-09 08:15:22] VISITOR: New session from [REDACTED]", delay: 3000, color: "text-chart-4" },
  { text: "[2026-03-09 08:15:23] ROUTE: GET /admin — unauthorized access detected", delay: 3200, color: "text-chart-1" },
  { text: "[2026-03-09 08:15:23] SEC: Running facial recognition... 🤔", delay: 3500, color: "text-chart-1" },
  { text: "[2026-03-09 08:15:24] SEC: Scan complete — you look trustworthy", delay: 4000, color: "text-chart-2" },
  { text: "[2026-03-09 08:15:25] SYS: Loading classified files...", delay: 4300, color: "text-muted-foreground" },
  { text: "", delay: 4500, color: "" },
  { text: "╔══════════════════════════════════════════╗", delay: 4700, color: "text-chart-2" },
  { text: "║         CLASSIFIED INFORMATION           ║", delay: 4800, color: "text-chart-2" },
  { text: "╠══════════════════════════════════════════╣", delay: 4900, color: "text-chart-2" },
  { text: "║ Favorite editor:     VS Code (obviously) ║", delay: 5100, color: "text-chart-2" },
  { text: "║ Tabs vs Spaces:      Tabs. Fight me.     ║", delay: 5300, color: "text-chart-2" },
  { text: "║ Coffee consumed:     ∞ cups              ║", delay: 5500, color: "text-chart-2" },
  { text: "║ Bugs created:        [REDACTED]          ║", delay: 5700, color: "text-chart-2" },
  { text: "║ Bugs fixed:          [REDACTED]+1        ║", delay: 5900, color: "text-chart-2" },
  { text: "║ Stack Overflow:      copy-paste expert   ║", delay: 6100, color: "text-chart-2" },
  { text: "║ Git force push:      only on Fridays     ║", delay: 6300, color: "text-chart-2" },
  { text: "╚══════════════════════════════════════════╝", delay: 6500, color: "text-chart-2" },
  { text: "", delay: 6700, color: "" },
  { text: "[2026-03-09 08:15:30] SYS: That's all the secrets. Go build something cool.", delay: 6900, color: "text-chart-4" },
  { text: "[2026-03-09 08:15:31] SYS: Type 'exit' to disconnect.", delay: 7200, color: "text-chart-4" },
  { text: "", delay: 7400, color: "" },
]

export default function AdminPage() {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [bootDone, setBootDone] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [history, setHistory] = useState<{ cmd: string; response: string; color: string }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    bootSequence.forEach((line, i) => {
      const timer = setTimeout(() => {
        setVisibleLines(prev => prev + 1)
        if (i === bootSequence.length - 1) {
          setBootDone(true)
        }
      }, line.delay)
      timers.push(timer)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (bootDone) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [bootDone])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleLines, history, bootDone])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()

    if (trimmed === "exit" || trimmed === "quit" || trimmed === "logout") {
      setHistory(prev => [...prev, { cmd, response: "Disconnecting... goodbye.", color: "text-chart-2" }])
      setTimeout(() => router.push("/"), 800)
      return
    }

    if (trimmed === "help") {
      setHistory(prev => [...prev, { cmd, response: "Available commands: exit, help, whoami, ls, pwd, clear, date, uptime, neofetch", color: "text-muted-foreground" }])
      return
    }

    if (trimmed === "whoami") {
      setHistory(prev => [...prev, { cmd, response: "visitor — unauthorized but tolerated", color: "text-chart-2" }])
      return
    }

    if (trimmed === "ls") {
      setHistory(prev => [...prev, { cmd, response: "secrets/  classified/  definitely-not-bugs/  node_modules/ (don't look in there)", color: "text-chart-2" }])
      return
    }

    if (trimmed === "pwd") {
      setHistory(prev => [...prev, { cmd, response: "/home/shawn/portfolio/admin", color: "text-chart-2" }])
      return
    }

    if (trimmed === "clear") {
      setHistory([])
      return
    }

    if (trimmed === "date") {
      setHistory(prev => [...prev, { cmd, response: new Date().toString(), color: "text-chart-2" }])
      return
    }

    if (trimmed === "uptime") {
      setHistory(prev => [...prev, { cmd, response: "up ∞ days, fueled by coffee and imposter syndrome", color: "text-chart-2" }])
      return
    }

    if (trimmed === "neofetch") {
      setHistory(prev => [...prev, { 
        cmd, 
        response: `  ╭──────────────────╮
  │  shawn@portfolio  │
  ╰──────────────────╯
  OS:     ShawnOS v2.0.26
  Host:   Bozeman, MT
  Shell:  bash 5.2.26
  Stack:  Next.js / React / Tailwind
  Theme:  cyberpunk-dark [always]
  Coffee: ████████████████ 100%`, 
        color: "text-chart-2" 
      }])
      return
    }

    if (trimmed.startsWith("cd ")) {
      setHistory(prev => [...prev, { cmd, response: "Nice try. You're not going anywhere.", color: "text-chart-1" }])
      return
    }

    if (trimmed === "rm -rf /" || trimmed === "rm -rf /*") {
      setHistory(prev => [...prev, { cmd, response: "Absolutely not. 🚫", color: "text-chart-1" }])
      return
    }

    if (trimmed === "sudo" || trimmed.startsWith("sudo ")) {
      setHistory(prev => [...prev, { cmd, response: "visitor is not in the sudoers file. This incident will be reported.", color: "text-chart-1" }])
      return
    }

    setHistory(prev => [...prev, { cmd, response: `bash: ${trimmed}: command not found. Try 'help'`, color: "text-chart-1" }])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(inputValue)
      setInputValue("")
    }
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 md:p-8 relative overflow-hidden">
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
      
      {/* CRT flicker effect */}
      <motion.div
        className="absolute inset-0 bg-green-900/5 pointer-events-none"
        animate={{ opacity: [0, 0.03, 0, 0.02, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: Math.random() * 3 }}
      />

      {/* Terminal window */}
      <div className="max-w-4xl mx-auto">
        {/* Terminal chrome */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-green-900/50 border-b-0">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-mono text-green-600 uppercase tracking-wider">
              root@shawn-os — /admin
            </span>
          </div>
          <span className="text-xs font-mono text-green-800">
            bash 5.2.26
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={containerRef}
          onClick={focusInput}
          className="bg-gray-950 border border-green-900/50 p-6 font-mono text-sm min-h-[70vh] max-h-[80vh] overflow-y-auto cursor-text"
        >
          {/* Boot sequence lines */}
          {bootSequence.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={`boot-${i}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={`${line.color} ${line.text === "" ? "h-4" : ""} leading-relaxed`}
            >
              {line.text}
            </motion.div>
          ))}

          {/* Command history */}
          {history.map((entry, i) => (
            <div key={`hist-${i}`}>
              <div className="text-chart-2 leading-relaxed">
                root@shawn-os:~# <span>{entry.cmd}</span>
              </div>
              <div className={`${entry.color} leading-relaxed whitespace-pre-wrap`}>
                {entry.response}
              </div>
            </div>
          ))}

          {/* Interactive prompt */}
          {bootDone && (
            <div className="flex items-center leading-relaxed text-chart-2">
              <span>root@shawn-os:~#&nbsp;</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none border-none text-chart-2 font-mono text-sm caret-chart-2"
                spellCheck={false}
                autoComplete="off"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
