"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { type LanguageContent, useLanguageContent } from "@/utils/language-content"
import { type SocialMediaPost, formatDate, useSocialMediaPosts } from "@/utils/social-media-utils"
import { Facebook, Instagram, Linkedin, MessageCircle, ThumbsUp, MessageSquare, Share2 } from "lucide-react"

const SocialMediaFeed = () => {
  const { t, language } = useLanguage()
  const [activePlatform, setActivePlatform] = useState<string>("all")

  // Language-specific section titles and descriptions
  const sectionContent: LanguageContent<{
    title: string
    description: string
  }> = {
    de: {
      title: "Folgen Sie uns in den sozialen Medien",
      description: "Bleiben Sie mit uns verbunden und erfahren Sie mehr über unsere Aktivitäten und Angebote",
    },
    en: {
      title: "Follow Us on Social Media",
      description: "Stay connected with us and learn more about our activities and offerings",
    },
    ru: {
      title: "Следите за нами в социальных сетях",
      description: "Оставайтесь на связи с нами и узнавайте больше о наших мероприятиях и предложениях",
    },
    uz: {
      title: "Ijtimoiy tarmoqlarda bizni kuzating",
      description: "Biz bilan bog'lanib turing va bizning faoliyatimiz va takliflarimiz haqida ko'proq bilib oling",
    },
  }

  // Language-specific social media posts
  const socialMediaPosts: LanguageContent<SocialMediaPost[]> = {
    de: [
      {
        id: "de-fb-1",
        platform: "facebook",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "Heute haben wir unseren neuen B1-Kurs gestartet! 15 motivierte Teilnehmer beginnen ihre Reise zur Sprachbeherrschung. Viel Erfolg an alle! #DeutschLernen #B1Kurs",
        image: "/images/gallery-1.png",
        likes: 45,
        comments: 8,
        shares: 3,
        date: "2023-09-15",
        url: "#",
      },
      {
        id: "de-ig-1",
        platform: "instagram",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "Unser Oktoberfest in Taschkent war ein voller Erfolg! Danke an alle, die dabei waren! 🍻 #Oktoberfest #DeutscheKultur #Taschkent",
        image: "/images/cultural-german-festival.png",
        likes: 132,
        comments: 24,
        date: "2023-10-05",
        url: "#",
      },
      {
        id: "de-tg-1",
        platform: "telegram",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "Neue Stipendienmöglichkeiten für usbekische Studenten in Deutschland! Informationsveranstaltung nächsten Donnerstag in unserem Zentrum. #Studium #Deutschland #Stipendium",
        likes: 28,
        comments: 5,
        shares: 12,
        date: "2023-11-02",
        url: "#",
      },
    ],
    en: [
      {
        id: "en-fb-1",
        platform: "facebook",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "We're excited to announce our new Business German course starting next month! Perfect for professionals looking to expand their career opportunities. #LearnGerman #BusinessGerman",
        image: "/images/course-english.png",
        likes: 38,
        comments: 7,
        shares: 5,
        date: "2023-09-20",
        url: "#",
      },
      {
        id: "en-ig-1",
        platform: "instagram",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "Our students enjoying the German Movie Night! 🎬 We watched 'Good Bye, Lenin!' with English subtitles. Join us next month for another classic! #GermanCinema #MovieNight",
        image: "/images/gallery-4.png",
        likes: 95,
        comments: 12,
        date: "2023-10-28",
        url: "#",
      },
      {
        id: "en-li-1",
        platform: "linkedin",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "We're proud to announce our partnership with the German Chamber of Commerce to provide specialized language training for businesses operating in Uzbekistan and Germany. #BusinessGerman #InternationalTrade",
        likes: 67,
        comments: 9,
        shares: 14,
        date: "2023-11-10",
        url: "#",
      },
    ],
    ru: [
      {
        id: "ru-fb-1",
        platform: "facebook",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "Открыт набор на интенсивный курс немецкого языка для начинающих! Старт 15 декабря. Успейте записаться! #НемецкийЯзык #ИзучениеЯзыков",
        image: "/images/course-russian.png",
        likes: 42,
        comments: 11,
        shares: 7,
        date: "2023-11-25",
        url: "#",
      },
      {
        id: "ru-ig-1",
        platform: "instagram",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "Наши студенты на экскурсии в Немецком культурном центре в Ташкенте. Погружение в культуру - важная часть изучения языка! 🇩🇪 #НемецкаяКультура #ИзучениеЯзыка",
        image: "/images/gallery-3.png",
        likes: 87,
        comments: 15,
        date: "2023-10-15",
        url: "#",
      },
      {
        id: "ru-tg-1",
        platform: "telegram",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "Поздравляем наших студентов, успешно сдавших экзамен TestDaF! 100% наших учеников прошли с первого раза! #TestDaF #НемецкийЯзык #Экзамены",
        likes: 34,
        comments: 6,
        shares: 8,
        date: "2023-11-18",
        url: "#",
      },
    ],
    uz: [
      {
        id: "uz-fb-1",
        platform: "facebook",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "Yangi o'quv yili boshlanishi munosabati bilan barcha kurslarimizga 15% chegirma! Shoshiling, aksiya 10-sentabrgacha amal qiladi! #NemisTili #TilO'rganish",
        image: "/images/course-uzbek.png",
        likes: 56,
        comments: 13,
        shares: 9,
        date: "2023-09-01",
        url: "#",
      },
      {
        id: "uz-ig-1",
        platform: "instagram",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "Bugun markazimizda Germaniya universitetlarida o'qish imkoniyatlari haqida seminar o'tkazildi. Ko'plab talabalar ishtirok etishdi! 🎓 #GermaniyaO'qish #TalabalarUchun",
        image: "/images/german-university.png",
        likes: 104,
        comments: 22,
        date: "2023-10-20",
        url: "#",
      },
      {
        id: "uz-li-1",
        platform: "linkedin",
        author: {
          name: "Profi Deutsch",
          handle: "ProfiDeutschUZ",
          avatar: "/PDico.png",
        },
        content:
          "O'zbekiston-Germaniya hamkorlik dasturi doirasida yangi grant dasturini e'lon qilamiz. Barcha tafsilotlar bilan markazimizga tashrif buyuring. #Grant #Germaniya #O'qish",
        likes: 48,
        comments: 7,
        shares: 15,
        date: "2023-11-05",
        url: "#",
      },
    ],
  }

  const currentSectionContent = useLanguageContent(sectionContent)
  const posts = useSocialMediaPosts(socialMediaPosts)

  // Filter posts by platform if needed
  const filteredPosts = activePlatform === "all" ? posts : posts.filter((post) => post.platform === activePlatform)

  // Function to render platform icon
  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "instagram":
        return <Instagram className="h-5 w-5" />
      case "telegram":
        return <MessageSquare className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <section className="py-16 md:py-24 bg-background/82">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{currentSectionContent.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{currentSectionContent.description}</p>
        </div>

        <Tabs defaultValue="all" value={activePlatform} onValueChange={setActivePlatform} className="w-full">
          <TabsList className="flex justify-center mb-8">
            <TabsTrigger value="all">{t("all_platforms")}</TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              <span>Facebook</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="telegram" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Telegram</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activePlatform} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={post.author.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-sm text-muted-foreground">{post.author.handle}</p>
                      </div>
                      <div className="ml-auto">{renderPlatformIcon(post.platform)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="mb-4">{post.content}</p>
                    {post.image && (
                      <div className="aspect-video w-full overflow-hidden rounded-md">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt=""
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" /> {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" /> {post.comments}
                        </span>
                        {post.shares !== undefined && (
                          <span className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" /> {post.shares}
                          </span>
                        )}
                      </div>
                      <span>{formatDate(post.date, language)}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            {t("view_more_posts")}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default SocialMediaFeed
