"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { usePathname } from "next/navigation"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, getLanguagePath } = useLanguage()
  const pathname = usePathname()

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <LangLink href="/" className="flex items-center space-x-2">
            <Image
              src="/ICOProfideutsch2.png"
              alt="Profi Deutsch Logo"
              width={180}
              height={50}
              className="h-auto"
              priority
            />
          </LangLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <LangLink href="#kurse" className="text-sm font-medium transition-colors hover:text-primary">
            {t("courses")}
          </LangLink>
          <LangLink href="#standorte" className="text-sm font-medium transition-colors hover:text-primary">
            {t("locations")}
          </LangLink>
          <LangLink href="#vorteile" className="text-sm font-medium transition-colors hover:text-primary">
            {t("benefits")}
          </LangLink>
          <LangLink href="#kontakt" className="text-sm font-medium transition-colors hover:text-primary">
            {t("contact")}
          </LangLink>
          <Button>{t("register_now")}</Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 bg-background">
          <nav className="flex flex-col space-y-4">
            <LangLink
              href="#kurse"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("courses")}
            </LangLink>
            <LangLink
              href="#standorte"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("locations")}
            </LangLink>
            <LangLink
              href="#vorteile"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("benefits")}
            </LangLink>
            <LangLink
              href="#kontakt"
              className="text-sm font-medium transition-colors hover:text-primary"
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
