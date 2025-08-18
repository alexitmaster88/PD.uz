"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { usePathname } from "next/navigation"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const { t, getLanguagePath, language, setLanguage } = useLanguage()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      // Show language switcher when scrolled past 300px
      setShowLanguageSwitcher(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)

    // Close language menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (isLanguageMenuOpen && !(event.target as Element).closest(".language-menu-container")) {
        setIsLanguageMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isLanguageMenuOpen])

  // Create a language-aware link component
  const LangLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
    const languagePath = getLanguagePath(href)
    return (
      <Link href={languagePath} className={className}>
        {children}
      </Link>
    )
  }

  // Function to toggle between languages
    const toggleLanguage = () => {
    const languages: ("de" | "uz" | "en" | "ru")[] = ["de", "uz", "en", "ru"]
    const currentIndex = languages.indexOf(language as "de" | "uz" | "en" | "ru")
    const nextIndex = (currentIndex + 1) % languages.length
    setLanguage(languages[nextIndex] as "de" | "en" | "ru" | "uz")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/15 backdrop-blur-2xl shadow-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <LangLink href="/" className="flex items-center space-x-2">
            <Image
              src="/ICOProfideutsch2.png"
              alt={t("logo_alt")}
              width={180}
              height={50}
              className="h-auto"
              priority
            />
          </LangLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <LangLink href="#kurse" className="text-sm font-medium text-[#130080] transition-colors hover:text-[#130080]/80">
            {t("courses")}
          </LangLink>
          <LangLink href="#standorte" className="text-sm font-medium text-[#130080] transition-colors hover:text-[#130080]/80">
            {t("locations")}
          </LangLink>
          <LangLink href="#vorteile" className="text-sm font-medium text-[#130080] transition-colors hover:text-[#130080]/80">
            {t("benefits")}
          </LangLink>
          <LangLink href="#kontakt" className="text-sm font-medium text-[#130080] transition-colors hover:text-[#130080]/80">
            {t("contact")}
          </LangLink>
          <Button>{t("register_now")}</Button>

          {/* Language switcher icon - only visible when scrolled */}
          {showLanguageSwitcher && (
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-all"
                aria-label={t("switch_language")}
              >
                <Globe className="h-4 w-4 text-primary" />
              </button>

              {/* Language dropdown menu */}
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-background rounded-md shadow-lg overflow-hidden z-50 language-menu-container">
                  <div className="py-1">
                    {[
                      { code: "de", name: t("language_german"), flag: "/images/flag-de.png" },
                      { code: "en", name: t("language_english"), flag: "/images/flag-en.png" },
                      { code: "ru", name: t("language_russian"), flag: "/images/flag-ru.png" },
                      { code: "uz", name: t("language_uzbek"), flag: "/images/flag-uz.png" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        className={`flex items-center w-full px-3 py-2 text-sm hover:bg-secondary transition-colors ${
                          language === lang.code ? "bg-primary/10 font-medium" : ""
                        }`}
                        onClick={() => {
                          setLanguage(lang.code as "de" | "en" | "ru" | "uz")
                          setIsLanguageMenuOpen(false)
                        }}
                      >
                        <img
                          src={lang.flag || "/placeholder.svg"}
                          alt={`${lang.name} flag`}
                          className="w-4 h-4 rounded-full mr-2 object-cover"
                        />
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Mobile language switcher - only visible when scrolled */}
          {showLanguageSwitcher && (
            <div className="relative language-menu-container">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-all"
                aria-label={t("switch_language")}
              >
                <Globe className="h-4 w-4 text-primary" />
              </button>

              {/* Language dropdown menu */}
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-background rounded-md shadow-lg overflow-hidden z-50">
                  <div className="py-1">
                    {[
                      { code: "de", name: t("language_german"), flag: "/images/flag-de.png" },
                      { code: "en", name: t("language_english"), flag: "/images/flag-en.png" },
                      { code: "ru", name: t("language_russian"), flag: "/images/flag-ru.png" },
                      { code: "uz", name: t("language_uzbek"), flag: "/images/flag-uz.png" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        className={`flex items-center w-full px-3 py-2 text-sm hover:bg-secondary transition-colors ${
                          language === lang.code ? "bg-primary/10 font-medium" : ""
                        }`}
                        onClick={() => {
                          setLanguage(lang.code as "de" | "en" | "ru" | "uz")
                          setIsLanguageMenuOpen(false)
                        }}
                      >
                        <img
                          src={lang.flag || "/placeholder.svg"}
                          alt={`${lang.name} flag`}
                          className="w-4 h-4 rounded-full mr-2 object-cover"
                        />
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? t("menu_close") : t("menu_open")}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 bg-background">
          <nav className="flex flex-col space-y-4">
            <LangLink
              href="#kurse"
              className="text-sm font-medium text-[#130080] transition-colors hover:text-[#130080]/80"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("courses")}
            </LangLink>
            <LangLink
              href="#standorte"
              className="text-sm font-medium text-[#130080] transition-colors hover:text-[#130080]/80"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("locations")}
            </LangLink>
            <LangLink
              href="#vorteile"
              className="text-sm font-medium text-[#130080] transition-colors hover:text-[#130080]/80"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("benefits")}
            </LangLink>
            <LangLink
              href="#kontakt"
              className="text-sm font-medium text-[#130080] transition-colors hover:text-[#130080]/80"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("contact")}
            </LangLink>
            <Button onClick={() => setIsMenuOpen(false)}>{t("register_now")}</Button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
