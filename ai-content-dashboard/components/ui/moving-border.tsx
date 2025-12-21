"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  duration?: number
  className?: string
  containerClassName?: string
}) => {
  return (
    <div className={cn("relative overflow-hidden rounded-lg border border-border bg-card p-[1px]", containerClassName)}>
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(90deg, var(--cyber-cyan), var(--cyber-violet), var(--cyber-blue), var(--cyber-cyan))`,
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <div className={cn("relative z-10 rounded-lg bg-background", className)}>{children}</div>
    </div>
  )
}
