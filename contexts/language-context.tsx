"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

type Language = "de" | "uz" | "en" | "ru"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  detectedLanguage: Language | null
  getLanguagePath: (path: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
  initialLanguage?: Language
}

// Helper function to detect browser language
function detectBrowserLanguage(): Language {
  // Default language if detection fails
  const defaultLang: Language = "de"

  // List of supported languages
  const supportedLanguages: Language[] = ["de", "uz", "en", "ru"]

  try {
    // Get browser languages (navigator.languages is an array of preferred languages)
    const browserLanguages = navigator.languages || [navigator.language]

    // Try to find a match with our supported languages
    for (const browserLang of browserLanguages) {
      // Get the base language code (e.g., "en" from "en-US")
      const baseLang = browserLang.split("-")[0].toLowerCase()

      // Check if we support this language
      if (supportedLanguages.includes(baseLang as Language)) {
        return baseLang as Language
      }
    }

    return defaultLang
  } catch (error) {
    console.error("Error detecting browser language:", error)
    return defaultLang
  }
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage || "de")
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({})
  const [detectedLanguage, setDetectedLanguage] = useState<Language | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Extract the current path without the language prefix
  const getPathWithoutLanguage = (path: string): string => {
    const supportedLanguages: Language[] = ["de", "uz", "en", "ru"]
    const segments = path.split("/")

    // If the first segment is a language code, remove it
    if (segments.length > 1 && supportedLanguages.includes(segments[1] as Language)) {
      return "/" + segments.slice(2).join("/")
    }

    return path
  }

  // Get path with the specified language
  const getLanguagePath = (path: string): string => {
    const pathWithoutLang = getPathWithoutLanguage(path)
    return `/${language}${pathWithoutLang === "/" ? "" : pathWithoutLang}`
  }

  useEffect(() => {
    // Detect browser language
    const browserLang = detectBrowserLanguage()
    setDetectedLanguage(browserLang)

    // Load translations
    import("@/translations").then((module) => {
      setTranslations(module.default)
    })

    // Update HTML lang attribute when language changes
    if (initialLanguage) {
      document.documentElement.lang = initialLanguage
    }
  }, [initialLanguage])

  const setLanguage = (lang: Language) => {
    // Update state
    setLanguageState(lang)

    // Save to localStorage
    localStorage.setItem("preferredLanguage", lang)

    // Update document language
    document.documentElement.lang = lang

    // Set cookie for server-side language detection
    document.cookie = `preferredLanguage=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`

    // Navigate to the same page but with new language prefix
    const currentPath = pathname || "/"
    const newPath = `/${lang}${getPathWithoutLanguage(currentPath) === "/" ? "" : getPathWithoutLanguage(currentPath)}`

    // Only navigate if the path would actually change
    if (currentPath !== newPath) {
      router.push(newPath)
    }
  }

  const t = (key: string): string => {
    if (!translations[language]) return key
    return translations[language][key] || translations["de"][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, detectedLanguage, getLanguagePath }}>
      {children}
    </LanguageContext.Provider>
  )
}
