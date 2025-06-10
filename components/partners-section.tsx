"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

interface Partner {
  id: string
  name: string
  logo: string
  website: string
  description: string
}

const PartnersSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useLanguage()

  // Partner data with placeholder logos and websites
  const partners: Partner[] = [
    {
      id: "goethe-institut",
      name: "Goethe Institut",
      logo: "/placeholder.svg?height=80&width=120",
      website: "https://www.goethe.de",
      description: "German Cultural Institute",
    },
    {
      id: "daad",
      name: "DAAD",
      logo: "/placeholder.svg?height=80&width=120",
      website: "https://www.daad.de",
      description: "German Academic Exchange Service",
    },
    {
      id: "bmz",
      name: "BMZ",
      logo: "/placeholder.svg?height=80&width=120",
      website: "https://www.bmz.de",
      description: "Federal Ministry for Economic Cooperation",
    },
    {
      id: "giz",
      name: "GIZ",
      logo: "/placeholder.svg?height=80&width=120",
      website: "https://www.giz.de",
      description: "Deutsche Gesellschaft für Internationale Zusammenarbeit",
    },
    {
      id: "siemens",
      name: "Siemens",
      logo: "/placeholder.svg?height=80&width=120",
      website: "https://www.siemens.com",
      description: "Technology Company",
    },
    {
      id: "volkswagen",
      name: "Volkswagen",
      logo: "/placeholder.svg?height=80&width=120",
      website: "https://www.volkswagen.com",
      description: "Automotive Manufacturer",
    },
    {
      id: "bosch",
      name: "Bosch",
      logo: "/placeholder.svg?height=80&width=120",
      website: "https://www.bosch.com",
      description: "Engineering and Technology Company",
    },
    {
      id: "sap",
      name: "SAP",
      logo: "/placeholder.svg?height=80&width=120",
      website: "https://www.sap.com",
      description: "Software Company",
    },
    {
      id: "lufthansa",
      name: "Lufthansa",
      logo: "/placeholder.svg?height=80&width=120",
      website: "https://www.lufthansa.com",
      description: "German Airline",
    },
  ]

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.5
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.5
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  useEffect(() => {
    // Auto-scroll functionality
    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10

        if (isAtEnd) {
          // Reset to beginning when reaching the end
          container.scrollTo({ left: 0, behavior: "smooth" })
        } else {
          // Scroll one item width
          const itemWidth = 280 // Approximate width of each partner card
          container.scrollBy({ left: itemWidth, behavior: "smooth" })
        }
      }
    }, 3000) // Auto-scroll every 3 seconds

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [])

  const handlePartnerClick = (website: string) => {
    window.open(website, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-16 md:py-24 bg-background/82">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            {t("our_partners") || "Unsere Partner"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("partners_description") ||
              "Wir arbeiten mit führenden deutschen Unternehmen und Institutionen zusammen, um unseren Studenten die besten Möglichkeiten zu bieten."}
          </p>
        </div>

        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {partners.map((partner) => (
              <Card
                key={partner.id}
                className="min-w-[280px] w-[280px] flex-shrink-0 overflow-hidden snap-start shadow-md hover:shadow-lg transition-shadow h-[380px] flex flex-col"
              >
                <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                  <div>
                    <div className="h-[120px] w-full mb-4 bg-white rounded-lg p-4 flex items-center justify-center">
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={`${partner.name} logo`}
                        width={100}
                        height={60}
                        className="object-contain w-[100px] h-[60px]"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 h-[28px] flex items-center justify-center">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 h-[60px] overflow-hidden">{partner.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-auto"
                    onClick={() => handlePartnerClick(partner.website)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("visit_website") || "Website besuchen"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            size="icon"
            variant="secondary"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={scrollLeft}
            aria-label="Previous partners"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={scrollRight}
            aria-label="Next partners"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            {t("partnership_interest") ||
              "Interessiert an einer Partnerschaft? Kontaktieren Sie uns für weitere Informationen."}
          </p>
        </div>
      </div>
    </section>
  )
}

export default PartnersSection
