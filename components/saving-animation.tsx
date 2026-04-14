// components/saving-animation.tsx
// Animated waveform shown while a URL is being saved and processed by AI.
// Displays pulsing beige bars, a bookmark icon center, and rotating cheeky messages.

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const MESSAGES = [
  "Fetching...",
  "Digesting...",
  "Overthinking...",
  "Almost...",
  "Cooking...",
  "Vibing...",
  "One sec...",
  "Hang tight...",
  "So close...",
  "Worth it...",
  "Pasting...",
  "Doodling...",
  "Googling...",
  "Baking...",
]

// Bar heights for the waveform — varied for a natural audio look
const BAR_HEIGHTS = [6, 10, 16, 20, 14, 22, 18, 24, 16, 26, 18, 24, 16, 22, 18, 20, 14, 26, 18, 24, 16, 22, 14, 20, 16, 18, 22, 14, 10, 6]

export function SavingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0)

  // Rotate messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(i => (i + 1) % MESSAGES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* Waveform */}
      <div className="flex items-center gap-1 h-8">
        {BAR_HEIGHTS.map((height, i) => {
          const isCenter = i === Math.floor(BAR_HEIGHTS.length / 2)
          if (isCenter) {
            return (
              <div
                key={i}
                className="flex items-center justify-center size-10 rounded-full bg-white shrink-0 mx-1"
              >
                <img src="/pasted_icon_v1.png" alt="P" className="size-8 object-contain" />
              </div>
            )
          }
          return (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-[#b89478] shrink-0"
              animate={{
                height: [height * 0.5, height, height * 0.6, height * 0.9, height * 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.08,
                ease: "easeInOut",
              }}
              style={{ height }}
            />
          )
        })}
      </div>

      {/* Rotating message */}
      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.3 }}
        className="text-sm font-bold text-[#806754] shrink-0"
      >
        {MESSAGES[messageIndex]}
      </motion.p>
    </div>
  )
}
