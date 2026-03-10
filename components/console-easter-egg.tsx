"use client"

import { useEffect } from "react"
import { siteConfig, projects, testimonials, processSteps } from "@/lib/data"

export function ConsoleEasterEgg() {
  useEffect(() => {
    const cyan = "color: #00ffc8; font-weight: bold; font-size: 14px;"
    const pink = "color: #ff0080; font-weight: bold; font-size: 14px;"
    const dim = "color: #666; font-size: 11px;"
    const normal = "color: #ccc; font-size: 12px;"
    const heading = "color: #00ffc8; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 2px;"
    const subheading = "color: #ff0080; font-weight: bold; font-size: 13px;"
    const tag = "color: #00ffc8; font-size: 11px; background: rgba(0,255,200,0.1); padding: 2px 6px; border-radius: 2px;"
    const separator = "color: #333; font-size: 10px;"

    const line = "─".repeat(60)
    const doubleLine = "═".repeat(60)

    // ═══════════════════════════════════════
    // HERO / BANNER
    // ═══════════════════════════════════════
    console.log(
      `%c
 ███████╗██╗  ██╗ █████╗ ██╗    ██╗███╗   ██╗
 ██╔════╝██║  ██║██╔══██╗██║    ██║████╗  ██║
 ███████╗███████║███████║██║ █╗ ██║██╔██╗ ██║
 ╚════██║██╔══██║██╔══██║██║███╗██║██║╚██╗██║
 ███████║██║  ██║██║  ██║╚███╔███╔╝██║ ╚████║
 ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═══╝
      `,
      cyan
    )

    console.log(
      `%c${doubleLine}`,
      separator
    )

    console.log(
      `%c> SYSTEM_STATUS: ONLINE\n` +
      `%c> ${siteConfig.title}\n` +
      `%c> ${siteConfig.tagline}\n` +
      `%c> LOC: ${siteConfig.location} — 45.6770°N, 111.0429°W`,
      pink, normal, normal, dim
    )

    console.log(`%c${doubleLine}`, separator)

    // ═══════════════════════════════════════
    // ABOUT
    // ═══════════════════════════════════════
    console.log(`\n%c[ USER_PROFILE ]`, heading)
    console.log(`%c${line}`, separator)

    console.log(
      `%cBridging design and engineering — I speak both languages fluently.\n\n` +
      `%cI'm a UI/UX designer and software developer who believes the best\n` +
      `digital experiences happen when design and engineering work as one.\n` +
      `My background spans fintech, healthcare, and emerging tech.\n\n` +
      `Currently pursuing a Master's in Human–Computer Interaction & Design\n` +
      `at UC Irvine. My work is design-led but technically informed. I\n` +
      `prototype in code, build design systems, and ship production interfaces.\n\n` +
      `%c[Fintech]  [Healthcare]  [Design Systems]  [HCI Research]`,
      subheading, normal, tag
    )

    // ═══════════════════════════════════════
    // CASE STUDIES
    // ═══════════════════════════════════════
    console.log(`\n%c${doubleLine}`, separator)
    console.log(`%c[ CASE_STUDIES ]`, heading)
    console.log(`%c${line}`, separator)

    projects.forEach((project, i) => {
      console.log(
        `\n%c${i + 1}. ${project.title}\n` +
        `%c   ${project.description}\n` +
        `%c   Role: ${project.role}  |  Team: ${project.team}  |  Timeline: ${project.timeline}\n` +
        `%c   ${project.tags.map(t => `[${t}]`).join("  ")}`,
        subheading, normal, dim, tag
      )
    })

    // ═══════════════════════════════════════
    // PROCESS (DOUBLE DIAMOND)
    // ═══════════════════════════════════════
    console.log(`\n%c${doubleLine}`, separator)
    console.log(`%c[ PROCESS // DOUBLE_DIAMOND ]`, heading)
    console.log(`%c${line}`, separator)

    console.log(
      `%c   ◆ Diamond 1: Problem Space          ◆ Diamond 2: Solution Space`,
      dim
    )

    processSteps.forEach((step) => {
      const icon = step.mode === "diverge" ? "◀▶" : "▶◀"
      console.log(
        `\n%c   ${icon} ${step.title.toUpperCase()} (${step.mode})\n` +
        `%c      ${step.description}\n` +
        `%c      ${step.tools.join(" · ")}`,
        subheading, normal, dim
      )
    })

    // ═══════════════════════════════════════
    // TESTIMONIALS
    // ═══════════════════════════════════════
    console.log(`\n%c${doubleLine}`, separator)
    console.log(`%c[ TESTIMONIALS ]`, heading)
    console.log(`%c${line}`, separator)

    testimonials.forEach((t) => {
      console.log(
        `\n%c   "${t.quote}"\n` +
        `%c   — ${t.name}, ${t.title} @ ${t.company}`,
        normal, pink
      )
    })

    // ═══════════════════════════════════════
    // CONTACT
    // ═══════════════════════════════════════
    console.log(`\n%c${doubleLine}`, separator)
    console.log(`%c[ CONTACT ]`, heading)
    console.log(`%c${line}`, separator)

    console.log(
      `%c   ✉  ${siteConfig.email}\n` +
      `   🔗 ${siteConfig.social.linkedin}\n` +
      `   🐙 ${siteConfig.social.github}\n` +
      `   ✏️  ${siteConfig.social.codepen}\n` +
      `   🏀 ${siteConfig.social.dribbble}`,
      normal
    )

    // ═══════════════════════════════════════
    // FOOTER / CTA
    // ═══════════════════════════════════════
    console.log(`\n%c${doubleLine}`, separator)

    console.log(
      `%c\n👋 Hey, you found the console. Nice detective work.\n\n` +
      `Since you're here, you probably appreciate clean code.\n` +
      `This site is built with Next.js, Tailwind CSS, and Framer Motion.\n\n` +
      `Try ⌘K for the command palette.\n` +
      `Or the Konami code if you're feeling nostalgic. ↑↑↓↓←→←→BA\n`,
      normal
    )

    console.log(
      `%c> Want to work together? %c${siteConfig.email}\n`,
      dim, cyan
    )

    console.log(`%c${doubleLine}\n`, separator)
  }, [])

  return null
}
