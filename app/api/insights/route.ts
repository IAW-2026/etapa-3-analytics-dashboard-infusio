import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildPrompt, type InsightsPayload } from "@/app/lib/insightsPrompt";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY no configurado" }, { status: 500 });
  }

  let payload: InsightsPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  try {
    const prompt = buildPrompt(payload);
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const content = result.text ?? "";
    return NextResponse.json({ content });
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Error desconocido";

    // Parse quota errors into a human-readable message
    const retryMatch = raw.match(/retry[^0-9]*(\d+)/i);
    const retryIn = retryMatch ? parseInt(retryMatch[1]) : null;

    if (raw.includes("429") || raw.includes("RESOURCE_EXHAUSTED") || raw.includes("quota")) {
      const msg = retryIn
        ? `Límite de la API alcanzado. Reintentá en ${retryIn} segundos.`
        : "Límite diario de la API alcanzado. El cupo se renueva mañana, o podés crear una nueva API key en aistudio.google.com.";
      return NextResponse.json({ error: msg }, { status: 429 });
    }

    return NextResponse.json({ error: raw }, { status: 500 });
  }
}
