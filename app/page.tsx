import { Header } from "@/components/header"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Projects } from "@/components/sections/projects"
import { Process } from "@/components/sections/process"
import { Testimonials } from "@/components/sections/testimonials"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"
import { KonamiEasterEgg } from "@/components/konami-easter-egg"
import { CommandPalette } from "@/components/command-palette"
import { ConsoleEasterEgg } from "@/components/console-easter-egg"
import { DynamicTabTitle } from "@/components/dynamic-tab-title"
import { KeyboardNav } from "@/components/keyboard-nav"
import { BarrelRoll } from "@/components/barrel-roll"
import { MatrixRain } from "@/components/matrix-rain"
import { LightFlash } from "@/components/light-flash"
import { PortalEasterEgg } from "@/components/portal-easter-egg"
import { CompanionCube } from "@/components/companion-cube"
import { SpaceCore } from "@/components/space-core"
import { CaveJohnson } from "@/components/cave-johnson"
import { PortalTransition } from "@/components/portal-transition"
import { RickRoll } from "@/components/rick-roll"
import { GorillazFeelGood } from "@/components/gorillaz-feel-good"
import { GorillazVisualizer } from "@/components/gorillaz-visualizer"
import { GorillazDare } from "@/components/gorillaz-dare"
import { NinHeadLikeAHole } from "@/components/nin-head-like-a-hole"
import { NinOnly } from "@/components/nin-only"
import { NinAlive } from "@/components/nin-alive"
import { GameBoyBoot } from "@/components/gameboy-boot"
import { AchievementSystem } from "@/components/achievement-system"
import { SnakeGame } from "@/components/snake-game"
import { SpaceInvaders } from "@/components/space-invaders"
import { PongGame } from "@/components/pong-game"
import { BreakoutGame } from "@/components/breakout-game"
import { AsteroidsGame } from "@/components/asteroids-game"

export default function Home() {
  return (
    <>
      <CursorGlow />
      <KonamiEasterEgg />
      <CommandPalette />
      <ConsoleEasterEgg />
      <DynamicTabTitle />
      <KeyboardNav />
      <BarrelRoll />
      <MatrixRain />
      <LightFlash />
      <PortalEasterEgg />
      <CompanionCube />
      <SpaceCore />
      <CaveJohnson />
      <PortalTransition />
      <RickRoll />
      <GorillazFeelGood />
      <GorillazVisualizer />
      <GorillazDare />
      <NinHeadLikeAHole />
      <NinOnly />
      <NinAlive />
      <GameBoyBoot />
      <AchievementSystem />
      <SnakeGame />
      <SpaceInvaders />
      <PongGame />
      <BreakoutGame />
      <AsteroidsGame />
      <Header />
      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
