"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const CoursesSection = () => {
  const [language, setLanguage] = useState("deutsch")
  const { t } = useLanguage()

  const courseData = {
    deutsch: [
      {
        level: "A1",
        title: t("beginner"),
        description: "Für Anfänger ohne Vorkenntnisse",
        features: ["80 " + t("hours"), t("small_groups") + " (max. 12 Teilnehmer)", t("certificate"), t("materials")],
        price: "2.500.000 UZS",
      },
      {
        level: "A2",
        title: t("beginner"),
        description: "Für Lernende mit grundlegenden Kenntnissen",
        features: ["100 " + t("hours"), t("small_groups") + " (max. 10 Teilnehmer)", t("certificate"), t("materials")],
        price: "3.000.000 UZS",
      },
      {
        level: "B1",
        title: t("intermediate"),
        description: "Für Lernende mit soliden Grundkenntnissen",
        features: ["120 " + t("hours"), t("small_groups") + " (max. 10 Teilnehmer)", t("certificate"), t("materials")],
        price: "3.500.000 UZS",
      },
      {
        level: "B2",
        title: t("intermediate"),
        description: "Für fortgeschrittene Lernende",
        features: ["140 " + t("hours"), t("small_groups") + " (max. 8 Teilnehmer)", t("certificate"), t("materials")],
        price: "4.000.000 UZS",
      },
    ],
    usbekisch: [
      {
        level: "A1",
        title: t("beginner"),
        description: "Für Anfänger ohne Vorkenntnisse",
        features: ["60 " + t("hours"), t("small_groups") + " (max. 12 Teilnehmer)", t("certificate"), t("materials")],
        price: "2.000.000 UZS",
      },
      {
        level: "A2",
        title: t("beginner"),
        description: "Für Lernende mit grundlegenden Kenntnissen",
        features: ["80 " + t("hours"), t("small_groups") + " (max. 10 Teilnehmer)", t("certificate"), t("materials")],
        price: "2.500.000 UZS",
      },
    ],
    englisch: [
      {
        level: "A1-A2",
        title: t("beginner"),
        description: "Für Anfänger und leicht Fortgeschrittene",
        features: ["100 " + t("hours"), t("small_groups") + " (max. 12 Teilnehmer)", t("certificate"), t("materials")],
        price: "2.800.000 UZS",
      },
      {
        level: "B1-B2",
        title: t("intermediate"),
        description: "Für Lernende mit soliden Grundkenntnissen",
        features: ["120 " + t("hours"), t("small_groups") + " (max. 10 Teilnehmer)", t("certificate"), t("materials")],
        price: "3.200.000 UZS",
      },
    ],
    russisch: [
      {
        level: "A1",
        title: t("beginner"),
        description: "Für Anfänger ohne Vorkenntnisse",
        features: ["80 " + t("hours"), t("small_groups") + " (max. 12 Teilnehmer)", t("certificate"), t("materials")],
        price: "2.400.000 UZS",
      },
      {
        level: "A2",
        title: t("beginner"),
        description: "Für Lernende mit grundlegenden Kenntnissen",
        features: ["100 " + t("hours"), t("small_groups") + " (max. 10 Teilnehmer)", t("certificate"), t("materials")],
        price: "2.900.000 UZS",
      },
    ],
  }

  return (
    <section id="kurse" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("our_courses")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("choose_courses")}</p>
        </div>

        <Tabs defaultValue="deutsch" value={language} onValueChange={setLanguage} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="deutsch">Deutsch</TabsTrigger>
            <TabsTrigger value="usbekisch">O'zbekcha</TabsTrigger>
            <TabsTrigger value="englisch">English</TabsTrigger>
            <TabsTrigger value="russisch">Русский</TabsTrigger>
          </TabsList>

          {Object.keys(courseData).map((lang) => (
            <TabsContent key={lang} value={lang} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courseData[lang].map((course, index) => (
                  <Card key={index} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{course.level}</CardTitle>
                          <CardDescription>{course.title}</CardDescription>
                        </div>
                        <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                      <ul className="space-y-2">
                        {course.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 text-primary mt-1" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start pt-4 border-t">
                      <div className="mb-4">
                        <span className="text-2xl font-bold">{course.price}</span>
                      </div>
                      <Button className="w-full">{t("register_now")}</Button>
                    </CardFooter>
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

export default CoursesSection
