"use client"

import { useState, useEffect } from "react"
import { Edit2, Save, X, Loader2, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import { type AdminLang, adminT } from "@/lib/admin-i18n"

interface Props { lang: AdminLang }

export default function AdminPricing({ lang }: Props) {
  const t = (key: string) => adminT(lang, key)
  const [levels, setLevels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [prices, setPrices] = useState<Record<number, string>>({})
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLevel, setNewLevel] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [adding, setAdding] = useState(false)

  const load = async () => {
    setLoading(true)
    const data = await fetch("/api/telc/exam-levels").then(r => r.json()).catch(() => [])
    const arr = Array.isArray(data) ? data : []
    setLevels(arr)
    const map: Record<number, string> = {}
    arr.forEach((l: any) => { map[l.id] = String(l.price) })
    setPrices(map)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAddLevel = async () => {
    if (!newLevel.trim() || !newPrice) return
    setAdding(true)
    try {
      const res = await fetch("/api/telc/exam-levels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: newLevel.trim(), price: newPrice }),
      })
      if (!res.ok) throw new Error()
      toast.success(t("level_added"))
      setShowAddForm(false)
      setNewLevel("")
      setNewPrice("")
      load()
    } catch {
      toast.error(t("level_add_failed"))
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (levelId: number) => {
    if (!confirm(t("confirm_delete_level"))) return
    const res = await fetch(`/api/telc/exam-levels?id=${levelId}`, { method: "DELETE" })
    if (res.ok) { toast.success(t("level_deleted")); load() }
    else toast.error(t("level_delete_failed"))
  }

  const handleSave = async (levelId: number) => {
    setSaving(true)
    try {
      const res = await fetch("/api/telc/exam-levels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelId, price: prices[levelId] }),
      })
      if (!res.ok) throw new Error()
      toast.success(t("price_updated"))
      setEditingId(null)
      load()
    } catch {
      toast.error(t("price_update_failed"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center gap-2 p-8 text-slate-500">
      <Loader2 className="animate-spin" size={20} /> {t("loading")}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{t("manage_pricing")}</h2>
        <button
          onClick={() => { setShowAddForm(v => !v); setNewLevel(""); setNewPrice("") }}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus size={15} /> {t("add_level")}
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">{t("add_new_level")}</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">{t("label_level_name")}</label>
              <input
                type="text"
                placeholder={t("level_name_placeholder")}
                value={newLevel}
                onChange={e => setNewLevel(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="w-48">
              <label className="mb-1 block text-xs font-medium text-slate-600">{t("col_price")} (UZS)</label>
              <input
                type="number"
                placeholder="0"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleAddLevel}
                disabled={adding || !newLevel.trim() || !newPrice}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {adding ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {t("btn_save")}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {[t("label_level"), t("col_price"), t("col_actions")].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {levels.map((level: any) => (
              <tr key={level.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{level.level}</td>
                <td className="px-6 py-4 text-slate-600">
                  {editingId === level.id ? (
                    <input
                      type="number"
                      className="w-40 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:border-primary"
                      value={prices[level.id]}
                      onChange={e => setPrices({ ...prices, [level.id]: e.target.value })}
                    />
                  ) : (
                    `${Number(prices[level.id]).toLocaleString()} UZS`
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === level.id ? (
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleSave(level.id)} disabled={saving}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-medium">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {t("btn_save")}
                      </button>
                      <button onClick={() => setEditingId(null)}
                        className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-xs">
                        <X size={14} /> {t("btn_cancel")}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button onClick={() => setEditingId(level.id)}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-medium">
                        <Edit2 size={14} /> {t("btn_edit")}
                      </button>
                      <button onClick={() => handleDelete(level.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-medium">
                        <Trash2 size={14} /> {t("btn_delete")}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
