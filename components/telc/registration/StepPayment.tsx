"use client"

import { useState } from "react"
import { Loader2, Check } from "lucide-react"
import { toast } from "sonner"

interface Props {
  registrationId: number
  amount: string | number
  lang: string
  onPaymentComplete: () => void
  onPrevious: () => void
}

const QR_IMAGE   = "/pdf_docs/QRcode_paynet%26payme.png"
const PAYNET_LOGO = "/images/logos/PAYNETLOGO.jpg"
const PAYME_LOGO  = "/images/logos/paymeLOGO.png"

const ui: Record<string, Record<string, string>> = {
  en: {
    title: "Payment", amount: "Amount to pay", selectMethod: "Select Payment Method",
    paynet: "Paynet", payme: "Payme",
    instructions: "Payment Instructions",
    step1: "Scan the QR code with your mobile banking app",
    step2: "Enter the exact amount and complete the payment",
    step3: 'Fill in the fields below and click "Verify Payment"',
    personalId: "Personal ID (INN / PINFL)", personalIdPlaceholder: "Enter your INN (9 digits) or PINFL (14 digits)",
    checkId: "Check / Transaction ID", checkIdPlaceholder: "Enter the check or transaction ID",
    verifyBtn: "Verify Payment", verifying: "Submitting...",
    submitted: "Payment Submitted", submittedMsg: "Your payment is pending verification by our team. A confirmation email has been sent to you.",
    previous: "← Previous", submit: "Continue →",
    errMethod: "Please select a payment method",
    errFail: "Failed to submit payment. Please try again.",
    errPersonalId: "Please enter your Personal ID (INN)",
    errCheckId: "Please enter the Check / Transaction ID",
    sendViaTelegram: "I will send the payment receipt photo to the admin via Telegram",
  },
  de: {
    title: "Zahlung", amount: "Zu zahlender Betrag", selectMethod: "Zahlungsmethode wählen",
    paynet: "Paynet", payme: "Payme",
    instructions: "Zahlungsanleitung",
    step1: "QR-Code mit der mobilen Banking-App scannen",
    step2: "Genauen Betrag eingeben und Zahlung abschließen",
    step3: 'Felder ausfüllen und „Zahlung prüfen" klicken',
    personalId: "Persönliche ID (INN / PINFL)", personalIdPlaceholder: "INN (9 Ziffern) oder PINFL (14 Ziffern) eingeben",
    checkId: "Check- / Transaktions-ID", checkIdPlaceholder: "Check- oder Transaktions-ID eingeben",
    verifyBtn: "Zahlung prüfen", verifying: "Wird gesendet...",
    submitted: "Zahlung eingereicht", submittedMsg: "Ihre Zahlung wird von unserem Team geprüft. Eine Bestätigungs-E-Mail wurde an Sie gesendet.",
    previous: "← Zurück", submit: "Weiter →",
    errMethod: "Bitte Zahlungsmethode wählen",
    errFail: "Fehler beim Einreichen der Zahlung.",
    errPersonalId: "Bitte persönliche ID (INN) eingeben",
    errCheckId: "Bitte Check- / Transaktions-ID eingeben",
    sendViaTelegram: "Ich sende das Zahlungsbeleg-Foto über Telegram an den Administrator",
  },
  ru: {
    title: "Оплата", amount: "Сумма к оплате", selectMethod: "Выберите способ оплаты",
    paynet: "Paynet", payme: "Payme",
    instructions: "Инструкция по оплате",
    step1: "Откройте мобильное банковское приложение и отсканируйте QR-код",
    step2: "Введите точную сумму и завершите оплату",
    step3: "Заполните поля ниже и нажмите «Подтвердить оплату»",
    personalId: "Персональный ID (ИНН / ПИНФЛ)", personalIdPlaceholder: "Введите ИНН (9 цифр) или ПИНФЛ (14 цифр)",
    checkId: "ID чека / транзакции", checkIdPlaceholder: "Введите ID чека или транзакции",
    verifyBtn: "Подтвердить оплату", verifying: "Отправка...",
    submitted: "Оплата отправлена", submittedMsg: "Ваш платёж ожидает проверки нашей командой. Письмо с подтверждением отправлено на вашу почту.",
    previous: "← Назад", submit: "Продолжить →",
    errMethod: "Выберите способ оплаты",
    errFail: "Ошибка отправки платежа. Попробуйте ещё раз.",
    errPersonalId: "Введите персональный ID (ИНН)",
    errCheckId: "Введите ID чека / транзакции",
    sendViaTelegram: "Я отправлю фото чека об оплате администратору через Telegram",
  },
  uz: {
    title: "To'lov", amount: "To'lov summasi", selectMethod: "To'lov usulini tanlang",
    paynet: "Paynet", payme: "Payme",
    instructions: "To'lov ko'rsatmalari",
    step1: "Mobil bank ilovasini oching va QR kodni skanerlang",
    step2: "Aniq summani kiriting va to'lovni yakunlang",
    step3: "Quyidagi maydonlarni to'ldiring va «To'lovni tasdiqlash» ni bosing",
    personalId: "Shaxsiy ID (INN / PINFL)", personalIdPlaceholder: "INN (9 raqam) yoki PINFL (14 raqam) kiriting",
    checkId: "Chek / tranzaksiya ID", checkIdPlaceholder: "Chek yoki tranzaksiya ID sini kiriting",
    verifyBtn: "To'lovni tasdiqlash", verifying: "Yuborilmoqda...",
    submitted: "To'lov yuborildi", submittedMsg: "To'lovingiz jamoamiz tomonidan tekshirilmoqda. Tasdiqlash xati emailingizga yuborildi.",
    previous: "← Oldingi", submit: "Davom etish →",
    errMethod: "To'lov usulini tanlang",
    errFail: "To'lovni yuborishda xato. Qayta urinib ko'ring.",
    errPersonalId: "Shaxsiy ID (INN) ni kiriting",
    errCheckId: "Chek / tranzaksiya ID sini kiriting",
    sendViaTelegram: "Telegram orqali administratorga to'lov chek suratini yuboraman",
  },
}

const METHODS = [
  {
    id: "paynet",
    logo: PAYNET_LOGO,
    accent: { ring: "border-blue-400", bg: "bg-blue-50", shadow: "shadow-blue-100", dot: "bg-blue-500" },
    base: "border-slate-200 hover:border-blue-300 hover:bg-blue-50/40",
  },
  {
    id: "payme",
    logo: PAYME_LOGO,
    accent: { ring: "border-purple-400", bg: "bg-purple-50", shadow: "shadow-purple-100", dot: "bg-purple-500" },
    base: "border-slate-200 hover:border-purple-300 hover:bg-purple-50/40",
  },
]

export default function StepPayment({ registrationId, amount, lang, onPaymentComplete, onPrevious }: Props) {
  const l: Record<string, string> = ui[lang] ?? ui["en"] ?? {}
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [personalId, setPersonalId] = useState("")
  const [checkId, setCheckId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [sendViaTelegram, setSendViaTelegram] = useState(false)

  const paymeMerchantId = process.env.NEXT_PUBLIC_PAYME_MERCHANT_ID ?? ""
  const paymeAmountTiyin = String(Math.round(Number(amount) * 100))
  const paymeLang = lang === "de" ? "ru" : (["ru", "uz", "en"].includes(lang) ? lang : "ru")
  const paymeCheckoutUrl = process.env.NEXT_PUBLIC_PAYME_ENV === "test"
    ? "https://test.paycom.uz"
    : "https://checkout.paycom.uz"

  const canVerify = !!selectedMethod && (sendViaTelegram || (personalId.trim().length > 0 && checkId.trim().length > 0))

  const handleVerify = async () => {
    if (!selectedMethod) { toast.error(l.errMethod); return }
    if (!sendViaTelegram && !personalId.trim()) { toast.error(l.errPersonalId); return }
    if (!sendViaTelegram && !checkId.trim()) { toast.error(l.errCheckId); return }
    setIsVerifying(true)
    try {
      const res = await fetch("/api/telc/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId,
          amount: String(amount),
          paymentMethod: selectedMethod,
          personalId: personalId.trim(),
          checkId: checkId.trim(),
        }),
      })
      if (!res.ok) throw new Error()
      setPaymentVerified(true)
      toast.success(l.submitted)
      setTimeout(onPaymentComplete, 1500)
    } catch {
      toast.error(l.errFail)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{l.title}</h2>

      {/* Amount */}
      <div className="mb-8 rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">{l.amount}</p>
        <p className="text-4xl font-extrabold text-primary">
          {Number(amount).toLocaleString()} <span className="text-2xl font-bold text-slate-500">UZS</span>
        </p>
      </div>

      {/* Payme hidden checkout form */}
      {paymeMerchantId && (
        <form id="payme-form" action={`${paymeCheckoutUrl}/`} method="POST" style={{ display: "none" }}>
          <input type="hidden" name="merchant" value={paymeMerchantId} />
          <input type="hidden" name="amount" value={paymeAmountTiyin} />
          <input type="hidden" name="account[order_id]" value={String(registrationId)} />
          <input type="hidden" name="lang" value={paymeLang} />
          <input type="hidden" name="description" value={`TELC exam registration #${registrationId}`} />
        </form>
      )}

      {/* Payment method selection — symmetric 2-column */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          {l.selectMethod}<span className="text-red-500 ml-0.5">*</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {METHODS.map(m => {
            const isSelected = selectedMethod === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMethod(m.id)}
                className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-200 ${
                  isSelected
                    ? `${m.accent.ring} ${m.accent.bg} shadow-md ${m.accent.shadow}`
                    : m.base
                }`}
              >
                {/* Selected checkmark */}
                {isSelected && (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow">
                    <Check size={11} style={{ color: "#ffffff" }} />
                  </span>
                )}

                {/* Logo */}
                <div className="h-14 w-full flex items-center justify-center px-2">
                  <img src={m.logo} alt={m.id} className="max-h-full max-w-full object-contain" />
                </div>

                {/* QR code thumbnail */}
                <div className="w-[88px] h-[88px] rounded-xl overflow-hidden border border-slate-100 bg-white p-1 shadow-sm">
                  <img src={QR_IMAGE} alt="QR" className="w-full h-full object-contain" />
                </div>

                {/* Label */}
                <span className="text-sm font-bold text-slate-800">{l[m.id]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Payment instructions */}
      {selectedMethod && !paymentVerified && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h4 className="font-semibold text-blue-900 mb-4 text-center">{l.instructions}</h4>
          <div className="flex justify-center mb-5">
            <img
              src={QR_IMAGE}
              alt="QR Code"
              className="w-48 h-48 object-contain rounded-xl border border-blue-100 bg-white p-2 shadow-sm"
            />
          </div>
          <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
            <li>{l.step1}</li>
            <li>{l.step2}</li>
            <li>{l.step3}</li>
          </ol>
        </div>
      )}

      {/* Post-payment confirmation fields */}
      {selectedMethod && !paymentVerified && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
          <div className={sendViaTelegram ? "opacity-40 pointer-events-none" : ""}>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {l.personalId}{!sendViaTelegram && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
              type="text"
              value={personalId}
              onChange={e => setPersonalId(e.target.value)}
              placeholder={l.personalIdPlaceholder}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
          <div className={sendViaTelegram ? "opacity-40 pointer-events-none" : ""}>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {l.checkId}{!sendViaTelegram && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
              type="text"
              value={checkId}
              onChange={e => setCheckId(e.target.value)}
              placeholder={l.checkIdPlaceholder}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
          <label className="flex items-start gap-3 cursor-pointer select-none pt-1 border-t border-slate-200">
            <input
              type="checkbox"
              checked={sendViaTelegram}
              onChange={e => setSendViaTelegram(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary shrink-0"
            />
            <span className="text-sm text-slate-700 leading-snug">{l.sendViaTelegram}</span>
          </label>
        </div>
      )}

      {/* Verified state */}
      {paymentVerified && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-5">
          <Check size={24} className="text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-900">{l.submitted}</p>
            <p className="text-sm text-green-800">{l.submittedMsg}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onPrevious}
          disabled={isVerifying || paymentVerified}
          className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-700 hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {l.previous}
        </button>
        {!paymentVerified ? (
          <button type="button" onClick={handleVerify}
            disabled={!canVerify || isVerifying}
            className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40">
            {isVerifying && <Loader2 size={15} className="animate-spin inline mr-2" />}
            {isVerifying ? l.verifying : l.verifyBtn}
          </button>
        ) : (
          <button type="button" onClick={onPaymentComplete}
            className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary/90">
            {l.submit}
          </button>
        )}
      </div>
    </div>
  )
}
