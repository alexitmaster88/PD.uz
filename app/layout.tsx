import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { ParallaxProvider } from "@/components/parallax-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata = {
  title: "Profi Deutsch in Usbekistan",
  description: "Lernen Sie Deutsch, Usbekisch, Englisch und Russisch in unserem Sprachzentrum in Usbekistan",
  icons: {
    icon: "/PDico.png",
    apple: "/PDico.png",
  },
    generator: 'v0.app'
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
      <body className={`${inter.className} relative min-h-screen text-style-override`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ParallaxProvider>
            <div className="relative z-10">
              <LanguageProvider>{children}</LanguageProvider>
            </div>
          </ParallaxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
