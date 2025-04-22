import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, type, budget, note } = body

    await resend.emails.send({
      from: 'Mini Ai App <info@miniaiapp.dev>',
      to: ['digitalautomation.it@gmail.com'],
      subject: '🧠 Nuova richiesta progetto AI',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nuova richiesta progetto AI</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Tipo:</strong> ${type}</p>
            <p><strong>Budget:</strong> ${budget}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
          </div>
          <p style="color: #666; font-size: 14px;">Questa email è stata inviata automaticamente dal form di contatto.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error)
    return NextResponse.json(
      { error: 'Errore nell\'invio dell\'email' },
      { status: 500 }
    )
  }
} 