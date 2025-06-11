import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata = {
  title: "Profi Deutsch in Usbekistan",
  description: "Lernen Sie Deutsch in unserem Sprachzentrum \"PROFI DEUTSCH\" in Usbekistan",
  icons: {
    icon: "/PDico.png",
    apple: "/PDico.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Add Framer Motion */}
        <link rel="preload" href="/_next/static/chunks/framer-motion.js" as="script" />
        <link rel="icon" href="/PDico.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
