"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { type LanguageContent, useLanguageContent } from "@/utils/language-content"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Testimonial {
  name: string
  role: string
  company?: string
  text: string
  image: string
  location: string
}

const LanguageSpecificTestimonials = () => {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Language-specific testimonials
  const testimonials: LanguageContent<{
    title: string
    description: string
    items: Testimonial[]
  }> = {
    de: {
      title: "Was unsere Studenten sagen",
      description: "Erfahrungen unserer deutschsprachigen Studenten",
      items: [
        {
          name: "Maximilian Schmidt",
          role: "Austauschstudent",
          company: "Universität München",
          text: "Das Deutschzentrum hat mir geholfen, mich in Usbekistan zurechtzufinden. Die Usbekischkurse waren hervorragend und die Lehrer sehr geduldig mit mir. Ich kann das Zentrum jedem deutschen Studenten empfehlen, der nach Usbekistan kommt.",
          image: "/images/testimonial-de.png",
          location: "München, Deutschland",
        },
        {
          name: "Sophia Weber",
          role: "Projektmanagerin",
          company: "Deutsche Gesellschaft für Internationale Zusammenarbeit",
          text: "Als ich für ein Projekt nach Taschkent kam, brauchte ich schnell Grundkenntnisse in Usbekisch. Das Sprachzentrum bot mir einen maßgeschneiderten Intensivkurs an, der genau auf meine Bedürfnisse zugeschnitten war.",
          image: "/images/testimonial-de.png",
          location: "Berlin, Deutschland",
        },
      ],
    },
    en: {
      title: "What Our Students Say",
      description: "Experiences from our English-speaking students",
      items: [
        {
          name: "James Wilson",
          role: "Business Consultant",
          company: "International Trade Center",
          text: "The German Language Center provided me with excellent language training that was crucial for my business dealings in Germany. The teachers understand the needs of English speakers and make German grammar much more approachable.",
          image: "/images/testimonial-en.png",
          location: "London, UK",
        },
        {
          name: "Emily Johnson",
          role: "Exchange Student",
          company: "University of Manchester",
          text: "I needed to learn German quickly before my semester abroad in Berlin. The intensive course at the center gave me the confidence to communicate effectively from day one in Germany.",
          image: "/images/testimonial-en.png",
          location: "Manchester, UK",
        },
      ],
    },
    ru: {
      title: "Что говорят наши студенты",
      description: "Отзывы наших русскоговорящих студентов",
      items: [
        {
          name: "Алексей Петров",
          role: "Бизнесмен",
          company: "ООО 'Восток-Запад'",
          text: "Благодаря курсам немецкого языка в центре, я смог расширить свой бизнес на немецкоговорящие страны. Преподаватели отлично понимают трудности, с которыми сталкиваются русскоговорящие при изучении немецкого.",
          image: "/images/testimonial-ru.png",
          location: "Москва, Россия",
        },
        {
          name: "Елена Смирнова",
          role: "Переводчик",
          text: "Я работаю переводчиком и решила добавить немецкий язык в свой профессиональный портфель. Методика преподавания в центре помогла мне быстро освоить язык и начать принимать заказы на переводы.",
          image: "/images/testimonial-ru.png",
          location: "Ташкент, Узбекистан",
        },
      ],
    },
    uz: {
      title: "Talabalarimiz nima deyishadi",
      description: "O'zbek tilidagi talabalarimizning tajribalari",
      items: [
        {
          name: "Aziz Karimov",
          role: "Talaba",
          company: "Toshkent Davlat Universiteti",
          text: "Nemis tili markazidagi o'qitish uslubi juda samarali. Men olti oyda nemis tilini B1 darajasiga yetkazishga muvaffaq bo'ldim va hozir Germaniyada o'qish uchun stipendiya oldim.",
          image: "/images/testimonial-uz.png",
          location: "Toshkent, O'zbekiston",
        },
        {
          name: "Nilufar Rahimova",
          role: "Tarjimon",
          text: "Men nemis tilini o'rganish uchun ko'p markazlarni ko'rib chiqdim, lekin bu yerda o'qitish sifati va individual yondashuv meni qoniqtirdi. Endi men nemis kompaniyalari bilan ishlashda muammolarga duch kelmayman.",
          image: "/images/testimonial-uz.png",
          location: "Samarqand, O'zbekiston",
        },
      ],
    },
  }

  const currentTestimonials = useLanguageContent(testimonials)
  const testimonialsCount = currentTestimonials.items.length

  const nextTestimonial = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % testimonialsCount)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + testimonialsCount) % testimonialsCount)
  }

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 8000)
    return () => clearInterval(interval)
  }, [testimonialsCount])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  return (
    <section className="py-16 md:py-24 relative">
      {/* Background image with blur effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80"
          alt="People sitting on bench near lake"
          fill
          className="object-cover opacity-85 filter blur-[1.5px]"
          priority
        />
        <div className="absolute inset-0 bg-[#aef2ea]/50"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{currentTestimonials.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{currentTestimonials.description}</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full"
            >
              <Card className="border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={currentTestimonials.items[activeIndex].image || "/placeholder.svg"}
                          alt={currentTestimonials.items[activeIndex].name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1">
                          <Quote className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <p className="text-lg mb-4 italic">{currentTestimonials.items[activeIndex].text}</p>
                      <div>
                        <p className="font-bold">{currentTestimonials.items[activeIndex].name}</p>
                        <p className="text-sm text-muted-foreground">
                          {currentTestimonials.items[activeIndex].role}
                          {currentTestimonials.items[activeIndex].company &&
                            `, ${currentTestimonials.items[activeIndex].company}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {currentTestimonials.items[activeIndex].location}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-6 gap-2">
            <Button size="icon" variant="outline" onClick={prevTestimonial} aria-label={t("previous")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: testimonialsCount }).map((_, index) => (
              <Button
                key={index}
                size="icon"
                variant={index === activeIndex ? "default" : "outline"}
                className="w-8 h-8"
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1)
                  setActiveIndex(index)
                }}
                aria-label={`${t("testimonial")} ${index + 1}`}
              >
                {index + 1}
              </Button>
            ))}
            <Button size="icon" variant="outline" onClick={nextTestimonial} aria-label={t("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LanguageSpecificTestimonials
