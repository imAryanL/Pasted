// components/animated-save-grid.tsx
// Framer Motion wrappers for the save cards grid.
// AnimatedSaveGrid staggers the children's entrance with a cascading effect.
// AnimatedCard handles entrance (fade + slide up), hover (lift + shadow), and tap (press) animations.
// These are Client Components because Framer Motion needs client-side JS.

"use client"

import { motion, type Variants } from "framer-motion"

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 },
    },
}

export function AnimatedSaveGrid({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.08 } },
            }}
        >
            {children}
        </motion.div>
    )
}

export function AnimatedCard({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            whileTap={{ scale: 0.98 }}
        >
            {children}
        </motion.div>
    )
}
