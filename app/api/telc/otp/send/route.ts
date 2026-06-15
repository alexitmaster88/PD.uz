import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendOtpEmail } from '@/server/email'

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

  // Block denied emails from registering
  const { data: deniedReg } = await supabaseAdmin
    .from('registrations')
    .select('id')
    .eq('email', email)
    .eq('status', 'denied')
    .limit(1)
    .maybeSingle()

  if (deniedReg) {
    return NextResponse.json(
      { error: 'This email has been blocked. Please contact us or register with a different email.' },
      { status: 403 }
    )
  }

  // Rate limit: one OTP per 60 seconds
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
  const { data: recentOtp } = await supabaseAdmin
    .from('otp_verifications')
    .select('created_at')
    .eq('email', email)
    .eq('verified', false)
    .gte('created_at', oneMinuteAgo)
    .limit(1)
    .maybeSingle()

  if (recentOtp) {
    return NextResponse.json({ error: 'Please wait 60 seconds before requesting another OTP' }, { status: 429 })
  }

  // Delete any previous unverified OTPs for this email
  await supabaseAdmin
    .from('otp_verifications')
    .delete()
    .eq('email', email)
    .eq('verified', false)

  const { error } = await supabaseAdmin.from('otp_verifications').insert({
    email,
    otp,
    verified: false,
    expires_at: expiresAt,
  })

  if (error) {
    console.error('[OTP] Supabase insert failed:', error.message)
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 })
  }

  try {
    await sendOtpEmail(email, otp)
  } catch (emailErr) {
    console.error('[OTP] Email send error:', emailErr)
  }

  return NextResponse.json({ success: true, message: 'OTP sent to your email' })
}
