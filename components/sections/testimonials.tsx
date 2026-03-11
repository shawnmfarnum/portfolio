"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { testimonials } from "@/lib/data"

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Hide section entirely when no testimonials exist
  if (testimonials.length === 0) return null

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-24 md:py-32 px-6 bg-secondary/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <div className="max-w-4xl mx-auto relative">
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
              NETWORK_FEEDBACK
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl chromatic-text">What People Say</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Cyberpunk card container */}
          <div className="bg-card border border-chart-2/30 p-8 md:p-12 relative overflow-hidden hover:border-chart-2/50 transition-all duration-500">
            {/* Scanlines */}
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-chart-2" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-chart-1" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-chart-1" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-chart-2" />
            
            {/* Quote icon */}
            <Quote className="absolute -top-2 left-6 w-12 h-12 text-chart-1/20" />

            {/* Carousel */}
            <div className="relative overflow-hidden min-h-[240px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="text-xs font-mono text-chart-2/60 mb-6">
                    {'// USER_FEEDBACK['}
                    <span className="text-chart-2">{currentIndex}</span>
                    {']'}
                  </div>
                  <blockquote className="font-serif text-xl md:text-2xl leading-relaxed mb-8 text-pretty">
                    &ldquo;{testimonials[currentIndex].quote}&rdquo;
                  </blockquote>
                  <div>
                    {testimonials[currentIndex].name && (
                      <p className="font-mono text-chart-2 uppercase tracking-wider">{testimonials[currentIndex].name}</p>
                    )}
                    {(testimonials[currentIndex].title || testimonials[currentIndex].company) && (
                      <p className="text-sm text-muted-foreground font-mono">
                        {[testimonials[currentIndex].title, testimonials[currentIndex].company].filter(Boolean).join(" @ ")}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="border-chart-2/30 hover:border-chart-2 hover:bg-chart-2/10 hover:text-chart-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 transition-all ${
                    index === currentIndex 
                      ? "bg-chart-2 shadow-[0_0_8px_rgba(0,255,255,0.5)]" 
                      : "bg-muted-foreground/30 hover:bg-chart-1/50"
                  }`}
                >
                  <span className="sr-only">Go to testimonial {index + 1}</span>
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="border-chart-2/30 hover:border-chart-2 hover:bg-chart-2/10 hover:text-chart-2"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
