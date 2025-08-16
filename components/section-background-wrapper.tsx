"use client"

import type { ReactNode } from "react"
import Image from "next/image"

interface SectionBackgroundWrapperProps {
  children: ReactNode
}

const SectionBackgroundWrapper = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="relative z-10 bg-white/20 rounded-lg p-6">
        {children}
      </div>
    </section>
  )
}

export default SectionBackgroundWrapper
