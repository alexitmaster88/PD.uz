import type React from "react"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import LanguageSwitcher from "@/components/language-switcher"
import type { Metadata } from "next"
import { LanguageProvider } from "@/contexts/language-context"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

// Define supported languages
const languages = ["de", "en", "ru", "uz"]

// Define the props type for layout
type LayoutProps = {
  children: React.ReactNode
  params: {
    lang: string
  }
}

// Generate metadata
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  // Validate language
  const lang = languages.includes(params.lang) ? params.lang as "de" | "en" | "ru" | "uz" : "de"

  const titles: Record<"de" | "en" | "ru" | "uz", string> = {
    de: "Deutsches Sprachzentrum in Usbekistan",
    en: "German Language Center in Uzbekistan",
    ru: "Немецкий языковой центр в Узбекистане",
    uz: "O'zbekistondagi Nemis til markazi",
  }

  const descriptions: Record<"de" | "en" | "ru" | "uz", string> = {
    de: "Lernen Sie Deutsch, Usbekisch, Englisch und Russisch in unserem Sprachzentrum in Usbekistan",
    en: "Learn German, Uzbek, English, and Russian at our language center in Uzbekistan",
    ru: "Изучайте немецкий, узбекский, английский и русский языки в нашем языковом центре в Узбекистане",
    uz: "O'zbekistondagi til markazimizda nemis, o'zbek, ingliz va rus tillarini o'rganing",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      languages: {
        de: `/de`,
        en: `/en`,
        ru: `/ru`,
        uz: `/uz`,
      },
    },
  }
}

// Generate static params for all supported languages
export function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

export default function LangLayout({ children, params }: LayoutProps) {
  const lang = languages.includes(params.lang) ? params.lang : "de"

  return (
    <LanguageProvider initialLanguage={lang as "de" | "en" | "ru" | "uz"}>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <LanguageSwitcher />
    </LanguageProvider>
  )
}