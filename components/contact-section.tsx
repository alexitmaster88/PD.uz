"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, Clock, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

const ContactSection = () => {
  const { t } = useLanguage()

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    course: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormState((prev) => ({ ...prev, course: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would normally send the form data to your backend
    console.log("Form submitted:", formState)

    // Show success message
    setIsSubmitted(true)

    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        course: "",
      })
    }, 5000)
  }

  return (
    <section id="kontakt" className="py-16 md:py-24 bg-secondary/50 relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/german-culture-2.png" alt="Contact background" fill className="object-cover opacity-10" />
        <div className="absolute inset-0 bg-secondary/70"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("contact_us_title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("contact_questions")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">{t("send_message")}</h3>

            {isSubmitted ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="mb-4 text-green-500">
                      <CheckCircle className="h-16 w-16" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Nachricht gesendet!</h3>
                    <p className="text-muted-foreground">
                      Vielen Dank für Ihre Nachricht. Wir werden uns in Kürze bei Ihnen melden.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {t("name")}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder={t("name")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t("email")}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="ihre-email@beispiel.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      {t("phone_number")}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder="+998 XX XXX XX XX"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="course" className="text-sm font-medium">
                      {t("courses")}
                    </label>
                    <Select value={formState.course} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("courses")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deutsch-a1">Deutsch A1</SelectItem>
                        <SelectItem value="deutsch-a2">Deutsch A2</SelectItem>
                        <SelectItem value="deutsch-b1">Deutsch B1</SelectItem>
                        <SelectItem value="deutsch-b2">Deutsch B2</SelectItem>
                        <SelectItem value="englisch">Englisch</SelectItem>
                        <SelectItem value="russisch">Russisch</SelectItem>
                        <SelectItem value="usbekisch">Usbekisch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    {t("subject")}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    placeholder={t("subject")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t("message")}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder={t("message")}
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {t("send")}
                </Button>
              </form>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">{t("contact_info")}</h3>

            <div className="grid gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t("phone")}</h4>
                      <p className="text-muted-foreground">+998 71 123 4567</p>
                      <p className="text-muted-foreground">+998 71 987 6543</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t("email")}</h4>
                      <p className="text-muted-foreground">info@profideutsch.uz</p>
                      <p className="text-muted-foreground">kurse@profideutsch.uz</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t("opening_hours")}</h4>
                      <p className="text-muted-foreground">{t("monday_friday")}</p>
                      <p className="text-muted-foreground">{t("saturday")}</p>
                      <p className="text-muted-foreground">{t("sunday")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-background rounded-lg border">
              <h4 className="font-bold mb-2">{t("headquarters")}</h4>
              <address className="not-italic text-muted-foreground">
                Amir Temur Straße 107A
                <br />
                Taschkent, 100084
                <br />
                Usbekistan
              </address>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
