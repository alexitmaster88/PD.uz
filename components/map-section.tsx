"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
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
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const { t, language } = useLanguage()

  const locations: LocationsData = {
    tashkent_city: {
      name: "Taschkent Stadt",
      address: "Amir Temur Straße 107A, Taschkent",
      phone: "+998 71 123 4567",
      email: "tashkent@profideutsch.uz",
      courses: ["Deutsch (A1-C1)", "Englisch (A1-B2)", "Russisch (A1-B2)", "Usbekisch (A1-B1)"],
      coordinates: { lat: 41.311081, lng: 69.240562 },
      image: "/images/german-classroom-1.png",
    },
    tashkent_region: {
      name: "Taschkent Region",
      address: "Nurafshon Straße 15, Nurafshon",
      phone: "+998 70 223 4567",
      email: "tashkent.region@profideutsch.uz",
      courses: ["Deutsch (A1-B1)", "Englisch (A1-A2)"],
      coordinates: { lat: 41.044498, lng: 69.332802 },
      image: "/images/german-classroom-2.png",
    },
    samarkand: {
      name: "Samarkand",
      address: "Registan Platz 45, Samarkand",
      phone: "+998 66 223 4567",
      email: "samarkand@profideutsch.uz",
      courses: ["Deutsch (A1-B2)", "Englisch (A1-B1)", "Usbekisch (A1-A2)"],
      coordinates: { lat: 39.654388, lng: 66.975628 },
      image: "/images/uzbek-german-1.png",
    },
    bukhara: {
      name: "Buchara",
      address: "Lyabi-Hauz Komplex 12, Buchara",
      phone: "+998 65 223 4567",
      email: "bukhara@profideutsch.uz",
      courses: ["Deutsch (A1-B1)", "Englisch (A1-A2)"],
      coordinates: { lat: 39.767927, lng: 64.421998 },
      image: "/images/uzbek-german-2.png",
    },
    andijan: {
      name: "Andischan",
      address: "Babur Straße 78, Andischan",
      phone: "+998 74 223 4567",
      email: "andijan@profideutsch.uz",
      courses: ["Deutsch (A1-A2)", "Englisch (A1-A2)"],
      coordinates: { lat: 40.783388, lng: 72.350891 },
      image: "/images/language-learning-1.png",
    },
    namangan: {
      name: "Namangan",
      address: "Alisher Navoi Straße 25, Namangan",
      phone: "+998 69 234 5678",
      email: "namangan@profideutsch.uz",
      courses: ["Deutsch (A1-A2)", "Englisch (A1-A2)"],
      coordinates: { lat: 41.000085, lng: 71.672579 },
      image: "/images/language-learning-2.png",
    },
    fergana: {
      name: "Fergana",
      address: "Mustaqillik Straße 15, Fergana",
      phone: "+998 73 244 5678",
      email: "fergana@profideutsch.uz",
      courses: ["Deutsch (A1-A2)", "Englisch (A1-A2)"],
      coordinates: { lat: 40.387054, lng: 71.783005 },
      image: "/images/students-1.png",
    },
    karakalpakstan: {
      name: "Karakalpakstan",
      address: "Dosnazarov Straße 32, Nukus",
      phone: "+998 61 222 3344",
      email: "nukus@profideutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 42.460201, lng: 59.617599 },
      image: "/images/students-2.png",
    },
    khorezm: {
      name: "Khorezm",
      address: "Al-Khwarizmi Straße 10, Urgench",
      phone: "+998 62 224 5566",
      email: "khorezm@profideutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 41.550942, lng: 60.631594 },
      image: "/images/cultural-event-1.png",
    },
    navoiy: {
      name: "Navoiy",
      address: "Alisher Navoiy Straße 22, Navoiy",
      phone: "+998 79 223 4455",
      email: "navoiy@profideutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 40.103076, lng: 65.373921 },
      image: "/images/cultural-event-2.png",
    },
    jizzakh: {
      name: "Jizzakh",
      address: "Sharof Rashidov Straße 63, Jizzakh",
      phone: "+998 72 226 7788",
      email: "jizzakh@profideutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 40.115005, lng: 67.842091 },
      image: "/images/german-culture-1.png",
    },
    sirdaryo: {
      name: "Sirdaryo",
      address: "Mustaqillik Straße 35, Gulistan",
      phone: "+998 67 225 6677",
      email: "sirdaryo@profideutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 40.489136, lng: 68.774901 },
      image: "/images/german-culture-2.png",
    },
    qashqadaryo: {
      name: "Qashqadaryo",
      address: "Amir Temur Straße 43, Karshi",
      phone: "+998 75 223 5566",
      email: "qashqadaryo@profideutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 38.857138, lng: 65.789058 },
      image: "/images/teacher-1.png",
    },
    surkhandarya: {
      name: "Surkhandarya",
      address: "Mustaqillik Straße 17, Termez",
      phone: "+998 76 227 8899",
      email: "surkhandarya@profideutsch.uz",
      courses: ["Deutsch (A1)", "Englisch (A1)"],
      coordinates: { lat: 37.227852, lng: 67.277872 },
      image: "/images/teacher-2.png",
    },
  }

  return (
    <section id="standorte" className="py-16 md:py-24 bg-secondary/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("our_locations")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("discover_centers")}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side: Larger map */}
          <div className="relative lg:w-2/3 h-[600px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6131894.988904507!2d60.3737383220778!3d41.77313717822868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b20a5d676b1%3A0xca0a6dad7e841e20!2sUzbekistan!5e0!3m2!1sen!2sus!4v1712252633626!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-md"
            ></iframe>
          </div>

          {/* Right side: Regions list and selected location details */}
          <div className="lg:w-1/3">
            <h3 className="text-xl font-bold mb-4">{t("our_locations")}</h3>
            <div className="grid grid-cols-2 gap-2 mb-6 max-h-[400px] overflow-y-auto">
              {Object.entries(locations).map(([key, location]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all ${activeRegion === key ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setActiveRegion(key)}
                >
                  <CardContent className="p-3">
                    <h3 className="font-bold text-sm">{location.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            {activeRegion && (
              <Card className="overflow-hidden">
                <div className="relative h-36 w-full">
                  <Image
                    src={locations[activeRegion].image || "/images/german-classroom-1.png"}
                    alt={locations[activeRegion].name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white">{locations[activeRegion].name}</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm">
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
