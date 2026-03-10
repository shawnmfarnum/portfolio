"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, MapPin, Github, Linkedin, ArrowUpRight, CodepenIcon, Dribbble } from "lucide-react"
import { siteConfig } from "@/lib/data"

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const links = [
    {
      label: "Email",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      icon: Mail,
    },
    {
      label: "LinkedIn",
      value: "Connect on LinkedIn",
      href: siteConfig.social.linkedin,
      icon: Linkedin,
    },
    {
      label: "GitHub",
      value: "View my code",
      href: siteConfig.social.github,
      icon: Github,
    },
    {
      label: "CodePen",
      value: "See my experiments",
      href: siteConfig.social.codepen,
      icon: CodepenIcon,
    },
    {
      label: "Dribbble",
      value: "View my shots",
      href: siteConfig.social.dribbble,
      icon: Dribbble,
    },
  ]

  return (
    <section id="contact" className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Horizon glow line */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-pink), var(--neon-cyan), transparent)",
        }}
      />
      
      <div className="max-w-4xl mx-auto relative">
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
              ESTABLISH_CONNECTION
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl mb-4 chromatic-text">{"Let's Work Together"}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Open to full-time roles, collaborations, and interesting side projects. 
            If you&apos;re building something meaningful, I&apos;d love to hear about it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {links.map((link, index) => {
            const Icon = link.icon
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group flex items-center gap-3 px-5 py-3 bg-card border border-chart-2/30 hover:border-chart-2 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all duration-300"
              >
                <Icon className="w-4 h-4 text-chart-2" />
                <span className="font-mono text-sm whitespace-nowrap group-hover:text-chart-2 transition-colors">
                  {link.label}
                </span>
                <ArrowUpRight className="w-3 h-3 text-chart-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            )
          })}
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-3 mt-12"
        >
          <MapPin className="w-4 h-4 text-chart-1" />
          <span className="text-sm font-mono text-muted-foreground group/loc cursor-default">
            <span className="text-chart-1/60">LOC:</span>{' '}
            <span className="group-hover/loc:hidden">{siteConfig.location}</span>
            <span className="hidden group-hover/loc:inline">45.6770°N, 111.0429°W</span>
          </span>
        </motion.div>
      </div>
    </section>
  )
}
