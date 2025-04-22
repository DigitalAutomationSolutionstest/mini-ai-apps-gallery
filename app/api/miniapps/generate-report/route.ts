import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  const { input } = await req.json()

  if (!input) {
    return NextResponse.json({ error: 'Testo mancante' }, { status: 400 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Genera un report professionale in formato testo a partire da questo contenuto:' },
        { role: 'user', content: input }
      ]
    })

    const report = completion.choices[0]?.message.content
    return NextResponse.json({ result: report })
  } catch (error) {
    return NextResponse.json({ error: 'Errore generazione report' }, { status: 500 })
  }
} 