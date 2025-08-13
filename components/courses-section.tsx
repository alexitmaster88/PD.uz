"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

const CoursesSection = () => {
  const [language, setLanguage] = useState("deutsch")
  const { t } = useLanguage()

  const courseData = {
    deutsch: [
      {
        level: "A1",
        title: t("beginner"),
        description: t("course_desc_a1_beginner"),
        features: ["80 " + t("hours"), t("small_groups") + t("max_12_participants"), t("certificate"), t("materials")],
        price: "2.500.000 UZS",
      },
      {
        level: "A2",
        title: t("beginner"),
        description: t("course_desc_a2_basic"),
        features: ["100 " + t("hours"), t("small_groups") + t("max_10_participants"), t("certificate"), t("materials")],
        price: "3.000.000 UZS",
      },
      {
        level: "B1",
        title: t("intermediate"),
        description: t("course_desc_b1_intermediate"),
        features: ["120 " + t("hours"), t("small_groups") + t("max_10_participants"), t("certificate"), t("materials")],
        price: "3.500.000 UZS",
      },
      {
        level: "B2",
        title: t("intermediate"),
        description: t("course_desc_b2_advanced"),
        features: ["140 " + t("hours"), t("small_groups") + t("max_8_participants"), t("certificate"), t("materials")],
        price: "4.000.000 UZS",
      },
    ],
    usbekisch: [
      {
        level: "A1",
        title: t("beginner"),
        description: t("course_desc_a1_beginner"),
        features: ["60 " + t("hours"), t("small_groups") + t("max_12_participants"), t("certificate"), t("materials")],
        price: "2.000.000 UZS",
      },
      {
        level: "A2",
        title: t("beginner"),
        description: t("course_desc_a2_basic"),
        features: ["80 " + t("hours"), t("small_groups") + t("max_10_participants"), t("certificate"), t("materials")],
        price: "2.500.000 UZS",
      },
    ],
    englisch: [
      {
        level: "A1-A2",
        title: t("beginner"),
        description: t("course_desc_a1_a2_beginner_plus"),
        features: ["100 " + t("hours"), t("small_groups") + t("max_12_participants"), t("certificate"), t("materials")],
        price: "2.800.000 UZS",
      },
      {
        level: "B1-B2",
        title: t("intermediate"),
        description: t("course_desc_b1_intermediate"),
        features: ["120 " + t("hours"), t("small_groups") + t("max_10_participants"), t("certificate"), t("materials")],
        price: "3.200.000 UZS",
      },
    ],
    russisch: [
      {
        level: "A1",
        title: t("beginner"),
        description: t("course_desc_a1_beginner"),
        features: ["80 " + t("hours"), t("small_groups") + t("max_12_participants"), t("certificate"), t("materials")],
        price: "2.400.000 UZS",
      },
      {
        level: "A2",
        title: t("beginner"),
        description: t("course_desc_a2_basic"),
        features: ["100 " + t("hours"), t("small_groups") + t("max_10_participants"), t("certificate"), t("materials")],
        price: "2.900.000 UZS",
      },
    ],
  }

  return (
    <section id="kurse" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background image with blur effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
          alt="Students learning in classroom"
          fill
          className="object-cover opacity-85 filter blur-[1.5px]"
          priority
        />
        <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("our_courses")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("choose_courses")}</p>
        </div>

        <Tabs defaultValue="deutsch" value={language} onValueChange={setLanguage} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="deutsch">{t("language_german")}</TabsTrigger>
            <TabsTrigger value="usbekisch">{t("language_uzbek")}</TabsTrigger>
            <TabsTrigger value="englisch">{t("language_english")}</TabsTrigger>
            <TabsTrigger value="russisch">{t("language_russian")}</TabsTrigger>
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
