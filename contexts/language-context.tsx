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

  const getTelcLanguageFromPath = (path: string): Language | null => {
    const supportedLanguages: Language[] = ["de", "uz", "en", "ru"]
    const segments = path.split("/").filter(Boolean)

    if (segments[0] === "telc" && supportedLanguages.includes(segments[1] as Language)) {
      return segments[1] as Language
    }

    return null
  }

  const getLanguageFromPath = (path: string): Language | null => {
    const supportedLanguages: Language[] = ["de", "uz", "en", "ru"]
    const segments = path.split("/").filter(Boolean)

    if (segments.length > 0 && supportedLanguages.includes(segments[0] as Language)) {
      return segments[0] as Language
    }

    return null
  }

  // Extract the current path without the language prefix
  const getPathWithoutLanguage = (path: string): string => {
    const supportedLanguages: Language[] = ["de", "uz", "en", "ru"]
    const segments = path.split("/").filter(Boolean)

    if (segments.length > 0 && supportedLanguages.includes(segments[0] as Language)) {
      return "/" + segments.slice(1).join("/")
    }

    if (segments.length > 1 && segments[0] === "telc" && supportedLanguages.includes(segments[1] as Language)) {
      const rest = segments.slice(2).join("/")
      return "/telc" + (rest ? `/${rest}` : "")
    }

    return path
  }

  // Get path with the specified language
  const getLanguagePath = (path: string): string => {
    const segments = path.split("/").filter(Boolean)

    if (segments.length > 0 && segments[0] === "telc") {
      const hasTelcLang = segments.length > 1 && ["de", "uz", "en", "ru"].includes(segments[1] as Language)
      const rest = hasTelcLang ? segments.slice(2).join("/") : segments.slice(1).join("/")
      return `/telc/${language}${rest ? `/${rest}` : ""}`
    }

    const pathWithoutLang = getPathWithoutLanguage(path)
    return `/${language}${pathWithoutLang === "/" ? "" : pathWithoutLang}`
  }

  useEffect(() => {
    if (!pathname) return

    const pathLang = getLanguageFromPath(pathname) || getTelcLanguageFromPath(pathname)
    if (pathLang && pathLang !== language) {
      setLanguageState(pathLang)
      document.documentElement.lang = pathLang
    }

    // Detect browser language
    const browserLang = detectBrowserLanguage()
    setDetectedLanguage(browserLang)

    // Load translations
    import("@/translations").then((module) => {
      const normalized = Object.fromEntries(
        Object.entries(module.default).map(([lang, map]) => [
          lang,
          Object.fromEntries(
            Object.entries(map).map(([k, v]) => [k, typeof v === "object" ? JSON.stringify(v) : v])
          )
        ])
      ) as Record<string, Record<string, string>>
      setTranslations(normalized)
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
    const isTelcPath = currentPath === "/telc" || currentPath.startsWith("/telc/")
    const telcRest = currentPath.split("/").slice(3).join("/")
    const newPath = isTelcPath
      ? `/telc/${lang}${telcRest ? `/${telcRest}` : ""}`
      : `/${lang}${getPathWithoutLanguage(currentPath) === "/" ? "" : getPathWithoutLanguage(currentPath)}`

    // Preserve current scroll position so we can restore it after navigation
    try {
      const scrollState = { path: currentPath, y: window.scrollY || 0 }
      sessionStorage.setItem("lang-switch-scroll", JSON.stringify(scrollState))
    } catch (e) {
      // ignore
    }

    // Only navigate if the path would actually change
    if (currentPath !== newPath) {
      // Use router.push to navigate; scroll restoration will be handled after mount
      router.push(newPath)
    }
  }

  // Restore scroll position after a language navigation (if present)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lang-switch-scroll")
      if (!raw) return
      const { y } = JSON.parse(raw)
      // Delay slightly to allow layout; then restore
      requestAnimationFrame(() => {
        window.scrollTo({ top: y || 0 })
      })
      sessionStorage.removeItem("lang-switch-scroll")
    } catch (e) {
      // ignore
    }
  }, [])

  const t = (key: string): string => {
    const langTrans = translations[language]
    const deTrans = translations["de"]
    return langTrans?.[key] ?? deTrans?.[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, detectedLanguage, getLanguagePath }}>
      {children}
    </LanguageContext.Provider>
  )
}
