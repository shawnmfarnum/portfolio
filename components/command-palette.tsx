"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Mail, ArrowRight, ExternalLink, Download, Copy, Printer, Share2 } from "lucide-react"
import { siteConfig } from "@/lib/data"

interface Command {
  id: string
  label: string
  category: string
  action: () => void
  shortcut?: string
  keywords?: string[]
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = [
    { id: "hero", label: "Go to Top", category: "Navigate", action: () => scrollTo("#hero"), shortcut: "1" },
    { id: "about", label: "About", category: "Navigate", action: () => scrollTo("#about"), shortcut: "2" },
    { id: "work", label: "Case Studies", category: "Navigate", action: () => scrollTo("#work"), shortcut: "3" },
    { id: "process", label: "Process", category: "Navigate", action: () => scrollTo("#process"), shortcut: "4" },
    { id: "testimonials", label: "Testimonials", category: "Navigate", action: () => scrollTo("#testimonials"), shortcut: "5" },
    { id: "contact", label: "Contact", category: "Navigate", action: () => scrollTo("#contact"), shortcut: "6" },
    { id: "resume", label: "Download Resume", category: "Action", keywords: ["resume", "cv", "pdf", "download"], action: () => { const a = document.createElement("a"); a.href = "/resume.pdf"; a.download = "Shawn_Farnum_Resume.pdf"; a.click() } },
    { id: "email", label: "Send Email", category: "Action", keywords: ["mail", "contact", "message"], action: () => window.open(`mailto:${siteConfig.email}`) },
    { id: "copy-email", label: "Copy Email to Clipboard", category: "Action", keywords: ["clipboard", "copy"], action: () => { navigator.clipboard.writeText(siteConfig.email) } },
    { id: "copy-url", label: "Copy Page URL", category: "Action", keywords: ["share", "link", "clipboard"], action: () => { navigator.clipboard.writeText(window.location.href) } },
    { id: "print", label: "Print Page", category: "Action", keywords: ["print", "pdf"], action: () => window.print() },
    { id: "linkedin", label: "Open LinkedIn", category: "Social", action: () => window.open(siteConfig.social.linkedin, "_blank") },
    { id: "github", label: "Open GitHub", category: "Social", action: () => window.open(siteConfig.social.github, "_blank") },
    { id: "codepen", label: "Open CodePen", category: "Social", action: () => window.open(siteConfig.social.codepen, "_blank") },
    { id: "dribbble", label: "Open Dribbble", category: "Social", action: () => window.open(siteConfig.social.dribbble, "_blank") },
    { id: "ee-konami", label: "Konami Code → ↑↑↓↓←→←→BA", category: "Easter Eggs", shortcut: "1", keywords: ["easter", "eggs", "secret", "hidden", "konami", "hack"], action: () => setIsOpen(false) },
    { id: "ee-keyboard", label: "Press 1-6 to jump to sections", category: "Easter Eggs", shortcut: "2", keywords: ["easter", "eggs", "secret", "hidden", "keyboard", "shortcut"], action: () => setIsOpen(false) },
    { id: "ee-tab", label: "Switch tabs to see a hidden message", category: "Easter Eggs", shortcut: "3", keywords: ["easter", "eggs", "secret", "hidden", "tab", "title"], action: () => setIsOpen(false) },
    { id: "ee-console", label: "Open DevTools console for a surprise", category: "Easter Eggs", shortcut: "4", keywords: ["easter", "eggs", "secret", "hidden", "console", "devtools"], action: () => setIsOpen(false) },
    { id: "ee-install", label: "Run: curl -fsSL portfolio-two-coral-84.vercel.app/install.sh | bash", category: "Easter Eggs", shortcut: "5", keywords: ["easter", "eggs", "secret", "hidden", "install", "curl", "terminal"], action: () => setIsOpen(false) },
    { id: "ee-404", label: "Visit a broken link for a custom 404", category: "Easter Eggs", shortcut: "6", keywords: ["easter", "eggs", "secret", "hidden", "404", "not found"], action: () => window.open("/404-easter-egg", "_self") },
    { id: "ee-barrel", label: "Do a barrel roll!", category: "Easter Eggs", shortcut: "7", keywords: ["easter", "eggs", "secret", "hidden", "barrel", "roll", "spin"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("barrel-roll")), 300) } },
    { id: "ee-matrix", label: "Enter the Matrix", category: "Easter Eggs", shortcut: "8", keywords: ["easter", "eggs", "secret", "hidden", "matrix", "neo", "rain"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("matrix-rain")), 300) } },
    { id: "ee-admin", label: "Access /admin (classified)", category: "Easter Eggs", shortcut: "9", keywords: ["easter", "eggs", "secret", "hidden", "admin", "hack", "classified"], action: () => window.open("/admin", "_self") },
    { id: "ee-highlight", label: "Highlight text in the About section", category: "Easter Eggs", shortcut: "10", keywords: ["easter", "eggs", "secret", "hidden", "highlight", "select", "about"], action: () => { scrollTo("#about"); setIsOpen(false) } },
    { id: "ee-rage", label: "Click really fast (10x in 2 sec)", category: "Easter Eggs", shortcut: "11", keywords: ["easter", "eggs", "secret", "hidden", "rage", "click", "fast"], action: () => setIsOpen(false) },
    { id: "ee-light", label: "Let there be light!", category: "Easter Eggs", shortcut: "12", keywords: ["easter", "eggs", "secret", "hidden", "light", "white", "eyes", "flash"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("let-there-be-light")), 300) } },
    { id: "ee-cake", label: "The cake is a lie.", category: "Easter Eggs", shortcut: "13", keywords: ["easter", "eggs", "secret", "hidden", "cake", "lie", "portal", "glados", "aperture", "still alive"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("the-cake-is-a-lie")), 300) } },
    { id: "ee-cube", label: "Summon Companion Cube ♥", category: "Easter Eggs", shortcut: "14", keywords: ["easter", "eggs", "secret", "hidden", "companion", "cube", "portal", "weighted"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("companion-cube")), 300) } },
    { id: "ee-cave", label: "Cave Johnson motivational speech", category: "Easter Eggs", shortcut: "15", keywords: ["easter", "eggs", "secret", "hidden", "cave", "johnson", "lemons", "portal", "aperture"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("cave-johnson")), 300) } },
    { id: "ee-space", label: "SPAAACE!", category: "Easter Eggs", shortcut: "16", keywords: ["easter", "eggs", "secret", "hidden", "space", "core", "portal"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("space-core")), 300) } },
    { id: "ee-turret", label: "Turrets are watching... (scroll to find)", category: "Easter Eggs", shortcut: "17", keywords: ["easter", "eggs", "secret", "hidden", "turret", "portal", "sentry", "are you still there"], action: () => setIsOpen(false) },
    { id: "ee-portals", label: "Portal transitions on nav links", category: "Easter Eggs", shortcut: "18", keywords: ["easter", "eggs", "secret", "hidden", "portal", "transition", "orange", "blue"], action: () => setIsOpen(false) },
    { id: "ee-rick", label: "Never Gonna Give You Up", category: "Easter Eggs", shortcut: "19", keywords: ["easter", "eggs", "secret", "hidden", "rick", "roll", "rickroll", "astley", "never gonna", "give you up"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("rick-roll")), 300) } },
    { id: "ee-feelgood", label: "Feel Good Inc.", category: "Easter Eggs", shortcut: "20", keywords: ["easter", "eggs", "secret", "hidden", "gorillaz", "feel good", "laugh", "ha ha", "island"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("feel-good-inc")), 300) } },
    { id: "ee-visualizer", label: "Gorillaz Visualizer", category: "Easter Eggs", shortcut: "21", keywords: ["easter", "eggs", "secret", "hidden", "gorillaz", "visualizer", "music", "bars", "demon days"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("gorillaz-visualizer")), 300) } },
    { id: "ee-dare", label: "It's DARE!", category: "Easter Eggs", shortcut: "22", keywords: ["easter", "eggs", "secret", "hidden", "gorillaz", "dare", "head", "coming up"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("dare-head")), 300) } },
    { id: "ee-hlah", label: "Head Like a Hole", category: "Easter Eggs", shortcut: "23", keywords: ["easter", "eggs", "secret", "hidden", "nin", "nine inch nails", "head", "hole", "black", "soul"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("head-like-a-hole")), 300) } },
    { id: "ee-only", label: "Only", category: "Easter Eggs", shortcut: "24", keywords: ["easter", "eggs", "secret", "hidden", "nin", "nine inch nails", "only", "with teeth"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("nin-only")), 300) } },
    { id: "ee-alive", label: "As Alive as You Need Me To Be", category: "Easter Eggs", shortcut: "25", keywords: ["easter", "eggs", "secret", "hidden", "nin", "nine inch nails", "alive", "ghosts", "locusts"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("nin-alive")), 300) } },
    { id: "ee-gameboy", label: "Game Boy Startup", category: "Easter Eggs", shortcut: "26", keywords: ["easter", "eggs", "secret", "hidden", "gameboy", "game boy", "nintendo", "retro", "startup", "boot"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("gameboy-boot")), 300) } },
    { id: "ee-snake", label: "Play Snake", category: "Arcade", shortcut: "1", keywords: ["game", "play", "snake", "retro", "atari", "arcade", "classic"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("snake-game")), 300) } },
    { id: "ee-invaders", label: "Play Space Invaders", category: "Arcade", shortcut: "2", keywords: ["game", "play", "space invaders", "retro", "atari", "arcade", "aliens", "classic", "shoot"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("space-invaders")), 300) } },
    { id: "ee-pong", label: "Play Pong", category: "Arcade", shortcut: "3", keywords: ["game", "play", "pong", "retro", "atari", "arcade", "classic", "paddle"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("pong-game")), 300) } },
    { id: "ee-breakout", label: "Play Breakout", category: "Arcade", shortcut: "4", keywords: ["game", "play", "breakout", "retro", "atari", "arcade", "classic", "bricks"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("breakout-game")), 300) } },
    { id: "ee-asteroids", label: "Play Asteroids", category: "Arcade", shortcut: "5", keywords: ["game", "play", "asteroids", "retro", "atari", "arcade", "classic", "space", "shoot"], action: () => { setIsOpen(false); setTimeout(() => window.dispatchEvent(new Event("asteroids-game")), 300) } },
  ]

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  const filtered = commands.filter(cmd => {
    const q = query.toLowerCase()
    return cmd.label.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords?.some(kw => q.length >= kw.length && q.includes(kw.toLowerCase())) || false
  })

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  const executeSelected = useCallback(() => {
    if (filtered[selectedIndex]) {
      filtered[selectedIndex].action()
      setIsOpen(false)
    }
  }, [filtered, selectedIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(prev => !prev)
        setQuery("")
        setSelectedIndex(0)
      }
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      executeSelected()
    }
  }

  const iconForCategory = (category: string) => {
    switch (category) {
      case "Navigate": return <ArrowRight className="w-3 h-3" />
      case "Action": return <Mail className="w-3 h-3" />
      case "Social": return <ExternalLink className="w-3 h-3" />
      default: return null
    }
  }

  let flatIndex = -1

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg bg-card border border-chart-2/30 shadow-[0_0_40px_rgba(0,255,255,0.1)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-2 bg-secondary/80 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-chart-1 terminal-dot" />
                  <div className="w-2 h-2 bg-chart-4 terminal-dot" />
                  <div className="w-2 h-2 bg-chart-2 terminal-dot" />
                </div>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  command_palette
                </span>
              </div>
              <span className="text-xs font-mono text-chart-2/40">ESC to close</span>
            </div>

            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-chart-2/60" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-sm font-mono outline-none placeholder:text-muted-foreground/50"
              />
              <kbd className="px-2 py-0.5 text-xs font-mono bg-secondary text-muted-foreground border border-border">
                ⌘K
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {Object.entries(grouped).length === 0 && (
                <p className="text-center text-sm text-muted-foreground/50 font-mono py-8">
                  No results found.
                </p>
              )}
              {Object.entries(grouped).map(([category, cmds]) => (
                <div key={category} className="mb-2">
                  <p className="text-xs font-mono text-chart-1/50 uppercase tracking-widest px-3 py-1">
                    {`// ${category}`}
                  </p>
                  {cmds.map((cmd) => {
                    flatIndex++
                    const idx = flatIndex
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => { cmd.action(); setIsOpen(false) }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-mono transition-colors ${
                          idx === selectedIndex
                            ? "bg-chart-2/10 text-chart-2"
                            : "text-muted-foreground hover:bg-chart-2/5 hover:text-foreground"
                        }`}
                      >
                        <span className="text-chart-2/50">{iconForCategory(category)}</span>
                        <span className="flex-1 text-left">{cmd.label}</span>
                        {cmd.shortcut && (
                          <kbd className="px-1.5 py-0.5 text-xs bg-secondary/50 text-muted-foreground/50 border border-border/50">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
