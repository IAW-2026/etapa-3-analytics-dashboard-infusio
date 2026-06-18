import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "No API key" }, { status: 500 });

  const genAI = new GoogleGenAI({ apiKey });
  const pager = await genAI.models.list();
  const names = pager.page.map((m) => m.name ?? "");
  return NextResponse.json({ models: names });
}
