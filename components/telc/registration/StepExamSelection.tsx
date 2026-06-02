"use client"

import { useState, useMemo, useEffect } from "react"
import { Calendar, Clock, Loader2, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Props {
  data: any
  lang: string
  existingRegistrationId?: number | null
  preloadedExams?: any[]
  preloadedLevels?: any[]
  onDataChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  onRegistrationComplete: (regId: number) => void
}

const regionLabels: Record<string, Record<string, string>> = {
  en: { tashkent: "Tashkent", samarkand: "Samarkand", fergana: "Fergana", kashkadarya: "Kashkadarya", bukhara: "Bukhara", urgench: "Urgench" },
  de: { tashkent: "Taschkent", samarkand: "Samarkand", fergana: "Fergana", kashkadarya: "Kaschkadarya", bukhara: "Buchara", urgench: "Urgentsch" },
  ru: { tashkent: "Ташкент", samarkand: "Самарканд", fergana: "Фергана", kashkadarya: "Кашкадарья", bukhara: "Бухара", urgench: "Ургенч" },
  uz: { tashkent: "Toshkent", samarkand: "Samarqand", fergana: "Farg'ona", kashkadarya: "Qashqadaryo", bukhara: "Buxoro", urgench: "Urganch" },
}

const regionInfo: Record<string, { address: string; phone: string; email: string }> = {
  samarkand: {
    address: "Samarqand shahri, O'zbekiston ko'chasi, 63 uy, 140105\n(Yoshlar kreativ shaharchasi)",
    phone: "+998 77 178 06 66",
    email: "info@profi-deutsch.uz",
  },
}

const ui: Record<string, Record<string, string>> = {
  en: {
    title: "Exam Selection", region: "Region", level: "Level", date: "Date", time: "Time",
    selectRegion: "Select region", selectLevel: "Select level", selectDate: "Select date", selectTime: "Select time",
    noExams: "No exams available for selected region and level",
    previous: "← Previous", next: "Next →", summary: "Summary",
    submitting: "Creating registration...", loading: "Loading exam data...",
    errRegion: "Select a region", errLevel: "Select a level", errDate: "Select a date", errTime: "Select a time",
    errFail: "Failed to create registration",
    full: "Full", examFull: "This exam date is fully booked.", suggestAlt: "Available alternative dates:", spots: "spots left",
    labelAddress: "Venue Address", labelContact: "Contact",
    docReminderTitle: "Required documents — bring with you 30 minutes before the exam:",
    docPassport: "Passport or national ID card (original)",
    docPrint: "Printed confirmation (PDF) with payment receipt",
  },
  de: {
    title: "Prüfung wählen", region: "Region", level: "Stufe", date: "Datum", time: "Zeit",
    selectRegion: "Region wählen", selectLevel: "Stufe wählen", selectDate: "Datum wählen", selectTime: "Zeit wählen",
    noExams: "Keine Prüfungen verfügbar",
    previous: "← Zurück", next: "Weiter →", summary: "Zusammenfassung",
    submitting: "Anmeldung wird erstellt...", loading: "Prüfungsdaten werden geladen...",
    errRegion: "Wählen Sie eine Region", errLevel: "Wählen Sie eine Stufe", errDate: "Wählen Sie ein Datum", errTime: "Wählen Sie eine Zeit",
    errFail: "Anmeldung fehlgeschlagen",
    full: "Voll", examFull: "Dieser Prüfungstermin ist ausgebucht.", suggestAlt: "Verfügbare alternative Termine:", spots: "Plätze frei",
    labelAddress: "Prüfungsort", labelContact: "Kontakt",
    docReminderTitle: "Erforderliche Dokumente — 30 Minuten vor der Prüfung mitbringen:",
    docPassport: "Reisepass oder Personalausweis (Original)",
    docPrint: "Ausgedruckte Bestätigung (PDF) mit Zahlungsbeleg",
  },
  ru: {
    title: "Выбор экзамена", region: "Регион", level: "Уровень", date: "Дата", time: "Время",
    selectRegion: "Выберите регион", selectLevel: "Выберите уровень", selectDate: "Выберите дату", selectTime: "Выберите время",
    noExams: "Нет доступных экзаменов",
    previous: "← Назад", next: "Далее →", summary: "Итоги",
    submitting: "Создание записи...", loading: "Загрузка данных...",
    errRegion: "Выберите регион", errLevel: "Выберите уровень", errDate: "Выберите дату", errTime: "Выберите время",
    errFail: "Ошибка создания записи",
    full: "Занято", examFull: "Этот экзамен полностью заполнен.", suggestAlt: "Доступные альтернативные даты:", spots: "мест осталось",
    labelAddress: "Адрес места проведения", labelContact: "Контакт",
    docReminderTitle: "Необходимые документы — принести за 30 минут до экзамена:",
    docPassport: "Паспорт или удостоверение личности (оригинал)",
    docPrint: "Распечатанное подтверждение (PDF) с квитанцией об оплате",
  },
  uz: {
    title: "Imtihon tanlash", region: "Hudud", level: "Daraja", date: "Sana", time: "Vaqt",
    selectRegion: "Hudud tanlang", selectLevel: "Daraja tanlang", selectDate: "Sana tanlang", selectTime: "Vaqt tanlang",
    noExams: "Tanlangan hudud va darajada imtihon yo'q",
    previous: "← Oldingi", next: "Keyingi →", summary: "Xulosa",
    submitting: "Ro'yxat yaratilmoqda...", loading: "Ma'lumotlar yuklanmoqda...",
    errRegion: "Hudud tanlang", errLevel: "Daraja tanlang", errDate: "Sana tanlang", errTime: "Vaqt tanlang",
    errFail: "Ro'yxatdan o'tishda xato",
    full: "To'liq", examFull: "Bu imtihon sanasi to'lib ketgan.", suggestAlt: "Mavjud muqobil sanalar:", spots: "joy qoldi",
    labelAddress: "Imtihon manzili", labelContact: "Aloqa",
    docReminderTitle: "Kerakli hujjatlar — imtihon kuni imtihon vaqtidan 30 minut oldin o'zingiz bilan olib keling:",
    docPassport: "Pasport yoki ID karta (original)",
    docPrint: "To'lov cheki bilan tasdiqlash (PDF) chop etilgan nusxasi",
  },
}

function todayStart() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export default function StepExamSelection({
  data, lang, existingRegistrationId,
  preloadedExams, preloadedLevels,
  onDataChange, onNext, onPrevious, onRegistrationComplete,
}: Props) {
  const l = ui[lang] ?? ui.en
  const rl = regionLabels[lang] ?? regionLabels.en
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedDate, setSelectedDate] = useState(data.selectedDate ?? "")
  const [selectedTime, setSelectedTime] = useState(data.selectedTime ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use preloaded data if available; fall back to local fetch only as a safety net
  const [localExams, setLocalExams] = useState<any[] | null>(null)
  const [localLevels, setLocalLevels] = useState<any[] | null>(null)

  useEffect(() => {
    // Only fetch locally if parent didn't prefetch
    if (preloadedExams !== undefined && preloadedLevels !== undefined) return
    Promise.all([
      fetch("/api/telc/exams?future=true").then(r => r.json()).catch(() => []),
      fetch("/api/telc/exam-levels").then(r => r.json()).catch(() => []),
    ]).then(([exams, levels]) => {
      setLocalExams(Array.isArray(exams) ? exams : [])
      setLocalLevels(Array.isArray(levels) ? levels : [])
    })
  }, [preloadedExams, preloadedLevels])

  const allExams: any[] = preloadedExams ?? localExams ?? []
  const levels: any[] = preloadedLevels ?? localLevels ?? []
  const isLoading = preloadedExams === undefined && localExams === null

  // Regions that have at least one upcoming exam — derived client-side, no extra fetch
  const activeRegions = useMemo(() => {
    const seen = new Set<string>()
    allExams.forEach(e => seen.add(e.region))
    return Array.from(seen)
  }, [allExams])

  // Filter exams client-side — eliminates the per-interaction network request
  const exams = useMemo(() => {
    if (!data.region || !data.levelId) return []
    return allExams.filter(e =>
      e.region === data.region &&
      String(e.level_id) === String(data.levelId) &&
      new Date(e.exam_date) >= todayStart()
    )
  }, [allExams, data.region, data.levelId])

  const availableDates = useMemo(() => {
    const dates = new Set<string>()
    exams.forEach(e => dates.add(e.exam_date.split("T")[0]))
    return Array.from(dates).sort()
  }, [exams])

  const isDateFull = useMemo(() => {
    const map: Record<string, boolean> = {}
    availableDates.forEach(d => {
      const dayExams = exams.filter(e => e.exam_date.split("T")[0] === d)
      map[d] = dayExams.length > 0 && dayExams.every(e => e.registered_count >= e.capacity)
    })
    return map
  }, [exams, availableDates])

  const availableTimes = useMemo(() => {
    if (!selectedDate) return []
    const times = new Set<string>()
    exams.forEach(e => { if (e.exam_date.split("T")[0] === selectedDate) times.add(e.start_time) })
    return Array.from(times).sort()
  }, [exams, selectedDate])

  const selectedExam = useMemo(() =>
    exams.find(e => e.exam_date.split("T")[0] === selectedDate && e.start_time === selectedTime),
    [exams, selectedDate, selectedTime])

  const selectedExamFull = selectedExam
    ? selectedExam.registered_count >= selectedExam.capacity
    : false

  const alternativeDates = useMemo(() =>
    availableDates.filter(d => !isDateFull[d] && d !== selectedDate),
    [availableDates, isDateFull, selectedDate])

  const locationAddress = selectedExam?.address || regionInfo[data.region]?.address || ""
  const locationPhone = regionInfo[data.region]?.phone || ""
  const locationEmail = regionInfo[data.region]?.email || ""

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.region) e.region = l.errRegion
    if (!data.levelId) e.level = l.errLevel
    if (!selectedDate) e.date = l.errDate
    if (!selectedTime) e.time = l.errTime
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !selectedExam) return

    const examPayload = {
      examId: selectedExam.id,
      selectedDate,
      selectedTime,
      examAmount: selectedExam.exam_levels?.price,
      levelName: selectedExam.exam_levels?.level,
      examAddress: locationAddress,
    }

    if (existingRegistrationId) {
      onDataChange(examPayload)
      onRegistrationComplete(existingRegistrationId)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/telc/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: selectedExam.id,
          firstName: data.firstName, lastName: data.lastName,
          phoneNumber: data.phoneNumber, email: data.email,
          passportNumber: data.passportNumber,
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error((d as any).error ?? l.errFail)
      }
      const reg = await res.json()
      onDataChange(examPayload)
      onRegistrationComplete(reg.id)
      toast.success("Registration created!")
    } catch (err: any) {
      toast.error(err.message ?? l.errFail)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
  const labelCls = "mb-1 flex items-center gap-1 text-sm font-medium text-slate-700"

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{l.title}</h2>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          <span>{l.loading}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelCls}>{l.region}<span className="text-red-500 ml-0.5">*</span></label>
            <select className={selectCls} value={data.region ?? ""} onChange={e => {
              onDataChange({ region: e.target.value, levelId: "", selectedDate: "", selectedTime: "" })
              setSelectedDate(""); setSelectedTime("")
            }}>
              <option value="">{l.selectRegion}</option>
              {activeRegions.map(r => (
                <option key={r} value={r}>{rl[r] ?? r}</option>
              ))}
            </select>
            {errors.region && <p className="mt-1 text-xs text-red-600">{errors.region}</p>}
          </div>

          <div>
            <label className={labelCls}>{l.level}<span className="text-red-500 ml-0.5">*</span></label>
            <select className={selectCls} value={data.levelId ?? ""} disabled={!data.region}
              onChange={e => {
                onDataChange({ levelId: e.target.value, selectedDate: "", selectedTime: "" })
                setSelectedDate(""); setSelectedTime("")
              }}>
              <option value="">{l.selectLevel}</option>
              {levels.map(lv => <option key={lv.id} value={lv.id}>{lv.level}</option>)}
            </select>
            {errors.level && <p className="mt-1 text-xs text-red-600">{errors.level}</p>}
          </div>

          {data.region && data.levelId && (
            <div>
              <label className={labelCls}><Calendar size={16} />{l.date}<span className="text-red-500 ml-0.5">*</span></label>
              <select className={selectCls} value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setSelectedTime("") }}>
                <option value="">{l.selectDate}</option>
                {availableDates.map(d => {
                  const full = isDateFull[d]
                  return (
                    <option key={d} value={d}>
                      {new Date(d).toLocaleDateString()}{full ? ` — ${l.full}` : ""}
                    </option>
                  )
                })}
              </select>
              {availableDates.length === 0 && <p className="mt-1 text-xs text-amber-600">{l.noExams}</p>}
              {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
            </div>
          )}

          {selectedDate && (
            <div>
              <label className={labelCls}><Clock size={16} />{l.time}<span className="text-red-500 ml-0.5">*</span></label>
              <select className={selectCls} value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                <option value="">{l.selectTime}</option>
                {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
            </div>
          )}

          {/* Summary block */}
          {selectedExam && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 space-y-1">
              <p className="font-semibold text-blue-900 mb-2">{l.summary}</p>
              <p><strong>{l.region}:</strong> {rl[data.region]}</p>
              <p><strong>{l.level}:</strong> {selectedExam.exam_levels?.level}</p>
              <p><strong>{l.date}:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
              <p><strong>{l.time}:</strong> {selectedTime}</p>
              {selectedExam.exam_levels?.price && (
                <p><strong>Price:</strong> {Number(selectedExam.exam_levels.price).toLocaleString()} UZS</p>
              )}
              {!selectedExamFull && (
                <p className="text-green-700 font-medium">
                  {selectedExam.capacity - selectedExam.registered_count} {l.spots}
                </p>
              )}
              {locationAddress && (
                <div className="mt-3 pt-3 border-t border-blue-200 space-y-1">
                  <p className="flex items-start gap-1.5">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <span>
                      <strong>{l.labelAddress}:</strong><br />
                      {locationAddress.split("\n").map((line: string, i: number) => (
                        <span key={i}>{line}{i < locationAddress.split("\n").length - 1 ? <br /> : null}</span>
                      ))}
                    </span>
                  </p>
                  {locationPhone && (
                    <p className="flex items-center gap-1.5">
                      <Phone size={14} className="shrink-0" />
                      <span><strong>{l.labelContact}:</strong> {locationPhone}{locationEmail ? `, ${locationEmail}` : ""}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Full exam warning */}
          {selectedExamFull && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-semibold mb-2">⚠ {l.examFull}</p>
              {alternativeDates.length > 0 && (
                <>
                  <p className="mb-2 text-red-700">{l.suggestAlt}</p>
                  <ul className="space-y-1">
                    {alternativeDates.map(d => {
                      const dayExams = exams.filter(e => e.exam_date.split("T")[0] === d)
                      const minSpots = Math.min(...dayExams.map(e => e.capacity - e.registered_count))
                      return (
                        <li key={d}>
                          <button type="button"
                            className="text-red-900 underline hover:text-red-700 font-medium"
                            onClick={() => { setSelectedDate(d); setSelectedTime("") }}>
                            {new Date(d).toLocaleDateString()}
                          </button>
                          <span className="ml-2 text-red-600">({minSpots} {l.spots})</span>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* Document reminder */}
          {selectedExam && !selectedExamFull && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold mb-2">📋 {l.docReminderTitle}</p>
              <ul className="space-y-1 list-none">
                <li className="flex items-start gap-2">🛂 {l.docPassport}</li>
                <li className="flex items-start gap-2">🖨️ {l.docPrint}</li>
              </ul>
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <Button type="button" variant="outline" size="lg" onClick={onPrevious} className="flex-1">{l.previous}</Button>
            <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting || !selectedExam || selectedExamFull}>
              {isSubmitting && <Loader2 size={16} className="animate-spin mr-2" />}
              {isSubmitting ? l.submitting : l.next}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
