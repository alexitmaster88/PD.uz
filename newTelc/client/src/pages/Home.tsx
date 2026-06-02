import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { trpc } from "@/lib/trpc";
import { ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import type { Language } from "@shared/i18n";

export default function Home() {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const [, setLocation] = useLocation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const { data: examLevels, isLoading } = trpc.examLevels.list.useQuery();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-bold">
              PD
            </div>
            <div className="text-xl font-bold text-gray-900">{t("header.logo")}</div>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Globe size={18} className="text-accent" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
              <ChevronDown size={16} className={`transition-transform ${showLanguageMenu ? "rotate-180" : ""}`} />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                      language === lang.code ? "bg-orange-50 text-accent font-medium" : "text-gray-700"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <button
            onClick={() => setLocation("/register")}
            className="btn-primary inline-block mb-12"
          >
            {t("hero.cta")}
          </button>

          {/* Decorative element */}
          <div className="flex justify-center gap-4 mb-12">
            <div className="w-20 h-1 bg-accent rounded-full"></div>
            <div className="w-20 h-1 bg-accent rounded-full opacity-50"></div>
            <div className="w-20 h-1 bg-accent rounded-full opacity-25"></div>
          </div>
        </div>
      </section>

      {/* Exam Levels Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("examLevels.title")}
            </h2>
            <p className="text-lg text-gray-600">{t("examLevels.subtitle")}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="exam-level-card animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {examLevels?.map((level) => (
                <div key={level.id} className="exam-level-card">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{level.level}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {level.level === "A2/B1" && "Beginner"}
                    {level.level === "B1" && "Elementary"}
                    {level.level === "B2" && "Intermediate"}
                    {level.level === "C1" && "Advanced"}
                  </p>
                  <div className="exam-level-price">
                    {typeof level.price === "string" ? level.price : String(level.price)}
                  </div>
                  <p className="text-gray-600 text-sm">{t("examLevels.som")}</p>
                  <button
                    onClick={() => setLocation("/register")}
                    className="btn-primary w-full mt-6"
                  >
                    {t("hero.cta")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === "uz" && "Oson Ro'yxatdan O'tish"}
                {language === "en" && "Easy Registration"}
                {language === "de" && "Einfache Anmeldung"}
              </h3>
              <p className="text-gray-600">
                {language === "uz" && "Bir necha daqiqada imtihonga ro'yxatdan o'ting"}
                {language === "en" && "Register for your exam in just a few minutes"}
                {language === "de" && "Melden Sie sich in wenigen Minuten zur Prüfung an"}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === "uz" && "Xavfsiz To'lov"}
                {language === "en" && "Secure Payment"}
                {language === "de" && "Sichere Zahlung"}
              </h3>
              <p className="text-gray-600">
                {language === "uz" && "Turli to'lov usullari orqali xavfsiz to'lov"}
                {language === "en" && "Multiple payment methods for your convenience"}
                {language === "de" && "Mehrere Zahlungsmethoden für Ihre Bequemlichkeit"}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === "uz" && "Rasmiy Sertifikat"}
                {language === "en" && "Official Certificate"}
                {language === "de" && "Offizielles Zertifikat"}
              </h3>
              <p className="text-gray-600">
                {language === "uz" && "Xalqaro telc sertifikati olish"}
                {language === "en" && "Receive your international telc certificate"}
                {language === "de" && "Erhalten Sie Ihr internationales telc-Zertifikat"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            {language === "uz" && "© 2024 Profi Deutsch. Barcha huquqlar himoyalangan."}
            {language === "en" && "© 2024 Profi Deutsch. All rights reserved."}
            {language === "de" && "© 2024 Profi Deutsch. Alle Rechte vorbehalten."}
          </p>
        </div>
      </footer>
    </div>
  );
}
