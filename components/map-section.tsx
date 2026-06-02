"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface LocationInfo {
  name: string
  address: string
  phone: string
  email: string
  courses: string[]
  coordinates: { lat: number; lng: number }
  mapEmbedUrl?: string
  image?: string
}

interface LocationsData {
  [key: string]: LocationInfo
}

const MapSection = () => {
  const [activeRegion, setActiveRegion] = useState<string | null>("samarkand")
  const { t, language } = useLanguage()

  const locations: LocationsData = {
    samarkand: {
      name: t("telc_booking_city_samarkand"),
      address: t("samarkand_address"),
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: [t("course_german_a1"), t("course_german_a2"), t("course_german_b1"), t("course_german_b2")],
      coordinates: { lat: 39.654388, lng: 66.975628 },
      mapEmbedUrl: "https://maps.google.com/maps?q=Yoshlar+Creative+Shaharchasi,+Uzbekistan+St+86,+Samarkand,+Samarqand+Region&ftid=0x3f4d190016b650a1:0xdfff3848f263cdf4&output=embed&z=17",
    },
  }

  const handleRegionClick = (region: string) => {
    setActiveRegion(region)
  }

  // Create a list of regions for the sidebar
  const regionsList = Object.entries(locations).map(([key, location]) => ({
    id: key,
    name: location.name,
  }))

  return (
    <section id="standorte" className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/map-bg.png"
          alt="Travel and location background"
          fill
          className="object-cover opacity-85 filter blur-[1.5px]"
          priority
        />
        <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("our_locations")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("discover_centers")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left side: List of regions */}
          <div className="lg:col-span-1 h-full">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-foreground">{t("our_locations")}</h3>
                <div className="space-y-2">
                  {regionsList.map((region) => (
                    <div
                      key={region.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors text-lg ${
                        activeRegion === region.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                      onClick={() => handleRegionClick(region.id)}
                    >
                      {region.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side: Map and location details */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {activeRegion && locations[activeRegion] && (
                  <div className="grid grid-cols-1">
                    {/* Map section */}
                    <div className="h-[500px] relative">
                      {locations[activeRegion] && (
                        (() => {
                          const loc = locations[activeRegion]
                          const src = loc.mapEmbedUrl
                            ?? `https://maps.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}&z=13&output=embed`
                          return (
                            <iframe
                              src={src}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                          )
                        })()
                      )}
                    </div>

                    {/* Location details - now below the map */}
                    <div className="p-6 bg-card border-t">
                      <div className="flex flex-wrap items-start justify-between">
                        <div className="mb-6 w-full">
                          <h3 className="text-2xl font-bold mb-2">{locations[activeRegion]?.name}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                          <div>
                            <p className="font-medium mb-2">{t("address")}</p>
                            <p className="text-muted-foreground whitespace-pre-line">{locations[activeRegion]?.address}</p>
                          </div>

                          <div>
                            <p className="font-medium mb-2">{t("phone")}</p>
                            <p className="text-muted-foreground">{locations[activeRegion]?.phone}</p>
                            <p className="font-medium mt-4 mb-2">{t("email")}</p>
                            <p className="text-muted-foreground">{locations[activeRegion]?.email}</p>
                          </div>

                          <div>
                            <p className="font-medium mb-2">{t("available_courses")}</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                              {locations[activeRegion]?.courses.map((course, index) => (
                                <li key={index}>{course}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location image */}
            {activeRegion && locations[activeRegion]?.image && (
              <div className="mt-6 aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={locations[activeRegion]!.image!}
                  alt={locations[activeRegion]?.name || "Location image"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MapSection
