"use client"

import { useLanguage } from "@/contexts/language-context"

type Lang = "de" | "en" | "ru" | "uz"
const VALID_LANGS = new Set<Lang>(["de", "en", "ru", "uz"])

export function useSoftLangSwitch() {
  const { setLanguage } = useLanguage()
  return (lang: string) => {
    if (VALID_LANGS.has(lang as Lang)) {
      setLanguage(lang as Lang)
    }
  }
}
