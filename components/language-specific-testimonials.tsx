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
        {
          name: "Lukas Becker",
          role: "Geschäftsführer",
          company: "Becker Import-Export GmbH",
          text: "Die Sprachkurse haben mir ermöglicht, meine Geschäftsbeziehungen in Usbekistan erheblich zu verbessern. Die Lehrer verstehen die kulturellen Nuancen und haben mir nicht nur die Sprache, sondern auch wichtige Geschäftsetikette beigebracht.",
          image: "/images/testimonial-de.png",
          location: "Hamburg, Deutschland",
        },
        {
          name: "Hannah Müller",
          role: "Doktorandin",
          company: "Humboldt-Universität zu Berlin",
          text: "Für meine Forschung zur zentralasiatischen Geschichte war das Erlernen des Usbekischen unerlässlich. Die strukturierte Methodik und die kompetenten Lehrkräfte haben mir geholfen, in nur sechs Monaten ein fortgeschrittenes Niveau zu erreichen.",
          image: "/images/testimonial-de.png",
          location: "Berlin, Deutschland",
        },
        {
          name: "Felix Hoffmann",
          role: "Ingenieur",
          company: "Siemens AG",
          text: "Als Expatriate in Taschkent war es mir wichtig, mich mit den Einheimischen verständigen zu können. Der Usbekisch-Kurs für Berufstätige passte perfekt in meinen vollen Terminkalender und die Lernerfolge waren beeindruckend schnell sichtbar.",
          image: "/images/testimonial-de.png",
          location: "Frankfurt, Deutschland",
        },
        {
          name: "Emma Wagner",
          role: "Medizinstudentin",
          company: "Charité Berlin",
          text: "Für mein Auslandssemester am Medizinischen Institut Taschkent brauchte ich sowohl Russisch als auch Usbekisch. Das Zentrum bot mir ein kombiniertes Programm an, das mir den Einstieg in beide Sprachen gleichzeitig ermöglichte.",
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
        {
          name: "Michael Brown",
          role: "Software Engineer",
          company: "Tech Innovations Ltd",
          text: "When I got a job offer from a German tech company, I had only three months to learn the basics. The center's specialized IT German course was exactly what I needed, focusing on technical vocabulary and business communication.",
          image: "/images/testimonial-en.png",
          location: "San Francisco, USA",
        },
        {
          name: "Olivia Davis",
          role: "Art Historian",
          company: "Metropolitan Museum",
          text: "The German for Academics course helped me tremendously with my research on German Expressionism. The teachers focused on academic writing and reading skills, which was perfect for my needs.",
          image: "/images/testimonial-en.png",
          location: "New York, USA",
        },
        {
          name: "Robert Thompson",
          role: "Diplomat",
          company: "British Foreign Service",
          text: "As a diplomat posted to Uzbekistan, I needed to learn both German and Uzbek. The center offered a flexible program that allowed me to progress in both languages simultaneously. The cultural insights provided were invaluable.",
          image: "/images/testimonial-en.png",
          location: "London, UK",
        },
        {
          name: "Sophia Martinez",
          role: "Medical Researcher",
          company: "International Health Organization",
          text: "The specialized medical German course prepared me perfectly for my research fellowship at Charité Hospital in Berlin. The focus on medical terminology and patient communication was exactly what I needed.",
          image: "/images/testimonial-en.png",
          location: "Toronto, Canada",
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
        {
          name: "Игорь Соколов",
          role: "Инженер",
          company: "Газпром",
          text: "Работая над совместным проектом с немецкими коллегами, я понял, что мне необходимо улучшить свой немецкий. Бизнес-курс в центре был идеально адаптирован под мои профессиональные потребности.",
          image: "/images/testimonial-ru.png",
          location: "Санкт-Петербург, Россия",
        },
        {
          name: "Наталья Козлова",
          role: "Студентка",
          company: "МГУ",
          text: "Я готовилась к учебе в Берлинском университете и выбрала интенсивный курс немецкого. Преподаватели помогли мне не только с языком, но и с подготовкой к TestDaF, который я успешно сдала с первого раза.",
          image: "/images/testimonial-ru.png",
          location: "Москва, Россия",
        },
        {
          name: "Дмитрий Новиков",
          role: "Врач",
          company: "Городская клиническая больница",
          text: "Специализированный курс медицинского немецкого помог мне подготовиться к стажировке в клинике Германии. Особенно ценным было изучение профессиональной терминологии и практика общения с пациентами.",
          image: "/images/testimonial-ru.png",
          location: "Екатеринбург, Россия",
        },
        {
          name: "Анна Иванова",
          role: "Юрист",
          company: "Международная юридическая фирма",
          text: "Для работы с немецкими клиентами мне требовался юридический немецкий. Центр разработал для меня индивидуальную программу, которая включала изучение правовой терминологии и составление документов.",
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
        {
          name: "Jahongir Aliyev",
          role: "Biznesmen",
          company: "Aliyev Import-Export",
          text: "Nemis hamkorlar bilan biznesni kengaytirish uchun men nemis tilini o'rganishim kerak edi. Markazdagi biznes-nemis kursi menga nafaqat til, balki nemis biznes madaniyatini ham o'rgatdi.",
          image: "/images/testimonial-uz.png",
          location: "Buxoro, O'zbekiston",
        },
        {
          name: "Gulnora Karimova",
          role: "Shifokor",
          company: "Respublika Klinikasi",
          text: "Germaniyada malaka oshirish uchun men tibbiy nemis tilini o'rganishim kerak edi. Markazdagi maxsus kurs menga tibbiy atamalarni va bemorlar bilan muloqot qilishni o'rgatdi.",
          image: "/images/testimonial-uz.png",
          location: "Toshkent, O'zbekiston",
        },
        {
          name: "Rustam Umarov",
          role: "Muhandis",
          company: "O'zbekiston Temir Yo'llari",
          text: "Nemis kompaniyasi bilan hamkorlik loyihasida ishlaganim uchun texnik nemis tilini o'rganishim kerak edi. Markazdagi o'qituvchilar menga kerakli texnik terminologiyani tez o'zlashtirishga yordam berishdi.",
          image: "/images/testimonial-uz.png",
          location: "Toshkent, O'zbekiston",
        },
        {
          name: "Dilnoza Mahmudova",
          role: "Talaba",
          company: "O'zbekiston Milliy Universiteti",
          text: "TestDaF imtihoniga tayyorlanish uchun men markazga keldim. O'qituvchilarning professional yondashuvi va maxsus tayyorgarlik dasturi tufayli men yuqori ball bilan imtihonni topshirdim.",
          image: "/images/testimonial-uz.png",
          location: "Namangan, O'zbekiston",
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

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000) // Auto-scroll every 5 seconds

    return () => clearInterval(interval)
  }, [testimonialsCount])

  return (
    <section className="py-16 md:py-24 relative bg-background/82">
      {/* Background image with blur effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/language-specific-testimonials.tsx/photo-1517457373958-b7bdd4587205.png"
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
