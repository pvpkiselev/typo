import { NextRequest, NextResponse } from 'next/server'

import { formatText } from '@/lib/format/formatText'
import { zFormatSchema } from '@/types/typoTypes'

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json()
    const validationResult = zFormatSchema.safeParse(requestBody)

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Errors in request body' }, { status: 400 })
    }

    const { sourceText, formatMode } = validationResult.data

    const { result, highlighted } = formatText(sourceText, formatMode)

    return NextResponse.json({
      result,
      highlighted,
    })
  } catch (e: unknown) {
    console.error(e)

    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
