"use client"

import { useState } from "react"
import { Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Props {
  registrationId: number
  amount: string | number
  lang: string
  onPaymentComplete: () => void
  onPrevious: () => void
}

const QR_IMAGE = "/pdf_docs/QRcode_paynet%26payme.png"

const ui: Record<string, Record<string, string>> = {
  en: {
    title: "Payment", amount: "Amount", selectMethod: "Select Payment Method",
    paynet: "Paynet", payme: "Payme", other: "Other",
    instructions: "Payment Instructions",
    step1: "Scan the QR code with your mobile device",
    step2: "Enter the amount and complete the payment",
    step3: 'Click "Verify Payment" below to confirm',
    personalId: "Personal ID (INN / PINFL)", personalIdPlaceholder: "Enter your INN (9 digits) or PINFL (14 digits)",
    checkId: "Check ID", checkIdPlaceholder: "Enter the check/transaction ID",
    verifyBtn: "Verify Payment", verifying: "Submitting...",
    submitted: "Payment Submitted", submittedMsg: "Your payment is pending verification by our team. A confirmation email has been sent to you.",
    previous: "← Previous", submit: "Continue →",
    errMethod: "Please select a payment method",
    errFail: "Failed to submit payment. Please try again.",
    errPersonalId: "Please enter your Personal ID (ИНН)",
    errCheckId: "Please enter the Check ID",
  },
  de: {
    title: "Zahlung", amount: "Betrag", selectMethod: "Zahlungsmethode wählen",
    paynet: "Paynet", payme: "Payme", other: "Sonstige",
    instructions: "Zahlungsanleitung",
    step1: "QR-Code mit dem Handy scannen",
    step2: "Betrag eingeben und Zahlung abschließen",
    step3: '"Zahlung prüfen" unten klicken',
    personalId: "Persönliche ID (INN / PINFL)", personalIdPlaceholder: "INN (9 Ziffern) oder PINFL (14 Ziffern) eingeben",
    checkId: "Check-ID", checkIdPlaceholder: "Check-/Transaktions-ID eingeben",
    verifyBtn: "Zahlung prüfen", verifying: "Wird gesendet...",
    submitted: "Zahlung eingereicht", submittedMsg: "Ihre Zahlung wird von unserem Team geprüft. Eine Bestätigungs-E-Mail wurde an Sie gesendet.",
    previous: "← Zurück", submit: "Weiter →",
    errMethod: "Bitte Zahlungsmethode wählen",
    errFail: "Fehler beim Einreichen der Zahlung.",
    errPersonalId: "Bitte persönliche ID (ИНН) eingeben",
    errCheckId: "Bitte Check-ID eingeben",
  },
  ru: {
    title: "Оплата", amount: "Сумма", selectMethod: "Выберите способ оплаты",
    paynet: "Paynet", payme: "Payme", other: "Другой",
    instructions: "Инструкция по оплате",
    step1: "Отсканируйте QR-код телефоном",
    step2: "Введите сумму и завершите оплату",
    step3: 'Нажмите "Подтвердить оплату" ниже',
    personalId: "Персональный ID (ИНН / ПИНФЛ)", personalIdPlaceholder: "Введите ИНН (9 цифр) или ПИНФЛ (14 цифр)",
    checkId: "ID чека", checkIdPlaceholder: "Введите ID чека / транзакции",
    verifyBtn: "Подтвердить оплату", verifying: "Отправка...",
    submitted: "Оплата отправлена", submittedMsg: "Ваш платёж ожидает проверки нашей командой. Письмо с подтверждением отправлено вам.",
    previous: "← Назад", submit: "Продолжить →",
    errMethod: "Выберите способ оплаты",
    errFail: "Ошибка отправки платежа.",
    errPersonalId: "Введите персональный ID (ИНН)",
    errCheckId: "Введите ID чека",
  },
  uz: {
    title: "To'lov", amount: "Summa", selectMethod: "To'lov usulini tanlang",
    paynet: "Paynet", payme: "Payme", other: "Boshqa",
    instructions: "To'lov ko'rsatmalari",
    step1: "Telefon bilan QR kodni skanerlang",
    step2: "Summani kiriting va to'lovni yakunlang",
    step3: '"To\'lovni tasdiqlash" tugmasini quyida bosing',
    personalId: "Shaxsiy ID (INN / PINFL)", personalIdPlaceholder: "INN (9 raqam) yoki PINFL (14 raqam) kiriting",
    checkId: "Chek ID", checkIdPlaceholder: "Chek / tranzaksiya ID sini kiriting",
    verifyBtn: "To'lovni tasdiqlash", verifying: "Yuborilmoqda...",
    submitted: "To'lov yuborildi", submittedMsg: "To'lovingiz jamoamiz tomonidan tekshirilmoqda. Tasdiqlash xati emailingizga yuborildi.",
    previous: "← Oldingi", submit: "Davom etish →",
    errMethod: "To'lov usulini tanlang",
    errFail: "To'lovni yuborishda xato.",
    errPersonalId: "Shaxsiy ID (ИНН) ni kiriting",
    errCheckId: "Chek ID ni kiriting",
  },
}

const PAYNET_LOGO = "/images/logos/PAYNETLOGO.jpg"
const PAYME_LOGO  = "/images/logos/paymeLOGO.png"
const BANK_PDF    = "/pdf_docs/PDBankinfo.pdf"

const METHODS = [
  { id: "paynet", logo: PAYNET_LOGO, colorSelected: "border-blue-400 bg-blue-50",   colorBase: "border-slate-200 hover:border-blue-300" },
  { id: "payme",  logo: PAYME_LOGO,  colorSelected: "border-purple-400 bg-purple-50", colorBase: "border-slate-200 hover:border-purple-300" },
  { id: "other",  logo: null,        colorSelected: "border-green-400 bg-green-50",  colorBase: "border-slate-200 hover:border-green-300" },
]

export default function StepPayment({ registrationId, amount, lang, onPaymentComplete, onPrevious }: Props) {
  const l = ui[lang] ?? ui.en
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [personalId, setPersonalId] = useState("")
  const [checkId, setCheckId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [paymentVerified, setPaymentVerified] = useState(false)

  const paymeMerchantId = process.env.NEXT_PUBLIC_PAYME_MERCHANT_ID ?? ""
  const paymeAmountTiyin = String(Math.round(Number(amount) * 100))
  const paymeLang = lang === "de" ? "ru" : (["ru", "uz", "en"].includes(lang) ? lang : "ru")
  const paymeCheckoutUrl = process.env.NEXT_PUBLIC_PAYME_ENV === "test"
    ? "https://test.paycom.uz"
    : "https://checkout.paycom.uz"

  const canVerify = !!selectedMethod && personalId.trim().length > 0 && checkId.trim().length > 0

  const handleVerify = async () => {
    if (!selectedMethod) { toast.error(l.errMethod); return }
    if (!personalId.trim()) { toast.error(l.errPersonalId); return }
    if (!checkId.trim()) { toast.error(l.errCheckId); return }
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
      <div className="mb-8 rounded-xl border border-orange-200 bg-orange-50 p-6">
        <p className="text-sm text-slate-600 mb-1">{l.amount}</p>
        <p className="text-4xl font-bold text-primary">
          {Number(amount).toLocaleString()} <span className="text-2xl">UZS</span>
        </p>
      </div>

      {/* Payme hidden form for checkout integration */}
      {paymeMerchantId && (
        <form id="payme-form" action={`${paymeCheckoutUrl}/`} method="POST" style={{ display: "none" }}>
          <input type="hidden" name="merchant" value={paymeMerchantId} />
          <input type="hidden" name="amount" value={paymeAmountTiyin} />
          <input type="hidden" name="account[order_id]" value={String(registrationId)} />
          <input type="hidden" name="lang" value={paymeLang} />
          <input type="hidden" name="description" value={`TELC exam registration #${registrationId}`} />
        </form>
      )}

      {/* Payment Method Selection */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          {l.selectMethod}<span className="text-red-500 ml-0.5">*</span>
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {METHODS.map(m => (
            <button key={m.id} type="button"
              onClick={() => setSelectedMethod(m.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                selectedMethod === m.id ? m.colorSelected : m.colorBase
              }`}>
              {/* Provider logo */}
              <div className="w-20 h-10 flex items-center justify-center">
                {m.logo ? (
                  <img src={m.logo} alt={m.id} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-3xl">🏦</span>
                )}
              </div>
              <span className="text-sm font-semibold text-slate-900">{l[m.id as keyof typeof l]}</span>
              {/* QR thumbnail for Paynet and Payme */}
              <div className="mt-1 w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50">
                {m.id !== "other" ? (
                  <img src={QR_IMAGE} alt="QR Code" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-3xl">🏦</span>
                )}
              </div>
              {selectedMethod === m.id && (
                <span className="text-xs font-semibold text-primary flex items-center gap-1">
                  <Check size={12} /> Selected
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Instructions */}
      {selectedMethod && !paymentVerified && (
        selectedMethod === "other" ? (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 overflow-hidden">
            <div className="px-5 py-3 border-b border-green-200">
              <h4 className="font-semibold text-green-900 text-center">{l.instructions}</h4>
            </div>
            <iframe
              src={BANK_PDF}
              className="w-full"
              style={{ height: 420, border: "none" }}
              title="Bank Payment Info"
            />
          </div>
        ) : (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h4 className="font-semibold text-blue-900 mb-4 text-center">{l.instructions}</h4>
            <div className="flex justify-center mb-4">
              <img
                src={QR_IMAGE}
                alt="QR Code"
                className="w-44 h-44 object-contain rounded-lg border border-blue-100 bg-white p-1"
              />
            </div>
            <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
              <li>{l.step1}</li>
              <li>{l.step2}</li>
              <li>{l.step3}</li>
            </ol>
          </div>
        )
      )}

      {/* Post-payment confirmation fields */}
      {selectedMethod && !paymentVerified && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {l.personalId}<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={personalId}
              onChange={(e) => setPersonalId(e.target.value)}
              placeholder={l.personalIdPlaceholder}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {l.checkId}<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={checkId}
              onChange={(e) => setCheckId(e.target.value)}
              placeholder={l.checkIdPlaceholder}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
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

      <div className="flex gap-4">
        <Button type="button" variant="outline" size="lg" className="flex-1"
          disabled={isVerifying || paymentVerified} onClick={onPrevious}>
          {l.previous}
        </Button>
        {!paymentVerified ? (
          <Button type="button" size="lg" className="flex-1"
            disabled={!canVerify || isVerifying} onClick={handleVerify}>
            {isVerifying && <Loader2 size={16} className="animate-spin mr-2" />}
            {isVerifying ? l.verifying : l.verifyBtn}
          </Button>
        ) : (
          <Button type="button" size="lg" className="flex-1" onClick={onPaymentComplete}>
            {l.submit}
          </Button>
        )}
      </div>
    </div>
  )
}
