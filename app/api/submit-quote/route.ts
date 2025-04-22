import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from 'resend';

// Verifica variabili d'ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Variabili d'ambiente Supabase mancanti:", {
    url: supabaseUrl ? "presente" : "mancante",
    key: supabaseServiceKey ? "presente" : "mancante"
  });
}

if (!resendApiKey || !adminEmail) {
  console.error("Variabili d'ambiente email mancanti:", {
    resend: resendApiKey ? "presente" : "mancante",
    admin: adminEmail ? "presente" : "mancante"
  });
}

const resend = new Resend(resendApiKey);
const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
  db: { 
    schema: 'public'
  }
});

// Funzione per creare la tabella quote_requests
async function createQuoteRequestsTable() {
  try {
    const { data, error } = await supabase.from('quote_requests').select('id').limit(1);
    
    if (error?.code === '42P01') { // tabella non esiste
      const query = `
        create table if not exists quote_requests (
          id uuid primary key default gen_random_uuid(),
          name text not null,
          email text not null,
          message text not null,
          created_at timestamp with time zone default now()
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { query });
      
      if (createError) {
        console.error("Errore creazione tabella:", createError);
        return false;
      }
      
      // Aggiungi le policy di sicurezza
      const policies = [
        `create policy "Enable insert for all users" on quote_requests for insert with check (true);`,
        `create policy "Enable select for authenticated users only" on quote_requests for select using (auth.role() = 'authenticated');`,
        `alter table quote_requests enable row level security;`
      ];
      
      for (const policy of policies) {
        const { error: policyError } = await supabase.rpc('exec_sql', { query: policy });
        if (policyError) {
          console.error("Errore creazione policy:", policyError);
          // Continuiamo comunque, le policy non sono critiche per il funzionamento
        }
      }
      
      return true;
    }
    
    return true; // tabella esiste già
  } catch (err) {
    console.error("Errore durante la creazione della tabella:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nome, email e messaggio sono richiesti" },
        { status: 400 }
      );
    }

    // Verifica/crea tabella
    const tableReady = await createQuoteRequestsTable();
    if (!tableReady) {
      return NextResponse.json(
        { error: "Errore configurazione database" },
        { status: 500 }
      );
    }

    // Salva il preventivo nel database
    const { error: dbError } = await supabase
      .from("quote_requests")
      .insert({
        name,
        email,
        message,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error("Errore salvataggio preventivo:", dbError);
      return NextResponse.json(
        { error: "Errore durante il salvataggio" },
        { status: 500 }
      );
    }

    // Invia email di notifica all'admin
    if (resendApiKey && adminEmail) {
      try {
        await resend.emails.send({
          from: "Mini AI Hub <onboarding@resend.dev>",
          to: adminEmail,
          subject: "Nuovo preventivo richiesto",
          html: `
            <h2>Nuovo preventivo richiesto</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Messaggio:</strong></p>
            <p>${message}</p>
          `
        });
      } catch (emailError) {
        console.error("Errore invio email admin:", emailError);
      }
    }

    // Invia email di conferma al cliente
    if (resendApiKey) {
      try {
        await resend.emails.send({
          from: "Mini AI Hub <onboarding@resend.dev>",
          to: email,
          subject: "Richiesta ricevuta",
          html: `<p>Ciao ${name},</p><p>Abbiamo ricevuto la tua richiesta. Ti risponderemo il prima possibile.</p>`
        });
      } catch (emailError) {
        console.error("Errore invio email cliente:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Preventivo inviato con successo"
    });
  } catch (err) {
    console.error("Errore invio preventivo:", err);
    return NextResponse.json(
      { error: "Errore durante l'invio del preventivo" },
      { status: 500 }
    );
  }
} 