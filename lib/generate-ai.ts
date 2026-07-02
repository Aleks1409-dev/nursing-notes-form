"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { generateNote, type NursingForm } from "./generate-note"

export async function generateAIContent(formData: NursingForm) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) throw new Error("GOOGLE_GEMINI_API_KEY no configurada")

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" })
  const rawNote = generateNote(formData)
  const prompt = `Actúa como un enfermero experto...`

  const result = await model.generateContent(prompt)
  return result.response.text()
}   