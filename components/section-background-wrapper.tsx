"use client"

import type { ReactNode } from "react"
import Image from "next/image"

interface SectionBackgroundWrapperProps {
  children: ReactNode
  imageUrl: string
  altText?: string
  blurAmount?: number
  overlayColor?: string
  overlayOpacity?: number
}

const SectionBackgroundWrapper = ({
  children,
  imageUrl,
  altText = "Background image",
  blurAmount = 1.5, // Default 15% blur
  overlayColor = "#aef2ea",
  overlayOpacity = 50, // 50%
}: SectionBackgroundWrapperProps) => {
  return (
    <section className="py-16 md:py-24 relative">
      {/* Background image with blur effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={altText}
          fill
          className={`object-cover opacity-85 filter blur-[${blurAmount}px]`}
          priority
        />
        <div className={`absolute inset-0 bg-[${overlayColor}]/${overlayOpacity}`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  )
}

export default SectionBackgroundWrapper
