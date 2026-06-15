import { Home, MapPin, Menu as MenuIcon } from "lucide-react"

export const pageRoutes = [
  {
    href: "/",
    labelKey: "left_menu_home",
    icon: Home,
  },
  {
    href: "/telc/booking",
    labelKey: "left_menu_telc_booking",
    icon: MenuIcon,
  },
  {
    href: "#kontakt",
    labelKey: "left_menu_contact",
    icon: MapPin,
  },
]
