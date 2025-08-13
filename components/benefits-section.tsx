"use client"
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
    <section id="vorteile" className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/benefits-section.tsx/photo-1523240795612-9a054b0db644.png"
          alt="Success and achievement background"
          fill
          className="object-cover opacity-85 filter blur-[1.5px]"
          priority
        />
        <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("why_learn_german")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("discover_benefits")}</p>
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
