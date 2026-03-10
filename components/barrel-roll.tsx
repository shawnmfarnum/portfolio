"use client"

import { useEffect, useCallback } from "react"

export function useBarrelRoll() {
  const doBarrelRoll = useCallback(() => {
    const body = document.body
    body.style.transition = "transform 1.5s ease-in-out"
    body.style.transform = "rotate(360deg)"
    setTimeout(() => {
      body.style.transition = ""
      body.style.transform = ""
    }, 1600)
  }, [])

  return doBarrelRoll
}

// Standalone component that listens for a custom event
export function BarrelRoll() {
  useEffect(() => {
    const handler = () => {
      const body = document.body
      body.style.transition = "transform 1.5s ease-in-out"
      body.style.transform = "rotate(360deg)"
      setTimeout(() => {
        body.style.transition = ""
        body.style.transform = ""
      }, 1600)
    }

    window.addEventListener("barrel-roll", handler)
    return () => window.removeEventListener("barrel-roll", handler)
  }, [])

  return null
}
