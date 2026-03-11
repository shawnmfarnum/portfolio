"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects, type Project } from "@/lib/data"

/** Renders long-form text with paragraph breaks and optional ALL-CAPS subsection headers */
function TextBlock({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.split("\n\n").filter(Boolean)

  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, i) => {
        const trimmed = block.trim()
        // Detect ALL-CAPS lines as subsection headers (e.g. "VISUAL DESIGN: THE COLOR LANGUAGE OF MONEY")
        const isAllCapsHeader = /^[A-Z][A-Z0-9 —:&/\-–·,''()]+$/.test(trimmed) && trimmed.length > 5 && trimmed.length < 120
        // Detect short mixed-case lines ending in colon as section labels (e.g. "What's Next:")
        const isSectionLabel = /^[A-Z][A-Za-z0-9 ''&/\-]+:$/.test(trimmed) && trimmed.length > 5 && trimmed.length < 60
        const isHeader = isAllCapsHeader || isSectionLabel

        if (isHeader) {
          return (
            <div key={i} className="pt-6 first:pt-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-6 h-px bg-chart-2/40" />
                <span className="text-chart-2 text-xs font-mono uppercase tracking-widest">
                  {trimmed}
                </span>
                <div className="flex-1 h-px bg-chart-2/20" />
              </div>
            </div>
          )
        }

        return (
          <p key={i} className="text-muted-foreground leading-relaxed">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

type DesignDecision = { title: string; insight: string; decision: string; afterHeader?: string }

function DecisionCallout({ dd, index }: { dd: DesignDecision; index: number }) {
  return (
    <div className="relative border border-chart-1/40 bg-chart-1/5 p-6 my-6">
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-chart-1" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-chart-2" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-chart-2" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-chart-1" />
      <p className="text-chart-1 text-xs font-mono uppercase tracking-widest mb-3">
        {`// KEY_DECISION_${String(index + 1).padStart(2, '0')}`}
      </p>
      <h3 className="font-serif text-xl mb-4 text-gradient">{dd.title}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        <span className="text-chart-3 font-mono">INSIGHT:</span> {dd.insight}
      </p>
      <p className="text-sm text-muted-foreground">
        <span className="text-chart-2 font-mono">OUTPUT:</span> {dd.decision}
      </p>
    </div>
  )
}

/** Like TextBlock but injects design decision callouts after their matching subsection */
function TextBlockWithDecisions({
  text,
  decisions,
  className = "",
}: {
  text: string
  decisions: DesignDecision[]
  className?: string
}) {
  const blocks = text.split("\n\n").filter(Boolean)

  // Build a map from header text to matching decisions (by afterHeader prefix)
  const decisionsByHeader: Record<string, { dd: DesignDecision; globalIndex: number }[]> = {}
  decisions.forEach((dd, i) => {
    if (dd.afterHeader) {
      const key = dd.afterHeader.toUpperCase()
      if (!decisionsByHeader[key]) decisionsByHeader[key] = []
      decisionsByHeader[key].push({ dd, globalIndex: i })
    }
  })

  // Find which header each block index belongs to
  let currentHeader = ""
  const blockHeaders: string[] = blocks.map((block) => {
    const trimmed = block.trim()
    const isAllCaps = /^[A-Z][A-Z0-9 —:&/\-–·,''()]+$/.test(trimmed) && trimmed.length > 5 && trimmed.length < 120
    if (isAllCaps) currentHeader = trimmed
    return currentHeader
  })

  // Find the last block index for each header group (insert decisions after that block)
  const lastBlockForHeader: Record<string, number> = {}
  blockHeaders.forEach((h, i) => {
    if (h) lastBlockForHeader[h] = i
  })

  const elements: React.ReactNode[] = []
  blocks.forEach((block, i) => {
    const trimmed = block.trim()
    const isAllCapsHeader = /^[A-Z][A-Z0-9 —:&/\-–·,''()]+$/.test(trimmed) && trimmed.length > 5 && trimmed.length < 120
    const isSectionLabel = /^[A-Z][A-Za-z0-9 ''&/\-]+:$/.test(trimmed) && trimmed.length > 5 && trimmed.length < 60
    const isHeader = isAllCapsHeader || isSectionLabel

    if (isHeader) {
      elements.push(
        <div key={`h-${i}`} className="pt-6 first:pt-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-6 h-px bg-chart-2/40" />
            <span className="text-chart-2 text-xs font-mono uppercase tracking-widest">
              {trimmed}
            </span>
            <div className="flex-1 h-px bg-chart-2/20" />
          </div>
        </div>
      )
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-muted-foreground leading-relaxed">
          {trimmed}
        </p>
      )
    }

    // Check if this is the last block under any header that has matching decisions
    const header = blockHeaders[i]
    if (header && lastBlockForHeader[header] === i) {
      // Find decisions whose afterHeader is a prefix of this header
      Object.entries(decisionsByHeader).forEach(([prefix, dds]) => {
        if (header.toUpperCase().startsWith(prefix)) {
          dds.forEach(({ dd, globalIndex }) => {
            elements.push(<DecisionCallout key={`dd-${globalIndex}`} dd={dd} index={globalIndex} />)
          })
        }
      })
    }
  })

  // Render any decisions without a matching header at the end
  const matchedHeaders = new Set<string>()
  Object.entries(decisionsByHeader).forEach(([prefix]) => {
    Object.keys(lastBlockForHeader).forEach((h) => {
      if (h.toUpperCase().startsWith(prefix)) matchedHeaders.add(prefix)
    })
  })
  decisions.forEach((dd, i) => {
    if (dd.afterHeader && !matchedHeaders.has(dd.afterHeader.toUpperCase())) {
      elements.push(<DecisionCallout key={`dd-orphan-${i}`} dd={dd} index={i} />)
    }
    if (!dd.afterHeader) {
      elements.push(<DecisionCallout key={`dd-noanchor-${i}`} dd={dd} index={i} />)
    }
  })

  return <div className={`space-y-4 ${className}`}>{elements}</div>
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative bg-card overflow-hidden border border-border mb-4 group-hover:border-chart-2/50 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]">
        {/* Cyberpunk terminal header */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/80 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-chart-1 terminal-dot" />
              <div className="w-2 h-2 bg-chart-4 terminal-dot" />
              <div className="w-2 h-2 bg-chart-2 terminal-dot" />
            </div>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {project.id}.sys
            </span>
          </div>
          <span className="text-xs font-mono text-chart-2/60">
            [{project.tags[0]}]
          </span>
        </div>
        
        <div className="relative aspect-[4/3] bg-background/50 overflow-hidden">
          {/* Scanline overlay */}
          <div className="absolute inset-0 scanlines pointer-events-none opacity-50" />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 via-transparent to-chart-2/5" />
          
          {/* Code preview with neon styling */}
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <div className="font-mono text-xs space-y-1 text-chart-2/40">
              <p>{'>'} <span className="text-chart-1/60">LOADING</span> {project.id}.module</p>
              <p>{'>'} STATUS: <span className="text-chart-2">DEPLOYED</span></p>
              <p>{'>'} <span className="text-muted-foreground/40">████████████</span> 100%</p>
            </div>
          </div>
          
          {/* Hover action button */}
          <div className="absolute inset-0 bg-chart-2/0 group-hover:bg-chart-2/5 transition-colors duration-300" />
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="px-3 py-2 bg-chart-2 text-background font-mono text-xs uppercase tracking-wider flex items-center gap-2">
              ACCESS
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="font-serif text-xl mb-2 group-hover:text-chart-2 transition-colors chromatic-text">
        {project.title}
      </h3>
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag, i) => (
          <span
            key={tag}
            className={`px-2 py-1 text-xs font-mono uppercase tracking-wider ${
              i === 0 
                ? 'bg-chart-1/10 text-chart-1 border border-chart-1/30' 
                : 'bg-chart-2/10 text-chart-2 border border-chart-2/30'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  )
}

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md overflow-y-auto noise-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="fixed inset-0 scanlines pointer-events-none opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen py-8 px-6 relative"
      >
        <div className="max-w-4xl mx-auto">
          {/* Close button - cyberpunk style */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="fixed top-6 right-6 z-50 border border-chart-1/30 hover:border-chart-1 hover:bg-chart-1/10 hover:text-chart-1"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>

          {/* Terminal header bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-chart-2/30 bg-chart-2/5">
              <span className="w-1.5 h-1.5 bg-chart-2 terminal-dot animate-pulse" />
              <span className="text-chart-2 text-xs font-mono uppercase tracking-widest">
                CASE_STUDY // {project.id.toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-mono text-chart-3/60">
              [{project.tags[0]}]
            </span>
          </div>

          {/* Hero - cyberpunk frame */}
          <div className="bg-card border border-chart-2/30 overflow-hidden mb-8 relative">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-3 bg-secondary/80 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-chart-1 terminal-dot" />
                  <div className="w-2 h-2 bg-chart-4 terminal-dot" />
                  <div className="w-2 h-2 bg-chart-2 terminal-dot" />
                </div>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  preview.render
                </span>
              </div>
              <span className="text-xs font-mono text-chart-3/60">LIVE</span>
            </div>
            <div className="aspect-video bg-background/50 relative">
              <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
              <div className="w-full h-full bg-gradient-to-br from-chart-1/10 via-transparent to-chart-2/10 flex items-center justify-center">
                <span className="text-muted-foreground font-mono text-sm">[LOADING: {project.title}]</span>
              </div>
            </div>
          </div>

          {/* Title with chromatic effect */}
          <h1 className="font-serif text-3xl md:text-4xl mb-4 chromatic-text">{project.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">{project.description}</p>

          {/* Minto Pyramid Lead — the answer/outcome shown first */}
          {project.lead && (
            <div className="relative border-l-2 border-chart-2/40 pl-6 mb-8">
              <p className="text-muted-foreground leading-relaxed">{project.lead}</p>
            </div>
          )}

          {/* Quick Stats - Terminal style */}
          <div className="bg-card border border-chart-2/30 mb-12 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-secondary/80 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-chart-1 terminal-dot" />
                  <div className="w-2 h-2 bg-chart-4 terminal-dot" />
                  <div className="w-2 h-2 bg-chart-2 terminal-dot" />
                </div>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  project.metadata
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
              <div>
                <p className="text-xs font-mono text-chart-1/60 uppercase tracking-wider mb-1">ROLE</p>
                <p className="font-mono text-sm text-chart-2">{project.role}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-chart-1/60 uppercase tracking-wider mb-1">TEAM</p>
                <p className="font-mono text-sm text-chart-2">{project.team}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-chart-1/60 uppercase tracking-wider mb-1">TIMELINE</p>
                <p className="font-mono text-sm text-chart-2">{project.timeline}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-chart-1/60 uppercase tracking-wider mb-1">STACK</p>
                <p className="font-mono text-sm text-chart-2">{project.tools.slice(0, 3).join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-chart-1 font-mono text-sm">[01]</span>
                <h2 className="font-serif text-2xl chromatic-text">{project.sectionHeadings?.problem ?? "The Problem"}</h2>
              </div>
              <TextBlock text={project.problem} className="pl-10" />
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-chart-1 font-mono text-sm">[02]</span>
                <h2 className="font-serif text-2xl chromatic-text">{project.sectionHeadings?.research ?? "Research & Discovery"}</h2>
              </div>
              <TextBlock text={project.research} className="pl-10" />
            </section>

            {/* Artifacts */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-chart-1 font-mono text-sm">[03]</span>
                <h2 className="font-serif text-2xl chromatic-text">{project.sectionHeadings?.artifacts ?? "Process Artifacts"}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4 pl-10">
                {project.artifacts.map((artifact, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-card border border-chart-2/30 overflow-hidden hover:border-chart-2/60 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                      <div className="px-3 py-2 bg-secondary/80 border-b border-border flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-chart-3 terminal-dot" />
                        <span className="text-xs font-mono text-muted-foreground uppercase">{artifact.type}</span>
                      </div>
                      <div className="aspect-[4/3] bg-background/50 relative">
                        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
                        <div className="w-full h-full bg-gradient-to-br from-chart-1/5 to-chart-2/5 flex items-center justify-center">
                          <span className="text-chart-2/40 font-mono text-xs">[IMG]</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{artifact.caption}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-chart-1 font-mono text-sm">[04]</span>
                <h2 className="font-serif text-2xl chromatic-text">{project.sectionHeadings?.design ?? "Design"}</h2>
              </div>
              {project.designDecisions?.some(dd => dd.afterHeader) ? (
                <TextBlockWithDecisions
                  text={project.design}
                  decisions={project.designDecisions}
                  className="pl-10"
                />
              ) : (
                <>
                  <TextBlock text={project.design} className="pl-10" />
                  {(project.designDecisions ?? [project.designDecision]).map((dd, ddIndex) => (
                    <DecisionCallout key={ddIndex} dd={dd} index={ddIndex} />
                  ))}
                </>
              )}
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-chart-1 font-mono text-sm">[05]</span>
                <h2 className="font-serif text-2xl chromatic-text">{project.sectionHeadings?.outcome ?? "Outcome"}</h2>
              </div>
              <TextBlock text={project.outcome} className="pl-10" />
            </section>

            {/* Tools - Neon tags */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-chart-1 font-mono text-sm">[06]</span>
                <h2 className="font-serif text-2xl chromatic-text">Tools & Methods</h2>
              </div>
              <div className="flex flex-wrap gap-2 pl-10">
                {project.tools.map((tool, i) => (
                  <span
                    key={tool}
                    className={`px-3 py-1 text-xs font-mono uppercase tracking-wider ${
                      i % 3 === 0
                        ? 'bg-chart-1/10 text-chart-1 border border-chart-1/30'
                        : i % 3 === 1
                        ? 'bg-chart-2/10 text-chart-2 border border-chart-2/30'
                        : 'bg-chart-3/10 text-chart-3 border border-chart-3/30'
                    }`}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Back button - Cyberpunk style */}
          <div className="mt-12 pt-8 border-t border-chart-2/20">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="font-mono uppercase tracking-wider border-chart-2/30 hover:border-chart-2 hover:bg-chart-2/10 hover:text-chart-2"
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              {'<< RETURN_TO_INDEX'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <>
      <section id="work" className="py-24 md:py-32 px-6 bg-secondary/30 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 grid-bg opacity-50" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-chart-1/30 bg-chart-1/5">
              <span className="w-1.5 h-1.5 bg-chart-1 terminal-dot animate-pulse" />
              <span className="text-chart-1 text-xs font-mono uppercase tracking-widest">
                PORTFOLIO_DATABASE
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl mb-4 chromatic-text">Case Studies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Exploring the intersection of research, design, and code across 
              fintech, healthcare, and emerging tech.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <CaseStudyModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
