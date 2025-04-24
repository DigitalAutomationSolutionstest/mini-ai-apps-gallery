import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name, message } = await req.json();

  try {
    const response = await resend.emails.send({
      from: "Mini AI Hub <info@miniaiapps.tech>",
      to: email,
      subject: "Grazie per la tua richiesta!",
      html: `<p>Ciao ${name},</p><p>Abbiamo ricevuto la tua richiesta: <br/>${message}</p><p>Ti risponderemo a breve.</p>`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
} 