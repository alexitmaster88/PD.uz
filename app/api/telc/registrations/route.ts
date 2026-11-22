import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireTelcAdmin } from '@/lib/telc-admin-auth'
import type { RegistrationStatus, TablesUpdate } from '@/types/database'

const REGISTRATION_STATUSES: readonly RegistrationStatus[] = ['pending', 'verified', 'paid', 'completed', 'cancelled', 'denied']

export async function GET(req: Request) {
  const auth = await requireTelcAdmin(req)
  if (auth instanceof NextResponse) return auth
  const { data, error } = await supabaseAdmin
    .from('registrations')
    .select('*, exams(region, address, exam_date, start_time, end_time, level_id, exam_levels(level, price))')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      examId, firstName, lastName, phoneNumber, email, passportNumber,
      dateOfBirth, gender, nationality, countryOfBirth, cityOfBirth,
      currentAddress, documentType, examType,
    } = body

    if (!examId || !firstName || !lastName || !phoneNumber || !email || !passportNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Server-side proof the email was OTP-verified (the client-side flag alone can be bypassed)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const { data: verifiedOtp } = await supabaseAdmin
      .from('otp_verifications')
      .select('id')
      .eq('email', email)
      .eq('verified', true)
      .gte('created_at', twoHoursAgo)
      .limit(1)
      .maybeSingle()

    if (!verifiedOtp) {
      return NextResponse.json(
        { error: 'Email not verified. Please verify your email with the code we sent.' },
        { status: 403 }
      )
    }

    // Check exam capacity
    const { data: exam } = await supabaseAdmin
      .from('exams')
      .select('capacity')
      .eq('id', examId)
      .maybeSingle()

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    const { count: registeredCount } = await supabaseAdmin
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('exam_id', examId)
      .in('status', ['pending', 'verified', 'paid', 'completed'])

    if ((registeredCount ?? 0) >= exam.capacity) {
      return NextResponse.json(
        { error: 'This exam is fully booked. Please choose a different date.' },
        { status: 409 }
      )
    }

    // Check for duplicate passport in the same exam
    const { data: existing } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('exam_id', examId)
      .eq('passport_number', passportNumber)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'This passport number is already registered for this exam' },
        { status: 409 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .insert({
        exam_id: examId,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email,
        passport_number: passportNumber,
        date_of_birth: dateOfBirth ?? null,
        gender: gender ?? null,
        nationality: nationality ?? null,
        country_of_birth: countryOfBirth ?? null,
        city_of_birth: cityOfBirth ?? null,
        current_address: currentAddress ?? null,
        document_type: documentType ?? 'passport',
        exam_type: examType ?? null,
        // OTP verification was confirmed server-side above
        status: 'verified',
        email_verified: true,
        payment_verified: false,
      })
      .select()
      .single()

    if (error) { console.error('[registrations POST]', error.message); return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 }) }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('[registrations POST]', err); return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const auth = await requireTelcAdmin(req)
  if (auth instanceof NextResponse) return auth
  const body = await req.json()
  const { id, status, firstName, lastName, phoneNumber, email, passportNumber } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  if (status && !REGISTRATION_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 })
  }

  const updates: TablesUpdate<'registrations'> = { updated_at: new Date().toISOString() }
  if (status)         updates.status          = status
  if (firstName)      updates.first_name      = firstName
  if (lastName)       updates.last_name       = lastName
  if (phoneNumber)    updates.phone_number    = phoneNumber
  if (email)          updates.email           = email
  if (passportNumber) updates.passport_number = passportNumber

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const auth = await requireTelcAdmin(req)
  if (auth instanceof NextResponse) return auth
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const regId = parseInt(id)

  // Delete child payments first to satisfy FK constraint
  const { error: paymentsError } = await supabaseAdmin
    .from('payments')
    .delete()
    .eq('registration_id', regId)

  if (paymentsError) return NextResponse.json({ error: paymentsError.message }, { status: 500 })

  const { error } = await supabaseAdmin
    .from('registrations')
    .delete()
    .eq('id', regId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
