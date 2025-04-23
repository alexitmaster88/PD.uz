"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { type LanguageContent, useLanguageContent } from "@/utils/language-content"
import { type Review, formatDate, useReviews } from "@/utils/social-media-utils"
import { Star, ThumbsUp, MessageSquare, Facebook } from "lucide-react"

const LanguageSpecificReviews = () => {
  const { t, language } = useLanguage()
  const [showAll, setShowAll] = useState(false)

  // Language-specific section titles and descriptions
  const sectionContent: LanguageContent<{
    title: string
    description: string
  }> = {
    de: {
      title: "Was unsere Studenten über uns sagen",
      description: "Erfahren Sie, was unsere Studenten über ihre Erfahrungen in unserem Sprachzentrum berichten",
    },
    en: {
      title: "What Our Students Say About Us",
      description: "Find out what our students have to say about their experiences at our language center",
    },
    ru: {
      title: "Что наши студенты говорят о нас",
      description: "Узнайте, что наши студенты рассказывают о своем опыте в нашем языковом центре",
    },
    uz: {
      title: "Talabalarimiz biz haqimizda nima deyishadi",
      description: "Talabalarimizning til markazimizda olgan tajribalari haqida fikrlarini bilib oling",
    },
  }

  // Language-specific reviews
  const reviewsData: LanguageContent<Review[]> = {
    de: [
      {
        id: "de-rev-1",
        platform: "google",
        author: {
          name: "Thomas Müller",
          avatar: "/images/testimonial-de.png",
          location: "Berlin, Deutschland",
        },
        rating: 5,
        content:
          "Ich habe während meines Aufenthalts in Usbekistan einen Usbekisch-Kurs besucht und war begeistert von der Qualität des Unterrichts. Die Lehrer sind sehr kompetent und geduldig. Das Zentrum bietet auch viele kulturelle Aktivitäten an, die das Lernen interessanter machen.",
        date: "2023-08-15",
        language: "de",
        helpful: 12,
        response: {
          author: "Deutsches Sprachzentrum Team",
          content:
            "Vielen Dank für Ihre positive Bewertung, Thomas! Wir freuen uns, dass Sie Ihre Zeit bei uns genossen haben.",
          date: "2023-08-17",
        },
      },
      {
        id: "de-rev-2",
        platform: "facebook",
        author: {
          name: "Anna Schmidt",
          avatar: "/images/testimonial-de.png",
          location: "München, Deutschland",
        },
        rating: 5,
        content:
          "Hervorragende Erfahrung! Ich habe den B1-Kurs für Usbekisch belegt und konnte nach nur 3 Monaten fließend sprechen. Die Methodik ist sehr effektiv und die Atmosphäre im Zentrum ist sehr freundlich und einladend.",
        date: "2023-09-22",
        language: "de",
        helpful: 8,
      },
      {
        id: "de-rev-3",
        platform: "trustpilot",
        author: {
          name: "Michael Weber",
          location: "Hamburg, Deutschland",
        },
        rating: 4,
        content:
          "Guter Unterricht und freundliches Personal. Die Lage des Zentrums ist sehr praktisch und die Preise sind angemessen. Ein Stern Abzug nur, weil die Gruppen manchmal etwas zu groß sind.",
        date: "2023-10-05",
        language: "de",
        helpful: 5,
      },
      {
        id: "de-rev-4",
        platform: "google",
        author: {
          name: "Lisa Bauer",
          avatar: "/images/testimonial-de.png",
          location: "Frankfurt, Deutschland",
        },
        rating: 5,
        content:
          "Das Deutschzentrum in Taschkent ist ein Ort, an dem man nicht nur eine Sprache lernt, sondern auch eine Kultur entdeckt. Die Lehrer sind sehr engagiert und die Kurse sind gut strukturiert. Sehr zu empfehlen!",
        date: "2023-11-10",
        language: "de",
        helpful: 15,
      },
    ],
    en: [
      {
        id: "en-rev-1",
        platform: "google",
        author: {
          name: "John Smith",
          avatar: "/images/testimonial-en.png",
          location: "London, UK",
        },
        rating: 5,
        content:
          "I took the intensive German course before moving to Berlin for work, and it was exactly what I needed. The teachers are native speakers and very professional. The small class size allowed for plenty of speaking practice. Highly recommended!",
        date: "2023-07-20",
        language: "en",
        helpful: 18,
        response: {
          author: "German Language Center Team",
          content: "Thank you for your kind words, John! We're glad we could help prepare you for your move to Berlin.",
          date: "2023-07-22",
        },
      },
      {
        id: "en-rev-2",
        platform: "facebook",
        author: {
          name: "Sarah Johnson",
          avatar: "/images/testimonial-en.png",
          location: "New York, USA",
        },
        rating: 4,
        content:
          "Great experience overall! The Business German course helped me tremendously in my career. The only reason for 4 stars instead of 5 is that I wish there were more business-specific vocabulary exercises.",
        date: "2023-08-30",
        language: "en",
        helpful: 7,
      },
      {
        id: "en-rev-3",
        platform: "trustpilot",
        author: {
          name: "David Wilson",
          location: "Sydney, Australia",
        },
        rating: 5,
        content:
          "Even though I was taking the course remotely from Australia, the online classes were very engaging and interactive. The teachers are excellent at creating a virtual immersive environment. I've made great progress in just a few months.",
        date: "2023-09-15",
        language: "en",
        helpful: 9,
      },
      {
        id: "en-rev-4",
        platform: "google",
        author: {
          name: "Emily Brown",
          avatar: "/images/testimonial-en.png",
          location: "Toronto, Canada",
        },
        rating: 5,
        content:
          "The German Language Center in Tashkent exceeded my expectations. As an expat living in Uzbekistan, finding quality German lessons was important to me. The center not only provides excellent language instruction but also creates a wonderful community of language enthusiasts.",
        date: "2023-10-28",
        language: "en",
        helpful: 14,
      },
    ],
    ru: [
      {
        id: "ru-rev-1",
        platform: "google",
        author: {
          name: "Алексей Иванов",
          avatar: "/images/testimonial-ru.png",
          location: "Москва, Россия",
        },
        rating: 5,
        content:
          "Отличный языковой центр! Я прошел курс немецкого языка уровня B1, и результаты превзошли мои ожидания. Преподаватели - настоящие профессионалы, которые умеют объяснить сложные грамматические конструкции простым и понятным языком.",
        date: "2023-08-05",
        language: "ru",
        helpful: 21,
        response: {
          author: "Команда Немецкого языкового центра",
          content: "Спасибо за ваш отзыв, Алексей! Мы рады, что вы довольны нашими курсами.",
          date: "2023-08-07",
        },
      },
      {
        id: "ru-rev-2",
        platform: "facebook",
        author: {
          name: "Елена Смирнова",
          avatar: "/images/testimonial-ru.png",
          location: "Санкт-Петербург, Россия",
        },
        rating: 5,
        content:
          "Я выбрала этот центр для подготовки к экзамену TestDaF, и не пожалела! Благодаря структурированному подходу и индивидуальному вниманию преподавателей, я успешно сдала экзамен с первого раза. Очень рекомендую!",
        date: "2023-09-10",
        language: "ru",
        helpful: 15,
      },
      {
        id: "ru-rev-3",
        platform: "trustpilot",
        author: {
          name: "Дмитрий Козлов",
          location: "Ташкент, Узбекистан",
        },
        rating: 4,
        content:
          "Хороший центр с профессиональными преподавателями. Удобное расположение и гибкий график занятий. Единственный минус - иногда не хватает разговорной практики, но в целом я доволен результатами.",
        date: "2023-10-18",
        language: "ru",
        helpful: 8,
      },
      {
        id: "ru-rev-4",
        platform: "google",
        author: {
          name: "Мария Петрова",
          avatar: "/images/testimonial-ru.png",
          location: "Екатеринбург, Россия",
        },
        rating: 5,
        content:
          "Прохожу курс немецкого языка онлайн, и очень довольна качеством обучения. Несмотря на дистанционный формат, преподаватели умеют создать атмосферу погружения в язык. Особенно нравятся культурные мероприятия, которые проводит центр.",
        date: "2023-11-05",
        language: "ru",
        helpful: 12,
      },
    ],
    uz: [
      {
        id: "uz-rev-1",
        platform: "google",
        author: {
          name: "Aziz Karimov",
          avatar: "/images/testimonial-uz.png",
          location: "Toshkent, O'zbekiston",
        },
        rating: 5,
        content:
          "Men bu markazda nemis tilini o'rganishni boshladim va natijalardan juda mamnunman. O'qituvchilar juda bilimli va sabrli. Ular grammatikani tushuntirishda juda yaxshi. Men B2 darajasiga yetishni maqsad qilganman va bunga ishonchim komil.",
        date: "2023-07-25",
        language: "uz",
        helpful: 19,
        response: {
          author: "Nemis tili markazi jamoasi",
          content: "Rahmat, Aziz! Sizning muvaffaqiyatingizdan xursandmiz. Maqsadingizga erishishda omad tilaymiz!",
          date: "2023-07-27",
        },
      },
      {
        id: "uz-rev-2",
        platform: "facebook",
        author: {
          name: "Nilufar Rahimova",
          avatar: "/images/testimonial-uz.png",
          location: "Samarqand, O'zbekiston",
        },
        rating: 5,
        content:
          "Men Germaniyada o'qish uchun nemis tilini o'rganishim kerak edi. Bu markazda o'qib, TestDaF imtihonini muvaffaqiyatli topshirdim va stipendiya oldim. O'qituvchilarning professional yondashuvi va qo'llab-quvvatlashi uchun minnatdorman!",
        date: "2023-08-18",
        language: "uz",
        helpful: 14,
      },
      {
        id: "uz-rev-3",
        platform: "trustpilot",
        author: {
          name: "Jahongir Aliyev",
          location: "Buxoro, O'zbekiston",
        },
        rating: 4,
        content:
          "Yaxshi markaz, professional o'qituvchilar. Darslar qiziqarli va samarali o'tadi. To'rt yulduz berishimning sababi - ba'zan guruhlar biroz katta bo'ladi, lekin umuman olganda men natijalardan mamnunman.",
        date: "2023-09-30",
        language: "uz",
        helpful: 7,
      },
      {
        id: "uz-rev-4",
        platform: "google",
        author: {
          name: "Gulnora Karimova",
          avatar: "/images/testimonial-uz.png",
          location: "Toshkent, O'zbekiston",
        },
        rating: 5,
        content:
          "Men online formatda nemis tilini o'rganyapman va o'qitish sifatidan juda mamnunman. O'qituvchilar masofaviy ta'lim sharoitida ham til muhitini yaratishga muvaffaq bo'lishadi. Ayniqsa, markaz tomonidan o'tkaziladigan madaniy tadbirlar juda foydali.",
        date: "2023-10-22",
        language: "uz",
        helpful: 11,
      },
    ],
  }

  const currentSectionContent = useLanguageContent(sectionContent)
  const reviews = useReviews(reviewsData)

  // Show only first 3 reviews unless showAll is true
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ))
  }

  // Function to render platform badge
  const renderPlatformBadge = (platform: string) => {
    let bgColor = ""
    const textColor = "text-white"

    switch (platform) {
      case "google":
        bgColor = "bg-blue-500"
        break
      case "facebook":
        bgColor = "bg-[#1877F2]"
        break
      case "trustpilot":
        bgColor = "bg-[#00B67A]"
        break
      case "yelp":
        bgColor = "bg-[#FF1A1A]"
        break
      default:
        bgColor = "bg-gray-500"
    }

    return (
      <span className={`${bgColor} ${textColor} text-xs px-2 py-1 rounded-full uppercase font-medium`}>{platform}</span>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-secondary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{currentSectionContent.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{currentSectionContent.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {displayedReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {review.author.avatar ? (
                      <img
                        src={review.author.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={review.author.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">{review.author.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{review.author.name}</p>
                      {review.author.location && (
                        <p className="text-sm text-muted-foreground">{review.author.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex">{renderStars(review.rating)}</div>
                    {renderPlatformBadge(review.platform)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="mb-4">{review.content}</p>
                {review.response && (
                  <div className="mt-4 bg-secondary/30 p-4 rounded-md">
                    <p className="font-medium text-sm">{review.response.author}</p>
                    <p className="mt-1 text-sm">{review.response.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDate(review.response.date, language)}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" /> {review.helpful} {t("found_helpful")}
                    </span>
                    <Button variant="ghost" size="sm" className="text-sm h-8 px-2">
                      <ThumbsUp className="h-3 w-3 mr-1" /> {t("helpful")}
                    </Button>
                  </div>
                  <span>{formatDate(review.date, language)}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {reviews.length > 3 && (
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" onClick={() => setShowAll(!showAll)}>
              {showAll ? t("show_less") : t("show_more_reviews")}
            </Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">{t("leave_review")}</h3>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Star className="h-4 w-4" /> Google
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" /> Facebook
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> {t("write_review")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LanguageSpecificReviews
