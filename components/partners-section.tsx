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
  descriptionKey: string
}

const PartnersSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useLanguage()

  const partners: Partner[] = [
    {
      id: "goethe-institut",
      name: "Goethe Institut",
      logo: "/images/logos/goethelogo.svg",
      website: "https://www.goethe.de",
      descriptionKey: "partner_goethe_desc",
    },
    {
      id: "daad",
      name: "DAAD",
      logo: "/images/logos/daadlogo.svg",
      website: "https://www.daad.de",
      descriptionKey: "partner_daad_desc",
    },
    {
      id: "bmz",
      name: "BMZ",
      logo: "/images/logos/bmzlogo.svg",
      website: "https://www.bmz.de",
      descriptionKey: "partner_bmz_desc",
    },
    {
      id: "giz",
      name: "GIZ",
      logo: "/images/logos/gizlogo.svg",
      website: "https://www.giz.de",
      descriptionKey: "partner_giz_desc",
    },
    {
      id: "siemens",
      name: "Siemens",
      logo: "/images/logos/siemenslogo.svg",
      website: "https://www.siemens.com",
      descriptionKey: "partner_siemens_desc",
    },
    {
      id: "volkswagen",
      name: "Volkswagen",
      logo: "/images/logos/volkswagenlogo.svg",
      website: "https://www.volkswagen.com",
      descriptionKey: "partner_volkswagen_desc",
    },
    {
      id: "bosch",
      name: "Bosch",
      logo: "/images/logos/boschlogo.svg",
      website: "https://www.bosch.com",
      descriptionKey: "partner_bosch_desc",
    },
    {
      id: "sap",
      name: "SAP",
      logo: "/images/logos/saplogo.svg",
      website: "https://www.sap.com",
      descriptionKey: "partner_sap_desc",
    },
    {
      id: "lufthansa",
      name: "Lufthansa",
      logo: "/images/logos/lufthansalogo.svg",
      website: "https://www.lufthansa.com",
      descriptionKey: "partner_lufthansa_desc",
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
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/partners-section.tsx/photo-1654442137037-fe784a7189af.png"
          alt="Business partnership background"
          fill
          className="object-cover opacity-85 filter blur-[1.5px]"
          priority
        />
        <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
      </div>
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("our_partners")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("partners_description")}</p>
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
                    <div className="h-[120px] w-full mb-4 bg-white rounded-lg p-4 flex items-center justify-center overflow-hidden">
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={`${partner.name} logo`}
                        width={120}
                        height={80}
                        className="object-contain max-h-full max-w-full w-auto h-auto"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=80&width=120"
                        }}
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 h-[28px] flex items-center justify-center">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 h-[60px] overflow-hidden">
                      {t(partner.descriptionKey)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-auto bg-transparent"
                    onClick={() => handlePartnerClick(partner.website)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("visit_website")}
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
            aria-label={t("previous_partners")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={scrollRight}
            aria-label={t("next_partners")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">{t("partnership_interest")}</p>
        </div>
      </div>
    </section>
  )
}

export default PartnersSection
