"use client"

import { useEffect } from "react"
import { CheckCircle, Download, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  registrationId: number
  formData: any
  lang: string
}

const ui: Record<string, Record<string, string>> = {
  en: {
    title: "You have successfully registered!", regId: "Registration ID",
    confirmDetails: "Confirmation Details", name: "Full Name", passport: "Passport / ID",
    region: "Region", date: "Date", time: "Time", level: "Level",
    address: "Venue Address", contact: "Contact", registeredAt: "Registered At",
    reminders: "Reminders",
    r1: "Arrive 30 minutes before the exam",
    r2: "Bring your passport or national ID card (original)",
    r3: "Latecomers will not be admitted",
    r4: "Bring a printed copy of this confirmation (PDF) with payment receipt",
    emailNote: "A confirmation email has been sent to",
    download: "Download / Print Ticket", backHome: "Back to Home",
  },
  de: {
    title: "Sie haben sich erfolgreich angemeldet!", regId: "Anmelde-ID",
    confirmDetails: "Bestätigungsdetails", name: "Vollständiger Name", passport: "Reisepass / Ausweis",
    region: "Region", date: "Datum", time: "Zeit", level: "Stufe",
    address: "Prüfungsort", contact: "Kontakt", registeredAt: "Angemeldet am",
    reminders: "Erinnerungen",
    r1: "Kommen Sie 30 Minuten vor der Prüfung",
    r2: "Bringen Sie Ihren Reisepass oder Personalausweis mit (Original)",
    r3: "Zu spät Kommende werden nicht zugelassen",
    r4: "Drucken Sie diese Bestätigung (PDF) mit Zahlungsbeleg aus und bringen Sie sie mit",
    emailNote: "Eine Bestätigungs-E-Mail wurde gesendet an",
    download: "Ticket herunterladen / drucken", backHome: "Zur Startseite",
  },
  ru: {
    title: "Вы успешно зарегистрированы!", regId: "ID регистрации",
    confirmDetails: "Детали подтверждения", name: "Полное имя", passport: "Паспорт / ID",
    region: "Регион", date: "Дата", time: "Время", level: "Уровень",
    address: "Адрес места проведения", contact: "Контакт", registeredAt: "Дата регистрации",
    reminders: "Напоминания",
    r1: "Приходите за 30 минут до экзамена",
    r2: "Возьмите паспорт или удостоверение личности (оригинал)",
    r3: "Опоздавших не допускают",
    r4: "Распечатайте это подтверждение (PDF) с квитанцией об оплате",
    emailNote: "Письмо с подтверждением отправлено на",
    download: "Скачать / Распечатать билет", backHome: "На главную",
  },
  uz: {
    title: "Siz muvaffaqiyatli ro'yxatdan o'tdingiz!", regId: "Ro'yxat ID",
    confirmDetails: "Tasdiqlash ma'lumotlari", name: "To'liq ism", passport: "Pasport / ID",
    region: "Hudud", date: "Sana", time: "Vaqt", level: "Daraja",
    address: "Imtihon manzili", contact: "Aloqa", registeredAt: "Ro'yxat vaqti",
    reminders: "Eslatmalar",
    r1: "Imtihonga 30 daqiqa oldin keling",
    r2: "Pasport yoki ID kartani (original) olib keling",
    r3: "Kech qolganlar kiritilmaydi",
    r4: "Ushbu tasdiqlash (PDF) to'lov cheki bilan chop etilgan nusxasini olib keling",
    emailNote: "Tasdiqlash xati yuborildi:",
    download: "Chiptani yuklab olish / chop etish", backHome: "Bosh sahifaga",
  },
}

const regionLabels: Record<string, Record<string, string>> = {
  en: { tashkent: "Tashkent", samarkand: "Samarkand", fergana: "Fergana", kashkadarya: "Kashkadarya", bukhara: "Bukhara", urgench: "Urgench" },
  de: { tashkent: "Taschkent", samarkand: "Samarkand", fergana: "Fergana", kashkadarya: "Kaschkadarya", bukhara: "Buchara", urgench: "Urgentsch" },
  ru: { tashkent: "Ташкент", samarkand: "Самарканд", fergana: "Фергана", kashkadarya: "Кашкадарья", bukhara: "Бухара", urgench: "Ургенч" },
  uz: { tashkent: "Toshkent", samarkand: "Samarqand", fergana: "Farg'ona", kashkadarya: "Qashqadaryo", bukhara: "Buxoro", urgench: "Urganch" },
}

// Fallback contact info per region
const regionContact: Record<string, { phone: string; email: string }> = {
  samarkand: { phone: "+998 77 178 06 66", email: "info@profi-deutsch.uz" },
}

function generatePDF(registrationId: number, formData: any, lang: string) {
  const l = ui[lang] ?? ui.en
  const rl = regionLabels[lang] ?? regionLabels.en
  const contact = regionContact[formData.region] ?? {}

  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString() } catch { return d }
  }
  const fmtDateTime = (d: string) => {
    try { return new Date(d).toLocaleString(undefined, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) } catch { return d }
  }

  const address = (formData.examAddress || "").replace(/\n/g, "<br>")
  const contactLine = [contact.phone, contact.email].filter(Boolean).join(" · ")

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<title>PROFI DEUTSCH – ${l.regId} #${registrationId}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 13px; color: #1e293b; background: #fff; padding: 24px; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #130080; padding-bottom: 12px; margin-bottom: 20px; }
  .header h1 { font-size: 22px; color: #130080; font-weight: 800; letter-spacing: -0.5px; }
  .header .reg-id { font-size: 13px; color: #64748b; text-align: right; }
  .reg-id strong { display: block; font-size: 18px; color: #130080; }
  .section { margin-bottom: 18px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; }
  .field label { font-size: 10px; color: #94a3b8; display: block; margin-bottom: 2px; }
  .field span { font-weight: 600; color: #1e293b; }
  .reminders { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 12px 14px; margin-bottom: 18px; }
  .reminders h3 { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #92400e; margin-bottom: 8px; }
  .reminders ul { list-style: none; }
  .reminders li { padding: 3px 0; color: #78350f; font-size: 12px; }
  .reminders li::before { content: "• "; font-weight: bold; }
  .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center; font-size: 11px; color: #94a3b8; margin-top: 18px; }
  .badge { display: inline-block; background: #130080; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 999px; margin-bottom: 6px; }
  @media print {
    body { padding: 0; }
    @page { margin: 16mm; }
  }
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>PROFI DEUTSCH</h1>
    <div style="font-size:11px;color:#64748b;">Ta'lim va Imtihon Markazi · Bildungs- und Prüfungszentrum</div>
  </div>
  <div class="reg-id">
    ${l.regId}<strong>#${registrationId}</strong>
  </div>
</div>

<div class="section">
  <div class="section-title">${l.confirmDetails}</div>
  <div class="grid">
    <div class="field"><label>${l.name}</label><span>${formData.firstName ?? ""} ${formData.lastName ?? ""}</span></div>
    <div class="field"><label>${l.passport}</label><span>${formData.passportNumber ?? "—"}</span></div>
    <div class="field"><label>Email</label><span>${formData.email ?? "—"}</span></div>
    <div class="field"><label>${l.level}</label><span>${formData.levelName ?? formData.levelId ?? "—"}</span></div>
    <div class="field"><label>${l.region}</label><span>${rl[formData.region] ?? formData.region ?? "—"}</span></div>
    <div class="field"><label>${l.date}</label><span>${formData.selectedDate ? fmtDate(formData.selectedDate) : "—"}</span></div>
    <div class="field"><label>${l.time}</label><span>${formData.selectedTime ?? "—"}</span></div>
    <div class="field"><label>${l.registeredAt}</label><span>${formData.registeredAt ? fmtDateTime(formData.registeredAt) : fmtDateTime(new Date().toISOString())}</span></div>
    ${address ? `<div class="field" style="grid-column:1/-1"><label>${l.address}</label><span>${address}</span></div>` : ""}
    ${contactLine ? `<div class="field" style="grid-column:1/-1"><label>${l.contact}</label><span>${contactLine}</span></div>` : ""}
  </div>
</div>

<div class="reminders">
  <h3>${l.reminders}</h3>
  <ul>
    <li>${l.r1}</li>
    <li>${l.r2}</li>
    <li>${l.r3}</li>
    <li>${l.r4}</li>
  </ul>
</div>

<div class="footer">
  <div class="badge">PROFI DEUTSCH</div><br/>
  profi-deutsch.uz · info@profi-deutsch.uz · +998 77 178 06 66
</div>

<script>window.onload = function() { window.print(); }</script>
</body>
</html>`

  const win = window.open("", "_blank", "width=800,height=700")
  if (!win) return
  win.document.write(html)
  win.document.close()
}

export default function SuccessScreen({ registrationId, formData, lang }: Props) {
  const l = ui[lang] ?? ui.en
  const rl = regionLabels[lang] ?? regionLabels.en
  const contact = regionContact[formData.region] ?? {}

  // Send confirmation email once on mount — fire-and-forget
  useEffect(() => {
    fetch("/api/telc/send-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        passportNumber: formData.passportNumber,
        levelName: formData.levelName,
        region: formData.region,
        selectedDate: formData.selectedDate,
        selectedTime: formData.selectedTime,
        examAddress: formData.examAddress,
        lang,
      }),
    }).catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fmtDateTime = (d: string) =>
    new Date(d).toLocaleString(undefined, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="text-center mb-8">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{l.title}</h2>
        <p className="text-slate-500 text-sm">{l.regId}: #{registrationId}</p>
      </div>

      {/* Confirmation Details */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 mb-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">{l.confirmDetails}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">{l.name}</p>
            <p className="font-semibold text-slate-900">{formData.firstName} {formData.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">{l.passport}</p>
            <p className="font-semibold text-slate-900 font-mono">{formData.passportNumber ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">{l.region}</p>
            <p className="font-semibold text-slate-900">{rl[formData.region] ?? formData.region}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">{l.level}</p>
            <p className="font-semibold text-slate-900">{formData.levelName ?? formData.levelId}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">{l.date}</p>
            <p className="font-semibold text-slate-900">
              {formData.selectedDate ? new Date(formData.selectedDate).toLocaleDateString() : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">{l.time}</p>
            <p className="font-semibold text-slate-900">{formData.selectedTime ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">{l.registeredAt}</p>
            <p className="font-semibold text-slate-900">
              {fmtDateTime(formData.registeredAt || new Date().toISOString())}
            </p>
          </div>
          {formData.examAddress && (
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-500 mb-1">{l.address}</p>
              <p className="font-semibold text-slate-900 whitespace-pre-line">{formData.examAddress}</p>
            </div>
          )}
          {(contact.phone || contact.email) && (
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-500 mb-1">{l.contact}</p>
              <p className="font-semibold text-slate-900">
                {[contact.phone, contact.email].filter(Boolean).join(" · ")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reminders */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-900 mb-3">{l.reminders}</h3>
        <div className="space-y-2">
          {[["⏰", l.r1], ["🛂", l.r2], ["⚠️", l.r3], ["🖨️", l.r4]].map(([icon, text]) => (
            <div key={text} className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
              <span className="text-lg shrink-0">{icon}</span>
              <p className="text-sm text-amber-900">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Email notice */}
      <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
        ✓ {l.emailNote} <strong>{formData.email}</strong>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" size="lg" className="flex-1"
          onClick={() => generatePDF(registrationId, formData, lang)}>
          <Download size={18} className="mr-2" />
          {l.download}
        </Button>
        <Button asChild size="lg" className="flex-1">
          <Link href={`/${lang}`}>
            <Home size={18} className="mr-2" />
            {l.backHome}
          </Link>
        </Button>
      </div>
    </div>
  )
}
