import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const region = searchParams.get('region')
  const levelId = searchParams.get('levelId')

  let query = supabaseAdmin
    .from('exams')
    .select('id, region, address, exam_date, start_time, end_time, capacity, registered_count, is_active, level_id, exam_levels(level, price)')
    .order('exam_date')

  if (region) query = query.eq('region', region)
  if (levelId) query = query.eq('level_id', parseInt(levelId))
  // Only return future exams when requested — reduces payload and avoids client-side filtering
  if (searchParams.get('future') === 'true') {
    query = query.gte('exam_date', new Date().toISOString())
  }
  // Public requests only see active exams; admin passes ?admin=true to see all
  if (searchParams.get('admin') !== 'true') {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const exams = data ?? []

  // Compute live registered_count from approved registrations — no stale counter
  if (exams.length > 0) {
    const examIds = exams.map((e: any) => e.id)
    const { data: regs } = await supabaseAdmin
      .from('registrations')
      .select('exam_id')
      .in('exam_id', examIds)
      .in('status', ['paid', 'completed'])

    const countMap: Record<number, number> = {}
    regs?.forEach((r: any) => { countMap[r.exam_id] = (countMap[r.exam_id] ?? 0) + 1 })

    return NextResponse.json(
      exams.map((e: any) => ({ ...e, registered_count: countMap[e.id] ?? 0 })),
      { headers: { 'Cache-Control': 'no-store' } }
    )
  }

  return NextResponse.json(exams, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { levelId, region, address, examDate, startTime, endTime, capacity } = body

  if (!levelId || !region || !examDate || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify levelId exists before insert (prevents FK constraint error)
  const { data: levelExists } = await supabaseAdmin
    .from('exam_levels')
    .select('id')
    .eq('id', levelId)
    .maybeSingle()

  if (!levelExists) {
    return NextResponse.json({
      error: `Exam level id=${levelId} not found. Go to the Pricing tab and create exam levels first, then refresh this page.`,
    }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('exams')
    .insert({
      level_id: levelId,
      region,
      address: address || null,
      exam_date: examDate,
      start_time: startTime,
      end_time: endTime,
      capacity: capacity || 30,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, levelId, region, address, examDate, startTime, endTime, capacity } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { isActive } = body
  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  if (levelId)              updates.level_id   = levelId
  if (region)               updates.region     = region
  if (address !== undefined) updates.address   = address || null
  if (examDate)             updates.exam_date  = examDate
  if (startTime)            updates.start_time = startTime
  if (endTime)              updates.end_time   = endTime
  if (capacity)             updates.capacity   = parseInt(capacity)
  if (isActive !== undefined) updates.is_active = isActive

  const { data, error } = await supabaseAdmin
    .from('exams').update(updates).eq('id', parseInt(id)).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const examId = parseInt(id)

  // Cascade: payments → registrations → exam
  const { data: regs } = await supabaseAdmin
    .from('registrations').select('id').eq('exam_id', examId)

  if (regs && regs.length > 0) {
    const regIds = regs.map((r: any) => r.id)
    await supabaseAdmin.from('payments').delete().in('registration_id', regIds)
    await supabaseAdmin.from('registrations').delete().eq('exam_id', examId)
  }

  const { error } = await supabaseAdmin.from('exams').delete().eq('id', examId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
