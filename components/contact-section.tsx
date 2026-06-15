"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, Clock, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import { CONTACT } from "@/lib/contact"

const ContactSection = () => {
  const { t } = useLanguage()
  const [formState, setFormState] = useState({ name: "", email: "", phone: "", subject: "", message: "", course: "" })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormState(prev => ({ ...prev, course: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Name: ${formState.name}\nEmail: ${formState.email}\nPhone: ${formState.phone}\nCourse: ${formState.course}\nSubject: ${formState.subject}\nMessage: ${formState.message}`
    window.open(`https://t.me/UZ_profideutsch?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer")
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormState({ name: "", email: "", phone: "", subject: "", message: "", course: "" })
    }, 5000)
  }

  const infoCard = (icon: React.ReactNode, title: string, lines: string[]) => (
    <div className="flex items-start gap-4 rounded-2xl border border-white/50 bg-white/80 p-5 shadow-sm backdrop-blur-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#130080]/10 text-[#130080]">
        {icon}
      </div>
      <div>
        <h4 className="mb-1.5 font-bold text-[#130080]">{title}</h4>
        {lines.map((l, i) => <p key={i} className="text-sm text-[#130080]/65">{l}</p>)}
      </div>
    </div>
  )

  return (
    <section id="kontakt" className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 -z-10">
        <Image src="/images/course-german.png" alt="" fill className="object-cover opacity-10" />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      </div>

      <div className="container relative">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-[#130080] md:text-4xl">{t("contact_us_title")}</h2>
          <p className="mx-auto max-w-2xl text-[#130080]/65">{t("contact_questions")}</p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          {/* Form */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-[#130080]">{t("send_message")}</h3>
            {isSubmitted ? (
              <div className="flex flex-col items-center rounded-2xl border border-white/50 bg-white/80 p-10 text-center shadow-md backdrop-blur-md">
                <CheckCircle className="mb-4 h-14 w-14 text-green-500" />
                <h3 className="mb-2 text-xl font-bold text-[#130080]">Nachricht gesendet!</h3>
                <p className="text-[#130080]/65">Vielen Dank für Ihre Nachricht. Wir werden uns in Kürze bei Ihnen melden.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#130080]">{t("name")}</label>
                    <Input name="name" value={formState.name} onChange={handleChange} placeholder={t("name")} required
                      className="border-[#130080]/20 bg-white/90 text-[#130080] placeholder:text-[#130080]/40 focus:border-[#130080] focus:ring-[#130080]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#130080]">{t("email")}</label>
                    <Input name="email" type="email" value={formState.email} onChange={handleChange} placeholder="email@beispiel.com" required
                      className="border-[#130080]/20 bg-white/90 text-[#130080] placeholder:text-[#130080]/40 focus:border-[#130080] focus:ring-[#130080]/20" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#130080]">{t("phone_number")}</label>
                    <Input name="phone" value={formState.phone} onChange={handleChange} placeholder="+998 XX XXX XX XX"
                      className="border-[#130080]/20 bg-white/90 text-[#130080] placeholder:text-[#130080]/40 focus:border-[#130080] focus:ring-[#130080]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#130080]">{t("courses")}</label>
                    <Select value={formState.course} onValueChange={handleSelectChange}>
                      <SelectTrigger className="border-[#130080]/20 bg-white/90 text-[#130080] focus:ring-[#130080]/20">
                        <SelectValue placeholder={t("courses")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deutsch-a1">Deutsch A1</SelectItem>
                        <SelectItem value="deutsch-a2">Deutsch A2</SelectItem>
                        <SelectItem value="deutsch-b1">Deutsch B1</SelectItem>
                        <SelectItem value="deutsch-b2">Deutsch B2</SelectItem>
                        <SelectItem value="telc-exam">TELC Exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#130080]">{t("subject")}</label>
                  <Input name="subject" value={formState.subject} onChange={handleChange} placeholder={t("subject")} required
                    className="border-[#130080]/20 bg-white/90 text-[#130080] placeholder:text-[#130080]/40 focus:border-[#130080] focus:ring-[#130080]/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#130080]">{t("message")}</label>
                  <Textarea name="message" value={formState.message} onChange={handleChange} placeholder={t("message")} rows={5} required
                    className="border-[#130080]/20 bg-white/90 text-[#130080] placeholder:text-[#130080]/40 focus:border-[#130080] focus:ring-[#130080]/20" />
                </div>
                <Button type="submit" className="w-full bg-[#130080] text-white hover:bg-[#130080]/90">
                  {t("send")}
                </Button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-[#130080]">{t("contact_info")}</h3>
            <div className="space-y-4">
              {infoCard(<Phone className="h-5 w-5" />, t("phone"), [CONTACT.phone1, CONTACT.phone2])}
              {infoCard(<Mail className="h-5 w-5" />, t("email"), [CONTACT.email])}
              {infoCard(<Clock className="h-5 w-5" />, t("opening_hours"), [t("monday_friday"), t("saturday"), t("sunday")])}
            </div>
            <div className="mt-4 rounded-2xl border border-white/50 bg-white/80 p-5 shadow-sm backdrop-blur-md">
              <h4 className="mb-2 font-bold text-[#130080]">{t("headquarters")}</h4>
              <address className="not-italic text-sm text-[#130080]/65">{t("tashkent_address")}</address>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
