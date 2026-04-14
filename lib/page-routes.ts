import { BookOpen, Home, MapPin, Menu as MenuIcon } from "lucide-react"

export const pageRoutes = [
  {
    href: "/",
    labelKey: "left_menu_home",
    icon: Home,
  },
  {
    href: "/telc",
    labelKey: "left_menu_telc",
    icon: MenuIcon,
  },
  {
    href: "/telc/booking",
    labelKey: "left_menu_telc_booking",
    icon: BookOpen,
  },
  {
    href: "#kontakt",
    labelKey: "left_menu_contact",
    icon: MapPin,
  },
]
