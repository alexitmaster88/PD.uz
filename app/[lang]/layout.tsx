import type { Metadata } from "next"
import type { ReactNode } from "react"

import { LanguageProvider } from "@/contexts/language-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import LanguageSwitcher from "@/components/language-switcher"

const languages = ["de", "en", "ru", "uz"] as const

type Lang = typeof languages[number]

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params
  const safeLang: Lang = (languages as readonly string[]).includes(lang)
    ? (lang as Lang)
    : "de"

  return {
    title: {
      de: "Deutsches Sprachzentrum in Usbekistan",
      en: "German Language Center in Uzbekistan",
      ru: "Немецкий языковой центр в Узбекистане",
      uz: "O'zbekistondagi Nemis til markazi",
    }[safeLang],
    description: {
      de: "Lernen Sie Deutsch, Usbekisch, Englisch und Russisch in unserem Sprachzentrum in Usbekistan",
      en: "Learn German, Uzbek, English, and Russian at our language center in Uzbekistan",
      ru: "Изучайте немецкий, узбекский, английский и русский языки в нашем языковом центре в Узбекистане",
      uz: "O'zbekistondagi til markazimizda nemis, o'zbek, ingliz va rus tillarini o'rganing",
    }[safeLang],
    alternates: { languages: { de: "/de", en: "/en", ru: "/ru", uz: "/uz" } },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const safeLang: Lang = (languages as readonly string[]).includes(lang)
    ? (lang as Lang)
    : "de"

  return (
    <html lang={safeLang}>
      <body>
        <LanguageProvider initialLanguage={safeLang}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <LanguageSwitcher />
        </LanguageProvider>
      </body>
    </html>
  )
}
