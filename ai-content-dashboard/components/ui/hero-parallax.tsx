"use client"

import React from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string
    link: string
    thumbnail: string
  }[]
}) => {
  const firstRow = products.slice(0, 5)
  const secondRow = products.slice(5, 10)
  const thirdRow = products.slice(10, 15)
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig)
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig)
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig)
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig)
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig)

  return (
    <div
      ref={ref}
      className="relative flex h-[300vh] flex-col self-auto overflow-hidden py-40 antialiased [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="mb-20 flex flex-row space-x-20">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export const Header = () => {
  return (
    <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-4 py-20 md:py-40">
      <h1 className="text-balance text-4xl font-bold text-foreground md:text-7xl">
        Autonomous Content Agents <br /> <span className="text-gradient">at Your Command</span>
      </h1>
      <p className="mt-8 max-w-2xl text-base text-muted-foreground md:text-xl">
        Deploy AI agents that research, write, and optimize content autonomously. From ideation to publication, let
        intelligent systems handle your content pipeline.
      </p>
      <div className="mt-12 flex gap-4">
        <Link
          href="/create"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary px-8 py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90"
        >
          <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary via-primary to-accent opacity-0 transition-opacity group-hover:opacity-20"></span>
          <span className="relative">Deploy Agent</span>
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-8 py-3 font-bold text-foreground transition-all hover:bg-accent/10"
        >
          View Command Center
        </Link>
      </div>
    </div>
  )
}

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string
    link: string
    thumbnail: string
  }
  translate: any
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product relative h-96 w-[30rem] flex-shrink-0"
    >
      <Link href={product.link} className="block group-hover/product:shadow-2xl">
        <div className="relative h-full w-full overflow-hidden rounded-lg border border-border/50 bg-card shadow-lg">
          <Image
            src={product.thumbnail || "/placeholder.svg"}
            height={600}
            width={600}
            className="absolute inset-0 h-full w-full object-cover object-left-top"
            alt={product.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-xl font-bold text-foreground opacity-100">{product.title}</h2>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
