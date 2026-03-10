"use client"

import { useEffect } from "react"

const sections = [
  { key: "1", href: "#hero" },
  { key: "2", href: "#about" },
  { key: "3", href: "#work" },
  { key: "4", href: "#process" },
  { key: "5", href: "#testimonials" },
  { key: "6", href: "#contact" },
]

export function KeyboardNav() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or the command palette
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return
      // Don't trigger with modifier keys (to not conflict with Cmd+K, etc.)
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const section = sections.find(s => s.key === e.key)
      if (section) {
        const el = document.querySelector(section.href)
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return null
}
