import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
})

export async function askChatGPT(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    })

    return completion.choices[0].message.content || 'Nessuna risposta'
  } catch (error) {
    console.error('Errore nella chiamata a OpenAI:', error)
    return 'Si è verificato un errore nella generazione della risposta.'
  }
} 