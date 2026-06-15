"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { type LanguageContent, useLanguageContent } from "@/utils/language-content"
import Image from "next/image"
import Link from "next/link"

const LanguageSpecificCourses = () => {
  const [courseLanguage, setCourseLanguage] = useState<keyof CourseDataType>("deutsch")
  const { t, getLanguagePath } = useLanguage()
  const telegramUrl = "https://t.me/profi_deutsch_uz"
  const telcBookingPath = getLanguagePath("/telc/booking")

  const languageSpecificCourses: LanguageContent<{ title: string; description: string }> = {
    de: { title: t("our_courses"), description: t("") },
    en: { title: t("our_courses"), description: t("") },
    ru: { title: t("our_courses"), description: t("") },
    uz: { title: t("our_courses"), description: t("") },
  }

  const currentCourses = useLanguageContent(languageSpecificCourses)

  type CourseType = {
    level: string
    title: string
    description: string
    features: string[]
    price: string
    image?: string
  }

  type CourseDataType = { [key in "deutsch" | "usbekisch"]: CourseType[] }

  const courseData: CourseDataType = {
    deutsch: [
      {
        level: "A1",
        title: t("A1.1-A1.2"),
        description: t("course_desc_a1_beginner"),
        features: [t("teacher_trained_in_germany"), "108 " + t("hours"), t("small_groups") + t("max_12_participants"), t("materials")],
        price: "",
        image: "/images/beginner.jpg",
      },
      {
        level: "A2",
        title: t("A2.1-A2.2"),
        description: t("course_desc_a2_basic"),
        features: [t("teacher_trained_in_germany"), "108 " + t("hours"), t("small_groups") + t("max_10_participants"), t("materials")],
        price: "",
        image: "/images/pre_inter.jpg",
      },
      {
        level: "B1",
        title: t("B1.1-B1.2"),
        description: t("course_desc_b1_intermediate"),
        features: [t("teacher_trained_in_germany"), "108 " + t("hours"), t("small_groups") + t("max_10_participants"), t("materials")],
        price: "",
        image: "/images/inter.jpg",
      },
      {
        level: "B2",
        title: t("B2.1-B2.2"),
        description: t("course_desc_b2_advanced"),
        features: [t("teacher_trained_in_germany"), "108 " + t("hours"), t("small_groups") + t("max_8_participants"), t("materials")],
        price: "",
        image: "/images/advanced.jpg",
      },
    ],
    usbekisch: [
      {
        level: t("telc_a2_level"),
        title: t("telc_prep_title"),
        description: "",
        features: [t("telc_prep_duration"), t("telc_prep_lesson_time"), t("telc_prep_small_groups"), t("telc_prep_practice"), t("telc_prep_materials")],
        price: "",
        image: "/images/TELCexam.png",
      },
      {
        level: t("telc_a2_b1_level"),
        title: t("telc_prep_title"),
        description: "",
        features: [t("telc_prep_duration"), t("telc_prep_lesson_time"), t("telc_prep_small_groups"), t("telc_prep_practice"), t("telc_prep_materials")],
        price: "",
        image: "/images/TELCexam.png",
      },
      {
        level: t("telc_b1_level"),
        title: t("telc_prep_title"),
        description: "",
        features: [t("telc_prep_duration"), t("telc_prep_lesson_time"), t("telc_prep_small_groups"), t("telc_prep_practice"), t("telc_prep_materials")],
        price: "",
        image: "/images/TELCexam.png",
      },
      {
        level: t("telc_b2_level"),
        title: t("telc_prep_title"),
        description: "",
        features: [t("telc_prep_duration"), t("telc_prep_lesson_time"), t("telc_prep_small_groups"), t("telc_prep_practice"), t("telc_prep_materials")],
        price: "",
        image: "/images/TELCexam.png",
      },
    ],
  }

  return (
    <section id="kurse" className="relative overflow-hidden py-16 md:py-24">
      {/* Section background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/courses-bg.png"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
      </div>

      <div className="container relative">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#130080] md:text-4xl">
            {currentCourses.title}
          </h2>
          {currentCourses.description && (
            <p className="mx-auto max-w-2xl text-lg text-[#130080]/70">{currentCourses.description}</p>
          )}
        </div>

        <Tabs
          defaultValue="deutsch"
          value={courseLanguage}
          onValueChange={val => setCourseLanguage(val as keyof CourseDataType)}
          className="w-full"
        >
          <TabsList className="mb-8 grid grid-cols-2 bg-white/60 backdrop-blur-sm border border-[#130080]/10">
            <TabsTrigger value="deutsch" className="data-[state=active]:bg-[#130080] data-[state=active]:text-white">
              {t("course_type_german")}
            </TabsTrigger>
            <TabsTrigger value="usbekisch" className="data-[state=active]:bg-[#130080] data-[state=active]:text-white">
              {t("course_type_uzbek")}
            </TabsTrigger>
          </TabsList>

          <div className="grid">
            {(["deutsch", "usbekisch"] as Array<keyof CourseDataType>).map((lang) => (
              <TabsContent
                key={lang}
                value={lang}
                forceMount
                className="mt-0 [grid-area:1/1] data-[state=inactive]:invisible"
              >
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
                    <div
                      key={index}
                      className="flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-md backdrop-blur-md transition-shadow hover:shadow-lg"
                    >
                      {/* Image — light overlay so text below is unaffected */}
                      <div className="relative h-44 w-full shrink-0 overflow-hidden">
                        <Image
                          src={course.image || "/images/course-german.png"}
                          alt={`${lang} ${course.level}`}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {/* Subtle bottom fade — just enough to separate image from card body */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
                        {/* Level + type badges over the image */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <span className="rounded-lg bg-white/90 px-3 py-1 text-sm font-bold shadow-md backdrop-blur-sm" style={{ color: "#130080" }}>
                            {(course.level as string)?.match(/[A-C][12](?:[/-][A-C][12])?/)?.[0] ?? course.level}
                          </span>
                          <span className="rounded-lg bg-[#130080] px-2.5 py-1 text-xs font-semibold shadow-sm" style={{ color: "#ffffff" }}>
                            {lang === "usbekisch" ? "TELC" : t("course_type_german")}
                          </span>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="flex flex-1 flex-col p-5">
                        {/* Title */}
                        <h3 className="mb-1 text-base font-bold text-[#130080]">{course.title}</h3>
                        {course.description && (
                          <p className="mb-3 text-sm text-[#130080]/65">{course.description}</p>
                        )}

                        {/* Features */}
                        <ul className="mb-5 flex-1 space-y-2">
                          {course.features.map((feature: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#130080]" />
                              <span className="text-sm text-[#130080]/80">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA button */}
                        {lang === "usbekisch" ? (
                          <Link
                            href={telcBookingPath}
                            className="block w-full rounded-xl bg-[#130080] px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#130080]/90"
                          >
                            {t("register_now")}
                          </Link>
                        ) : (
                          <a
                            href={telegramUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full rounded-xl bg-[#130080] px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#130080]/90"
                          >
                            {t("register_now")}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  )
}

export default LanguageSpecificCourses
