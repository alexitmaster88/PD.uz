"use client"

import { useState, useMemo, useEffect } from "react"
import { MapPin, Phone, Users, ChevronDown, Calendar, Clock } from "lucide-react"
import { CONTACT } from "@/lib/contact"

interface Props {
  data: any
  lang: string
  preloadedExams: any[] | undefined
  preloadedLevels: any[] | undefined
  onDataChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

const regionLabels: Record<string, Record<string, string>> = {
  en: { tashkent: "Tashkent", samarkand: "Samarkand", fergana: "Fergana", kashkadarya: "Kashkadarya", bukhara: "Bukhara", urgench: "Urgench" },
  de: { tashkent: "Taschkent", samarkand: "Samarkand", fergana: "Fergana", kashkadarya: "Kaschkadarya", bukhara: "Buchara", urgench: "Urgentsch" },
  ru: { tashkent: "Ташкент", samarkand: "Самарканд", fergana: "Фергана", kashkadarya: "Кашкадарья", bukhara: "Бухара", urgench: "Ургенч" },
  uz: { tashkent: "Toshkent", samarkand: "Samarqand", fergana: "Farg'ona", kashkadarya: "Qashqadaryo", bukhara: "Buxoro", urgench: "Urganch" },
}

const regionInfo: Record<string, { address: Record<string, string>; phone: string; email: string }> = {
  samarkand: {
    address: {
      uz: "Samarqand shahar, O'zbekiston ko'chasi, 53-uy, Yoshlar kreativ bog'i",
      en: "Samarkand, Uzbekiston Street, 53, Yoshlar Creative Park",
      de: "Samarkand, Uzbekiston-Straße, Haus 53, Yoshlar Kreativpark",
      ru: "г. Самарканд, ул. Узбекистан, дом 53, Молодёжный творческий парк",
    },
    phone: CONTACT.phone1,
    email: CONTACT.email,
  },
  tashkent: {
    address: {
      uz: "Toshkent shahar, Olmazor tumani, Sebzor ko'chasi, 313-uy (sobiq Toshkent shahar dizayner va texnologlarni tayyorlash texnikumi)",
      en: "Tashkent, Olmazor district, Sebzor Street, 313 (former Tashkent city designer and technologist training college)",
      de: "Taschkent, Bezirk Olmazor, Sebzor-Straße, Haus 313 (ehemaliges Institut für Ausbildung von Designern und Technologen)",
      ru: "г. Ташкент, Олмазорский р-н, ул. Сабзор, дом 313 (бывший Ташкентский техникум подготовки дизайнеров и технологов)",
    },
    phone: CONTACT.phone1,
    email: CONTACT.email,
  },
}

const ui: Record<string, Record<string, string>> = {
  en: {
    title: "Exam Information",
    region: "Exam region", level: "Level",
    selectRegion: "Select region", selectLevel: "Select level",
    spotsAvailable: "Available spots", spots: "spots",
    examType: "Exam type",
    oralWritten: "Oral + Written", oral: "Oral", written: "Written",
    examDate: "Exam date", time: "Time",
    selectTime: "Select time slot",
    noExams: "No exams available for selected region and level",
    confirmInfo: "I confirm the above information is correct",
    next: "Next step", previous: "← Back",
    loading: "Loading exam data...",
    full: "Full", spotsLeft: "spots left",
    errRegion: "Select a region", errLevel: "Select a level",
    errDate: "Select a date", errTime: "Select a time slot",
    errExamType: "Select exam type",
    errConfirm: "Please confirm the information",
    labelAddress: "Venue Address", labelContact: "Contact",
    docReminderTitle: "Bring with you 30 min before the exam:",
    docPassport: "Passport or national ID (original)",
    docPrint: "Printed confirmation (PDF) with payment receipt",
  },
  de: {
    title: "Prüfungsinformationen",
    region: "Prüfungsregion", level: "Stufe",
    selectRegion: "Region wählen", selectLevel: "Stufe wählen",
    spotsAvailable: "Verfügbare Plätze", spots: "Plätze",
    examType: "Prüfungstyp",
    oralWritten: "Mündlich + Schriftlich", oral: "Mündlich", written: "Schriftlich",
    examDate: "Prüfungsdatum", time: "Zeit",
    selectTime: "Uhrzeit wählen",
    noExams: "Keine Prüfungen verfügbar",
    confirmInfo: "Ich bestätige die Richtigkeit der obigen Angaben",
    next: "Nächster Schritt", previous: "← Zurück",
    loading: "Prüfungsdaten werden geladen...",
    full: "Voll", spotsLeft: "Plätze frei",
    errRegion: "Region wählen", errLevel: "Stufe wählen",
    errDate: "Datum wählen", errTime: "Uhrzeit wählen",
    errExamType: "Prüfungstyp wählen",
    errConfirm: "Bitte bestätigen",
    labelAddress: "Prüfungsort", labelContact: "Kontakt",
    docReminderTitle: "30 Min. vor der Prüfung mitbringen:",
    docPassport: "Reisepass oder Personalausweis (Original)",
    docPrint: "Ausgedruckte Bestätigung (PDF) mit Zahlungsbeleg",
  },
  ru: {
    title: "Информация об экзамене",
    region: "Регион экзамена", level: "Уровень",
    selectRegion: "Выберите регион", selectLevel: "Выберите уровень",
    spotsAvailable: "Доступные места", spots: "мест",
    examType: "Тип экзамена",
    oralWritten: "Устный + Письменный", oral: "Устный", written: "Письменный",
    examDate: "Дата экзамена", time: "Время",
    selectTime: "Выберите время",
    noExams: "Нет доступных экзаменов",
    confirmInfo: "Я подтверждаю правильность указанных данных",
    next: "Следующий шаг", previous: "← Назад",
    loading: "Загрузка данных...",
    full: "Занято", spotsLeft: "мест осталось",
    errRegion: "Выберите регион", errLevel: "Выберите уровень",
    errDate: "Выберите дату", errTime: "Выберите время",
    errExamType: "Выберите тип экзамена",
    errConfirm: "Подтвердите данные",
    labelAddress: "Адрес", labelContact: "Контакт",
    docReminderTitle: "Принести за 30 мин до экзамена:",
    docPassport: "Паспорт или удостоверение (оригинал)",
    docPrint: "Распечатанное подтверждение (PDF) с квитанцией",
  },
  uz: {
    title: "Imtihon ma'lumotlari",
    region: "Imtihon topshirish hududi", level: "Daraja",
    selectRegion: "Hududni tanlang", selectLevel: "Darajani tanlang",
    spotsAvailable: "Bo'sh o'rinlar", spots: "ta",
    examType: "Imtihon turi",
    oralWritten: "Og'zaki + Yozma", oral: "Og'zaki", written: "Yozma",
    examDate: "Imtihon kuni", time: "Vaqt",
    selectTime: "Vaqtni tanlang",
    noExams: "Tanlangan hudud va darajada imtihon yo'q",
    confirmInfo: "Yuqoridagi ma'lumotlar to'g'ri ekanligiga ishonch hosil qildim",
    next: "Keyingi qadam", previous: "← Orqaga",
    loading: "Ma'lumotlar yuklanmoqda...",
    full: "To'liq", spotsLeft: "o'rin qoldi",
    errRegion: "Hududni tanlang", errLevel: "Darajani tanlang",
    errDate: "Sanani tanlang", errTime: "Vaqtni tanlang",
    errExamType: "Imtihon turini tanlang",
    errConfirm: "Ma'lumotlarni tasdiqlang",
    labelAddress: "Imtihon manzili", labelContact: "Aloqa",
    docReminderTitle: "Imtihon kuni 30 daqiqa oldin olib keling:",
    docPassport: "Pasport yoki ID karta (original)",
    docPrint: "To'lov cheki bilan tasdiqlash (PDF) chop etilgan nusxasi",
  },
}

function todayStart() {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d
}

function formatDate(dateStr: string, lang: string) {
  const d = new Date(dateStr + "T00:00:00")
  if (lang === "uz") {
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    return `${dd}.${mm}.${d.getFullYear()}`
  }
  return d.toLocaleDateString(
    lang === "ru" ? "ru-RU" : lang === "de" ? "de-DE" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric" }
  )
}

export default function StepExamSelection({
  data, lang, preloadedExams, preloadedLevels, onDataChange, onNext, onPrevious,
}: Props) {
  const l = ui[lang] ?? ui.en
  const rl = regionLabels[lang] ?? regionLabels.en
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedDate, setSelectedDate] = useState(data.selectedDate ?? "")
  const [selectedTime, setSelectedTime] = useState(data.selectedTime ?? "")
  const [confirmed, setConfirmed] = useState(false)

  const [localExams, setLocalExams] = useState<any[] | null>(null)
  const [localLevels, setLocalLevels] = useState<any[] | null>(null)

  useEffect(() => {
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

  const activeRegions = useMemo(() => {
    const seen = new Set<string>()
    allExams.forEach(e => seen.add(e.region))
    return Array.from(seen)
  }, [allExams])

  const activeLevelsForRegion = useMemo(() => {
    if (!data.region) return levels
    const ids = new Set<string>()
    allExams.forEach(e => { if (e.region === data.region) ids.add(String(e.level_id)) })
    return levels.filter(lv => ids.has(String(lv.id)))
  }, [allExams, levels, data.region])

  const exams = useMemo(() => {
    if (!data.region || !data.levelId) return []
    return allExams.filter(e =>
      e.region === data.region &&
      String(e.level_id) === String(data.levelId) &&
      new Date(e.exam_date) >= todayStart()
    )
  }, [allExams, data.region, data.levelId])

  // Total available spots across all dates for this region+level
  const totalSpots = useMemo(() =>
    exams.reduce((sum, e) => sum + Math.max(0, e.capacity - e.registered_count), 0),
    [exams])

  const availableDates = useMemo(() => {
    const dates = new Set<string>()
    exams.forEach(e => dates.add(e.exam_date.split("T")[0]))
    return Array.from(dates).sort()
  }, [exams])

  // All exams on the currently selected date
  const examsOnSelectedDate = useMemo(() =>
    selectedDate ? exams.filter(e => e.exam_date.split("T")[0] === selectedDate) : [],
    [exams, selectedDate])

  // Single slot → auto-pick it; multiple slots → wait for explicit user choice
  const effectiveTime = examsOnSelectedDate.length === 1
    ? examsOnSelectedDate[0].start_time
    : selectedTime

  const selectedExam = useMemo(() =>
    exams.find(e =>
      e.exam_date.split("T")[0] === selectedDate && e.start_time === effectiveTime
    ),
    [exams, selectedDate, effectiveTime])

  const spotsForDate = (d: string) => {
    const dayExams = exams.filter(e => e.exam_date.split("T")[0] === d)
    return dayExams.reduce((sum, e) => sum + Math.max(0, e.capacity - e.registered_count), 0)
  }

  const examTypes = [
    { value: "oral_written", label: l.oralWritten },
    { value: "oral",         label: l.oral },
    { value: "written",      label: l.written },
  ]

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.region)    e.region    = l.errRegion
    if (!data.levelId)   e.level     = l.errLevel
    if (!selectedDate)   e.date      = l.errDate
    if (examsOnSelectedDate.length > 1 && !selectedTime) e.time = l.errTime
    if (!data.examType)  e.examType  = l.errExamType
    if (!confirmed)      e.confirmed = l.errConfirm
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !selectedExam) return
    onDataChange({
      examId: selectedExam.id,
      selectedDate,
      selectedTime: selectedExam.start_time,
      examAmount: selectedExam.exam_levels?.price,
      levelName: selectedExam.exam_levels?.level,
      examAddress: selectedExam.address || regionInfo[data.region]?.address[lang] || regionInfo[data.region]?.address.uz || "",
    })
    onNext()
  }

  const selectCls = "w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-slate-50 disabled:text-slate-400"

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{l.title}</h2>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-400 text-sm">
          <span className="animate-spin inline-block w-5 h-5 border-2 border-slate-300 border-t-primary rounded-full" />
          {l.loading}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Region */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <MapPin size={15} className="text-slate-400" /> {l.region} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className={selectCls} value={data.region ?? ""} onChange={e => {
                onDataChange({ region: e.target.value, levelId: "", selectedDate: "", selectedTime: "", examType: "" })
                setSelectedDate("")
                setSelectedTime("")
              }}>
                <option value="">{l.selectRegion}</option>
                {activeRegions.map(r => <option key={r} value={r}>{rl[r] ?? r}</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.region && <p className="mt-1 text-xs text-red-600">{errors.region}</p>}
          </div>

          {/* Level */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <Users size={15} className="text-slate-400" /> {l.level} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className={selectCls} value={data.levelId ?? ""} disabled={!data.region}
                onChange={e => {
                  onDataChange({ levelId: e.target.value, selectedDate: "", selectedTime: "", examType: "" })
                  setSelectedDate("")
                  setSelectedTime("")
                }}>
                <option value="">{l.selectLevel}</option>
                {activeLevelsForRegion.map(lv => <option key={lv.id} value={lv.id}>{lv.level}</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.level && <p className="mt-1 text-xs text-red-600">{errors.level}</p>}
          </div>

          {/* Spots badge */}
          {data.region && data.levelId && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <Users size={18} className="shrink-0 text-primary" />
              <span className="text-sm text-slate-600">{l.spotsAvailable}:</span>
              <span className="ml-auto inline-flex items-center rounded-lg bg-primary px-3 py-1 text-sm font-bold" style={{ color: '#ffffff' }}>
                {totalSpots} {l.spots}
              </span>
            </div>
          )}

          {/* Exam type */}
          {data.region && data.levelId && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {l.examType} <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {examTypes.map(et => (
                  <label key={et.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      data.examType === et.value
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-white hover:border-primary/40"
                    }`}>
                    <input
                      type="radio"
                      name="examType"
                      value={et.value}
                      checked={data.examType === et.value}
                      onChange={() => onDataChange({ examType: et.value })}
                      className="accent-primary w-4 h-4 shrink-0"
                    />
                    <span className="text-sm font-medium text-slate-800">{et.label}</span>
                  </label>
                ))}
              </div>
              {errors.examType && <p className="mt-1 text-xs text-red-600">{errors.examType}</p>}
            </div>
          )}

          {/* Date cards */}
          {data.region && data.levelId && (
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Calendar size={15} className="text-slate-400" /> {l.examDate} <span className="text-red-500">*</span>
              </label>
              {availableDates.length === 0 ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{l.noExams}</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {availableDates.map(d => {
                    const spots = spotsForDate(d)
                    const full = spots <= 0
                    const isSelected = selectedDate === d
                    return (
                      <button
                        key={d}
                        type="button"
                        disabled={full}
                        onClick={() => {
                          setSelectedDate(d)
                          setSelectedTime("")
                          onDataChange({ selectedDate: d, selectedTime: "" })
                        }}
                        className={`flex flex-col items-center rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all ${
                          isSelected
                            ? "border-primary bg-primary shadow-md"
                            : full
                              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                              : "border-slate-200 bg-white text-slate-800 hover:border-primary/60 hover:shadow-sm"
                        }`}
                        style={isSelected ? { color: '#ffffff' } : undefined}
                      >
                        <span className="font-bold">{formatDate(d, lang)}</span>
                        <span
                          className={`mt-0.5 text-xs ${full ? "text-slate-300" : !isSelected ? "text-slate-400" : ""}`}
                          style={isSelected ? { color: 'rgba(255,255,255,0.8)' } : undefined}
                        >
                          {full ? l.full : `${spots} ${l.spotsLeft}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
              {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
            </div>
          )}

          {/* Time slot selection — only when multiple exams exist on the chosen date */}
          {selectedDate && examsOnSelectedDate.length > 1 && (
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Clock size={15} className="text-slate-400" /> {l.selectTime} <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {examsOnSelectedDate.map(exam => {
                  const slotSpots = Math.max(0, exam.capacity - exam.registered_count)
                  const slotFull = slotSpots <= 0
                  const isSelected = selectedTime === exam.start_time
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      disabled={slotFull}
                      onClick={() => {
                        setSelectedTime(exam.start_time)
                        onDataChange({ selectedTime: exam.start_time })
                      }}
                      className={`flex flex-col items-center rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-primary bg-primary shadow-md"
                          : slotFull
                            ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                            : "border-slate-200 bg-white text-slate-800 hover:border-primary/60 hover:shadow-sm"
                      }`}
                      style={isSelected ? { color: '#ffffff' } : undefined}
                    >
                      <span className="font-bold">{exam.start_time} – {exam.end_time}</span>
                      <span
                        className={`mt-0.5 text-xs ${slotFull ? "text-slate-300" : !isSelected ? "text-slate-400" : ""}`}
                        style={isSelected ? { color: 'rgba(255,255,255,0.8)' } : undefined}
                      >
                        {slotFull ? l.full : `${slotSpots} ${l.spotsLeft}`}
                      </span>
                    </button>
                  )
                })}
              </div>
              {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
            </div>
          )}

          {/* Confirmed time info (auto-selected single slot) */}
          {selectedExam && examsOnSelectedDate.length === 1 && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <Clock size={17} className="shrink-0 text-slate-400" />
              <span className="text-sm text-slate-600">{l.time}:</span>
              <span className="font-bold text-primary">{selectedExam.start_time}</span>
            </div>
          )}

          {/* Venue info */}
          {selectedExam && regionInfo[data.region] && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm space-y-1.5">
              <p className="flex items-start gap-2 text-blue-800">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span><strong>{l.labelAddress}:</strong> {(selectedExam.address || regionInfo[data.region].address[lang] || regionInfo[data.region].address.uz).replace("\n", ", ")}</span>
              </p>
              <p className="flex items-center gap-2 text-blue-800">
                <Phone size={14} className="shrink-0" />
                <span><strong>{l.labelContact}:</strong> {regionInfo[data.region].phone}</span>
              </p>
            </div>
          )}

          {/* Confirm checkbox */}
          {selectedExam && (
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
              confirmed ? "border-primary bg-primary/5" : "border-slate-200 bg-white hover:border-primary/40"
            }`}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="accent-primary mt-0.5 w-4 h-4 shrink-0"
              />
              <span className="text-sm text-slate-700">{l.confirmInfo}</span>
            </label>
          )}
          {errors.confirmed && <p className="mt-1 text-xs text-red-600">{errors.confirmed}</p>}

          {/* Navigation */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!selectedExam || !confirmed}
              className="w-full rounded-xl bg-primary py-3.5 text-base font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {l.next}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
