import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendRegistrationConfirmation } from '@/server/email'

// Only send for fresh registrations, so this public endpoint can't be used to re-spam old ones.
const MAX_AGE_MS = 2 * 60 * 60 * 1000

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const registrationId = Number(body?.registrationId)
    const lang = typeof body?.lang === 'string' ? body.lang : 'en'
    if (!Number.isInteger(registrationId) || registrationId <= 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // All email content comes from the database, and it goes only to the registrant's own address.
    const { data: reg } = await supabaseAdmin
      .from('registrations')
      .select('id, first_name, last_name, email, passport_number, created_at, exams(region, address, exam_date, start_time, exam_levels(level))')
      .eq('id', registrationId)
      .maybeSingle()

    const exam = reg?.exams
    if (!reg || !exam) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    if (Date.now() - new Date(reg.created_at).getTime() > MAX_AGE_MS) {
      return NextResponse.json({ error: 'Confirmation window expired' }, { status: 410 })
    }

    // Exams without a stored address fall back to the localized region address the client shows.
    const clientAddress = typeof body?.examAddress === 'string' ? body.examAddress.slice(0, 300) : ''

    await sendRegistrationConfirmation(reg.email, {
      registrationId: reg.id,
      firstName: esc(reg.first_name),
      lastName: esc(reg.last_name),
      passportNumber: esc(reg.passport_number),
      level: esc(exam.exam_levels?.level),
      region: exam.region ?? '',
      examDate: new Date(exam.exam_date),
      startTime: esc(exam.start_time),
      examAddress: esc(exam.address || clientAddress),
      lang,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[send-confirmation]', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
