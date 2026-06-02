import { NextResponse } from 'next/server'
import { sendRegistrationConfirmation } from '@/server/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      registrationId, firstName, lastName, email,
      passportNumber, levelName, region,
      selectedDate, selectedTime, examAddress, lang,
    } = body

    if (!email || !registrationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await sendRegistrationConfirmation(email, {
      registrationId: Number(registrationId),
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      passportNumber: passportNumber ?? '',
      level: levelName ?? '',
      region: region ?? '',
      examDate: selectedDate ? new Date(selectedDate) : new Date(),
      startTime: selectedTime ?? '',
      examAddress: examAddress ?? '',
      lang: lang ?? 'en',
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[send-confirmation]', err)
    return NextResponse.json({ error: err?.message ?? 'Failed to send email' }, { status: 500 })
  }
}
