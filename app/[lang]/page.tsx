"use client"

import { useLanguage } from "@/contexts/language-context"
import LanguageSpecificHero from "@/components/language-specific-hero"
import MapSection from "@/components/map-section"
import LanguageSpecificCourses from "@/components/language-specific-courses"
import BenefitsSection from "@/components/benefits-section"
import ContactSection from "@/components/contact-section"
import YouTubePlayer from "@/components/youtube-player"
import PhotoGallery from "@/components/photo-gallery"
import LanguageSpecificTestimonials from "@/components/language-specific-testimonials"
import LanguageSpecificCulturalContent from "@/components/language-specific-cultural-content"

export default function Home() {
  const { t } = useLanguage()

  const photos = [
    {
      src: "/images/gallery-1.png",
      alt: t("photo_alt_1"),
      caption: t("photo_caption_1"),
    },
    {
      src: "/images/gallery-2.png",
      alt: t("photo_alt_2"),
      caption: t("photo_caption_2"),
    },
    {
      src: "/images/gallery-3.png",
      alt: t("photo_alt_3"),
      caption: t("photo_caption_3"),
    },
    {
      src: "/images/gallery-4.png",
      alt: t("photo_alt_4"),
      caption: t("photo_caption_4"),
    },
    {
      src: "/images/gallery-5.png",
      alt: t("photo_alt_5"),
      caption: t("photo_caption_5"),
    },
    {
      src: "/images/gallery-6.png",
      alt: t("photo_alt_6"),
      caption: t("photo_caption_6"),
    },
  ]

  return (
    <>
      <LanguageSpecificHero />
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("welcome_center")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("intro_video_description")}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <YouTubePlayer videoId="Yw9qeR9rf4Q" title={t("intro_video_title")} />
          </div>
        </div>
      </section>
      <LanguageSpecificTestimonials />
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="container max-w-4xl mx-auto">
          <PhotoGallery photos={photos} title={t("photo_gallery_title")} />
        </div>
      </section>
      <LanguageSpecificCourses />
      <LanguageSpecificCulturalContent />
      <MapSection />
      <BenefitsSection />
      <ContactSection />
    </>
  )
}
