"use client"

import { useEffect } from "react"

export function DynamicTabTitle() {
  useEffect(() => {
    const originalTitle = document.title

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "> come_back... 👀"
      } else {
        document.title = "> welcome_back! ✓"
        setTimeout(() => {
          document.title = originalTitle
        }, 2000)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.title = originalTitle
    }
  }, [])

  return null
}
