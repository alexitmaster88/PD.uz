"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Eye, X, Loader2, Pencil, Trash2, CheckCircle, XCircle, Ban, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { type AdminLang, adminT } from "@/lib/admin-i18n"

const EXAM_TYPE_LABELS: Record<string, { label: string; cls: string }> = {
  oral_written: { label: "Oral+Written", cls: "bg-blue-100 text-blue-800" },
  oral:         { label: "Oral",         cls: "bg-purple-100 text-purple-800" },
  written:      { label: "Written",      cls: "bg-indigo-100 text-indigo-800" },
}

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  paid:      "bg-blue-100 text-blue-800",
  pending:   "bg-yellow-100 text-yellow-800",
  verified:  "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
  denied:    "bg-red-200 text-red-900",
}

const inputCls = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
const labelCls = "mb-1 block text-xs font-medium text-slate-600"

type SortField = "name" | "email" | "passport" | "level" | "exam_type" | "region" | "exam_date" | "status" | "created_at"
type SortDir = "asc" | "desc"
type ColKey = "check" | "no" | "name" | "email" | "passport" | "level" | "exam_type" | "region" | "exam_date" | "created_at" | "status" | "actions"

const DEFAULT_WIDTHS: Record<ColKey, number> = {
  check: 40, no: 48, name: 160, email: 170, passport: 110, level: 70, exam_type: 90,
  region: 90, exam_date: 95, created_at: 130, status: 90, actions: 180,
}
const PAGE_SIZES = [50, 100, 150, 250, 400, 500, 1000]
const btnCls = "inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
const STATUSES = ["pending", "verified", "paid", "completed", "cancelled", "denied"]

interface Props { lang: AdminLang }

export default function AdminRegistrations({ lang }: Props) {
  const t = (key: string) => adminT(lang, key)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [editing, setEditing] = useState<any | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [sortField, setSortField] = useState<SortField>("exam_date")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterRegion, setFilterRegion] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [colWidths, setColWidths] = useState<Record<ColKey, number>>(DEFAULT_WIDTHS)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [batchBusy, setBatchBusy] = useState(false)
  const headerCheckRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const data = await fetch("/api/telc/registrations").then(r => r.json()).catch(() => [])
    setRegistrations(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const regions = useMemo(() => {
    const set = new Set<string>()
    registrations.forEach(r => { if (r.exams?.region) set.add(r.exams.region) })
    return Array.from(set).sort()
  }, [registrations])

  const displayed = useMemo(() => {
    let list = [...registrations]
    if (filterStatus) list = list.filter(r => r.status === filterStatus)
    if (filterRegion) list = list.filter(r => r.exams?.region === filterRegion)
    const val = (r: any): string => {
      switch (sortField) {
        case "name":      return `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim()
        case "email":     return r.email ?? ""
        case "passport":  return r.passport_number ?? ""
        case "level":     return r.exams?.exam_levels?.level ?? ""
        case "exam_type": return r.exam_type ?? ""
        case "region":    return r.exams?.region ?? ""
        case "exam_date": return r.exams?.exam_date ?? ""
        case "status":    return r.status ?? ""
        case "created_at":return r.created_at ?? ""
        default:          return ""
      }
    }
    list.sort((a, b) => sortDir === "asc" ? val(a).localeCompare(val(b)) : val(b).localeCompare(val(a)))
    return list
  }, [registrations, filterStatus, filterRegion, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = displayed.slice((safePage - 1) * pageSize, safePage * pageSize)

  const allOnPageSelected = paginated.length > 0 && paginated.every(r => selectedIds.has(r.id))
  const someOnPageSelected = paginated.some(r => selectedIds.has(r.id)) && !allOnPageSelected

  useEffect(() => {
    if (headerCheckRef.current) headerCheckRef.current.indeterminate = someOnPageSelected
  }, [someOnPageSelected])

  const toggleRow = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (allOnPageSelected) paginated.forEach(r => next.delete(r.id))
      else paginated.forEach(r => next.add(r.id))
      return next
    })
  }

  const handleBatchAction = async (action: "approve" | "cancel" | "deny" | "delete") => {
    const ids = Array.from(selectedIds)
    if (!ids.length) return
    const confirmKey = action === "approve" ? "batch_confirm_approve" : action === "cancel" ? "batch_confirm_cancel" : action === "deny" ? "batch_confirm_deny" : "batch_confirm_delete"
    if (!confirm(adminT(lang, confirmKey, { count: ids.length }))) return
    setBatchBusy(true)
    try {
      await Promise.all(ids.map(id => {
        if (action === "delete") return fetch(`/api/telc/registrations?id=${id}`, { method: "DELETE" })
        const status = action === "approve" ? "completed" : action === "cancel" ? "cancelled" : "denied"
        return fetch("/api/telc/registrations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        })
      }))
      toast.success(`${ids.length} registrations ${action === "delete" ? "deleted" : "updated"}`)
      setSelectedIds(new Set())
      load()
    } catch {
      toast.error("Batch action failed")
    } finally {
      setBatchBusy(false)
    }
  }

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

  const exportExcel = async () => {
    // Fetch payments separately (no DB-level FK so can't join via Supabase)
    const allPayments: any[] = await fetch("/api/telc/payments")
      .then(r => r.json()).catch(() => [])
    const paymentByReg: Record<number, any> = {}
    if (Array.isArray(allPayments)) {
      allPayments.forEach(p => {
        // Keep the most recent payment per registration
        if (!paymentByReg[p.registration_id]) paymentByReg[p.registration_id] = p
      })
    }

    const rows = displayed.map(r => {
      const payment = paymentByReg[r.id] ?? null
      return {
        "ID": r.id,
        // ── Step 2: Personal Info ──
        "First Name": r.first_name ?? "",
        "Last Name": r.last_name ?? "",
        "Email": r.email ?? "",
        "Phone": r.phone_number ?? "",
        "Passport / ID No": r.passport_number ?? "",
        "Document Type": r.document_type ?? "",
        "Date of Birth": r.date_of_birth ?? "",
        "Gender": r.gender ?? "",
        "Nationality": r.nationality ?? "",
        "Country of Birth": r.country_of_birth ?? "",
        "City of Birth": r.city_of_birth ?? "",
        "Current Address": r.current_address ?? "",
        // ── Step 1: Exam Selection ──
        "Exam Level": r.exams?.exam_levels?.level ?? "",
        "Exam Type": r.exam_type ?? "",
        "Region": r.exams?.region ?? "",
        "Exam Date": r.exams?.exam_date ? new Date(r.exams.exam_date).toLocaleDateString("de-DE") : "",
        "Time Slot": r.exams?.start_time && r.exams?.end_time
          ? `${r.exams.start_time} – ${r.exams.end_time}`
          : r.exams?.start_time ?? "",
        "Exam Address": r.exams?.address ?? "",
        "Price (UZS)": r.exams?.exam_levels?.price ?? "",
        // ── Step 3: Payment ──
        "Payment Method": payment?.payment_method ?? "",
        "Payment Amount": payment?.amount ?? "",
        "Payment Status": payment?.status ?? "",
        "Payment Date": payment?.created_at ? new Date(payment.created_at).toLocaleString() : "",
        // ── Status ──
        "Registration Status": r.status ?? "",
        "Email Verified": r.email_verified ? "Yes" : "No",
        "Payment Verified": r.payment_verified ? "Yes" : "No",
        "Registered At": r.created_at ? new Date(r.created_at).toLocaleString() : "",
      }
    })
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Registrations")
    const suffix = filterStatus ? `_${filterStatus}` : ""
    XLSX.writeFile(wb, `registrations${suffix}_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch("/api/telc/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error()
      toast.success(t("status_updated"))
      load()
      if (selected?.id === id) setSelected({ ...selected, status })
    } catch {
      toast.error(t("status_update_failed"))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleEditSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch("/api/telc/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          firstName: editing.first_name,
          lastName: editing.last_name,
          email: editing.email,
          phoneNumber: editing.phone_number,
          passportNumber: editing.passport_number,
          status: editing.status,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success(t("reg_updated"))
      setEditing(null)
      load()
    } catch {
      toast.error(t("reg_update_failed"))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(adminT(lang, "confirm_delete_reg", { id }))) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/telc/registrations?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success(t("reg_deleted"))
      if (selected?.id === id) setSelected(null)
      if (editing?.id === id) setEditing(null)
      load()
    } catch {
      toast.error(t("reg_delete_failed"))
    } finally {
      setDeletingId(null)
    }
  }

  const handleQuickAction = async (id: number, action: "approve" | "cancel" | "deny") => {
    const statusMap = { approve: "completed", cancel: "cancelled", deny: "denied" } as const
    const confirmKey = action === "approve" ? "confirm_approve" : action === "cancel" ? "confirm_cancel_reg" : "confirm_deny"
    if (!confirm(adminT(lang, confirmKey, { id }))) return
    setUpdatingId(id)
    try {
      const res = await fetch("/api/telc/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: statusMap[action] }),
      })
      if (!res.ok) throw new Error()
      toast.success(t(action === "approve" ? "reg_approved" : action === "deny" ? "reg_denied" : "status_updated"))
      load()
      if (selected?.id === id) setSelected({ ...selected, status: statusMap[action] })
    } catch {
      toast.error(t("reg_action_failed"))
    } finally {
      setUpdatingId(null)
    }
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" })

  const fmtDateTime = (d: string) => {
    const p = (n: number) => String(n).padStart(2, "0")
    const dt = new Date(new Date(d).getTime() + 5 * 60 * 60 * 1000)
    return `${p(dt.getUTCDate())}.${p(dt.getUTCMonth() + 1)}.${dt.getUTCFullYear()}, ${p(dt.getUTCHours())}:${p(dt.getUTCMinutes())}`
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t("registrations")}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{displayed.length} / {registrations.length} {t("total")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-primary"
          >
            <option value="">{t("all_statuses")}</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select
            value={filterRegion}
            onChange={e => { setFilterRegion(e.target.value); setPage(1) }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-primary"
          >
            <option value="">{t("all_regions")}</option>
            {regions.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-primary"
          >
            {PAGE_SIZES.map(n => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
          <button
            onClick={exportExcel}
            disabled={displayed.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-40 transition"
          >
            <Download size={14} /> {t("export_excel")}
          </button>
        </div>
      </div>

      {/* View panel */}
      {selected && !editing && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-slate-900">{t("view_registration")} #{selected.id}</h3>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              [t("col_name"), `${selected.first_name} ${selected.last_name}`],
              [t("col_email"), selected.email],
              [t("col_phone"), selected.phone_number],
              [t("col_passport"), selected.passport_number],
              [t("label_region"), selected.exams?.region ?? "—"],
              [t("label_exam_date"), selected.exams?.exam_date ? fmtDate(selected.exams.exam_date) : "—"],
              [t("email_verified"), selected.email_verified ? t("yes") : t("no_val")],
              [t("payment_verified"), selected.payment_verified ? t("yes") : t("no_val")],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="font-medium text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleQuickAction(selected.id, "approve")} disabled={updatingId === selected.id || selected.status === "completed"}
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-40">
                {updatingId === selected.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />} {t("btn_approve")}
              </button>
              <button onClick={() => handleQuickAction(selected.id, "cancel")} disabled={updatingId === selected.id || selected.status === "cancelled"}
                className="flex items-center gap-1.5 rounded-lg bg-slate-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600 disabled:opacity-40">
                <XCircle size={13} /> {t("btn_cancel")}
              </button>
              <button onClick={() => handleQuickAction(selected.id, "deny")} disabled={updatingId === selected.id || selected.status === "denied"}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-40">
                <Ban size={13} /> {t("btn_deny")}
              </button>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">{t("update_status")}</p>
              <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-primary"
                value={selected.status} onChange={e => handleStatusChange(selected.id, e.target.value)} disabled={updatingId === selected.id}>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Edit panel */}
      {editing && (
        <div className="rounded-xl border border-blue-200 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-slate-900">{t("edit_registration")} #{editing.id}</h3>
            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>{t("label_first_name")}</label>
              <input className={inputCls} value={editing.first_name} onChange={e => setEditing({ ...editing, first_name: e.target.value })} /></div>
            <div><label className={labelCls}>{t("label_last_name")}</label>
              <input className={inputCls} value={editing.last_name} onChange={e => setEditing({ ...editing, last_name: e.target.value })} /></div>
            <div><label className={labelCls}>{t("col_email")}</label>
              <input className={inputCls} type="email" value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} /></div>
            <div><label className={labelCls}>{t("label_phone")}</label>
              <input className={inputCls} value={editing.phone_number} onChange={e => setEditing({ ...editing, phone_number: e.target.value })} /></div>
            <div><label className={labelCls}>{t("label_passport")}</label>
              <input className={inputCls} value={editing.passport_number} onChange={e => setEditing({ ...editing, passport_number: e.target.value })} /></div>
            <div><label className={labelCls}>{t("label_status")}</label>
              <select className={inputCls} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select></div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleEditSave} disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50">
              {saving && <Loader2 size={14} className="animate-spin" />} {t("save_changes")}
            </button>
            <button onClick={() => setEditing(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              {t("btn_cancel")}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-slate-500">
            <Loader2 className="animate-spin" size={20} /> {t("loading")}
          </div>
        ) : displayed.length === 0 ? (
          <p className="p-8 text-center text-slate-500">{t("no_registrations")}</p>
        ) : (
          <>
            {/* Batch action bar */}
            {selectedIds.size > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-b border-primary/20 bg-primary/5 px-4 py-2.5">
                <span className="text-sm font-semibold text-primary mr-1">{selectedIds.size} {t("batch_selected")}</span>
                <button onClick={() => handleBatchAction("approve")} disabled={batchBusy}
                  className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition">
                  {batchBusy ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />} {t("batch_approve")}
                </button>
                <button onClick={() => handleBatchAction("cancel")} disabled={batchBusy}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-600 disabled:opacity-50 transition">
                  <XCircle size={12} /> {t("batch_cancel")}
                </button>
                <button onClick={() => handleBatchAction("deny")} disabled={batchBusy}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition">
                  <Ban size={12} /> {t("batch_deny")}
                </button>
                <button onClick={() => handleBatchAction("delete")} disabled={batchBusy}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition">
                  <Trash2 size={12} /> {t("batch_delete")}
                </button>
                <button onClick={() => setSelectedIds(new Set())}
                  className="ml-auto flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                  <X size={12} /> {t("batch_clear")}
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {/* Select-all checkbox */}
                    <th className="px-3 py-3 text-center" style={{ minWidth: colWidths["check"], width: colWidths["check"] }}>
                      <input
                        ref={headerCheckRef}
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </th>
                    <Th col="no" label="№" />
                    <Th col="name"       sortKey="name"       label={t("col_name")} />
                    <Th col="email"      sortKey="email"      label={t("col_email")} />
                    <Th col="passport"   sortKey="passport"   label={t("col_passport")} />
                    <Th col="level"      sortKey="level"      label={t("label_level")} />
                    <Th col="exam_type"  sortKey="exam_type"  label={t("col_exam_type")} />
                    <Th col="region"     sortKey="region"     label={t("label_region")} />
                    <Th col="exam_date"  sortKey="exam_date"  label={t("label_exam_date")} />
                    <Th col="created_at" sortKey="created_at" label={t("col_registered_at")} />
                    <Th col="status"     sortKey="status"     label={t("col_status")} />
                    <Th col="actions"    label={t("col_actions")} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((reg: any, idx: number) => {
                    const isChecked = selectedIds.has(reg.id)
                    return (
                      <tr key={reg.id} className={`hover:bg-slate-50 ${isChecked ? "bg-primary/5" : ""}`}>
                        <td className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleRow(reg.id)}
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-400 text-center tabular-nums">{(safePage - 1) * pageSize + idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{reg.first_name} {reg.last_name}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{reg.email}</td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-xs">{reg.passport_number ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{reg.exams?.exam_levels?.level ?? "—"}</td>
                        <td className="px-4 py-3 text-xs">
                          {reg.exam_type && EXAM_TYPE_LABELS[reg.exam_type] ? (
                            <span className={`inline-block rounded-full px-2 py-0.5 font-medium ${EXAM_TYPE_LABELS[reg.exam_type].cls}`}>
                              {EXAM_TYPE_LABELS[reg.exam_type].label}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs capitalize">{reg.exams?.region ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                          {reg.exams?.exam_date ? fmtDate(reg.exams.exam_date) : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                          {reg.created_at ? fmtDateTime(reg.created_at) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[reg.status] ?? "bg-slate-100 text-slate-800"}`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-3">
                              <button onClick={() => { setSelected(reg); setEditing(null) }}
                                className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-medium">
                                <Eye size={14} /> {t("btn_view")}
                              </button>
                              <button onClick={() => { setEditing({ ...reg }); setSelected(null) }}
                                className="flex items-center gap-1 text-amber-600 hover:text-amber-800 text-xs font-medium">
                                <Pencil size={14} /> {t("btn_edit")}
                              </button>
                              <button onClick={() => handleDelete(reg.id)} disabled={deletingId === reg.id}
                                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50">
                                {deletingId === reg.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} {t("btn_delete")}
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleQuickAction(reg.id, "approve")}
                                disabled={updatingId === reg.id || reg.status === "completed"}
                                className="flex items-center gap-0.5 text-green-700 hover:text-green-900 text-xs font-medium disabled:opacity-40">
                                {updatingId === reg.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />} {t("btn_approve")}
                              </button>
                              <button onClick={() => handleQuickAction(reg.id, "cancel")}
                                disabled={updatingId === reg.id || reg.status === "cancelled"}
                                className="flex items-center gap-0.5 text-slate-500 hover:text-slate-700 text-xs font-medium disabled:opacity-40">
                                <XCircle size={12} /> {t("btn_cancel")}
                              </button>
                              <button onClick={() => handleQuickAction(reg.id, "deny")}
                                disabled={updatingId === reg.id || reg.status === "denied"}
                                className="flex items-center gap-0.5 text-red-700 hover:text-red-900 text-xs font-medium disabled:opacity-40">
                                <Ban size={12} /> {t("btn_deny")}
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-slate-50/60">
                <p className="text-xs text-slate-500">
                  {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, displayed.length)} / {displayed.length}
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
