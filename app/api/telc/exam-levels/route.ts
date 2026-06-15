import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('exam_levels')
    .select('*')
    .order('id')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
  })
}

export async function POST(req: Request) {
  const { level, price } = await req.json()
  if (!level || price === undefined) {
    return NextResponse.json({ error: 'level and price required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('exam_levels')
    .insert({ level: level.trim(), price: parseFloat(price) })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const levelId = parseInt(id)

  // Cascade: payments → registrations → exams → level
  const { data: exams } = await supabaseAdmin
    .from('exams').select('id').eq('level_id', levelId)

  if (exams && exams.length > 0) {
    const examIds = exams.map((e: any) => e.id)
    const { data: regs } = await supabaseAdmin
      .from('registrations').select('id').in('exam_id', examIds)
    if (regs && regs.length > 0) {
      const regIds = regs.map((r: any) => r.id)
      await supabaseAdmin.from('payments').delete().in('registration_id', regIds)
      await supabaseAdmin.from('registrations').delete().in('exam_id', examIds)
    }
    await supabaseAdmin.from('exams').delete().in('level_id', [levelId])
  }

  const { error } = await supabaseAdmin.from('exam_levels').delete().eq('id', levelId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: Request) {
  const { levelId, price } = await req.json()
  if (!levelId || price === undefined) {
    return NextResponse.json({ error: 'levelId and price required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('exam_levels')
    .update({ price: parseFloat(price), updated_at: new Date().toISOString() })
    .eq('id', levelId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
