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
  image?: string
}

interface LocationsData {
  [key: string]: LocationInfo
}

const MapSection = () => {
  const [activeRegion, setActiveRegion] = useState<string | null>("tashkent_city")
  const { t, language } = useLanguage()

  const locations: LocationsData = {
    tashkent_city: {
      name: "Taschkent Stadt",
      address: "Amir Temur Straße 107A, Taschkent",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1-C1)", "Englisch (A1-B2)", "Russisch (A1-B2)", "Usbekisch (A1-B1)"],
      coordinates: { lat: 41.337767, lng: 69.253528 },
      // image: "/images/german-classroom-1.png",
    },
    tashkent_region: {
      name: "Taschkent Region",
      address: "Nurafshon Straße 15, Nurafshon",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1-B1)", "Englisch (A1-A2)"],
      coordinates: { lat: 41.044498, lng: 69.332802 },
      // image: "/images/german-classroom-2.png",
    },
    samarkand: {
      name: "Samarkand",
      address: "Registan Platz 45, Samarkand",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1-B2)", "Englisch (A1-B1)", "Usbekisch (A1-A2)"],
      coordinates: { lat: 39.654388, lng: 66.975628 },
      // image: "/images/uzbek-german-1.png",
    },
    bukhara: {
      name: "Buchara",
      address: "Lyabi-Hauz Komplex 12, Buchara",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1-B1)", "Englisch (A1-A2)"],
      coordinates: { lat: 39.767927, lng: 64.421998 },
      // image: "/images/uzbek-german-2.png",
    },
    andijan: {
      name: "Andischan",
      address: "Babur Straße 78, Andischan",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1-A2)", "Englisch (A1-A2)"],
      coordinates: { lat: 40.783388, lng: 72.350891 },
      // image: "/images/language-learning-1.png",
    },
    namangan: {
      name: "Namangan",
      address: "Alisher Navoi Straße 25, Namangan",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1-A2)", "Englisch (A1-A2)"],
      coordinates: { lat: 41.000085, lng: 71.672579 },
      // image: "/images/language-learning-2.png",
    },
    fergana: {
      name: "Fergana",
      address: "Mustaqillik Straße 15, Fergana",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1-A2)", "Englisch (A1-A2)"],
      coordinates: { lat: 40.387054, lng: 71.783005 },
      // image: "/images/students-1.png",
    },
    karakalpakstan: {
      name: "Karakalpakstan",
      address: "Dosnazarov Straße 32, Nukus",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 42.460201, lng: 59.617599 },
      // image: "/images/students-2.png",
    },
    khorezm: {
      name: "Khorezm",
      address: "Al-Khwarizmi Straße 10, Urgench",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 41.550942, lng: 60.631594 },
      // image: "/images/cultural-event-1.png",
    },
    navoiy: {
      name: "Navoiy",
      address: "Alisher Navoiy Straße 22, Navoiy",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 40.103076, lng: 65.373921 },
      // image: "/images/cultural-event-2.png",
    },
    jizzakh: {
      name: "Jizzakh",
      address: "Sharof Rashidov Straße 63, Jizzakh",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 40.115005, lng: 67.842091 },
      // image: "/images/german-culture-1.png",
    },
    sirdaryo: {
      name: "Sirdaryo",
      address: "Mustaqillik Straße 35, Gulistan",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 40.489136, lng: 68.774901 },
      // image: "/images/german-culture-2.png",
    },
    qashqadaryo: {
      name: "Qashqadaryo",
      address: "Amir Temur Straße 43, Karshi",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 38.857138, lng: 65.789058 },
      // image: "/images/teacher-1.png",
    },
    surkhandarya: {
      name: "Surkhandarya",
      address: "Mustaqillik Straße 17, Termez",
      phone: "+998 77 178 06 66",
      email: "info@profi-deutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 37.227852, lng: 67.277872 },
      // image: "/images/teacher-2.png",
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
          src="/map-section.tsx/photo-1488646953014-85cb44e25828.png"
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
                          const { lat, lng } = locations[activeRegion].coordinates
                          const src = `https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`
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
                            <p className="text-muted-foreground">{locations[activeRegion]?.address}</p>
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
                  src={locations[activeRegion]?.image || "/placeholder.svg"}
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
