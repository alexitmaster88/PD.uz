"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, DollarSign, Users, LogOut } from "lucide-react"
import { TelcProvider } from "@/components/telc/TelcProvider"
import AdminExams from "@/components/telc/admin/AdminExams"
import AdminPricing from "@/components/telc/admin/AdminPricing"
import AdminRegistrations from "@/components/telc/admin/AdminRegistrations"

type Tab = "exams" | "pricing" | "registrations"

const TABS: { id: Tab; label: string; Icon: typeof Calendar }[] = [
  { id: "exams", label: "Manage Exams", Icon: Calendar },
  { id: "pricing", label: "Pricing", Icon: DollarSign },
  { id: "registrations", label: "Registrations", Icon: Users },
]

function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("exams")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => router.push("/de")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <LogOut size={18} />
            Exit
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === id
                    ? "border-orange-500 text-orange-500 font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}>
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === "exams" && <AdminExams lang="uz" />}
        {activeTab === "pricing" && <AdminPricing lang="uz" />}
        {activeTab === "registrations" && <AdminRegistrations lang="uz" />}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <TelcProvider>
      <AdminDashboard />
    </TelcProvider>
  )
}
