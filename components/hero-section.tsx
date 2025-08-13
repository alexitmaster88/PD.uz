"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import Image from "next/image"

type Lang = "de" | "uz" | "en" | "ru"

const FLAG_SRC: Record<Lang, string> = {
  de: "/images/flag-de.png",
  uz: "/images/flag-uz.png",
  en: "/images/flag-en.png",
  ru: "/images/flag-ru.png",
}

const HeroSection = () => {
  const { language, setLanguage, t, detectedLanguage, getLanguagePath } = useLanguage()
  const [showLanguageAlert, setShowLanguageAlert] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show the alert if language was automatically detected and no preference was saved
    const hasStoredPreference = localStorage.getItem("preferredLanguage") !== null
    setShowLanguageAlert(!!detectedLanguage && !hasStoredPreference && detectedLanguage === language)
  }, [detectedLanguage, language])

  const dismissAlert = () => {
    setShowLanguageAlert(false)
  }

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
    <section className="relative">
      {/* Background with German flag colors as subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-red-500/5 to-yellow-500/5" />

      <div className="container relative py-20 md:py-32 flex flex-col items-center text-center">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl"
        >
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
            {t("discover")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Button size="lg" asChild>
              <LangLink href="#kurse">{t("explore_courses")}</LangLink>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <LangLink href="#kontakt">{t("contact_us")}</LangLink>
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
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none ${
                  language === lang ? "scale-110" : ""
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                style={{ WebkitTapHighlightColor: "transparent" }}
                aria-label={`Switch to ${
                  lang === "de" ? "German" : lang === "uz" ? "Uzbek" : lang === "en" ? "English" : "Russian"
                }`}
              >
                <motion.div
                  className="language-flag"
                  whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
                >
                  <div className="w-10 h-7">
                    <Image
                      src={FLAG_SRC[lang as Lang]}
                      alt={
                        lang === "de"
                          ? "German flag"
                          : lang === "uz"
                            ? "Uzbek flag"
                            : lang === "en"
                              ? "English flag"
                              : "Russian flag"
                      }
                      width={40}
                      height={28}
                      className="rounded-sm object-cover"
                      priority={false}
                    />
                  </div>
                </motion.div>
                <span className="text-sm mt-1">
                  {lang === "de" ? "Deutsch" : lang === "uz" ? "O'zbekcha" : lang === "en" ? "English" : "Русский"}
                </span>
              </motion.button>
            ))}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-sm text-muted-foreground mt-2"
          >
            {t("language_switcher_hint")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
