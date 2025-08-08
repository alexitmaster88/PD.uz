'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'

type FormState = {
  name: string
  email: string
  message: string
  course?: string
}

export default function ContactSection() {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
    course: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: wire up to your backend/email service here
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <section id="kontakt" className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-semibold">Vielen Dank!</h2>
          <p className="mt-2 text-muted-foreground">
            Ihre Nachricht wurde gesendet. Wir melden uns bald bei Ihnen.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="kontakt" className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-3xl font-bold tracking-tight">Kontakt</h2>
        <p className="mt-2 text-muted-foreground">
          Haben Sie Fragen? Schreiben Sie uns – wir helfen gerne weiter.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formState.name}
              onChange={handleChange}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">E-Mail</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formState.email}
              onChange={handleChange}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="course" className="text-sm font-medium">Kurs</label>
            <select
              id="course"
              name="course"
              value={formState.course}
              onChange={handleChange}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Bitte wählen…</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium">Nachricht</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formState.message}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Senden
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}