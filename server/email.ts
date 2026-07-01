import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'PROFI DEUTSCH <no-reply@profi-deutsch.uz>'

const regionNames: Record<string, Record<string, string>> = {
  en: { tashkent: "Tashkent", samarkand: "Samarkand", fergana: "Fergana", kashkadarya: "Kashkadarya", bukhara: "Bukhara", urgench: "Urgench" },
  de: { tashkent: "Taschkent", samarkand: "Samarkand", fergana: "Fergana", kashkadarya: "Kaschkadarya", bukhara: "Buchara", urgench: "Urgentsch" },
  ru: { tashkent: "Ташкент", samarkand: "Самарканд", fergana: "Фергана", kashkadarya: "Кашкадарья", bukhara: "Бухара", urgench: "Ургенч" },
  uz: { tashkent: "Toshkent", samarkand: "Samarqand", fergana: "Farg'ona", kashkadarya: "Qashqadaryo", bukhara: "Buxoro", urgench: "Urganch" },
}

const emailStrings: Record<string, Record<string, string>> = {
  en: {
    subject: "telc Exam Registration Confirmation",
    greeting: "Dear",
    intro: "Your telc exam registration has been received. Below are your confirmation details:",
    regId: "Registration ID", name: "Full Name", passport: "Passport / ID",
    level: "Exam Level", region: "Region", date: "Exam Date", time: "Start Time",
    address: "Venue Address",
    remindersTitle: "Important Reminders",
    r1: "Arrive 30 minutes before the exam start time",
    r2: "Bring your passport or national ID card (original)",
    r3: "Bring a printed copy of this confirmation with your payment receipt",
    paymentTitle: "Payment Status",
    paymentNote: "Your payment is currently pending verification. Our team will review and confirm your registration. You will be notified once payment is verified.",
    footer: "PROFI DEUTSCH — Ta'lim va Imtihon Markazi · Bildungs- und Prüfungszentrum",
    contact: "profi-deutsch.uz · info@profi-deutsch.uz · +998 77 178 06 66",
  },
  de: {
    subject: "telc Prüfungsanmeldung Bestätigung",
    greeting: "Sehr geehrte(r)",
    intro: "Ihre telc Prüfungsanmeldung ist eingegangen. Unten finden Sie Ihre Bestätigungsdetails:",
    regId: "Anmelde-ID", name: "Vollständiger Name", passport: "Reisepass / Ausweis",
    level: "Prüfungsstufe", region: "Region", date: "Prüfungsdatum", time: "Startzeit",
    address: "Prüfungsort",
    remindersTitle: "Wichtige Hinweise",
    r1: "Erscheinen Sie 30 Minuten vor Prüfungsbeginn",
    r2: "Bringen Sie Ihren Reisepass oder Personalausweis mit (Original)",
    r3: "Bringen Sie einen Ausdruck dieser Bestätigung mit Zahlungsbeleg mit",
    paymentTitle: "Zahlungsstatus",
    paymentNote: "Ihre Zahlung wird derzeit geprüft. Unser Team wird Ihre Anmeldung überprüfen und bestätigen.",
    footer: "PROFI DEUTSCH — Ta'lim va Imtihon Markazi · Bildungs- und Prüfungszentrum",
    contact: "profi-deutsch.uz · info@profi-deutsch.uz · +998 77 178 06 66",
  },
  ru: {
    subject: "Подтверждение регистрации на экзамен telc",
    greeting: "Уважаемый(ая)",
    intro: "Ваша регистрация на экзамен telc принята. Ниже приведены данные подтверждения:",
    regId: "ID регистрации", name: "Полное имя", passport: "Паспорт / ID",
    level: "Уровень экзамена", region: "Регион", date: "Дата экзамена", time: "Время начала",
    address: "Адрес места проведения",
    remindersTitle: "Важные напоминания",
    r1: "Приходите за 30 минут до начала экзамена",
    r2: "Возьмите паспорт или удостоверение личности (оригинал)",
    r3: "Возьмите распечатанную копию этого подтверждения с квитанцией об оплате",
    paymentTitle: "Статус оплаты",
    paymentNote: "Ваш платёж ожидает проверки. Наша команда проверит и подтвердит вашу регистрацию.",
    footer: "PROFI DEUTSCH — Ta'lim va Imtihon Markazi · Bildungs- und Prüfungszentrum",
    contact: "profi-deutsch.uz · info@profi-deutsch.uz · +998 77 178 06 66",
  },
  uz: {
    subject: "telc imtihoniga ro'yxatdan o'tish tasdiqi",
    greeting: "Hurmatli",
    intro: "telc imtihoniga ro'yxatdan o'tishingiz qabul qilindi. Quyida tasdiqlash ma'lumotlari keltirilgan:",
    regId: "Ro'yxat ID", name: "To'liq ism", passport: "Pasport / ID",
    level: "Imtihon darajasi", region: "Hudud", date: "Imtihon sanasi", time: "Boshlanish vaqti",
    address: "Imtihon manzili",
    remindersTitle: "Muhim eslatmalar",
    r1: "Imtihon boshlanishidan 30 daqiqa oldin keling",
    r2: "Pasport yoki ID kartani (original) olib keling",
    r3: "Ushbu tasdiqnomaning to'lov cheki bilan chop etilgan nusxasini olib keling",
    paymentTitle: "To'lov holati",
    paymentNote: "To'lovingiz hozirda tekshirilmoqda. Jamoamiz ro'yxatdan o'tishingizni ko'rib chiqadi va tasdiqlaydi.",
    footer: "PROFI DEUTSCH — Ta'lim va Imtihon Markazi · Bildungs- und Prüfungszentrum",
    contact: "profi-deutsch.uz · info@profi-deutsch.uz · +998 77 178 06 66",
  },
}

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email] OTP for ${email}: ${otp}`)
    return
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your telc exam verification code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;background:#f8fafc;border-radius:12px">
        <h2 style="color:#130080;margin-top:0">Email Verification</h2>
        <p style="color:#475569">Use the code below to verify your email address for telc exam registration:</p>
        <div style="background:#fff;border:2px solid #e2e8f0;border-radius:8px;padding:24px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#130080">${otp}</span>
        </div>
        <p style="color:#64748b;font-size:14px">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
        <p style="color:#94a3b8;font-size:12px">PROFI DEUTSCH — profi-deutsch.uz · +998 77 178 06 66</p>
      </div>
    `,
  })
  if (error) throw new Error(`Resend: ${error.message}`)
}

export async function sendRegistrationConfirmation(
  email: string,
  data: {
    registrationId: number
    firstName: string
    lastName: string
    passportNumber?: string
    level: string
    region: string
    examDate: Date
    startTime: string
    examAddress?: string
    lang?: string
  }
): Promise<void> {
  const lang = data.lang && emailStrings[data.lang] ? data.lang : 'en'
  const s = emailStrings[lang]
  const rl = regionNames[lang] ?? regionNames.en

  const dateStr = data.examDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const regionLabel = rl[data.region] ?? data.region
  const fullName = `${data.firstName} ${data.lastName}`

  const rows = [
    [s.regId, `#${data.registrationId}`],
    [s.name, fullName],
    ...(data.passportNumber ? [[s.passport, data.passportNumber]] : []),
    [s.level, data.level],
    [s.region, regionLabel],
    [s.date, dateStr],
    [s.time, data.startTime],
    ...(data.examAddress ? [[s.address, data.examAddress.replace(/\n/g, ', ')]] : []),
  ]

  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email] Registration confirmation for ${email}:`, data)
    return
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${s.subject} — #${data.registrationId}`,
    html: `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

  <!-- Header -->
  <div style="background:#130080;padding:28px 32px">
    <p style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px">PROFI DEUTSCH</p>
    <p style="margin:4px 0 0;color:#a5b4fc;font-size:12px">Ta'lim va Imtihon Markazi · Bildungs- und Prüfungszentrum</p>
  </div>

  <!-- Body -->
  <div style="padding:32px">
    <h2 style="margin:0 0 8px;color:#130080;font-size:20px">${s.subject}</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:14px">${s.greeting} ${data.firstName},<br>${s.intro}</p>

    <!-- Details table -->
    <div style="background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:24px">
      <table style="width:100%;border-collapse:collapse">
        ${rows.map(([label, value], i) => `
        <tr style="background:${i % 2 === 0 ? '#fff' : '#f8fafc'}">
          <td style="padding:10px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #e2e8f0;width:45%">${label}</td>
          <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0">${value}</td>
        </tr>`).join('')}
      </table>
    </div>

    <!-- Reminders -->
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:16px 20px;margin-bottom:24px">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;color:#92400e;letter-spacing:0.5px">${s.remindersTitle}</p>
      <ul style="margin:0;padding-left:18px;color:#78350f;font-size:13px;line-height:1.8">
        <li>${s.r1}</li>
        <li>${s.r2}</li>
        <li>${s.r3}</li>
      </ul>
    </div>

    <!-- Payment status -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 20px">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;color:#1e40af;letter-spacing:0.5px">${s.paymentTitle}</p>
      <p style="margin:0;font-size:13px;color:#1e3a8a">${s.paymentNote}</p>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center">
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#130080">${s.footer}</p>
    <p style="margin:0;font-size:11px;color:#94a3b8">${s.contact}</p>
  </div>

</div>
</body>
</html>`,
  })

  if (error) throw new Error(`Resend: ${error.message}`)
}
