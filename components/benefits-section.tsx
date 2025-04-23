"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Globe2, BookOpen, Award, Users, Briefcase, GraduationCap } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

const BenefitsSection = () => {
  const { t } = useLanguage()

  const benefits = [
    {
      icon: <Globe2 className="h-10 w-10 text-primary" />,
      title: t("international_recognition"),
      description: t("international_recognition_desc"),
      image: "/images/certificate-1.png",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: t("modern_methods"),
      description: t("modern_methods_desc"),
      image: "/images/language-learning-1.png",
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: t("qualified_teachers"),
      description: t("qualified_teachers_desc"),
      image: "/images/teacher-1.png",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: t("small_learning_groups"),
      description: t("small_learning_groups_desc"),
      image: "/images/students-1.png",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: t("career_prospects"),
      description: t("career_prospects_desc"),
      image: "/images/german-culture-1.png",
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      title: t("study_opportunities"),
      description: t("study_opportunities_desc"),
      image: "/images/german-university.png",
    },
  ]

  return (
    <section id="vorteile" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("why_learn_german")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("discover_benefits")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-none shadow-md overflow-hidden">
              <div className="relative h-48 w-full">
                <Image src={benefit.image || "/placeholder.svg"} alt={benefit.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-1 text-white">{benefit.title}</h3>
                  </div>
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex flex-col">
                  <div className="mb-3 p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-secondary/50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">{t("german_most_spoken")}</h3>
          <p className="text-lg mb-6">{t("german_importance")}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary">100+ {t("million")}</div>
              <div className="text-sm text-muted-foreground">{t("native_speakers")}</div>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary">#1</div>
              <div className="text-sm text-muted-foreground">{t("economy_europe")}</div>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary">400+</div>
              <div className="text-sm text-muted-foreground">{t("universities")}</div>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary">2000+</div>
              <div className="text-sm text-muted-foreground">{t("german_companies")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
