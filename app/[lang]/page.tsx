"use client"

import { useLanguage } from "@/contexts/language-context"
import HeroSection from "@/components/hero-section"
import LanguageSpecificCourses from "@/components/language-specific-courses"
import BenefitsSection from "@/components/benefits-section"
import MapSection from "@/components/map-section"
import ContactSection from "@/components/contact-section"
import PartnersSection from "@/components/partners-section"
import YouTubePlayer from "@/components/youtube-player"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Video Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="backdrop-blur-md bg-white/30 rounded-2xl p-8 mb-12 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">{t("welcome_center")}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("intro_video_description")}</p>
            </div>
          </div>
          <YouTubePlayer
            videoId="HCRdpfCYxFM"
            title="Profi Deutsch o'quv markazi haqida | Maqsadlarimiz | Natijalarimiz"
          />
        </div>
      </section>

      {/* Removed CoursesSection import and usage to eliminate duplicate */}
      <LanguageSpecificCourses />
      <BenefitsSection />
      <PartnersSection />
      <MapSection />
      <ContactSection />
    </div>
  )
}
