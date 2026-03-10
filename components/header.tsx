"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/data"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [typedText, setTypedText] = useState("")
  const fullCommand = "curl -fsSL https://shawnfarnum.com/install.sh"

  useEffect(() => {
    let i = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < fullCommand.length) {
          setTypedText(fullCommand.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
        }
      }, 50)
      return () => clearInterval(interval)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-lg border-b border-chart-2/20"
            : "bg-transparent"
        }`}
      >
        {/* Top accent line */}
        {isScrolled && (
          <div 
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-pink), var(--neon-cyan), transparent)",
            }}
          />
        )}
        
        <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollToSection("#hero")}
            className="group flex items-center gap-3 hover:opacity-80 transition-all"
          >
            <span className="font-mono text-sm tracking-widest flex items-center">
              <span>
                {typedText.length <= 4 && <span className="text-chart-2/60">{typedText}</span>}
                {typedText.length > 4 && typedText.length <= 10 && (
                  <><span className="text-chart-2/60">curl </span><span className="text-chart-1/70">{typedText.slice(5)}</span></>
                )}
                {typedText.length > 10 && (
                  <><span className="text-chart-2/60">curl </span><span className="text-chart-1/70">-fsSL </span><span className="text-blue-400/80">{typedText.slice(11)}</span></>
                )}
              </span>
              <span className="ml-0.5 w-[6px] h-[14px] bg-chart-2 inline-block animate-pulse" />
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="group text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-chart-2 transition-all"
              >
                <span className="text-chart-1/60 group-hover:text-chart-1">[{String(index + 1).padStart(2, '0')}]</span>
                <span className="ml-1">{link.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu - Cyberpunk style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg pt-20 md:hidden scanlines"
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 grid-bg opacity-30" />
            
            <nav className="relative flex flex-col items-center gap-6 p-8">
              <div className="text-xs font-mono text-chart-2/60 mb-4 uppercase tracking-widest">
                {'// NAVIGATION_MENU'}
              </div>
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(link.href)}
                  className="text-xl font-mono uppercase tracking-wider hover:text-chart-2 transition-colors flex items-center gap-3"
                >
                  <span className="text-chart-1 text-sm">[{String(index + 1).padStart(2, '0')}]</span>
                  {link.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
