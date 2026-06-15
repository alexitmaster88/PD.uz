"use client"

import { useState, useEffect } from "react"
import { Loader2, Mail, CheckCircle, X, ChevronDown, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface FormData {
  firstName: string; lastName: string; phoneNumber: string
  email: string; passportNumber: string; agreeTerms: boolean
  emailVerified: boolean; examId: number | null
  dateOfBirth: string; gender: string; nationality: string
  countryOfBirth: string; cityOfBirth: string; currentAddress: string
  documentType: string; examType: string
}

interface Props {
  data: FormData
  lang: string
  onDataChange: (data: Partial<FormData>) => void
  onRegistrationComplete: (regId: number) => void
  onPrevious: () => void
}

const REQUIRED_SECONDS = 10

const COUNTRIES: { value: string; label: Record<string, string> }[] = [
  { value: "Uzbekistan",    label: { uz: "O'zbekiston",   en: "Uzbekistan",    de: "Usbekistan",    ru: "Узбекистан"    } },
  { value: "Kazakhstan",    label: { uz: "Qozog'iston",   en: "Kazakhstan",    de: "Kasachstan",    ru: "Казахстан"     } },
  { value: "Kyrgyzstan",    label: { uz: "Qirg'iziston",  en: "Kyrgyzstan",    de: "Kirgisistan",   ru: "Кыргызстан"    } },
  { value: "Tajikistan",    label: { uz: "Tojikiston",    en: "Tajikistan",    de: "Tadschikistan", ru: "Таджикистан"   } },
  { value: "Turkmenistan",  label: { uz: "Turkmaniston",  en: "Turkmenistan",  de: "Turkmenistan",  ru: "Туркменистан"  } },
  { value: "Afghanistan",   label: { uz: "Afg'oniston",   en: "Afghanistan",   de: "Afghanistan",   ru: "Афганистан"    } },
  { value: "Russia",        label: { uz: "Rossiya",       en: "Russia",        de: "Russland",      ru: "Россия"        } },
  { value: "Other",         label: { uz: "Boshqa",        en: "Other",         de: "Andere",        ru: "Другое"        } },
]

const labels: Record<string, Record<string, string>> = {
  en: {
    title: "Personal Information",
    lastName: "Last Name", firstName: "First Name",
    email: "Email", sendOtp: "Verify", verified: "Verified",
    phone: "Phone Number", dob: "Date of Birth",
    gender: "Gender", male: "Male", female: "Female",
    nationality: "Nationality",
    countryOfBirth: "Country of Birth", selectCountry: "Select country", cityOfBirth: "City of Birth",
    currentAddress: "Current Address",
    addressHint: "Province, district, street, house number",
    documentType: "Document Type", idCard: "ID Card", passport: "Passport",
    docNumber: "Document Number",
    terms: "I have read and agree to the", termsLink: "Terms and Conditions",
    sendOtpBtn: "Send OTP",
    enterOtp: "Enter 6-digit OTP sent to your email",
    verifyOtp: "Verify", resend: "Resend OTP", resendIn: "Resend in",
    otpExpiry: "Code valid for 5 minutes",
    nameHint: "As in document, Latin letters only",
    phoneHint: "Format: +998 XX XXX-XX-XX",
    next: "Next step", previous: "← Back",
    submitting: "Creating registration...",
    errFirst: "First name required", errLast: "Last name required",
    errPhone: "Phone number required", errEmail: "Valid email required",
    errPassport: "Document number required",
    errPassportFormat: "Format: 2 letters + 7 digits (e.g. AB1234567)",
    errTerms: "You must agree to the terms",
    errOtp: "Invalid OTP code", otpSent: "OTP sent to your email",
    otpFail: "Failed to send OTP", otpSuccess: "Email verified!",
    errEmailDenied: "This email has been blocked. Please contact us.",
    errDob: "Date of birth required", errGender: "Select gender",
    errNationality: "Nationality required", errCountry: "Country required",
    errCity: "City required", errAddress: "Address required",
    termsTitle: "Terms and Conditions",
    readingTimer: "Please read the document. Available in",
    acceptTerms: "I have read and agree to the terms and conditions",
    btnAccept: "Accept & Continue",
    openInNewTab: "Open full document in new tab",
  },
  de: {
    title: "Persönliche Daten",
    lastName: "Nachname", firstName: "Vorname",
    email: "E-Mail", sendOtp: "Prüfen", verified: "Verifiziert",
    phone: "Telefonnummer", dob: "Geburtsdatum",
    gender: "Geschlecht", male: "Männlich", female: "Weiblich",
    nationality: "Nationalität",
    countryOfBirth: "Geburtsland", selectCountry: "Land auswählen", cityOfBirth: "Geburtsort",
    currentAddress: "Aktuelle Adresse",
    addressHint: "Provinz, Bezirk, Straße, Hausnummer",
    documentType: "Dokumenttyp", idCard: "Personalausweis", passport: "Reisepass",
    docNumber: "Dokumentnummer",
    terms: "Ich habe gelesen und stimme zu", termsLink: "AGB",
    sendOtpBtn: "OTP senden",
    enterOtp: "6-stelligen OTP-Code eingeben",
    verifyOtp: "Prüfen", resend: "OTP erneut senden", resendIn: "Erneut in",
    otpExpiry: "Code gilt 5 Minuten",
    nameHint: "Wie im Dokument, nur lateinische Buchstaben",
    phoneHint: "Format: +998 XX XXX-XX-XX",
    next: "Nächster Schritt", previous: "← Zurück",
    submitting: "Anmeldung wird erstellt...",
    errFirst: "Vorname erforderlich", errLast: "Nachname erforderlich",
    errPhone: "Telefonnummer erforderlich", errEmail: "Gültige E-Mail erforderlich",
    errPassport: "Dokumentnummer erforderlich",
    errPassportFormat: "Format: 2 Buchstaben + 7 Ziffern (z. B. AB1234567)",
    errTerms: "Bitte stimmen Sie zu",
    errOtp: "Ungültiger OTP-Code", otpSent: "OTP gesendet",
    otpFail: "OTP-Versand fehlgeschlagen", otpSuccess: "E-Mail verifiziert!",
    errEmailDenied: "Diese E-Mail wurde gesperrt.",
    errDob: "Geburtsdatum erforderlich", errGender: "Geschlecht wählen",
    errNationality: "Nationalität erforderlich", errCountry: "Land erforderlich",
    errCity: "Stadt erforderlich", errAddress: "Adresse erforderlich",
    termsTitle: "Allgemeine Geschäftsbedingungen",
    readingTimer: "Bitte lesen Sie das Dokument. Verfügbar in",
    acceptTerms: "Ich habe die AGB gelesen und stimme zu",
    btnAccept: "Akzeptieren & Weiter",
    openInNewTab: "Vollständiges Dokument in neuem Tab öffnen",
  },
  ru: {
    title: "Личные данные",
    lastName: "Фамилия", firstName: "Имя",
    email: "Email", sendOtp: "Подтвердить", verified: "Подтверждено",
    phone: "Телефон", dob: "Дата рождения",
    gender: "Пол", male: "Мужской", female: "Женский",
    nationality: "Национальность",
    countryOfBirth: "Страна рождения", selectCountry: "Выберите страну", cityOfBirth: "Город рождения",
    currentAddress: "Текущий адрес",
    addressHint: "Область, район, улица, номер дома",
    documentType: "Тип документа", idCard: "Удостоверение", passport: "Паспорт",
    docNumber: "Номер документа",
    terms: "Я прочитал(а) и согласен(на) с", termsLink: "условиями",
    sendOtpBtn: "Отправить OTP",
    enterOtp: "Введите 6-значный код из письма",
    verifyOtp: "Подтвердить", resend: "Отправить повторно", resendIn: "Повторно через",
    otpExpiry: "Код действителен 5 минут",
    nameHint: "Как в документе, только латинские буквы",
    phoneHint: "Формат: +998 XX XXX-XX-XX",
    next: "Следующий шаг", previous: "← Назад",
    submitting: "Создание записи...",
    errFirst: "Введите имя", errLast: "Введите фамилию",
    errPhone: "Введите телефон", errEmail: "Введите корректный email",
    errPassport: "Введите номер документа",
    errPassportFormat: "Формат: 2 буквы + 7 цифр (напр. AB1234567)",
    errTerms: "Необходимо согласие",
    errOtp: "Неверный OTP", otpSent: "OTP отправлен на email",
    otpFail: "Ошибка отправки OTP", otpSuccess: "Email подтверждён!",
    errEmailDenied: "Этот email заблокирован.",
    errDob: "Укажите дату рождения", errGender: "Выберите пол",
    errNationality: "Укажите национальность", errCountry: "Укажите страну",
    errCity: "Укажите город", errAddress: "Укажите адрес",
    termsTitle: "Условия и положения",
    readingTimer: "Пожалуйста, прочитайте документ. Доступно через",
    acceptTerms: "Я прочитал(а) и согласен(на) с условиями",
    btnAccept: "Принять и продолжить",
    openInNewTab: "Открыть полный документ в новой вкладке",
  },
  uz: {
    title: "Shaxsiy ma'lumotlar",
    lastName: "Familiya", firstName: "Ism",
    email: "Email", sendOtp: "Tasdiqlash", verified: "Tasdiqlandi",
    phone: "Telefon raqami", dob: "Tug'ilgan sana",
    gender: "Jins", male: "Erkak", female: "Ayol",
    nationality: "Millat",
    countryOfBirth: "Tug'ilgan davlat", selectCountry: "Davlatni tanlang", cityOfBirth: "Tug'ilgan shahar",
    currentAddress: "Hozirgi yashash manzili",
    addressHint: "Viloyat, tuman, ko'cha, uy raqami",
    documentType: "Hujjat turi", idCard: "ID karta", passport: "Pasport",
    docNumber: "Hujjat raqami",
    terms: "Men bilan tanishdim va roziman", termsLink: "Oferta shartlari",
    sendOtpBtn: "OTP yuborish",
    enterOtp: "Emailingizga yuborilgan 6 xonali kodni kiriting",
    verifyOtp: "Tasdiqlash", resend: "Qayta yuborish", resendIn: "Qayta yuborish",
    otpExpiry: "Kod 5 daqiqa amal qiladi",
    nameHint: "Hujjatdagidek, faqat lotin harflar",
    phoneHint: "Format: +998 XX XXX-XX-XX",
    next: "Keyingi qadam", previous: "← Orqaga",
    submitting: "Ro'yxat yaratilmoqda...",
    errFirst: "Ism kiritish shart", errLast: "Familiya kiritish shart",
    errPhone: "Telefon kiritish shart", errEmail: "To'g'ri email kiriting",
    errPassport: "Hujjat raqami kiritish shart",
    errPassportFormat: "Format: 2 harf + 7 raqam (mas. AB1234567)",
    errTerms: "Shartlarga rozi bo'ling",
    errOtp: "Noto'g'ri OTP kodi", otpSent: "OTP emailingizga yuborildi",
    otpFail: "OTP yuborishda xato", otpSuccess: "Email tasdiqlandi!",
    errEmailDenied: "Bu email bloklangan.",
    errDob: "Tug'ilgan sanani kiriting", errGender: "Jins tanlang",
    errNationality: "Millat kiritish shart", errCountry: "Davlat kiritish shart",
    errCity: "Shahar kiritish shart", errAddress: "Manzil kiritish shart",
    termsTitle: "Foydalanish shartlari",
    readingTimer: "Iltimos, hujjatni o'qing. Tayyor bo'ladi:",
    acceptTerms: "Men shartlarni o'qidim va roziman",
    btnAccept: "Qabul qilish va davom etish",
    openInNewTab: "To'liq hujjatni yangi yorliqda ochish",
  },
}

export default function StepPersonalInfo({ data, lang, onDataChange, onRegistrationComplete, onPrevious }: Props) {
  const l = labels[lang] ?? labels.en
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [otpVisible, setOtpVisible] = useState(false)
  const [otp, setOtp] = useState("")
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [otpCooldown, setOtpCooldown] = useState(0)
  const [termsOpen, setTermsOpen] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [modalChecked, setModalChecked] = useState(false)

  const canAccept = timeElapsed >= REQUIRED_SECONDS

  useEffect(() => {
    if (otpCooldown <= 0) return
    const t = setTimeout(() => setOtpCooldown(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [otpCooldown])

  useEffect(() => {
    if (!data.phoneNumber) onDataChange({ phoneNumber: "+998" })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!termsOpen) return
    setTimeElapsed(0)
    const interval = setInterval(() => {
      setTimeElapsed(prev => { if (prev >= REQUIRED_SECONDS) { clearInterval(interval); return prev } return prev + 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [termsOpen])

  const handlePassportChange = (raw: string) => {
    const v = raw.toUpperCase()
    let result = ""
    for (const ch of v) {
      if (result.length < 2) { if (/[A-Z]/.test(ch)) result += ch }
      else if (result.length < 9) { if (/[0-9]/.test(ch)) result += ch }
      else break
    }
    onDataChange({ passportNumber: result })
  }

  const validate = () => {
    const e: Record<string, string | undefined> = {}
    if (!data.lastName.trim())     e.lastName     = l.errLast
    if (!data.firstName.trim())    e.firstName    = l.errFirst
    if (!data.phoneNumber.trim())  e.phoneNumber  = l.errPhone
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = l.errEmail
    if (!data.dateOfBirth)         e.dateOfBirth  = l.errDob
    if (!data.gender)              e.gender       = l.errGender
    if (!data.nationality.trim())  e.nationality  = l.errNationality
    if (!data.countryOfBirth.trim()) e.countryOfBirth = l.errCountry
    if (!data.cityOfBirth.trim())  e.cityOfBirth  = l.errCity
    if (!data.currentAddress.trim()) e.currentAddress = l.errAddress
    if (!data.passportNumber.trim()) {
      e.passportNumber = l.errPassport
    } else if (!/^[A-Z]{2}[0-9]{7}$/.test(data.passportNumber)) {
      e.passportNumber = l.errPassportFormat
    }
    if (!data.agreeTerms) e.agreeTerms = l.errTerms
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSendOtp = async () => {
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setErrors({ email: l.errEmail }); return
    }
    setSendingOtp(true)
    try {
      const res = await fetch("/api/telc/otp/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      })
      if (res.status === 403) { setErrors({ email: l.errEmailDenied }); return }
      if (!res.ok) throw new Error()
      setOtpVisible(true); setOtpCooldown(60); toast.success(l.otpSent)
    } catch { toast.error(l.otpFail) } finally { setSendingOtp(false) }
  }

  const handleVerifyOtp = async () => {
    if (!otp.trim()) { setErrors({ otp: l.errOtp }); return }
    setVerifyingOtp(true)
    try {
      const res = await fetch("/api/telc/otp/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, otp }),
      })
      if (!res.ok) throw new Error()
      onDataChange({ emailVerified: true }); setOtpVisible(false); toast.success(l.otpSuccess)
    } catch { setErrors({ otp: l.errOtp }) } finally { setVerifyingOtp(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/telc/registrations", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: data.examId,
          firstName: data.firstName, lastName: data.lastName,
          phoneNumber: data.phoneNumber, email: data.email,
          passportNumber: data.passportNumber,
          dateOfBirth: data.dateOfBirth, gender: data.gender,
          nationality: data.nationality, countryOfBirth: data.countryOfBirth,
          cityOfBirth: data.cityOfBirth, currentAddress: data.currentAddress,
          documentType: data.documentType, examType: data.examType,
        }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error((errData as any).error ?? l.errFirst)
      }
      const reg = await res.json()
      onRegistrationComplete(reg.id)
      toast.success("Registration created!")
    } catch (err: any) {
      toast.error(err.message ?? "Error")
    } finally { setIsSubmitting(false) }
  }

  const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-slate-400"
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"
  const errCls = "mt-1 text-xs text-red-600"
  const hintCls = "mt-1 text-xs text-slate-400"

  return (
    <>
      {/* Terms Modal */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
          onClick={e => { if (e.target === e.currentTarget) setTermsOpen(false) }}>
          <div className="relative flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl sm:mx-4 overflow-hidden" style={{ height: "90vh" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">{l.termsTitle}</h3>
              <div className="flex items-center gap-3">
                <a href="/pdf_docs/offerta.pdf" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <ExternalLink size={12} /> {l.openInNewTab}
                </a>
                <button type="button" onClick={() => setTermsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <iframe src="/pdf_docs/offerta.pdf" className="flex-1 w-full" style={{ border: 0 }} title={l.termsTitle} />
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
              {!canAccept && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <ChevronDown size={14} className="animate-bounce shrink-0" />
                  <span>{l.readingTimer} {REQUIRED_SECONDS - timeElapsed}s…</span>
                  <div className="ml-auto w-20 h-1.5 rounded-full bg-amber-200 overflow-hidden shrink-0">
                    <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(timeElapsed / REQUIRED_SECONDS) * 100}%` }} />
                  </div>
                </div>
              )}
              <label className={`flex items-start gap-3 mb-3 select-none ${canAccept ? "cursor-pointer" : "cursor-not-allowed"}`}>
                <input type="checkbox" disabled={!canAccept} checked={modalChecked}
                  onChange={e => setModalChecked(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-gray-300 accent-primary disabled:opacity-40" />
                <span className={`text-sm leading-snug ${canAccept ? "text-slate-700" : "text-slate-400"}`}>
                  {l.acceptTerms}<span className="text-red-500 ml-0.5">*</span>
                </span>
              </label>
              <Button type="button" className="w-full" disabled={!modalChecked}
                onClick={() => { onDataChange({ agreeTerms: true }); setTermsOpen(false) }}>
                {l.btnAccept}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{l.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Last name + First name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>{l.lastName}<span className="text-red-500 ml-0.5">*</span></label>
              <input className={inputCls} placeholder="TOSHMATOV" value={data.lastName}
                onChange={e => onDataChange({ lastName: e.target.value })} />
              {errors.lastName ? <p className={errCls}>{errors.lastName}</p> : <p className={hintCls}>{l.nameHint}</p>}
            </div>
            <div>
              <label className={labelCls}>{l.firstName}<span className="text-red-500 ml-0.5">*</span></label>
              <input className={inputCls} placeholder="ANVAR" value={data.firstName}
                onChange={e => onDataChange({ firstName: e.target.value })} />
              {errors.firstName ? <p className={errCls}>{errors.firstName}</p> : <p className={hintCls}>{l.nameHint}</p>}
            </div>
          </div>

          {/* Email + OTP */}
          <div>
            <label className={labelCls}><Mail size={14} className="inline mr-1 text-slate-400" />{l.email}<span className="text-red-500 ml-0.5">*</span></label>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} type="email" placeholder="email@example.com"
                value={data.email} disabled={data.emailVerified}
                onChange={e => onDataChange({ email: e.target.value, emailVerified: false })} />
              {data.emailVerified ? (
                <div className="flex items-center gap-1 px-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-200 shrink-0">
                  <CheckCircle size={15} /> {l.verified}
                </div>
              ) : (
                <button type="button" onClick={handleSendOtp} disabled={sendingOtp || !data.email}
                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-primary hover:text-primary transition-colors disabled:opacity-50">
                  {sendingOtp ? <Loader2 size={15} className="animate-spin inline mr-1" /> : null}
                  {l.sendOtpBtn}
                </button>
              )}
            </div>
            {errors.email && <p className={errCls}>{errors.email}</p>}
          </div>

          {otpVisible && !data.emailVerified && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <label className="mb-1 block text-sm font-medium text-blue-900">{l.enterOtp}</label>
              <p className="mb-2 text-xs text-blue-600">{l.otpExpiry}</p>
              <div className="flex gap-2">
                <input className="flex-1 rounded-xl border border-blue-200 bg-white px-4 py-3 text-center text-xl font-bold tracking-[0.5em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="000000" maxLength={6} value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} />
                <Button type="button" onClick={handleVerifyOtp} disabled={verifyingOtp || otp.length < 6} className="rounded-xl shrink-0">
                  {verifyingOtp ? <Loader2 size={15} className="animate-spin mr-1" /> : null}{l.verifyOtp}
                </Button>
              </div>
              <div className="mt-2">
                {otpCooldown > 0
                  ? <p className="text-xs text-blue-600">{l.resendIn} {otpCooldown}s</p>
                  : <button type="button" onClick={handleSendOtp} disabled={sendingOtp}
                      className="text-xs text-primary underline underline-offset-2 hover:text-primary/80 disabled:opacity-50">
                      {sendingOtp ? <Loader2 size={11} className="animate-spin inline mr-1" /> : null}{l.resend}
                    </button>}
              </div>
              {errors.otp && <p className={errCls}>{errors.otp}</p>}
            </div>
          )}

          {/* Phone */}
          <div>
            <label className={labelCls}>{l.phone}<span className="text-red-500 ml-0.5">*</span></label>
            <input className={inputCls} type="tel" placeholder="+998 90 123-45-67"
              value={data.phoneNumber} onChange={e => onDataChange({ phoneNumber: e.target.value })} />
            {errors.phoneNumber ? <p className={errCls}>{errors.phoneNumber}</p> : <p className={hintCls}>{l.phoneHint}</p>}
          </div>

          {/* Date of birth */}
          <div>
            <label className={labelCls}>{l.dob}<span className="text-red-500 ml-0.5">*</span></label>
            <input className={inputCls} type="date"
              value={data.dateOfBirth}
              onChange={e => onDataChange({ dateOfBirth: e.target.value })}
              max={new Date().toISOString().split("T")[0]} />
            {errors.dateOfBirth && <p className={errCls}>{errors.dateOfBirth}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className={labelCls}>{l.gender}<span className="text-red-500 ml-0.5">*</span></label>
            <div className="flex gap-3">
              {[{ value: "male", label: l.male }, { value: "female", label: l.female }].map(g => (
                <label key={g.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors ${
                    data.gender === g.value ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-700 hover:border-primary/40"
                  }`}>
                  <input type="radio" name="gender" value={g.value} checked={data.gender === g.value}
                    onChange={() => onDataChange({ gender: g.value })} className="accent-primary w-4 h-4" />
                  {g.label}
                </label>
              ))}
            </div>
            {errors.gender && <p className={errCls}>{errors.gender}</p>}
          </div>

          {/* Nationality */}
          <div>
            <label className={labelCls}>{l.nationality}<span className="text-red-500 ml-0.5">*</span></label>
            <input className={inputCls} placeholder={lang === "uz" ? "O'zbek" : lang === "ru" ? "Узбек" : "Uzbek"}
              value={data.nationality} onChange={e => onDataChange({ nationality: e.target.value })} />
            {errors.nationality && <p className={errCls}>{errors.nationality}</p>}
          </div>

          {/* Country + City of birth */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>{l.countryOfBirth}<span className="text-red-500 ml-0.5">*</span></label>
              <div className="relative">
                <select
                  className={`${inputCls} appearance-none pr-10`}
                  value={data.countryOfBirth}
                  onChange={e => onDataChange({ countryOfBirth: e.target.value })}
                >
                  <option value="">{l.selectCountry}</option>
                  {COUNTRIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label[lang] ?? c.label.en}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.countryOfBirth && <p className={errCls}>{errors.countryOfBirth}</p>}
            </div>
            <div>
              <label className={labelCls}>{l.cityOfBirth}<span className="text-red-500 ml-0.5">*</span></label>
              <input className={inputCls} placeholder={lang === "uz" ? "Toshkent" : lang === "ru" ? "Ташкент" : "Tashkent"}
                value={data.cityOfBirth} onChange={e => onDataChange({ cityOfBirth: e.target.value })} />
              {errors.cityOfBirth && <p className={errCls}>{errors.cityOfBirth}</p>}
            </div>
          </div>

          {/* Current address */}
          <div>
            <label className={labelCls}>{l.currentAddress}<span className="text-red-500 ml-0.5">*</span></label>
            <input className={inputCls}
              placeholder={lang === "uz" ? "Toshkent sh., Mirzo Ulug'bek t., Navoiy ko'chasi, 123-uy" : lang === "ru" ? "г. Ташкент, р-н Мирзо Улугбек, ул. Навои, дом 123" : "Tashkent, Mirzo Ulugbek, Navoi str., 123"}
              value={data.currentAddress} onChange={e => onDataChange({ currentAddress: e.target.value })} />
            {errors.currentAddress ? <p className={errCls}>{errors.currentAddress}</p> : <p className={hintCls}>{l.addressHint}</p>}
          </div>

          {/* Document type */}
          <div>
            <label className={labelCls}>{l.documentType}<span className="text-red-500 ml-0.5">*</span></label>
            <div className="flex gap-3">
              {[{ value: "id_card", label: l.idCard }, { value: "passport", label: l.passport }].map(dt => (
                <label key={dt.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors ${
                    data.documentType === dt.value ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-700 hover:border-primary/40"
                  }`}>
                  <input type="radio" name="documentType" value={dt.value} checked={data.documentType === dt.value}
                    onChange={() => onDataChange({ documentType: dt.value })} className="accent-primary w-4 h-4" />
                  {dt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Document number */}
          <div>
            <label className={labelCls}>{l.docNumber}<span className="text-red-500 ml-0.5">*</span></label>
            <input className={inputCls} placeholder="AB1234567"
              value={data.passportNumber} maxLength={9}
              onChange={e => handlePassportChange(e.target.value)} />
            {errors.passportNumber && <p className={errCls}>{errors.passportNumber}</p>}
          </div>

          {/* Terms */}
          <div>
            <button type="button" onClick={() => { setModalChecked(false); setTermsOpen(true) }}
              className="flex items-start gap-3 w-full text-left rounded-xl border border-slate-200 px-4 py-3 hover:border-primary/40 transition-colors group">
              <div className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                data.agreeTerms ? "bg-primary border-primary" : "border-slate-300 group-hover:border-primary/60"
              }`}>
                {data.agreeTerms && <Check size={12} className="text-white" />}
              </div>
              <span className="text-sm text-slate-700">
                {l.terms}{" "}
                <span className="text-primary underline underline-offset-2">{l.termsLink}</span>
                <span className="text-red-500 ml-0.5">*</span>
              </span>
            </button>
            {errors.agreeTerms && <p className={errCls}>{errors.agreeTerms}</p>}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onPrevious} disabled={isSubmitting}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:border-primary/40 hover:text-primary transition-colors">
              {l.previous}
            </button>
            <button type="submit" disabled={!data.emailVerified || isSubmitting}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40">
              {isSubmitting ? <><Loader2 size={15} className="animate-spin inline mr-2" />{l.submitting}</> : l.next}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
