import { redirect } from "next/navigation"

export default function Home() {
  // This page will never be rendered because the middleware will redirect
  // to a language-specific page, but we'll add a fallback just in case
  redirect("/de")

  return null
}
