"use client"

import { cn } from "@/lib/utils"

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-background",
        className,
      )}
    >
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "var(--cyber-cyan)", stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: "var(--cyber-violet)", stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "var(--cyber-violet)", stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: "var(--cyber-blue)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <g opacity="0.5">
          <BeamPath d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875" duration={8} delay={0} />
          <BeamPath d="M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867" duration={8} delay={0.5} />
          <BeamPath d="M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859" duration={8} delay={1} />
          <BeamPath d="M1380 -189C1380 -189 1312 216 848 343C384 470 316 875 316 875" duration={8} delay={1.5} />
          <BeamPath d="M1373 -197C1373 -197 1305 208 841 335C377 462 309 867 309 867" duration={8} delay={2} />
          <BeamPath d="M1366 -205C1366 -205 1298 200 834 327C370 454 302 859 302 859" duration={8} delay={2.5} />
        </g>
      </svg>
    </div>
  )
}

const BeamPath = ({
  d,
  duration = 8,
  delay = 0,
}: {
  d: string
  duration?: number
  delay?: number
}) => {
  return (
    <>
      <path d={d} stroke="url(#grad1)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={d} stroke="url(#grad2)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="200 1000">
        <animate
          attributeName="stroke-dashoffset"
          values="0;-1200"
          dur={`${duration}s`}
          repeatCount="indefinite"
          begin={`${delay}s`}
        />
      </path>
    </>
  )
}
