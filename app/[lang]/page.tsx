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
      {/* Hero section */}
      <LanguageSpecificHero />

      {/* Welcome section with German town view */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/german-town-view.jpg"
            alt="German town view"
            fill
            className="object-cover opacity-85 filter blur-[1.5px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>
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

      {/* Testimonials section with German city view */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/german-city-view.jpg"
            alt="German city view"
            fill
            className="object-cover opacity-85 filter blur-[1.5px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>
        <div className="container relative z-10">
          <LanguageSpecificTestimonials />
        </div>
      </section>

      {/* Photo Gallery section with tall building */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/brandenburg-gate.png"
            alt="The Brandenburg Gate in Berlin, Germany"
            fill
            className="object-cover opacity-85 filter blur-[1.5px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <PhotoGallery photos={photos} title={t("photo_gallery_title")} />
        </div>
      </section>

      {/* Courses section with white and brown concrete building */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/white-brown-building.jpg"
            alt="White and brown concrete building near green trees during daytime"
            fill
            className="object-cover opacity-85 filter blur-[1.2px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>
        <div className="container relative z-10">
          <LanguageSpecificCourses />
        </div>
      </section>

      {/* Social Media section with canal between buildings */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/canal-buildings.jpg"
            alt="Canal between buildings during nighttime"
            fill
            className="object-cover opacity-85 filter blur-[1.5px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>
        <div className="container relative z-10">
          <SocialMediaFeed />
        </div>
      </section>

      {/* Cultural Content section with green trees near water */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/trees-water.jpg"
            alt="Green trees near body of water"
            fill
            className="object-cover opacity-85 filter blur-[1.5px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>
        <div className="container relative z-10">
          <LanguageSpecificCulturalContent />
        </div>
      </section>

      {/* Map section with flag */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/flag-pole.jpg"
            alt="A flag on a pole"
            fill
            className="object-cover opacity-85 filter blur-[1.2px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>
        <div className="container relative z-10">
          <MapSection />
        </div>
      </section>

      {/* Benefits section with green mountain beside water */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/mountain-water.jpg"
            alt="Green mountain beside body of water"
            fill
            className="object-cover opacity-85 filter blur-[1.5px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>
        <div className="container relative z-10">
          <BenefitsSection />
        </div>
      </section>

      {/* Reviews section with city buildings */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/city-buildings.jpg"
            alt="Photo of city buildings during daytime"
            fill
            className="object-cover opacity-85 filter blur-[1.5px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>
        <div className="container relative z-10">
          <LanguageSpecificReviews />
        </div>
      </section>

      {/* Contact section with building with dome */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/dome-building.jpg"
            alt="A large building with a dome on top"
            fill
            className="object-cover opacity-85 filter blur-[1.5px]"
            priority
          />
          <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
        </div>
        <div className="container relative z-10">
          <ContactSection />
        </div>
      </section>
    </>
  )
}
