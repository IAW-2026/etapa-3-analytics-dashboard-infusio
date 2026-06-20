import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { buildPrompt, type InsightsPayload } from "@/app/lib/insightsPrompt";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY no configurado" }, { status: 500 });
  }

  let payload: InsightsPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  try {
    const prompt = buildPrompt(payload);
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    });
    const content = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ content });
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Error desconocido";

    if (raw.includes("429") || raw.includes("rate_limit") || raw.includes("quota")) {
      return NextResponse.json(
        { error: "Límite de la API alcanzado. Esperá unos segundos y volvé a intentar." },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: raw }, { status: 500 });
  }
}
