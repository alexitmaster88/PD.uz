"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { type LanguageContent, useLanguageContent } from "@/utils/language-content"
import { Calendar, GraduationCap } from "lucide-react"
import type { JSX } from "react"

const LanguageSpecificCulturalContent = () => {
  const { t } = useLanguage()

  // Language-specific cultural content
  const culturalContent: LanguageContent<{
    title: string
    description: string
    categories: {
      id: string
      name: string
      icon: JSX.Element
      items: {
        title: string
        description: string
        image?: string
      }[]
    }[]
  }> = {
    de: {
      title: "Deutsche Kultur entdecken",
      description: "Tauchen Sie ein in die vielfältige deutsche Kultur und Geschichte",
      categories: [
        {
          id: "events",
          name: "Kulturveranstaltungen",
          icon: <Calendar className="h-5 w-5" />,
          items: [
            {
              title: "Oktoberfest in Taschkent",
              description:
                "Erleben Sie das größte deutsche Volksfest in Usbekistan mit traditionellem Bier, Musik und Essen.",
              image: "/images/cultural-german-festival.png",
            },
            {
              title: "Deutscher Filmabend",
              description:
                "Jeden letzten Freitag im Monat zeigen wir preisgekrönte deutsche Filme mit usbekischen Untertiteln.",
              image: "/images/gallery-4.png",
            },
          ],
        },
        {
          id: "education",
          name: "Bildung in Deutschland",
          icon: <GraduationCap className="h-5 w-5" />,
          items: [
            {
              title: "Studieren in Deutschland",
              description:
                "Informationen zu Studienmöglichkeiten, Stipendien und dem deutschen Hochschulsystem für usbekische Studenten.",
              image: "/images/german-university.png",
            },
            {
              title: "DAAD-Informationsveranstaltung",
              description:
                "Regelmäßige Informationsveranstaltungen des Deutschen Akademischen Austauschdienstes (DAAD) in unserem Zentrum.",
              image: "/images/german-classroom.png",
            },
          ],
        },
      ],
    },
    en: {
      title: "Discover German Culture",
      description: "Immerse yourself in the diverse German culture and history",
      categories: [
        {
          id: "events",
          name: "Cultural Events",
          icon: <Calendar className="h-5 w-5" />,
          items: [
            {
              title: "Oktoberfest in Tashkent",
              description:
                "Experience the biggest German folk festival in Uzbekistan with traditional beer, music, and food.",
              image: "/images/cultural-german-festival.png",
            },
            {
              title: "German Movie Night",
              description: "Every last Friday of the month, we show award-winning German films with English subtitles.",
              image: "/images/gallery-4.png",
            },
          ],
        },
        {
          id: "education",
          name: "Education in Germany",
          icon: <GraduationCap className="h-5 w-5" />,
          items: [
            {
              title: "Study in Germany",
              description:
                "Information about study opportunities, scholarships, and the German higher education system for international students.",
              image: "/images/german-university.png",
            },
            {
              title: "DAAD Information Session",
              description: "Regular information sessions by the German Academic Exchange Service (DAAD) at our center.",
              image: "/images/german-classroom.png",
            },
          ],
        },
      ],
    },
    ru: {
      title: "Откройте для себя немецкую культуру",
      description: "Погрузитесь в разнообразную немецкую культуру и историю",
      categories: [
        {
          id: "events",
          name: "Культурные мероприятия",
          icon: <Calendar className="h-5 w-5" />,
          items: [
            {
              title: "Октоберфест в Ташкенте",
              description:
                "Испытайте крупнейший немецкий народный фестиваль в Узбекистане с традиционным пивом, музыкой и едой.",
              image: "/images/cultural-german-festival.png",
            },
            {
              title: "Вечер немецкого кино",
              description:
                "Каждую последнюю пятницу месяца мы показываем отмеченные наградами немецкие фильмы с русскими субтитрами.",
              image: "/images/gallery-4.png",
            },
          ],
        },
        {
          id: "education",
          name: "Образование в Германии",
          icon: <GraduationCap className="h-5 w-5" />,
          items: [
            {
              title: "Учеба в Германии",
              description:
                "Информация о возможностях обучения, стипендиях и немецкой системе высшего образования для русскоговорящих студентов.",
              image: "/images/german-university.png",
            },
            {
              title: "Информационная сессия DAAD",
              description:
                "Регулярные информационные сессии Германской службы академических обменов (DAAD) в нашем центре.",
              image: "/images/german-classroom.png",
            },
          ],
        },
      ],
    },
    uz: {
      title: "Nemis madaniyatini kashf eting",
      description: "Xilma-xil nemis madaniyati va tarixiga sho'ng'ing",
      categories: [
        {
          id: "events",
          name: "Madaniy tadbirlar",
          icon: <Calendar className="h-5 w-5" />,
          items: [
            {
              title: "Toshkentda Oktoberfest",
              description:
                "O'zbekistondagi eng katta nemis xalq festivalini an'anaviy pivo, musiqa va ovqat bilan tajriba qiling.",
              image: "/images/cultural-german-festival.png",
            },
            {
              title: "Nemis kino kechasi",
              description:
                "Har oyning oxirgi juma kuni biz mukofotlangan nemis filmlarini o'zbek subtitrlar bilan namoyish etamiz.",
              image: "/images/gallery-4.png",
            },
          ],
        },
        {
          id: "education",
          name: "Germaniyada ta'lim",
          icon: <GraduationCap className="h-5 w-5" />,
          items: [
            {
              title: "Germaniyada o'qish",
              description:
                "O'zbek talabalar uchun o'qish imkoniyatlari, stipendiyalar va nemis oliy ta'lim tizimi haqida ma'lumot.",
              image: "/images/german-university.png",
            },
            {
              title: "DAAD axborot sessiyasi",
              description:
                "Markazimizda Nemis akademik almashinuv xizmati (DAAD) tomonidan muntazam axborot sessiyalari.",
              image: "/images/german-classroom.png",
            },
          ],
        },
      ],
    },
  }

  const currentContent = useLanguageContent(culturalContent)

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{currentContent.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{currentContent.description}</p>
        </div>

        <Tabs defaultValue={currentContent.categories[0].id} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            {currentContent.categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.icon}
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {currentContent.categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item, index) => (
                  <Card key={index}>
                    {item.image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default LanguageSpecificCulturalContent
