"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Loader2, Mail, CheckCircle, X, ChevronDown, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface FormData {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  passportNumber: string
  agreeTerms: boolean
  emailVerified: boolean
}

interface Props {
  data: FormData
  lang: string
  onDataChange: (data: Partial<FormData>) => void
  onNext: () => void
}

const REQUIRED_SECONDS = 10

const labels: Record<string, Record<string, string>> = {
  en: {
    title: "Personal Information", firstName: "First Name", lastName: "Last Name",
    phone: "Phone Number", email: "Email", passport: "Passport Number",
    terms: "I agree to the terms and conditions", sendOtp: "Send OTP",
    enterOtp: "Enter 6-digit OTP sent to your email", verifyOtp: "Verify",
    next: "Next →", verified: "Verified",
    errFirst: "First name is required", errLast: "Last name is required",
    errPhone: "Phone number is required", errEmail: "Valid email required",
    errPassport: "Passport number is required", errPassportFormat: "Format: 2 letters + 7 digits (e.g. AB1234567)", errTerms: "You must agree to the terms",
    errOtp: "Invalid OTP code", otpSent: "OTP sent to your email",
    otpFail: "Failed to send OTP", otpSuccess: "Email verified!",
    termsTitle: "Terms and Conditions",
    readingTimer: "Please read the document. Available in",
    acceptTerms: "I have read and agree to the terms and conditions",
    btnAccept: "Accept & Continue",
    openInNewTab: "Open full document in new tab",
  },
  de: {
    title: "Persönliche Daten", firstName: "Vorname", lastName: "Nachname",
    phone: "Telefonnummer", email: "E-Mail", passport: "Passnummer",
    terms: "Ich stimme den AGB zu", sendOtp: "OTP senden",
    enterOtp: "6-stelligen OTP-Code eingeben", verifyOtp: "Prüfen",
    next: "Weiter →", verified: "Verifiziert",
    errFirst: "Vorname erforderlich", errLast: "Nachname erforderlich",
    errPhone: "Telefonnummer erforderlich", errEmail: "Gültige E-Mail erforderlich",
    errPassport: "Passnummer erforderlich", errPassportFormat: "Format: 2 Buchstaben + 7 Ziffern (z. B. AB1234567)", errTerms: "Bitte stimmen Sie zu",
    errOtp: "Ungültiger OTP-Code", otpSent: "OTP gesendet",
    otpFail: "OTP-Versand fehlgeschlagen", otpSuccess: "E-Mail verifiziert!",
    termsTitle: "Allgemeine Geschäftsbedingungen",
    readingTimer: "Bitte lesen Sie das Dokument. Verfügbar in",
    acceptTerms: "Ich habe die AGB gelesen und stimme zu",
    btnAccept: "Akzeptieren & Weiter",
    openInNewTab: "Vollständiges Dokument in neuem Tab öffnen",
  },
  ru: {
    title: "Личные данные", firstName: "Имя", lastName: "Фамилия",
    phone: "Телефон", email: "Email", passport: "Номер паспорта",
    terms: "Я согласен с условиями", sendOtp: "Отправить OTP",
    enterOtp: "Введите 6-значный код из письма", verifyOtp: "Подтвердить",
    next: "Далее →", verified: "Подтверждено",
    errFirst: "Введите имя", errLast: "Введите фамилию",
    errPhone: "Введите телефон", errEmail: "Введите корректный email",
    errPassport: "Введите номер паспорта", errPassportFormat: "Формат: 2 буквы + 7 цифр (напр. AB1234567)", errTerms: "Необходимо согласие",
    errOtp: "Неверный OTP", otpSent: "OTP отправлен на email",
    otpFail: "Ошибка отправки OTP", otpSuccess: "Email подтверждён!",
    termsTitle: "Условия и положения",
    readingTimer: "Пожалуйста, прочитайте документ. Доступно через",
    acceptTerms: "Я прочитал(а) и согласен(на) с условиями",
    btnAccept: "Принять и продолжить",
    openInNewTab: "Открыть полный документ в новой вкладке",
  },
  uz: {
    title: "Shaxsiy ma'lumotlar", firstName: "Ism", lastName: "Familiya",
    phone: "Telefon", email: "Email", passport: "Pasport raqami",
    terms: "Shartlarga roziman", sendOtp: "OTP yuborish",
    enterOtp: "Emailingizga yuborilgan 6 xonali kodni kiriting", verifyOtp: "Tasdiqlash",
    next: "Keyingi →", verified: "Tasdiqlandi",
    errFirst: "Ism kiritish shart", errLast: "Familiya kiritish shart",
    errPhone: "Telefon kiritish shart", errEmail: "To'g'ri email kiriting",
    errPassport: "Pasport raqami kiritish shart", errPassportFormat: "Format: 2 harf + 7 raqam (mas. AB1234567)", errTerms: "Shartlarga rozi bo'ling",
    errOtp: "Noto'g'ri OTP kodi", otpSent: "OTP emailingizga yuborildi",
    otpFail: "OTP yuborishda xato", otpSuccess: "Email tasdiqlandi!",
    termsTitle: "Foydalanish shartlari",
    readingTimer: "Iltimos, hujjatni o'qing. Tayyor bo'ladi:",
    acceptTerms: "Men shartlarni o'qidim va roziman",
    btnAccept: "Qabul qilish va davom etish",
    openInNewTab: "To'liq hujjatni yangi yorliqda ochish",
  },
}

export default function StepPersonalInfo({ data, lang, onDataChange, onNext }: Props) {
  const l = labels[lang] ?? labels.en
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otpVisible, setOtpVisible] = useState(false)
  const [otp, setOtp] = useState("")
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)

  // Terms modal state
  const [termsOpen, setTermsOpen] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [modalChecked, setModalChecked] = useState(false)

  const canAccept = timeElapsed >= REQUIRED_SECONDS

  // Pre-fill phone with +998 on first mount if empty
  useEffect(() => {
    if (!data.phoneNumber) {
      onDataChange({ phoneNumber: "+998" })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Countdown timer while modal is open
  useEffect(() => {
    if (!termsOpen) return
    setTimeElapsed(0)
    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        if (prev >= REQUIRED_SECONDS) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [termsOpen])

  const openTermsModal = () => {
    setModalChecked(false)
    setTermsOpen(true)
  }

  const handleAcceptTerms = () => {
    onDataChange({ agreeTerms: true })
    setTermsOpen(false)
  }

  // Enforce AA1234567 pattern: positions 0-1 = letters only, positions 2-8 = digits only, max 9 chars
  const handlePassportChange = (raw: string) => {
    const v = raw.toUpperCase()
    let result = ""
    for (const ch of v) {
      if (result.length < 2) {
        if (/[A-Z]/.test(ch)) result += ch
      } else if (result.length < 9) {
        if (/[0-9]/.test(ch)) result += ch
      } else {
        break
      }
    }
    onDataChange({ passportNumber: result })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.firstName.trim()) e.firstName = l.errFirst
    if (!data.lastName.trim()) e.lastName = l.errLast
    if (!data.phoneNumber.trim()) e.phoneNumber = l.errPhone
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = l.errEmail
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
      setErrors({ email: l.errEmail })
      return
    }
    setSendingOtp(true)
    try {
      const res = await fetch("/api/telc/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error((errorData as any).error || `Server error: ${res.status}`)
      }
      setOtpVisible(true)
      toast.success(l.otpSent)
    } catch (err) {
      console.error("OTP send failed:", err)
      toast.error(l.otpFail)
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp.trim()) { setErrors({ otp: l.errOtp }); return }
    setVerifyingOtp(true)
    try {
      const res = await fetch("/api/telc/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, otp }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error((errorData as any).error || `Server error: ${res.status}`)
      }
      onDataChange({ emailVerified: true })
      setOtpVisible(false)
      toast.success(l.otpSuccess)
    } catch (err) {
      console.error("OTP verify failed:", err)
      setErrors({ otp: l.errOtp })
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onNext()
  }

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
  const labelCls = "mb-1 block text-sm font-medium text-slate-700"

  return (
    <>
      {/* Terms & Conditions Modal */}
      {termsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) setTermsOpen(false) }}
        >
          <div
            className="relative flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl sm:mx-4 overflow-hidden"
            style={{ height: "90vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">{l.termsTitle}</h3>
              <div className="flex items-center gap-3">
                <a
                  href="/pdf_docs/offerta.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink size={12} /> {l.openInNewTab}
                </a>
                <button type="button" onClick={() => setTermsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PDF iframe — full interactivity, fills remaining space */}
            <iframe
              src="/pdf_docs/offerta.pdf"
              className="flex-1 w-full"
              style={{ border: 0 }}
              title={l.termsTitle}
            />

            {/* Footer — timer countdown then accept */}
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
              {!canAccept && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <ChevronDown size={14} className="animate-bounce shrink-0" />
                  <span>{l.readingTimer} {REQUIRED_SECONDS - timeElapsed}s…</span>
                  {/* Progress bar */}
                  <div className="ml-auto w-20 h-1.5 rounded-full bg-amber-200 overflow-hidden shrink-0">
                    <div
                      className="h-full bg-amber-500 transition-all duration-1000"
                      style={{ width: `${(timeElapsed / REQUIRED_SECONDS) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <label className={`flex items-start gap-3 mb-3 select-none ${canAccept ? "cursor-pointer" : "cursor-not-allowed"}`}>
                <input
                  type="checkbox"
                  disabled={!canAccept}
                  checked={modalChecked}
                  onChange={e => setModalChecked(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-40"
                />
                <span className={`text-sm leading-snug transition-colors ${canAccept ? "text-slate-700" : "text-slate-400"}`}>
                  {l.acceptTerms}<span className="text-red-500 ml-0.5">*</span>
                </span>
              </label>

              <Button
                type="button"
                className="w-full"
                disabled={!modalChecked}
                onClick={handleAcceptTerms}
              >
                {l.btnAccept}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{l.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls}>{l.firstName}<span className="text-red-500 ml-0.5">*</span></label>
              <input className={inputCls} value={data.firstName}
                onChange={(e) => onDataChange({ firstName: e.target.value })} />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label className={labelCls}>{l.lastName}<span className="text-red-500 ml-0.5">*</span></label>
              <input className={inputCls} value={data.lastName}
                onChange={(e) => onDataChange({ lastName: e.target.value })} />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls}>{l.phone}<span className="text-red-500 ml-0.5">*</span></label>
            <input className={inputCls} type="tel"
              value={data.phoneNumber}
              onChange={(e) => onDataChange({ phoneNumber: e.target.value })} />
            {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label className={labelCls}>{l.email}<span className="text-red-500 ml-0.5">*</span></label>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} type="email" placeholder="example@email.com"
                value={data.email} disabled={data.emailVerified}
                onChange={(e) => onDataChange({ email: e.target.value, emailVerified: false })} />
              {data.emailVerified ? (
                <div className="flex items-center gap-1 px-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                  <CheckCircle size={16} /> {l.verified}
                </div>
              ) : (
                <Button type="button" variant="outline" onClick={handleSendOtp}
                  disabled={sendingOtp || !data.email} className="rounded-xl shrink-0">
                  {sendingOtp ? <Loader2 size={16} className="animate-spin mr-1" /> : <Mail size={16} className="mr-1" />}
                  {l.sendOtp}
                </Button>
              )}
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          {otpVisible && !data.emailVerified && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <label className="mb-2 block text-sm font-medium text-blue-900">{l.enterOtp}</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-blue-200 bg-white px-4 py-3 text-center text-xl font-bold tracking-[0.5em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="000000" maxLength={6} value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} />
                <Button type="button" onClick={handleVerifyOtp}
                  disabled={verifyingOtp || otp.length < 6} className="rounded-xl shrink-0">
                  {verifyingOtp ? <Loader2 size={16} className="animate-spin mr-1" /> : null}
                  {l.verifyOtp}
                </Button>
              </div>
              {errors.otp && <p className="mt-1 text-xs text-red-600">{errors.otp}</p>}
            </div>
          )}

          <div>
            <label className={labelCls}>{l.passport}<span className="text-red-500 ml-0.5">*</span></label>
            <input
              className={inputCls}
              placeholder="AA1234567"
              value={data.passportNumber}
              maxLength={9}
              onChange={(e) => handlePassportChange(e.target.value)}
            />
            {errors.passportNumber && <p className="mt-1 text-xs text-red-600">{errors.passportNumber}</p>}
          </div>

          {/* Terms row — clicking opens the modal */}
          <div>
            <button
              type="button"
              onClick={openTermsModal}
              className="flex items-center gap-3 group w-full text-left"
            >
              <div className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                data.agreeTerms
                  ? "bg-primary border-primary"
                  : "border-slate-300 group-hover:border-primary/60"
              }`}>
                {data.agreeTerms && <Check size={12} className="text-white" />}
              </div>
              <span className="text-sm text-slate-700 underline-offset-2 group-hover:underline">
                {l.terms}<span className="text-red-500 ml-0.5">*</span>
              </span>
            </button>
            {errors.agreeTerms && <p className="mt-1 text-xs text-red-600">{errors.agreeTerms}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={!data.emailVerified}>
            {l.next}
          </Button>
        </form>
      </div>
    </>
  )
}
