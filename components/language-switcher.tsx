"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { ChevronUp, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

type Lang = "de" | "uz" | "en" | "ru"

const FLAG_SRC: Record<Lang, string> = {
  de: "/images/flag-de.png",
  uz: "/images/flag-uz.png",
  en: "/images/flag-en.png",
  ru: "/images/flag-ru.png",
}

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedLang, setSelectedLang] = useState<string | null>(null)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setIsExpanded(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleLanguageChange = (lang: "de" | "uz" | "en" | "ru") => {
    setSelectedLang(lang)

    // Animate selection before changing language
    setTimeout(() => {
      setLanguage(lang)
      setIsExpanded(false)
      setSelectedLang(null)
    }, 400)
  }

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case "de":
        return "Deutsch"
      case "uz":
        return "O'zbekcha"
      case "en":
        return "English"
      case "ru":
        return "Русский"
      default:
        return lang
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 50,
        transition: { duration: 0.5 },
      }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
    >
      {/* Language options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              staggerChildren: 0.1,
              staggerDirection: -1,
            }}
            className="flex flex-col gap-2 mb-3"
          >
            {["de", "uz", "en", "ru"].map((lang, index) => (
              <motion.div
                key={lang}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <Button
                  onClick={() => handleLanguageChange(lang as "de" | "uz" | "en" | "ru")}
                  variant={language === lang ? "default" : "outline"}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 shadow-md transition-all duration-300",
                    language === lang ? "shadow-lg" : "hover:shadow-md",
                    selectedLang === lang ? "scale-110 ring-2 ring-primary" : "",
                  )}
                  aria-label={`Switch to ${getLanguageName(lang)}`}
                >
                  <motion.div
                    className="language-flag border-0 m-0"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    <div className="language-flag w-6 h-4">
                      <Image
                        src={FLAG_SRC[lang as Lang]}
                        alt={`${getLanguageName(lang)} flag`}
                        width={24}
                        height={16}
                        className="rounded-sm object-cover"
                        priority={false}
                      />
                    </div>
                  </motion.div>
                  <span className="text-sm">{getLanguageName(lang)}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={toggleExpanded}
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
            isExpanded ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90",
          )}
          aria-label="Change language"
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="chevron"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronUp className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="flag"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="language-flag w-6 h-4">
                  <Image
                    src={FLAG_SRC[(language as Lang)]}
                    alt={`${getLanguageName(language)} flag`}
                    width={24}
                    height={16}
                    className="rounded-sm object-cover"
                    priority={false}
                  />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Globe className="h-3 w-3 text-primary" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Pulsing effect when first visible */}
      {isVisible && !isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: [0, 0.2, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: 2,
            repeatDelay: 1,
          }}
          className="absolute inset-0 bg-primary rounded-full"
        />
      )}
    </motion.div>
  )
}
