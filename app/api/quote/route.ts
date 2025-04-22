import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.json()
  const { email, type, budget, note } = body

  try {
    const data = await resend.emails.send({
      from: 'Mini AI Hub <onboarding@resend.dev>',
      to: ['info.digitalautomationsolutions@gmail.com'],
      subject: 'Nuovo preventivo ricevuto',
      html: `
        <h2>Nuovo Preventivo</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tipo:</strong> ${type}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Note:</strong> ${note}</p>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Errore nell\'invio dell\'email:', err)
    return NextResponse.json({ success: false, error: err }, { status: 500 })
  }
} 