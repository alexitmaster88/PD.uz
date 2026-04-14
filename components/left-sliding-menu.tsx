"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Menu as MenuIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { usePathname } from "next/navigation"
import { pageRoutes } from "@/lib/page-routes"

const LeftSlidingMenu = () => {
  const { t, getLanguagePath } = useLanguage()
  const pathname = usePathname() || "/"
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY + 20) {
        setIsOpen(false)
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = useMemo(
    () =>
      pageRoutes.map((route) => ({
        ...route,
        href: getLanguagePath(route.href),
        label: t(route.labelKey),
      })),
    [getLanguagePath, t]
  )

  return (
    <aside className="fixed left-0 top-1/2 z-50 hidden -translate-y-1/2 md:block">
      <div
        className={`relative flex items-center overflow-hidden rounded-r-full border border-slate-200/70 bg-white/95 shadow-xl shadow-slate-900/10 transition-all duration-300 ${
          isOpen ? "w-56 px-3 py-3" : "w-12 px-0 py-2"
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          className="flex h-12 w-12 items-center justify-center rounded-r-full bg-primary text-white shadow-lg transition-colors duration-200 hover:bg-primary/90"
          onClick={() => setIsOpen((value) => !value)}
          aria-label={t("left_menu_title")}
          type="button"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <div
          className={`ml-2 flex w-full flex-col gap-2 transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href.startsWith("/telc") && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors duration-200 ${
                  isActive ? "bg-primary/10 text-primary font-semibold" : "text-slate-700 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export default LeftSlidingMenu
