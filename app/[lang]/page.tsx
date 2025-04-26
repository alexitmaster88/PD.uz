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
import SocialMediaFeed from "@/components/social-media-feed"
import LanguageSpecificReviews from "@/components/language-specific-reviews"
import Image from "next/image"

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
      <section className="py-16 md:py-24 relative bg-[#aef2ea]/50">
        {/* Background image with blur effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&q=80"
            alt="Aerial view of Munich"
            fill
            className="object-cover opacity-85 filter blur-[1.5px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10">
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
      <section className="py-16 md:py-24 relative">
        {/* Background image with blur effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600454021970-351eff4a6554?auto=format&fit=crop&q=80"
            alt="View of a building across a pond"
            fill
            className="object-cover opacity-85 filter blur-[1px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>

        {/* Content */}
        <div className="container max-w-4xl mx-auto relative z-10">
          <PhotoGallery photos={photos} title={t("photo_gallery_title")} />
        </div>
      </section>
      <LanguageSpecificCourses />
      <SocialMediaFeed />
      <LanguageSpecificCulturalContent />
      <MapSection />
      <BenefitsSection />
      <LanguageSpecificReviews />
      <ContactSection />
    </>
  )
}
