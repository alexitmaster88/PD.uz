"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, MessageSquare } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const Footer = () => {
  const { t, getLanguagePath } = useLanguage()

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
    <footer className="bg-secondary">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Image src="/ICOProfideutsch2.png" alt="Profi Deutsch Logo" width={150} height={40} className="h-auto" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t("about_us")}</p>
            <div className="flex space-x-4">
              <LangLink href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </LangLink>
              <LangLink href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </LangLink>
              <LangLink href="#" className="text-muted-foreground hover:text-foreground">
                <MessageSquare size={20} />
                <span className="sr-only">Telegram</span>
              </LangLink>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("links")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <LangLink href="#kurse" className="text-muted-foreground hover:text-foreground">
                  {t("courses")}
                </LangLink>
              </li>
              <li>
                <LangLink href="#standorte" className="text-muted-foreground hover:text-foreground">
                  {t("locations")}
                </LangLink>
              </li>
              <li>
                <LangLink href="#vorteile" className="text-muted-foreground hover:text-foreground">
                  {t("benefits")}
                </LangLink>
              </li>
              <li>
                <LangLink href="#kontakt" className="text-muted-foreground hover:text-foreground">
                  {t("contact")}
                </LangLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contact")}</h3>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              <p>Amir Temur Straße 107A</p>
              <p>Taschkent, Usbekistan</p>
              <p>Telefon: +998 71 123 4567</p>
              <p>E-Mail: info@profideutsch.uz</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Profi Deutsch in Usbekistan. {t("all_rights_reserved")}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
