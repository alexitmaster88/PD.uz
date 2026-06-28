import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, CheckCircle, ArrowRight, Phone, Clock, MessageCircle, Award, Users } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase"
import { CONTACT } from "@/lib/contact"

export const dynamic = 'force-dynamic'

interface PageProps { params: Promise<{ lang: string }> }

type Lang = "en" | "de" | "ru" | "uz"

const T: Record<Lang, Record<string, string>> = {
  en: {
    navTelc: "TELC Exam",
    navHome: "Home",
    heroEyebrow: "Official TELC Exam Center in Uzbekistan",
    heroTitle: "German Language Exam",
    heroAccent: "TELC Certificate",
    heroSub: "Register for the internationally recognized TELC German language exam at Profi Deutsch — Uzbekistan's official TELC partner.",
    registerNow: "Register Now",
    viewSchedule: "View Schedule ↓",
    badge1: "Internationally recognized",
    badge2: "Accepted by European universities",
    badge3: "Required for German visa & residence",
    aboutTitle: "What is TELC?",
    aboutText: "TELC (The European Language Certificates) is a globally recognized language examination body. A TELC certificate is accepted by universities, employers, and immigration authorities across Europe and beyond.",
    howTitle: "How It Works",
    step1T: "Register Online", step1D: "Fill out the 3-step form with your details, choose an exam date and pay online.",
    step2T: "Get Confirmation", step2D: "Receive your registration confirmation by email with all details.",
    step3T: "Take the Exam", step3D: "Arrive 30 minutes early with your passport and printed confirmation.",
    levelsTitle: "Exam Levels & Prices",
    levelsDesc: "All prices include exam administration. Choose the level that matches your proficiency.",
    currency: "UZS",
    registerLevel: "Register for this level",
    scheduleTitle: "Upcoming Exam Dates",
    scheduleDesc: "Spots are strictly limited — book early.",
    noExams: "No upcoming exams scheduled. Check back soon.",
    colDate: "Date", colTime: "Time", colLevel: "Level", colLocation: "Location", colSpots: "Spots", colAction: "",
    spotsLeft: "left", full: "Full", register: "Register →",
    reqTitle: "What to Bring",
    req1: "Original passport or national ID card",
    req2: "Printed registration confirmation (PDF)",
    req3: "Payment receipt",
    req4: "Arrive 30 minutes before the exam",
    req5: "No electronic devices during the exam",
    contactTitle: "Questions? We're here to help.",
    telegram: "Message on Telegram",
    call: "Call Us",
    ctaTitle: "Ready to Get Certified?",
    ctaDesc: "Spots are limited. Secure your place for the next TELC exam today.",
    ctaBtn: "Start Registration →",
  },
  de: {
    navTelc: "TELC-Prüfung",
    navHome: "Startseite",
    heroEyebrow: "Offizielles TELC-Prüfungszentrum in Usbekistan",
    heroTitle: "Deutschprüfung",
    heroAccent: "TELC-Zertifikat",
    heroSub: "Melden Sie sich für die international anerkannte TELC-Deutschprüfung bei Profi Deutsch an — dem offiziellen TELC-Partner in Usbekistan.",
    registerNow: "Jetzt anmelden",
    viewSchedule: "Termine ansehen ↓",
    badge1: "International anerkannt",
    badge2: "Akzeptiert von europäischen Universitäten",
    badge3: "Erforderlich für deutsches Visum",
    aboutTitle: "Was ist TELC?",
    aboutText: "TELC (The European Language Certificates) ist ein international anerkanntes Sprachprüfungsinstitut. Ein TELC-Zertifikat wird von Universitäten, Arbeitgebern und Einwanderungsbehörden in ganz Europa akzeptiert.",
    howTitle: "So funktioniert es",
    step1T: "Online anmelden", step1D: "Füllen Sie das 3-stufige Formular aus, wählen Sie einen Termin und zahlen Sie online.",
    step2T: "Bestätigung erhalten", step2D: "Erhalten Sie Ihre Anmeldebestätigung per E-Mail mit allen Details.",
    step3T: "Prüfung ablegen", step3D: "Kommen Sie 30 Minuten früher mit Reisepass und Bestätigung.",
    levelsTitle: "Prüfungsstufen & Preise",
    levelsDesc: "Alle Preise beinhalten die Prüfungsverwaltung. Wählen Sie die passende Stufe.",
    currency: "UZS",
    registerLevel: "Für diese Stufe anmelden",
    scheduleTitle: "Kommende Prüfungstermine",
    scheduleDesc: "Plätze sind begrenzt — früh buchen.",
    noExams: "Keine bevorstehenden Prüfungen. Schauen Sie bald wieder vorbei.",
    colDate: "Datum", colTime: "Zeit", colLevel: "Stufe", colLocation: "Ort", colSpots: "Plätze", colAction: "",
    spotsLeft: "frei", full: "Voll", register: "Anmelden →",
    reqTitle: "Was mitbringen",
    req1: "Originalreisepass oder Personalausweis",
    req2: "Gedruckte Anmeldebestätigung (PDF)",
    req3: "Zahlungsbeleg",
    req4: "30 Minuten vor Prüfungsbeginn erscheinen",
    req5: "Keine elektronischen Geräte während der Prüfung",
    contactTitle: "Fragen? Wir helfen gerne.",
    telegram: "Auf Telegram schreiben",
    call: "Anrufen",
    ctaTitle: "Bereit für Ihr Zertifikat?",
    ctaDesc: "Plätze sind begrenzt. Sichern Sie sich noch heute Ihren Platz.",
    ctaBtn: "Anmeldung starten →",
  },
  ru: {
    navTelc: "Экзамен TELC",
    navHome: "Главная",
    heroEyebrow: "Официальный центр TELC в Узбекистане",
    heroTitle: "Экзамен по немецкому языку",
    heroAccent: "Сертификат TELC",
    heroSub: "Зарегистрируйтесь на международно признанный экзамен TELC по немецкому языку в Profi Deutsch — официальном партнёре TELC в Узбекистане.",
    registerNow: "Зарегистрироваться",
    viewSchedule: "Расписание ↓",
    badge1: "Международно признан",
    badge2: "Принимается европейскими университетами",
    badge3: "Требуется для немецкой визы",
    aboutTitle: "Что такое TELC?",
    aboutText: "TELC (The European Language Certificates) — это международно признанный орган по проведению языковых экзаменов. Сертификат TELC принимается университетами, работодателями и иммиграционными органами по всей Европе.",
    howTitle: "Как это работает",
    step1T: "Регистрация онлайн", step1D: "Заполните 3-шаговую форму, выберите дату экзамена и оплатите онлайн.",
    step2T: "Получите подтверждение", step2D: "Получите подтверждение регистрации по электронной почте со всеми деталями.",
    step3T: "Сдайте экзамен", step3D: "Придите за 30 минут до начала с паспортом и распечатанным подтверждением.",
    levelsTitle: "Уровни экзамена и цены",
    levelsDesc: "Все цены включают организацию экзамена. Выберите уровень, соответствующий вашим знаниям.",
    currency: "UZS",
    registerLevel: "Записаться на этот уровень",
    scheduleTitle: "Ближайшие даты экзаменов",
    scheduleDesc: "Мест строго ограничено — бронируйте заранее.",
    noExams: "Ближайшие экзамены не запланированы. Проверьте позже.",
    colDate: "Дата", colTime: "Время", colLevel: "Уровень", colLocation: "Место", colSpots: "Мест", colAction: "",
    spotsLeft: "осталось", full: "Занято", register: "Записаться →",
    reqTitle: "Что взять с собой",
    req1: "Оригинал паспорта или удостоверения личности",
    req2: "Распечатанное подтверждение регистрации (PDF)",
    req3: "Квитанция об оплате",
    req4: "Прийти за 30 минут до начала экзамена",
    req5: "Никаких электронных устройств во время экзамена",
    contactTitle: "Есть вопросы? Мы поможем.",
    telegram: "Написать в Telegram",
    call: "Позвонить",
    ctaTitle: "Готовы получить сертификат?",
    ctaDesc: "Мест мало. Забронируйте место на следующий экзамен TELC сегодня.",
    ctaBtn: "Начать регистрацию →",
  },
  uz: {
    navTelc: "TELC imtihoni",
    navHome: "Bosh sahifa",
    heroEyebrow: "Rasmiy TELC imtihon markazi O'zbekistonda",
    heroTitle: "Nemis tili imtihoni",
    heroAccent: "TELC sertifikati",
    heroSub: "Profi Deutsch — O'zbekistondagi rasmiy TELC hamkorida xalqaro tan olingan TELC nemis tili imtihoniga ro'yxatdan o'ting.",
    registerNow: "Ro'yxatdan o'tish",
    viewSchedule: "Jadvalga qarang ↓",
    badge1: "Xalqaro tan olingan",
    badge2: "Yevropa universitetlari qabul qiladi",
    badge3: "Nemis vizasi uchun zarur",
    aboutTitle: "TELC nima?",
    aboutText: "TELC (The European Language Certificates) — bu xalqaro tan olingan til imtihoni tashkiloti. TELC sertifikati butun Yevropa bo'ylab universitetlar, ish beruvchilar va immigratsiya idoralari tomonidan qabul qilinadi.",
    howTitle: "Qanday ishlaydi",
    step1T: "Onlayn ro'yxatdan o'ting", step1D: "Ma'lumotlaringizni 3 bosqichli forma orqali to'ldiring, sanani tanlang va onlayn to'lang.",
    step2T: "Tasdiqlash oling", step2D: "Barcha tafsilotlar bilan elektron pochta orqali ro'yxatdan o'tish tasdiqlashingizni oling.",
    step3T: "Imtihon topshing", step3D: "Pasport va chop etilgan tasdiqnoma bilan 30 daqiqa oldin keling.",
    levelsTitle: "Imtihon darajalari va narxlar",
    levelsDesc: "Barcha narxlar imtihon tashkilotini o'z ichiga oladi. Joriy bilim darajangizga mos darajani tanlang.",
    currency: "UZS",
    registerLevel: "Bu daraja uchun ro'yxatdan o'tish",
    scheduleTitle: "Yaqinlashayotgan imtihon sanalar",
    scheduleDesc: "Joylar qat'iy cheklangan — erta band qiling.",
    noExams: "Yaqin imtihonlar rejalashtirilmagan. Tez orada tekshiring.",
    colDate: "Sana", colTime: "Vaqt", colLevel: "Daraja", colLocation: "Joy", colSpots: "Joylar", colAction: "",
    spotsLeft: "qoldi", full: "To'liq", register: "Ro'yxatdan o'tish →",
    reqTitle: "Nima olib kelish kerak",
    req1: "Asl pasport yoki milliy shaxsiy guvohnoma",
    req2: "Chop etilgan ro'yxatdan o'tish tasdiqlash (PDF)",
    req3: "To'lov cheki",
    req4: "Imtihon boshlanishidan 30 daqiqa oldin keling",
    req5: "Imtihon vaqtida elektron qurilmalar taqiqlangan",
    contactTitle: "Savollar bormi? Yordam berishga tayyormiz.",
    telegram: "Telegram orqali yozish",
    call: "Qo'ng'iroq qilish",
    ctaTitle: "Sertifikat olishga tayyormisiz?",
    ctaDesc: "Joylar cheklangan. Bugun keyingi TELC imtihoni uchun o'rningizni band qiling.",
    ctaBtn: "Ro'yxatdan o'tishni boshlash →",
  },
}

const LEVEL_DESC: Record<string, Record<Lang, string>> = {
  B1: { en: "Everyday communication & basic professional use", de: "Alltägliche Kommunikation & einfache berufliche Situationen", ru: "Повседневное общение и простые профессиональные ситуации", uz: "Kundalik muloqot va oddiy kasbiy vaziyatlar" },
  B2: { en: "Upper intermediate · required for many university programmes", de: "Gehobene Mittelstufe · für viele Universitätszulassungen", ru: "Выше среднего · требуется для многих университетских программ", uz: "O'rta yuqori · ko'plab universitet dasturlari uchun" },
  C1: { en: "Advanced · required for professional work & top universities", de: "Fortgeschritten · für professionelle Arbeit & Spitzenuniversitäten", ru: "Продвинутый · для профессиональной работы", uz: "Ilg'or · kasbiy ish va eng yaxshi universitetlar uchun" },
}

const REGION_LABELS: Record<string, string> = {
  samarkand: "Samarqand", tashkent: "Toshkent", fergana: "Farg'ona",
  kashkadarya: "Qashqadaryo", bukhara: "Buxoro", urgench: "Urganch",
}

function levelDesc(level: string, lang: Lang): string {
  const key = Object.keys(LEVEL_DESC).find(k => level.includes(k))
  return key ? (LEVEL_DESC[key]?.[lang] ?? "") : ""
}

export default async function TelcBookingPage({ params }: PageProps) {
  const { lang } = await params
  const l = (["en","de","ru","uz"].includes(lang) ? lang : "en") as Lang
  const t = T[l]

  const { data: levels } = await supabaseAdmin.from("exam_levels").select("id, level, price").order("price")
  const { data: upcomingExams } = await supabaseAdmin
    .from("exams")
    .select("id, region, exam_date, start_time, end_time, capacity, level_id, exam_levels(level)")
    .eq("is_active", true)
    .gte("exam_date", new Date().toISOString())
    .order("exam_date")
    .limit(20)

  const rawExams = upcomingExams ?? []
  const safeLevels = levels ?? []

  // Compute live registered_count from approved registrations
  let safeExams: any[] = rawExams
  if (rawExams.length > 0) {
    const examIds = rawExams.map((e: any) => e.id)
    const { data: regs } = await supabaseAdmin
      .from("registrations")
      .select("exam_id")
      .in("exam_id", examIds)
      .in("status", ["pending", "verified", "paid", "completed"])
    const countMap: Record<number, number> = {}
    regs?.forEach((r: any) => { countMap[r.exam_id] = (countMap[r.exam_id] ?? 0) + 1 })
    safeExams = rawExams.map((e: any) => ({ ...e, registered_count: countMap[e.id] ?? 0 }))
  }

  const dateStr = (d: string) => new Date(d).toLocaleDateString(
    l === "ru" ? "ru-RU" : l === "de" ? "de-DE" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric" }
  )

  return (
    <div className="relative min-h-screen font-sans text-[#130080]">

      {/* Background — matches main site body::before + body::after */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/backgrounds/LongStatuePicture.png')", filter: "saturate(1.05) contrast(1.05)" }}
        aria-hidden
      />
      <div
        className="fixed inset-0 -z-10"
        style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(255,255,255,0.58)" }}
        aria-hidden
      />

      {/* Header — matches main site style */}
      <header className="sticky top-0 z-50 w-full border-b border-white/30 bg-white/15 backdrop-blur-2xl shadow-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={`/${l}`}>
            <Image src="/ICOProfideutsch2.png" alt="Profi Deutsch" width={160} height={44} className="h-auto" priority />
          </Link>
          <nav className="flex items-center gap-4">
            <Link href={`/${l}`} className="hidden sm:block text-sm font-medium text-[#130080] hover:text-[#130080]/70 transition-colors">
              {t.navHome}
            </Link>
            <span className="hidden sm:block text-sm font-semibold text-[#130080]">{t.navTelc}</span>
            <div className="flex items-center gap-1">
              {(["de","en","ru","uz"] as Lang[]).map(code => (
                <Link
                  key={code}
                  href={`/telc/${code}/booking`}
                  className={`rounded px-2 py-0.5 text-xs font-bold transition-colors ${code === l ? "bg-[#130080] text-white" : "text-[#130080]/55 hover:text-[#130080]"}`}
                >
                  {code.toUpperCase()}
                </Link>
              ))}
            </div>
            <Link
              href={`/telc/${l}/register`}
              className="rounded-lg bg-[#130080] px-4 py-2 text-sm font-bold text-white hover:bg-[#130080]/90 transition-colors"
            >
              {t.registerNow}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#130080]/20 bg-white/60 px-4 py-1.5 text-xs font-medium text-[#130080]/80 backdrop-blur-sm shadow-sm">
            <Award size={13} /> {t.heroEyebrow}
          </div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-[#130080] drop-shadow-sm sm:text-6xl">
            {t.heroTitle}
          </h1>
          <h2 className="mb-5 text-3xl font-extrabold text-[#130080] sm:text-5xl" style={{ textShadow: "0 0 1em rgba(255,255,255,0.9), 0 0 0.3em rgba(255,255,255,1)" }}>
            {t.heroAccent}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-[#130080]/75">
            {t.heroSub}
          </p>
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/telc/${l}/register`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#130080] px-8 py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-[#130080]/90"
            >
              {t.registerNow} <ArrowRight size={18} />
            </Link>
            <a
              href="#schedule"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#130080]/30 bg-white/50 px-8 py-3.5 text-base font-semibold text-[#130080] backdrop-blur-sm transition-colors hover:bg-white/70"
            >
              {t.viewSchedule}
            </a>
          </div>
        </div>
      </section>

      {/* Exam Levels & Prices */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-[#130080]">{t.levelsTitle}</h2>
            <p className="text-[#130080]/65">{t.levelsDesc}</p>
          </div>
          {safeLevels.length === 0 ? (
            <p className="text-center text-[#130080]/50">{t.noExams}</p>
          ) : (
            /* flex + justify-center: any partial last row is always centered */
            <div className="flex flex-wrap justify-center gap-4">
              {safeLevels.map((lv: any) => {
                const n = safeLevels.length
                const levelCode = (lv.level as string)?.match(/[A-C][12](?:[/-][A-C][12])?/)?.[0] ?? lv.level
                const fullName = lv.level
                // Width per card: shrinks gracefully, last row centers via justify-center
                const widthClass =
                  n === 1 ? "w-full max-w-[220px]" :
                  n === 2 ? "w-[calc(50%-8px)] max-w-[260px]" :
                  n === 4 ? "w-[calc(50%-8px)] sm:w-[calc(25%-12px)]" :
                            "w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)]"
                return (
                  <div key={lv.id} className={`${widthClass} group flex flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}>
                    {/* Accent bar */}
                    <div className="h-[3px] w-full bg-[#130080]" />
                    <div className="flex flex-1 flex-col p-4">
                      {/* Level badge — inline style forces white regardless of parent color cascade */}
                      <div className="mb-3">
                        <span
                          className="inline-flex items-center rounded-md bg-[#130080] px-3 py-1 text-base font-black tracking-widest leading-tight"
                          style={{ color: '#ffffff' }}
                        >
                          {levelCode}
                        </span>
                        {levelCode !== fullName && fullName && (
                          <p className="mt-1 text-[10px] font-medium leading-tight" style={{ color: 'rgba(19,0,128,0.4)' }}>{fullName}</p>
                        )}
                      </div>
                      {/* Description — flex-1 equalises card heights within each row */}
                      <p className="mb-4 flex-1 text-[11px] leading-relaxed" style={{ color: 'rgba(19,0,128,0.55)' }}>
                        {levelDesc(lv.level, l)}
                      </p>
                      {/* Price */}
                      <div className="mb-3 border-t pt-3" style={{ borderColor: 'rgba(19,0,128,0.08)' }}>
                        <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(19,0,128,0.35)' }}>{t.currency}</p>
                        <p className="text-2xl font-extrabold leading-none" style={{ color: '#130080' }}>
                          {Number(lv.price).toLocaleString()}
                        </p>
                      </div>
                      {/* Full-width CTA */}
                      <Link
                        href={`/telc/${l}/register`}
                        className="block w-full rounded-xl py-2 text-center text-xs font-bold transition-colors hover:opacity-90"
                        style={{ backgroundColor: '#130080', color: '#ffffff' }}
                      >
                        {t.registerLevel} →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-[#130080]">{t.scheduleTitle}</h2>
            <p className="text-[#130080]/65">{t.scheduleDesc}</p>
          </div>
          {safeExams.length === 0 ? (
            <div className="rounded-2xl border border-white/40 bg-white/50 p-10 text-center text-[#130080]/50 backdrop-blur-md">
              {t.noExams}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-sm backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#130080]/10 bg-[#130080]/5">
                      {[t.colLevel, t.colDate, t.colTime, t.colLocation, t.colSpots, t.colAction].map((h, i) => (
                        <th key={i} className="px-5 py-3.5 text-left text-xs font-semibold tracking-wide text-[#130080]/70">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#130080]/8">
                    {safeExams.map((ex: any) => {
                      const spots = ex.capacity - ex.registered_count
                      const isFull = spots <= 0
                      const isAlmostFull = spots <= 5 && spots > 0
                      return (
                        <tr key={ex.id} className="transition-colors hover:bg-[#130080]/5">
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center rounded-lg bg-[#130080]/10 px-2.5 py-1 text-xs font-bold text-[#130080]">
                              {(ex.exam_levels as any)?.level ?? `#${ex.level_id}`}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 text-[#130080]">
                              <Calendar size={13} className="shrink-0 text-[#130080]/40" />
                              <span className="font-medium">{dateStr(ex.exam_date)}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 text-[#130080]/70">
                              <Clock size={13} className="shrink-0 text-[#130080]/40" />
                              {ex.start_time} – {ex.end_time}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 text-[#130080]/70">
                              <MapPin size={13} className="shrink-0 text-[#130080]/40" />
                              {REGION_LABELS[ex.region] ?? ex.region}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            {isFull ? (
                              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">{t.full}</span>
                            ) : (
                              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isAlmostFull ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                                {spots} {t.spotsLeft}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            {!isFull && (
                              <Link
                                href={`/telc/${l}/register`}
                                className="inline-flex items-center gap-1 rounded-lg bg-[#130080] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#130080]/85"
                              >
                                {t.register}
                              </Link>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Requirements */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-7 text-center text-3xl font-bold text-[#130080]">{t.reqTitle}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[t.req1, t.req2, t.req3, t.req4, t.req5].map(r => (
              <div key={r} className="flex w-full items-start gap-3 rounded-xl border border-white/40 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-md sm:w-[calc(50%-6px)]">
                <CheckCircle size={17} className="mt-0.5 shrink-0" style={{ color: '#130080' }} />
                <span className="text-sm" style={{ color: 'rgba(19,0,128,0.8)' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#130080]">{t.howTitle}</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {([
              { icon: <Users size={26} />, title: t.step1T, desc: t.step1D },
              { icon: <CheckCircle size={26} />, title: t.step2T, desc: t.step2D },
              { icon: <Award size={26} />, title: t.step3T, desc: t.step3D },
            ] as const).map(({ icon, title, desc }, i) => (
              <div key={title} className="rounded-2xl border border-white/40 bg-white/60 p-6 text-center shadow-sm backdrop-blur-md">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-[#130080]/15 bg-[#130080]/10 text-[#130080]">
                  {icon}
                </div>
                <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#130080] text-xs font-bold text-white">{i + 1}</div>
                <h3 className="mb-1.5 font-bold text-[#130080]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#130080]/65">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-2xl font-bold text-[#130080]">{t.contactTitle}</h2>
          <p className="mb-7 text-sm text-[#130080]/55">{CONTACT.samarkand.address.replace("\n", " · ")}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={CONTACT.telegramChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2AABEE] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#1a9de0]"
            >
              <MessageCircle size={17} /> {t.telegram}
            </a>
            <a
              href={`tel:${CONTACT.phone1.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#130080]/25 bg-white/60 px-6 py-3 text-sm font-semibold text-[#130080] backdrop-blur-sm transition-colors hover:bg-white/80"
            >
              <Phone size={17} /> {CONTACT.phone1}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#130080]/10 bg-white/40 px-4 py-7 text-center text-xs text-[#130080]/50 backdrop-blur-sm">
        <p className="mb-1 font-semibold text-[#130080]/70">Profi Deutsch — TELC Exam Center</p>
        <p>{CONTACT.email} · {CONTACT.phone1}</p>
      </footer>
    </div>
  )
}
