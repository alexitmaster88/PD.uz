import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
import { BarChart3, Calendar, DollarSign, Users, LogOut } from "lucide-react";
import AdminExams from "@/components/admin/AdminExams";
import AdminPricing from "@/components/admin/AdminPricing";
import AdminRegistrations from "@/components/admin/AdminRegistrations";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<"exams" | "pricing" | "registrations">("exams");

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You do not have permission to access this page.</p>
          <button
            onClick={() => setLocation("/")}
            className="btn-primary w-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const tabs = [
    { id: "exams", label: "Manage Exams", icon: Calendar },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "registrations", label: "Registrations", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-bold">
              AD
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-accent text-accent font-semibold"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "exams" && <AdminExams />}
        {activeTab === "pricing" && <AdminPricing />}
        {activeTab === "registrations" && <AdminRegistrations />}
      </div>
    </div>
  );
}
