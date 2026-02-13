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

// Generate metadata
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  // `params` may be a promise in some Next.js runtimes — await it before use
  const resolvedParams = await params as { lang: string }
  // Validate language
  const lang = languages.includes(resolvedParams.lang) ? resolvedParams.lang : "de"

  const titles = {
    de: "Deutsches Sprachzentrum in Usbekistan",
    en: "German Language Center in Uzbekistan",
    ru: "Немецкий языковой центр в Узбекистане",
    uz: "O'zbekistondagi Nemis til markazi",
  }

  const descriptions = {
    de: "Lernen Sie Deutsch in unserem Sprachzentrum in Usbekistan",
    en: "Learn German language at our language center in Uzbekistan",
    ru: "Изучайте немецкий язык в нашем языковом центре в Узбекистане",
    uz: "O'zbekistondagi til markazimizda nemis tilini o'rganing",
  }

  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
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

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  // Await params to satisfy Next.js async dynamic param requirements
  const resolvedParams = await params as { lang: string }
  // Validate language
  const lang = languages.includes(resolvedParams.lang) ? resolvedParams.lang : "de"

  return (
    <LanguageProvider initialLanguage={lang as "de" | "en" | "ru" | "uz"}>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <LanguageSwitcher />
    </LanguageProvider>
  )
}
