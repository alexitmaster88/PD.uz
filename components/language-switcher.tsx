"use client"

import React, { useState, useEffect, startTransition } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { ChevronUp, Facebook, Instagram, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"

const SOCIAL_ICONS = [
  { 
    type: 'lucide',
    icon: Facebook, 
    link: "https://facebook.com/profideutsch"
  },
  { 
    type: 'lucide',
    icon: Instagram, 
    link: "https://instagram.com/profideutsch"
  },
  { 
    type: 'custom',
    imageSrc: "/images/telegram-icon.svg",
    link: "https://t.me/profideutsch"
  }
]

type Lang = "de" | "uz" | "en" | "ru"

const FLAG_SRC: Record<Lang, string> = {
  de: "/images/flag-de.png",
  uz: "/images/flag-uz.png",
  en: "/images/flag-en.png",
  ru: "/images/flag-ru.png",
}

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedLang, setSelectedLang] = useState<string | null>(null)
  const [pendingScroll, setPendingScroll] = useState<number | null>(null)
  const [currentIconIndex, setCurrentIconIndex] = useState(0)

  // Rotate social media icons
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % SOCIAL_ICONS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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

  // Effect to handle scroll restoration (single, reliable attempt)
  useEffect(() => {
    if (pendingScroll !== null) {
      // Try multiple times to ensure scroll is applied after route updates
      let attempts = 0
      const maxAttempts = 8

      const tryRestore = () => {
        window.scrollTo(0, pendingScroll)
        attempts += 1
        if (attempts < maxAttempts) {
          // schedule another try in case layout hasn't settled
          setTimeout(tryRestore, attempts * 50)
        } else {
          setPendingScroll(null)
        }
      }

      requestAnimationFrame(tryRestore)
    }
  }, [pendingScroll])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleLanguageChange = (lang: "de" | "uz" | "en" | "ru") => {
    setSelectedLang(lang)
    // Store current scroll position (will be restored after navigation)
    const scrollPos = window.scrollY
    setPendingScroll(scrollPos)
    const nextPath = (() => {
      const parts = (pathname || "/").split("/")
      parts[1] = lang // ['', lang, ...]
      const joined = parts.join("/") || `/${lang}`
      return joined.replace(/\/+$/, "") || `/${lang}`
    })()
  
    // Store current scroll position in sessionStorage as a fallback
    sessionStorage.setItem('scrollPosition', scrollPos.toString())

    setTimeout(async () => {
      setLanguage(lang)
      startTransition(async () => {
        await router.replace(nextPath, { scroll: false })

        // After navigation, attempt to restore scroll from sessionStorage
        const saved = sessionStorage.getItem('scrollPosition')
        if (saved) {
          const savedPos = parseInt(saved)
          // Use pendingScroll state to trigger the restoration effect
          setPendingScroll(savedPos)
          sessionStorage.removeItem('scrollPosition')
        }
      })
      setIsExpanded(false)
      setSelectedLang(null)
    }, 200)
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
                key="social"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <a
                  href={SOCIAL_ICONS[currentIconIndex]?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <motion.div
                    key={currentIconIndex}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {SOCIAL_ICONS[currentIconIndex]?.type === 'lucide' ? (
                      React.createElement(SOCIAL_ICONS[currentIconIndex].icon!, {
                        className: "h-6 w-6 text-white",
                      })
                    ) : (
                      <Image
                        src={SOCIAL_ICONS[currentIconIndex]?.imageSrc || ''}
                        alt="Social Media Icon"
                        width={24}
                        height={24}
                        className="h-6 w-6 brightness-0 invert"
                      />
                    )}
                  </motion.div>
                </a>
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
