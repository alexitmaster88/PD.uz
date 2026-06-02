# Business Context

## About ProfiDeutsch Uzbekistan

ProfiDeutsch is a German language school based in Uzbekistan. It offers German language courses at all levels (A1–C1) and is an official test center for **TELC** (The European Language Certificates) — widely recognized official German language certificates required for university admission, immigration, and professional certification.

The primary audience is Uzbek citizens seeking to:
- Learn German for immigration to Germany/Austria/Switzerland
- Obtain official TELC certificates for university enrollment (Studienkolleg, university admission)
- Obtain work permits or Blue Card eligibility
- Improve professional German for business contexts

---

## Website Purpose

`PD.uz` serves two purposes:

1. **Marketing site** — Attracts students and communicates course offerings, school identity, social proof (testimonials, reviews), location, and contact information. Supports four languages (de/en/ru/uz) because the audience spans German learners at all levels.

2. **TELC exam registration platform** — Allows prospective exam-takers to register for scheduled TELC exam sessions entirely online, with payment via Uzbek payment networks (Click, Payme, Paynet).

---

## TELC Exam Registration — User Flow

### Step 1: Personal Information + Email Verification
- User enters: first name, last name, phone number, email, passport number
- An OTP is sent to their email (6-digit code, valid 10 minutes)
- User enters OTP to verify email before proceeding
- Demo OTP `"123456"` is available for testing

### Step 2: Exam Selection
- User selects: region (Tashkent, Samarkand, Fergana, Kashkadarya, Bukhara, Urgench), exam level (A1–C1), available date, available time
- Available exams are loaded live from the database filtered by region + level
- On submit, a registration record is created in `pending` status
- Exam fee is determined by the level's current price in `exam_levels`

### Step 3: Payment
- User sees the exam fee (in UZS) and selects a payment method: Click, Payme, or Paynet
- Payme: real QR code + Pay button rendered via Payme CDN checkout script; backend Merchant API at `/api/payme` handles the payment lifecycle
- Paynet: user is given their booking ID to enter at a Paynet terminal; backend at `/api/paynet` handles the inbound JSON-RPC call
- Click: placeholder QR icon — SDK integration not yet implemented
- On confirmed payment, booking status transitions from `pending_payment` → `confirmed`

### Success Screen
- Shows registration summary: name, exam, date, time, location
- Offers ticket download (PDF generation not yet implemented — stub alert)
- Shows contact information for questions

---

## Marketing Site Locations Map

`components/map-section.tsx` shows an interactive multi-location map. The user picks a city from a sidebar list; the right panel renders a Google Maps embed (via `maps.google.com/maps?q=lat,lng&z=13&output=embed`) and the location's address, phone, email, and offered courses. Location names are pulled from translation keys (`telc_booking_city_*`).

Six locations:

| Map key | City | Coordinates |
|---------|------|-------------|
| `tashkent_city` | Tashkent | 41.337767, 69.253528 |
| `samarkand` | Samarkand | 39.654388, 66.975628 |
| `bukhara` | Bukhara | 39.767927, 64.421998 |
| `fergana` | Fergana | 40.387054, 71.783005 |
| `khorezm` | Urgench | 41.550942, 60.631594 |
| `qashqadaryo` | Karshi | 38.857138, 65.789058 |

Note: map keys (`tashkent_city`, `khorezm`, `qashqadaryo`) differ from the TELC exam region codes (`tashkent`, `urgench`, `kashkadarya`) — they are independent systems.

---

## Exam Regions

Six exam centers:

| Code | Uzbek | Russian | German |
|------|-------|---------|--------|
| tashkent | Toshkent | Ташкент | Taschkent |
| samarkand | Samarqand | Самарканд | Samarkand |
| fergana | Farg'ona | Фергана | Fergana |
| kashkadarya | Qashqadaryo | Кашкадарья | Kaschkadarya |
| bukhara | Buxoro | Бухара | Buchara |
| urgench | Urganch | Ургенч | Urgentsch |

---

## Admin Capabilities

Admin dashboard at `/admin` (single admin user via `ADMIN_EMAIL` env var):

- **Manage Exams** — Schedule new exam sessions: pick region, level, date, start/end time, capacity, optional address. Delete upcoming exams.
- **Manage Pricing** — Update the exam fee per language level (A1–C1). Prices stored in UZS.
- **View Registrations** — List all registrations with status, expandable detail view per candidate.

---

## Payment Ecosystem

Uzbekistan has three major consumer payment networks used in the product:

| Gateway | Integration type | Status |
|---------|-----------------|--------|
| **Paynet** | Inbound JSON-RPC 2.0 (Paynet calls us) | Fully implemented (`/api/paynet`) |
| **Payme** | Inbound JSON-RPC 2.0 (Payme calls us) + CDN QR | Fully implemented (`/api/payme` + CDN checkout script) |
| **Click** | Outbound redirect / QR | QR placeholder only — Click SDK integration pending |

Paynet is widely used at physical kiosks; Payme is dominant for mobile QR payments via the Payme app.

---

## Contact & Social

- **Telegram (contact/courses):** `https://t.me/profi_deutsch_uz`
- **Telegram (header button + contact form):** `https://t.me/UZ_profideutsch` (inconsistency — verify before changing)
- **Email:** `info@profi-deutsch.uz` (shown in map-section per-location cards)
- **Phone:** `+998 77 178 06 66` (shown in map-section per-location cards)
- **Address:** Fetched from `tashkent_address` translation key (previously hardcoded)

---

## Known Incomplete Features

| Feature | Current state | Notes |
|---------|--------------|-------|
| Email delivery | `console.log` stub | Needs Resend or SendGrid |
| OTP emails | Logged to console only | Works end-to-end once email is wired |
| Ticket PDF | Alert stub in `SuccessScreen.tsx` | Needs PDF generation library |
| Click QR | Placeholder icon | Needs Click API/SDK integration |
| Contact form | Submits via Telegram deep-link | Opens `t.me/UZ_profideutsch?text=…` with pre-filled fields; no server-side storage |
| Admin auth gate | No client-side check | Relies on server-side `adminProcedure` |
