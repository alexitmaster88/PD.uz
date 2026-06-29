import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('registrations')
    .select('*, exams(region, exam_date, start_time, level_id, exam_levels(level))')
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
        status: 'pending',
        email_verified: false,
        payment_verified: false,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // If OTP was already verified for this email, mark email_verified and advance status
    const { data: verifiedOtp } = await supabaseAdmin
      .from('otp_verifications')
      .select('id')
      .eq('email', email)
      .eq('verified', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (verifiedOtp) {
      await supabaseAdmin
        .from('registrations')
        .update({ email_verified: true, status: 'verified' })
        .eq('id', data.id)
      data.email_verified = true
      data.status = 'verified'
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, status, firstName, lastName, phoneNumber, email, passportNumber } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
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
