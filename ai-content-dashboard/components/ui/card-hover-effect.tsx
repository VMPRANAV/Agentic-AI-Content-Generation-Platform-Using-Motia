"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string
    description: string
    link?: string
  }[]
  className?: string
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn("grid grid-cols-1 py-10", className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatedCardBg hoveredIndex={hoveredIndex} currentIndex={idx} />
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  )
}

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "relative z-20 h-full w-full overflow-hidden rounded-lg border border-border/50 bg-card p-4 group-hover:border-primary/50",
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h4 className={cn("mt-2 font-bold tracking-wide text-foreground", className)}>{children}</h4>
}

export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <p className={cn("mt-4 text-sm leading-relaxed tracking-wide text-muted-foreground", className)}>{children}</p>
}

const AnimatedCardBg = ({ hoveredIndex, currentIndex }: { hoveredIndex: number | null; currentIndex: number }) => {
  return (
    <motion.span
      className="absolute inset-0 z-10 block h-full w-full rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"
      layoutId="hoverBackground"
      initial={{ opacity: 0 }}
      animate={{
        opacity: hoveredIndex === currentIndex ? 1 : 0,
      }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
    />
  )
}
