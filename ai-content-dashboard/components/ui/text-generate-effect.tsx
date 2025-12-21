"use client"

import { useEffect, useState } from "react"
import { motion, stagger, useAnimate } from "framer-motion"
import { cn } from "@/lib/utils"

export const TextGenerateEffect = ({ words, className }: { words: string; className?: string }) => {
  const [scope, animate] = useAnimate()
  const [isAnimating, setIsAnimating] = useState(true)
  const wordsArray = words.split(" ")

  useEffect(() => {
    if (scope.current && isAnimating) {
      animate(
        "span",
        {
          opacity: 1,
          filter: "blur(0px)",
        },
        {
          duration: 0.5,
          delay: stagger(0.05),
        },
      ).then(() => setIsAnimating(false))
    }
  }, [scope, animate, isAnimating])

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="opacity-0"
              style={{
                filter: "blur(8px)",
              }}
            >
              {word}{" "}
            </motion.span>
          )
        })}
      </motion.div>
    )
  }

  return (
    <div className={cn("font-mono", className)}>
      <div className="text-foreground leading-relaxed">{renderWords()}</div>
    </div>
  )
}
