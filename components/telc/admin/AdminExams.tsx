"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Plus, Trash2, Edit2, Save, X, Loader2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { type AdminLang, adminT } from "@/lib/admin-i18n"

const REGIONS = ["tashkent","samarkand","fergana","kashkadarya","bukhara","urgench"]
const REGION_LABELS: Record<string,string> = { tashkent:"Tashkent", samarkand:"Samarkand", fergana:"Fergana", kashkadarya:"Kashkadarya", bukhara:"Bukhara", urgench:"Urgench" }

const inputCls = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
const labelCls = "mb-1 block text-xs font-medium text-slate-600"

type ExamForm = { levelId: string; region: string; address: string; examDate: string; startTime: string; endTime: string; capacity: string }
const emptyForm: ExamForm = { levelId: "1", region: "tashkent", address: "", examDate: "", startTime: "09:00", endTime: "11:00", capacity: "30" }

type SortField = "level" | "region" | "date" | "time" | "capacity" | "active"
type SortDir = "asc" | "desc"
type ColKey = "level" | "region" | "date" | "time" | "capacity" | "active" | "actions"

const DEFAULT_WIDTHS: Record<ColKey, number> = {
  level: 100, region: 110, date: 105, time: 130, capacity: 190, active: 150, actions: 170,
}
const PAGE_SIZE = 10
const btnCls = "inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"

interface Props { lang: AdminLang }

export default function AdminExams({ lang }: Props) {
  const t = (key: string) => adminT(lang, key)
  const [exams, setExams] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<ExamForm>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<ExamForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [page, setPage] = useState(1)
  const [colWidths, setColWidths] = useState<Record<ColKey, number>>(DEFAULT_WIDTHS)

  const load = async () => {
    setLoading(true)
    const [e, l] = await Promise.all([
      fetch("/api/telc/exams?admin=true", { cache: "no-store" }).then(r => r.json()).catch(() => []),
      fetch("/api/telc/exam-levels").then(r => r.json()).catch(() => []),
    ])
    setExams(Array.isArray(e) ? e : [])
    const lvls: any[] = Array.isArray(l) ? l : []
    setLevels(lvls)
    if (lvls.length > 0 && lvls[0]) setForm(f => ({ ...f, levelId: String(lvls[0].id) }))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const displayed = useMemo(() => {
    const list = [...exams]
    const val = (ex: any): string => {
      switch (sortField) {
        case "level":    return ex.exam_levels?.level ?? String(ex.level_id ?? "")
        case "region":   return ex.region ?? ""
        case "date":     return ex.exam_date ?? ""
        case "time":     return ex.start_time ?? ""
        case "capacity": return String(ex.registered_count ?? 0).padStart(6, "0")
        case "active":   return ex.is_active !== false ? "1" : "0"
        default:         return ""
      }
    }
    list.sort((a, b) => sortDir === "asc" ? val(a).localeCompare(val(b)) : val(b).localeCompare(val(a)))
    return list
  }, [exams, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(displayed.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = displayed.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("asc") }
    setPage(1)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={12} className="opacity-30 shrink-0" />
    return sortDir === "asc"
      ? <ChevronUp size={12} className="text-primary shrink-0" />
      : <ChevronDown size={12} className="text-primary shrink-0" />
  }

  const onResizeStart = (col: ColKey, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const th = (e.currentTarget as HTMLElement).closest("th") as HTMLElement
    const startX = e.clientX
    const startW = th.offsetWidth
    const onMove = (mv: MouseEvent) => {
      setColWidths(prev => ({ ...prev, [col]: Math.max(60, startW + (mv.clientX - startX)) }))
    }
    const onUp = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const Th = ({ col, sortKey, label }: { col: ColKey; sortKey?: SortField; label: string }) => (
    <th
      onClick={sortKey ? () => toggleSort(sortKey) : undefined}
      className={`relative px-4 py-3 text-left text-xs font-semibold text-slate-700 select-none whitespace-nowrap ${sortKey ? "cursor-pointer hover:text-primary" : ""}`}
      style={{ minWidth: colWidths[col] }}
    >
      <span className="flex items-center gap-1 pr-2">
        {label}
        {sortKey && <SortIcon field={sortKey} />}
      </span>
      <div
        onMouseDown={e => onResizeStart(col, e)}
        onClick={e => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-primary/30 active:bg-primary/50 transition-colors"
      />
    </th>
  )

  const handleEdit = (ex: any) => {
    setEditingId(ex.id)
    setEditForm({
      levelId: String(ex.level_id),
      region: ex.region,
      address: ex.address ?? "",
      examDate: ex.exam_date ? ex.exam_date.split("T")[0] : "",
      startTime: ex.start_time ?? "09:00",
      endTime: ex.end_time ?? "11:00",
      capacity: String(ex.capacity),
    })
  }

  const handleSaveEdit = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/telc/exams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          levelId: parseInt(editForm.levelId),
          region: editForm.region,
          address: editForm.address || null,
          examDate: editForm.examDate ? new Date(editForm.examDate).toISOString() : undefined,
          startTime: editForm.startTime,
          endTime: editForm.endTime,
          capacity: parseInt(editForm.capacity),
        }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error((errData as any).error || `Server error: ${res.status}`)
      }
      toast.success(t("exam_updated"))
      setEditingId(null)
      load()
    } catch (err: any) {
      toast.error(err.message || t("exam_update_failed"))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirm_delete_exam"))) return
    const res = await fetch(`/api/telc/exams?id=${id}`, { method: "DELETE" })
    if (res.ok) { toast.success(t("exam_deleted")); load() }
    else toast.error(t("exam_delete_failed"))
  }

  const handleToggle = async (id: number, currentActive: boolean) => {
    setTogglingId(id)
    try {
      const res = await fetch("/api/telc/exams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentActive }),
      })
      if (!res.ok) throw new Error()
      toast.success(currentActive ? t("exam_deactivated") : t("exam_activated"))
      load()
    } catch {
      toast.error(t("exam_update_failed"))
    } finally {
      setTogglingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.examDate) { toast.error(t("exam_date_required")); return }
    setSubmitting(true)
    try {
      const res = await fetch("/api/telc/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          levelId: parseInt(form.levelId),
          region: form.region,
          address: form.address || null,
          examDate: new Date(form.examDate).toISOString(),
          startTime: form.startTime,
          endTime: form.endTime,
          capacity: parseInt(form.capacity),
        }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error((errData as any).error || `Server error: ${res.status}`)
      }
      toast.success(t("exam_created"))
      setShowForm(false)
      setForm(f => ({ ...f, examDate: "", address: "" }))
      load()
    } catch (err: any) {
      toast.error(err.message || t("exam_create_failed"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{t("manage_exams")}</h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus size={16} className="mr-1" /> {t("add_exam")}
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">{t("create_exam")}</h3>
          {levels.length === 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              ⚠️ No exam levels found. Go to the <strong>Pricing</strong> tab first and create at least one exam level, then come back here.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{t("label_level")}</label>
                <select className={inputCls} value={form.levelId} onChange={e => setForm({...form, levelId: e.target.value})}>
                  {levels.map((l: any) => <option key={l.id} value={l.id}>{l.level}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("label_region")}</label>
                <select className={inputCls} value={form.region} onChange={e => setForm({...form, region: e.target.value})}>
                  {REGIONS.map(r => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{t("label_address")}</label>
                <input className={inputCls} placeholder={t("label_address")} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              <div>
                <label className={labelCls}>{t("label_exam_date")}</label>
                <input type="date" className={inputCls} required value={form.examDate} onChange={e => setForm({...form, examDate: e.target.value})} />
              </div>
              <div>
                <label className={labelCls}>{t("label_capacity")}</label>
                <input type="number" className={inputCls} min="1" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} />
              </div>
              <div>
                <label className={labelCls}>{t("label_start_time")}</label>
                <input type="time" className={inputCls} value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
              </div>
              <div>
                <label className={labelCls}>{t("label_end_time")}</label>
                <input type="time" className={inputCls} value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting && <Loader2 size={16} className="animate-spin mr-2" />} {t("btn_create")}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>{t("btn_cancel")}</Button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-slate-500"><Loader2 className="animate-spin" size={20}/> {t("loading")}</div>
        ) : exams.length === 0 ? (
          <p className="p-8 text-center text-slate-500">{t("no_exams")}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <Th col="level"    sortKey="level"    label={t("label_level")} />
                    <Th col="region"   sortKey="region"   label={t("label_region")} />
                    <Th col="date"     sortKey="date"     label={t("col_date")} />
                    <Th col="time"     sortKey="time"     label={t("col_time")} />
                    <Th col="capacity" sortKey="capacity" label={t("col_capacity")} />
                    <Th col="active"   sortKey="active"   label={t("col_active")} />
                    <Th col="actions"  label={t("col_actions")} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((ex: any) => {
                    const pct = ex.capacity > 0 ? Math.min(100, Math.round((ex.registered_count / ex.capacity) * 100)) : 0
                    const isFull = ex.registered_count >= ex.capacity
                    const barColor = isFull ? "bg-red-500" : pct >= 75 ? "bg-amber-400" : "bg-green-500"
                    const isEditing = editingId === ex.id
                    const isActive = ex.is_active !== false
                    return (
                      <React.Fragment key={ex.id}>
                        <tr className={`hover:bg-slate-50 ${isEditing ? "bg-amber-50" : ""} ${!isActive ? "opacity-50" : ""}`}>
                          <td className="px-4 py-3 font-medium">{ex.exam_levels?.level ?? `Level ${ex.level_id}`}</td>
                          <td className="px-4 py-3 text-slate-600 capitalize">{REGION_LABELS[ex.region] ?? ex.region}</td>
                          <td className="px-4 py-3 text-slate-600">{new Date(ex.exam_date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-slate-600">{ex.start_time} – {ex.end_time}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-slate-600 whitespace-nowrap">{ex.registered_count}/{ex.capacity}</span>
                              {isFull && <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">{t("full")}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggle(ex.id, isActive)}
                              disabled={togglingId === ex.id}
                              title={isActive ? t("exam_deactivate") : t("exam_activate")}
                              className="flex items-center gap-1.5"
                            >
                              {togglingId === ex.id ? (
                                <Loader2 size={16} className="animate-spin text-slate-400" />
                              ) : (
                                <span className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${isActive ? "bg-green-500" : "bg-slate-300"}`}>
                                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                                </span>
                              )}
                              <span className={`text-xs font-medium ${isActive ? "text-green-700" : "text-slate-400"}`}>
                                {isActive ? t("exam_active") : t("exam_inactive")}
                              </span>
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => isEditing ? setEditingId(null) : handleEdit(ex)}
                                className={`flex items-center gap-1 text-xs font-medium ${isEditing ? "text-slate-500 hover:text-slate-700" : "text-amber-600 hover:text-amber-800"}`}
                              >
                                {isEditing ? <><X size={14}/> {t("btn_cancel")}</> : <><Edit2 size={14}/> {t("btn_edit")}</>}
                              </button>
                              <button onClick={() => handleDelete(ex.id)} className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-medium">
                                <Trash2 size={14}/> {t("btn_delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isEditing && (
                          <tr key={`edit-${ex.id}`}>
                            <td colSpan={7} className="px-4 py-4 bg-amber-50 border-t border-amber-100">
                              <p className="text-xs font-semibold text-amber-800 mb-3 uppercase tracking-wide">{t("edit_exam")}</p>
                              <div className="grid sm:grid-cols-3 gap-3">
                                <div>
                                  <label className={labelCls}>{t("label_level")}</label>
                                  <select className={inputCls} value={editForm.levelId} onChange={e => setEditForm({...editForm, levelId: e.target.value})}>
                                    {levels.map((l: any) => <option key={l.id} value={l.id}>{l.level}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className={labelCls}>{t("label_region")}</label>
                                  <select className={inputCls} value={editForm.region} onChange={e => setEditForm({...editForm, region: e.target.value})}>
                                    {REGIONS.map(r => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className={labelCls}>{t("label_exam_date")}</label>
                                  <input type="date" className={inputCls} value={editForm.examDate} onChange={e => setEditForm({...editForm, examDate: e.target.value})} />
                                </div>
                                <div>
                                  <label className={labelCls}>{t("label_start_time")}</label>
                                  <input type="time" className={inputCls} value={editForm.startTime} onChange={e => setEditForm({...editForm, startTime: e.target.value})} />
                                </div>
                                <div>
                                  <label className={labelCls}>{t("label_end_time")}</label>
                                  <input type="time" className={inputCls} value={editForm.endTime} onChange={e => setEditForm({...editForm, endTime: e.target.value})} />
                                </div>
                                <div>
                                  <label className={labelCls}>{t("label_capacity")}</label>
                                  <input type="number" className={inputCls} min="1" value={editForm.capacity} onChange={e => setEditForm({...editForm, capacity: e.target.value})} />
                                </div>
                                <div className="sm:col-span-3">
                                  <label className={labelCls}>{t("label_address")}</label>
                                  <input className={inputCls} value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                                </div>
                                <div className="sm:col-span-3 flex gap-3">
                                  <button
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                                  >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    {t("btn_save")}
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                                  >
                                    <X size={14} /> {t("btn_cancel")}
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-slate-50/60">
                <p className="text-xs text-slate-500">
                  {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, displayed.length)} / {displayed.length}
                </p>
                <div className="flex items-center gap-1">
                  <button className={btnCls} disabled={safePage === 1} onClick={() => setPage(1)}><ChevronsLeft size={14} /></button>
                  <button className={btnCls} disabled={safePage === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></button>
                  <span className="px-3 text-xs font-medium text-slate-700">{safePage} / {totalPages}</span>
                  <button className={btnCls} disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></button>
                  <button className={btnCls} disabled={safePage === totalPages} onClick={() => setPage(totalPages)}><ChevronsRight size={14} /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
