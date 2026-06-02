import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .select('*, registrations(id, first_name, last_name, email, passport_number, phone_number)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const body = await req.json()
  const { registrationId, amount, paymentMethod, personalId, checkId } = body

  if (!registrationId || !amount || !paymentMethod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Try inserting with new columns; fall back gracefully if columns not yet migrated in DB
  let result = await supabaseAdmin
    .from('payments')
    .insert({
      registration_id: registrationId,
      amount: parseFloat(amount),
      payment_method: paymentMethod,
      status: 'pending',
      payer_inn: personalId ?? null,
      check_id: checkId ?? null,
    })
    .select()
    .single()

  if (result.error?.message?.includes('payer_inn') || result.error?.message?.includes('check_id')) {
    // Columns not yet added to DB — insert without them until migration is applied
    result = await supabaseAdmin
      .from('payments')
      .insert({
        registration_id: registrationId,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        status: 'pending',
      })
      .select()
      .single()
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json(result.data, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { paymentId, registrationId, action = 'accept' } = body

  if (!paymentId) return NextResponse.json({ error: 'paymentId required' }, { status: 400 })

  const now = new Date().toISOString()
  const isAccept = action === 'accept'

  const { data: payment, error: payErr } = await supabaseAdmin
    .from('payments')
    .update(isAccept
      ? { status: 'completed', verified_at: now, updated_at: now }
      : { status: 'cancelled', updated_at: now }
    )
    .eq('id', paymentId)
    .select()
    .single()

  if (payErr) return NextResponse.json({ error: payErr.message }, { status: 500 })

  if (registrationId) {
    await supabaseAdmin
      .from('registrations')
      .update(isAccept
        ? { payment_verified: true, status: 'paid', updated_at: now }
        : { payment_verified: false, status: 'verified', updated_at: now }
      )
      .eq('id', registrationId)
  }

  return NextResponse.json(payment)
}
