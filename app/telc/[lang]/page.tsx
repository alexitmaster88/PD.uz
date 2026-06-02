import { redirect } from "next/navigation"

interface PageProps { params: Promise<{ lang: string }> }

export default async function TelcLangPage({ params }: PageProps) {
  const { lang } = await params
  redirect(`/telc/${lang}/register`)
}
