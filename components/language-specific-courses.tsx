"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { type LanguageContent, useLanguageContent } from "@/utils/language-content"
import Image from "next/image"

const LanguageSpecificCourses = () => {
  const [courseLanguage, setCourseLanguage] = useState<keyof CourseDataType>("deutsch")
  const { t, language } = useLanguage()

  const languageSpecificCourses: LanguageContent<{
    title: string
    description: string
    popularCourses: string[]
    specialOffers: {
      title: string
      description: string
      price: string
      discount?: string
      image?: string
    }[]
  }> = {
    de: {
      title: t("our_courses"),
      // description: t("choose_courses"),
      popularCourses: [t("popular_courses")],
      specialOffers: [
        {
          title: t("early_bird_discount"),
          description: t("early_bird_desc"),
          price: "2.125.000 UZS",
          discount: "2.500.000 UZS",
          image: "/images/german-classroom-1.png",
        },
      ],
    },
    en: {
      title: t("our_courses"),
      // description: t("choose_courses"),
      popularCourses: [t("popular_courses")],
      specialOffers: [
        {
          title: t("early_bird_discount"),
          description: t("early_bird_desc"),
          price: "2,125,000 UZS",
          discount: "2,500,000 UZS",
          image: "/images/german-classroom-2.png",
        },
      ],
    },
    ru: {
      title: t("our_courses"),
      // description: t("choose_courses"),
      popularCourses: [t("popular_courses")],
      specialOffers: [
        {
          title: t("early_bird_discount"),
          description: t("early_bird_desc"),
          price: "2 125 000 UZS",
          discount: "2 500 000 UZS",
          image: "/images/students-1.png",
        },
      ],
    },
    uz: {
      title: t("our_courses"),
      // description: t("choose_courses"),
      popularCourses: [t("popular_courses")],
      specialOffers: [
        {
          title: t("early_bird_discount"),
          description: t("early_bird_desc"),
          price: "2,125,000 UZS",
          discount: "2,500,000 UZS",
          image: "/images/students-2.png",
        },
      ],
    },
  }

  const currentCourses = useLanguageContent(languageSpecificCourses)

  // Course images by language
  const courseImages: Record<keyof CourseDataType, string> = {
    deutsch: "/images/course-german.png",
    usbekisch: "/images/course-uzbek.png",
    englisch: "/images/course-english.png",
    russisch: "/images/course-russian.png",
  }

  type CourseType = {
    level: string;
    title: string;
    description: string;
    features: string[];
    price: string;
  }

  type CourseDataType = {
    [key in 'deutsch' | 'usbekisch' | 'englisch' | 'russisch']: CourseType[];
  }

  const courseData: CourseDataType = {
    deutsch: [
      {
        level: "A1",
        title: t("A1.1-A1.2"),
        description: t("course_desc_a1_beginner"),
        features: [t("Germaniyada malaka o'tagan pedagog"), "144 " + t("hours"), t("small_groups") + t("max_12_participants"), t("materials")],
        price: "2.500.000 UZS",
      },
      {
        level: "A2",
        title: t("A2.1-A2.2"),
        description: t("course_desc_a2_basic"),
        features: [t("Germaniyada malaka o'tagan pedagog"), "144 " + t("hours"), t("small_groups") + t("max_10_participants"), t("materials")],
        price: "3.000.000 UZS",
      },
      {
        level: "B1",
        title: t("B1.1-B1.2"),
        description: t("course_desc_b1_intermediate"),
        features: [t("Germaniyada malaka o'tagan pedagog"), "144 " + t("hours"), t("small_groups") + t("max_10_participants"),  t("materials")],
        price: "3.500.000 UZS",
      },
      {
        level: "B2",
        title: t("B2.1-B2.2"),
        description: t("course_desc_b2_advanced"),
        features: [t("Germaniyada malaka o'tagan pedagog"), "144 " + t("hours"), t("small_groups") + t("max_8_participants"), t("materials")],
        price: "4.000.000 UZS",
      },
    ],
    usbekisch: [
      {
        level: "A1",
        title: t("beginner"),
        description: t("course_desc_a1_beginner"),
        features: ["60 " + t("hours"), t("small_groups") + t("max_12_participants"), t("materials")],
        price: "2.000.000 UZS",
      },
      {
        level: "A2",
        title: t("beginner"),
        description: t("course_desc_a2_basic"),
        features: ["80 " + t("hours"), t("small_groups") + t("max_10_participants"), t("materials")],
        price: "2.500.000 UZS",
      },
    ],
    englisch: [
      {
        level: "A1",
        title: t("beginner"),
        description: t("course_desc_a1_a2_beginner_plus"),
        features: ["100 " + t("hours"), t("small_groups") + t("max_12_participants"),  t("materials")],
        price: "2.800.000 UZS",
      },
      {
        level: "B1-B2",
        title: t("intermediate"),
        description: t("course_desc_b1_intermediate"),
        features: ["120 " + t("hours"), t("small_groups") + t("max_10_participants"), t("materials")],
        price: "3.200.000 UZS",
      },
    ],
    russisch: [
      {
        level: "A1",
        title: t("beginner"),
        description: t("course_desc_a1_beginner"),
        features: ["80 " + t("hours"), t("small_groups") + t("max_12_participants"),  t("materials")],
        price: "2.400.000 UZS",
      },
      {
        level: "A2",
        title: t("beginner"),
        description: t("course_desc_a2_basic"),
        features: ["100 " + t("hours"), t("small_groups") + t("max_10_participants"),  t("materials")],
        price: "2.900.000 UZS",
      },
    ],
  }

  return (
    <section id="kurse" className="py-16 md:py-24 relative overflow-hidden bg-background/82">
      <div className="absolute inset-0 z-0">
        <Image
          src="/language-specific-courses.tsx/photo-1434030216411-0b793f4b4173.png"
          alt="Education and learning background"
          fill
          className="object-cover opacity-85 filter blur-[1.5px]"
          priority
        />
        <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{currentCourses.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{currentCourses.description}</p>
        </div>

        {/* Regular course listings */}
        <Tabs defaultValue="deutsch" value={courseLanguage} onValueChange={val => setCourseLanguage(val as keyof CourseDataType)} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="deutsch">{t("course_type_german")}</TabsTrigger>
            <TabsTrigger value="usbekisch">{t("course_type_uzbek")}</TabsTrigger>
            <TabsTrigger value="englisch">{t("course_type_english")}</TabsTrigger>
            <TabsTrigger value="russisch">{t("course_type_russian")}</TabsTrigger>
          </TabsList>

          {(Object.keys(courseData) as Array<keyof CourseDataType>).map((lang) => (
            <TabsContent key={lang} value={lang} className="mt-0">
              <div
                className={`grid gap-6 ${
                  courseData[lang].length === 1
                    ? "grid-cols-1 max-w-md mx-auto"
                    : courseData[lang].length === 2
                      ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
                      : courseData[lang].length === 3
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {courseData[lang].map((course: CourseType, index: number) => (
                  <Card key={index} className="flex flex-col">
                    <div className="relative h-40 w-full">
                      <Image
                        src={courseImages[lang] || "/images/language-learning-1.png"}
                        alt={`${lang} ${course.level}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-4">
                          <h3 className="text-xl font-bold text-white">{course.level}</h3>
                          <p className="text-sm text-white/80">{course.title}</p>
                        </div>
                      </div>
                    </div>
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
                        {course.features.map((feature: string, i: number) => (
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

export default LanguageSpecificCourses
