"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

interface LocationInfo {
  name: string
  address: string
  phone: string
  email: string
  courses: string[]
  coordinates: { lat: number; lng: number }
}

interface LocationsData {
  [key: string]: LocationInfo
}

const MapSection = () => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const { t, language } = useLanguage()

  const locations: LocationsData = {
    tashkent: {
      name: "Taschkent",
      address: "Amir Temur Straße 107A, Taschkent",
      phone: "+998 71 123 4567",
      email: "tashkent@deutsch-usbekistan.uz",
      courses: ["Deutsch (A1-C1)", "Englisch (A1-B2)", "Russisch (A1-B2)", "Usbekisch (A1-B1)"],
      coordinates: { lat: 41.311081, lng: 69.240562 },
    },
    samarkhand: {
      name: "Samarkand",
      address: "Registan Platz 45, Samarkand",
      phone: "+998 66 223 4567",
      email: "samarkand@deutsch-usbekistan.uz",
      courses: ["Deutsch (A1-B2)", "Englisch (A1-B1)", "Usbekisch (A1-A2)"],
      coordinates: { lat: 39.654388, lng: 66.975628 },
    },
    boukhara: {
      name: "Buchara",
      address: "Lyabi-Hauz Komplex 12, Buchara",
      phone: "+998 65 223 4567",
      email: "bukhara@deutsch-usbekistan.uz",
      courses: ["Deutsch (A1-B1)", "Englisch (A1-A2)"],
      coordinates: { lat: 39.767927, lng: 64.421998 },
    },
    andijan: {
      name: "Andischan",
      address: "Babur Straße 78, Andischan",
      phone: "+998 74 223 4567",
      email: "andijan@deutsch-usbekistan.uz",
      courses: ["Deutsch (A1-A2)", "Englisch (A1-A2)"],
      coordinates: { lat: 40.783388, lng: 72.350891 },
    },
    namangan: {
      name: "Namangan",
      address: "Alisher Navoi Straße 25, Namangan",
      phone: "+998 69 234 5678",
      email: "namangan@deutsch-usbekistan.uz",
      courses: ["Deutsch (A1-A2)", "Englisch (A1-A2)"],
      coordinates: { lat: 41.000085, lng: 71.672579 },
    },
    fergana: {
      name: "Fergana",
      address: "Mustaqillik Straße 15, Fergana",
      phone: "+998 73 244 5678",
      email: "fergana@deutsch-usbekistan.uz",
      courses: ["Deutsch (A1-A2)", "Englisch (A1-A2)"],
      coordinates: { lat: 40.387054, lng: 71.783005 },
    },
    karakalpakstan: {
      name: "Karakalpakstan",
      address: "Dosnazarov Straße 32, Nukus",
      phone: "+998 61 222 3344",
      email: "nukus@deutsch-usbekistan.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 42.460201, lng: 59.617599 },
    },
  }

  return (
    <section id="standorte" className="py-16 md:py-24 bg-secondary/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("our_locations")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("discover_centers")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6131894.988904507!2d60.3737383220778!3d41.77313717822868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b20a5d676b1%3A0xca0a6dad7e841e20!2sUzbekistan!5e0!3m2!1sen!2sus!4v1712252633626!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-md"
            ></iframe>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(locations).map(([key, location]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all ${activeRegion === key ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setActiveRegion(key)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {activeRegion && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">{locations[activeRegion].name}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{t("address")}</h4>
                      <p>{locations[activeRegion].address}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t("contact_info")}:</h4>
                      <p>
                        {t("phone")} {locations[activeRegion].phone}
                      </p>
                      <p>
                        {t("email")} {locations[activeRegion].email}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t("available_courses")}</h4>
                      <ul className="list-disc pl-5">
                        {locations[activeRegion].courses.map((course, index) => (
                          <li key={index}>{course}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MapSection
