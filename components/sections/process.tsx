"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Search, Target, PenTool, Rocket } from "lucide-react"
import { processSteps } from "@/lib/data"

const icons = {
  discover: Search,
  define: Target,
  develop: PenTool,
  deliver: Rocket,
}

export function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="process" className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-chart-2/30 bg-chart-2/5">
            <span className="w-1.5 h-1.5 bg-chart-2 terminal-dot animate-pulse" />
            <span className="text-chart-2 text-xs font-mono uppercase tracking-widest">
              WORKFLOW_PROTOCOL
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl mb-4 chromatic-text">How I Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A design-to-code process rooted in HCI research methodology, 
            adapted for shipping real products.
          </p>
        </motion.div>

        {/* Desktop: Double Diamond */}
        <div className="hidden lg:block">
          <div className="bg-card border border-chart-2/30 overflow-hidden hover:border-chart-2/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-3 bg-secondary/80 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-chart-1 terminal-dot" />
                  <div className="w-2 h-2 bg-chart-4 terminal-dot" />
                  <div className="w-2 h-2 bg-chart-2 terminal-dot" />
                </div>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  double_diamond.sys
                </span>
              </div>
              <span className="text-xs font-mono text-chart-2/60">EXECUTING...</span>
            </div>
            
            <div className="p-8">
              {/* 4-step grid */}
              <div className="grid grid-cols-4 gap-8">
                {processSteps.map((step, index) => {
                  const Icon = icons[step.id as keyof typeof icons]
                  const isDiamond1 = step.diamond === 1
                  const accentColor = isDiamond1 ? 'chart-1' : 'chart-2'
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative group"
                    >
                      {/* Phase label */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-mono text-${accentColor}/50 select-none`}>
                          [{String(index + 1).padStart(2, '0')}]
                        </span>
                        <span className={`text-xs font-mono text-${accentColor}/60 uppercase`}>
                          {step.mode === 'diverge' ? '◇ DIVERGE' : '◆ CONVERGE'}
                        </span>
                      </div>
                      
                      {/* Icon */}
                      <div className={`relative z-10 w-14 h-14 mx-auto mb-4 bg-secondary/50 border border-${accentColor}/30 flex items-center justify-center group-hover:border-${accentColor} group-hover:bg-${accentColor}/10 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all`}>
                        <Icon className={`w-5 h-5 text-${accentColor}/60 group-hover:text-${accentColor} transition-colors`} />
                      </div>
                      
                      {/* Content */}
                      <div className="text-center">
                        <h3 className="font-medium text-sm mb-2 font-mono uppercase tracking-wide">{step.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap justify-center gap-1">
                          {step.tools.slice(0, 3).map((tool, i) => (
                            <span
                              key={tool}
                              className={`px-2 py-0.5 text-xs font-mono ${
                                isDiamond1 ? 'bg-chart-1/10 text-chart-1' : 'bg-chart-2/10 text-chart-2'
                              }`}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Arrow connector between diamonds */}
                      {index === 1 && (
                        <div className="absolute top-1/2 -right-5 text-chart-2/30 hidden xl:block font-mono text-sm">
                          {'→'}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Vertical Cards */}
        <div className="lg:hidden space-y-4">
          {[1, 2].map((diamond) => (
            <div key={diamond}>
              <div className={`text-xs font-mono uppercase tracking-widest mb-3 px-1 ${
                diamond === 1 ? 'text-chart-1/60' : 'text-chart-2/60'
              }`}>
                {diamond === 1 ? '◇ DIAMOND 1 — Problem Space' : '◇ DIAMOND 2 — Solution Space'}
              </div>
              <div className="space-y-3 mb-6">
                {processSteps.filter(s => s.diamond === diamond).map((step, index) => {
                  const Icon = icons[step.id as keyof typeof icons]
                  const globalIndex = diamond === 1 ? index : index + 2
                  const isDiamond1 = diamond === 1
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: globalIndex * 0.1 }}
                      className={`flex gap-4 p-5 bg-secondary/50 border ${
                        isDiamond1 ? 'border-chart-1/20' : 'border-chart-2/20'
                      }`}
                    >
                      <div className={`shrink-0 w-12 h-12 bg-background border ${
                        isDiamond1 ? 'border-chart-1/30' : 'border-chart-2/30'
                      } flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${
                          isDiamond1 ? 'text-chart-1/60' : 'text-chart-2/60'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-mono ${
                            isDiamond1 ? 'text-chart-1/50' : 'text-chart-2/50'
                          }`}>[0{globalIndex + 1}]</span>
                          <span className={`text-xs font-mono uppercase ${
                            isDiamond1 ? 'text-chart-1/40' : 'text-chart-2/40'
                          }`}>
                            {step.mode === 'diverge' ? '◇ DIVERGE' : '◆ CONVERGE'}
                          </span>
                        </div>
                        <h3 className="font-medium font-mono uppercase tracking-wide text-sm mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {step.tools.map((tool) => (
                            <span
                              key={tool}
                              className={`px-2 py-0.5 text-xs font-mono ${
                                isDiamond1 ? 'bg-chart-1/10 text-chart-1' : 'bg-chart-2/10 text-chart-2'
                              }`}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
