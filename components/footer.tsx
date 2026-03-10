"use client"

import { siteConfig } from "@/lib/data"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 px-6 border-t border-chart-2/20 relative">
      {/* Top glow line */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-pink), var(--neon-cyan), transparent)",
          opacity: 0.5,
        }}
      />
      
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          <span className="text-chart-1/60">{'>'}</span> {currentYear} <span className="text-chart-2">{siteConfig.name}</span>
        </p>
      </div>
    </footer>
  )
}
