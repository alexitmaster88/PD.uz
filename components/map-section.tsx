"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { CONTACT } from "@/lib/contact"
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
  logo?: string
  logoWidth?: number
  logoHeight?: number
}

const MapSection = () => {
  const [activeRegion, setActiveRegion] = useState<string | null>("tashkent")
  const { t } = useLanguage()

  const locations: Record<string, LocationInfo> = {
    tashkent: {
      name: t("telc_booking_city_tashkent"),
      address: t("tashkent_address"),
      phone: CONTACT.phone2,
      email: CONTACT.email,
      courses: [t("course_german_a1"), t("course_german_a2"), t("course_german_b1"), t("course_german_b2")],
      coordinates: { lat: 41.299496, lng: 69.178864 },
      mapEmbedUrl: "https://maps.google.com/maps?q=Sebzor+ko%27chasi,+313,+Olmazor+tumani,+Toshkent&output=embed&z=15",
      logo: "/images/logo.png",
      logoWidth: 120,
      logoHeight: 40,
    },
    samarkand: {
      name: t("telc_booking_city_samarkand"),
      address: t("samarkand_address"),
      phone: CONTACT.phone1,
      email: CONTACT.email,
      courses: [t("course_german_a1"), t("course_german_a2"), t("course_german_b1"), t("course_german_b2")],
      coordinates: { lat: 39.654388, lng: 66.975628 },
      mapEmbedUrl: "https://maps.google.com/maps?q=Yoshlar+Creative+Shaharchasi,+Uzbekistan+St+86,+Samarkand,+Samarqand+Region&ftid=0x3f4d190016b650a1:0xdfff3848f263cdf4&output=embed&z=17",
      logo: "/images/telc-Pruefungszentrum-1024x315.png",
      logoWidth: 180,
      logoHeight: 56,
    },
  }

  const regionsList = Object.entries(locations).map(([key, loc]) => ({ id: key, name: loc.name, logo: loc.logo, logoWidth: loc.logoWidth, logoHeight: loc.logoHeight }))
  const active = activeRegion ? locations[activeRegion] : null

  return (
    <section id="standorte" className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 -z-10">
        <Image src="/images/map-bg.png" alt="" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
      </div>

      <div className="container relative">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-[#130080] md:text-4xl">{t("our_locations")}</h2>
          <p className="mx-auto max-w-2xl text-[#130080]/65">{t("discover_centers")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/50 bg-white/80 p-4 shadow-md backdrop-blur-md">
              <h3 className="mb-4 font-semibold text-[#130080]">{t("our_locations")}</h3>
              <div className="space-y-2">
                {regionsList.map(region => (
                  <button
                    key={region.id}
                    onClick={() => setActiveRegion(region.id)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                      activeRegion === region.id
                        ? "bg-blue-100/60 text-gray-900 shadow-sm border border-blue-200/70"
                        : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span>{region.name}</span>
                    {region.logo && (
                      <span className="mt-2 block">
                        <Image
                          src={region.logo}
                          alt={region.name}
                          width={region.logoWidth ?? 120}
                          height={region.logoHeight ?? 36}
                          className={`h-7 w-auto object-contain ${activeRegion === region.id ? "brightness-0 invert" : ""}`}
                        />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map + details */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-md backdrop-blur-md">
              {active && (
                <>
                  {/* Google Map */}
                  <div className="h-[420px]">
                    <iframe
                      src={active.mapEmbedUrl ?? `https://maps.google.com/maps?q=${active.coordinates.lat},${active.coordinates.lng}&z=13&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  {/* Location details */}
                  <div className="border-t border-[#130080]/8 bg-white/90 p-6">
                    <div className="mb-5 flex items-center gap-4">
                      <h3 className="text-xl font-bold text-[#130080]">{active.name}</h3>
                      {active.logo && (
                        <Image
                          src={active.logo}
                          alt={active.name}
                          width={active.logoWidth ?? 120}
                          height={active.logoHeight ?? 36}
                          className="h-9 w-auto object-contain"
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#130080]/50">{t("address")}</p>
                        <p className="text-sm text-[#130080]/80 whitespace-pre-line">{active.address}</p>
                      </div>
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#130080]/50">{t("phone")}</p>
                        <p className="text-sm text-[#130080]/80">{active.phone}</p>
                        <p className="mt-4 mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#130080]/50">{t("email")}</p>
                        <p className="text-sm text-[#130080]/80">{active.email}</p>
                      </div>
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#130080]/50">{t("available_courses")}</p>
                        <ul className="space-y-1">
                          {active.courses.map((course, i) => (
                            <li key={i} className="text-sm text-[#130080]/80">• {course}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MapSection
