"use client"

import { useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Photo {
  src: string
  alt: string
  caption?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  title?: string
  autoScroll?: boolean
  autoScrollInterval?: number
}

const PhotoGallery = ({ photos, title, autoScroll = true, autoScrollInterval = 3000 }: PhotoGalleryProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useLanguage()

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  useEffect(() => {
    if (autoScroll && photos.length > 1) {
      autoScrollIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current
          const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10

          if (isAtEnd) {
            // Reset to beginning when reaching the end
            container.scrollTo({ left: 0, behavior: "smooth" })
          } else {
            // Scroll one item width
            const itemWidth = (container.clientWidth * 0.8) / 3 // Assuming 3 items visible
            container.scrollBy({ left: itemWidth, behavior: "smooth" })
          }
        }
      }, autoScrollInterval)
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [autoScroll, autoScrollInterval, photos.length])

  return (
    <div className="relative">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">{title || t("photo_gallery_title")}</h2>

      <div className="relative group">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {photos.map((photo, index) => (
            <Card
              key={index}
              className="min-w-[220px] md:min-w-[260px] flex-shrink-0 overflow-hidden snap-start shadow-md"
            >
              <div className="aspect-[16/9] relative">
                <img src={photo.src || "/placeholder.svg"} alt={photo.alt} className="w-full h-full object-cover" />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm">{photo.caption}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Button
          size="icon"
          variant="secondary"
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={scrollLeft}
          aria-label={t("previous")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={scrollRight}
          aria-label={t("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default PhotoGallery
