"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { type LanguageContent, useLanguageContent } from "@/utils/language-content"

const LanguageSpecificHero = () => {
  const { language, setLanguage, t, detectedLanguage, getLanguagePath } = useLanguage()
  const [showLanguageAlert, setShowLanguageAlert] = useState(false)

  useEffect(() => {
    // Show the alert if language was automatically detected and no preference was saved
    const hasStoredPreference = localStorage.getItem("preferredLanguage") !== null
    setShowLanguageAlert(!!detectedLanguage && !hasStoredPreference && detectedLanguage === language)
  }, [detectedLanguage, language])

  const dismissAlert = () => {
    setShowLanguageAlert(false)
  }

  // Language-specific hero backgrounds
  const heroBackgrounds: LanguageContent<string> = {
    de: "bg-gradient-to-b from-black/5 via-[#DD0000]/5 to-[#FFCE00]/5",
    en: "bg-gradient-to-b from-[#012169]/5 via-white/5 to-[#C8102E]/5",
    ru: "bg-gradient-to-b from-white/5 via-[#0039A6]/5 to-[#D52B1E]/5",
    uz: "bg-gradient-to-b from-[#0099B5]/5 via-white/5 to-[#1EB53A]/5",
  }

  // Language-specific hero images
  const heroImages: LanguageContent<string> = {
    de: "/images/german-classroom-1.png",
    en: "/images/german-classroom-2.png",
    ru: "/images/uzbek-german-1.png",
    uz: "/images/uzbek-german-2.png",
  }

  // Language-specific hero content
  const heroContent: LanguageContent<{
    subtitle: string
    cta: string
    secondaryCta: string
    image: string
    imageAlt: string
  }> = {
    de: {
      subtitle: "Entdecken Sie die deutsche Sprache und Kultur im Herzen von Usbekistan",
      cta: "Kurse entdecken",
      secondaryCta: "Über uns",
      image: heroImages.de,
      imageAlt: "Deutsche Kultur und Sprache",
    },
    en: {
      subtitle: "Learn German language and culture in the heart of Uzbekistan",
      cta: "Explore courses",
      secondaryCta: "About us",
      image: heroImages.en,
      imageAlt: "German culture and language",
    },
    ru: {
      subtitle: "Изучайте немецкий язык и культуру в самом сердце Узбекистана",
      cta: "Изучить курсы",
      secondaryCta: "О нас",
      image: heroImages.ru,
      imageAlt: "Немецкая культура и язык",
    },
    uz: {
      subtitle: "O'zbekiston markazida nemis tili va madaniyatini o'rganing",
      cta: "Kurslarni ko'rish",
      secondaryCta: "Biz haqimizda",
      image: heroImages.uz,
      imageAlt: "Nemis madaniyati va tili",
    },
  }

  const currentHeroContent = useLanguageContent(heroContent)
  const currentBackground = useLanguageContent(heroBackgrounds)

  // Create a language-aware link component
  const LangLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
    const languagePath = getLanguagePath(href)
    return (
      <Link href={languagePath} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <section className="relative bg-background/82">
      {/* Background with language-specific colors and image */}
      <div className={`absolute inset-0 ${currentBackground} opacity-70`} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/language-specific-hero.tsx/photo-1599946347371-68eb71b16afc.png"
          alt="Berlin cityscape aerial view"
          fill
          className="object-cover opacity-20 filter blur-[1.3px]"
          priority
        />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-3xl mx-auto min-h-[400px]"
          >
            {/* Language detection alert */}
            <AnimatePresence>
              {showLanguageAlert && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-full max-w-lg mx-auto mb-6"
                >
                  <Alert className="bg-primary/10 border-primary/20">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertDescription className="flex justify-between items-center w-full">
                      <span>{t("language_detected")}</span>
                      <Button variant="ghost" size="sm" onClick={dismissAlert} className="h-6 w-6 p-0">
                        <X className="h-4 w-4" />
                        <span className="sr-only">{t("dismiss")}</span>
                      </Button>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter"
            >
              {t("welcome")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-muted-foreground"
            >
              {currentHeroContent.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <Button size="lg" asChild>
                <LangLink href="#kurse">{currentHeroContent.cta}</LangLink>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <LangLink href="#about">{currentHeroContent.secondaryCta}</LangLink>
              </Button>
            </motion.div>

            {/* Language flags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex justify-center gap-6 pt-8"
            >
              {["de", "uz", "en", "ru"].map((lang, index) => (
                <motion.button
                  key={lang}
                  onClick={() => setLanguage(lang as "de" | "uz" | "en" | "ru")}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none w-16 h-20 ${
                    language === lang ? "scale-110 font-medium" : ""
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  aria-label={`Switch to ${
                    lang === "de" ? "German" : lang === "uz" ? "Uzbek" : lang === "en" ? "English" : "Russian"
                  }`}
                >
                  <motion.div
                    className="language-flag"
                    whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
                  >
                    <img
                      src={`/images/flag-${lang}.png`}
                      alt={`${lang === "de" ? "German" : lang === "uz" ? "Uzbek" : lang === "en" ? "English" : "Russian"} flag`}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  </motion.div>
                  <span className="text-sm mt-1 line-clamp-2 text-center">
                    {lang === "de" ? "Deutsch" : lang === "uz" ? "O'zbekcha" : lang === "en" ? "English" : "Русский"}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default LanguageSpecificHero
