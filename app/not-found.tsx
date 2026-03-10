"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 scanlines opacity-30" />
      
      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--neon-pink) 0%, transparent 60%)" }}
        animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--neon-cyan) 0%, transparent 60%)" }}
        animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative text-center max-w-lg">
        {/* Error badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-chart-1/40 bg-chart-1/5"
        >
          <span className="w-1.5 h-1.5 bg-chart-1 terminal-dot animate-pulse" />
          <span className="text-chart-1 text-xs font-mono uppercase tracking-widest">
            ERR_404 // ACCESS_DENIED
          </span>
        </motion.div>

        {/* Big 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-[8rem] md:text-[12rem] font-mono font-bold leading-none chromatic-text"
            style={{ textShadow: "0 0 40px var(--neon-pink), 0 0 80px rgba(255,0,128,0.3)" }}
          >
            404
          </h1>
        </motion.div>

        {/* Terminal output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-card border border-chart-2/30 overflow-hidden text-left inline-block w-full">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/80 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-chart-1 terminal-dot" />
                <div className="w-2 h-2 bg-chart-4 terminal-dot" />
                <div className="w-2 h-2 bg-chart-2 terminal-dot" />
              </div>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                error.log
              </span>
            </div>
            <div className="p-4 font-mono text-sm space-y-1">
              <p className="text-chart-1">{'>'} ERROR: Route not found in filesystem</p>
              <p className="text-muted-foreground">{'>'} Searched all known paths...</p>
              <p className="text-muted-foreground">{'>'} Status: <span className="text-chart-1">FAILED</span></p>
              <p className="text-chart-2 mt-2">{'>'} Suggestion: Return to home base</p>
            </div>
          </div>
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/">
            <Button
              variant="outline"
              className="font-mono uppercase tracking-wider border-chart-2/30 hover:border-chart-2 hover:bg-chart-2/10 hover:text-chart-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {'<< RETURN_TO_HOME'}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
