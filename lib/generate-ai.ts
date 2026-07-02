"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateNote, type NursingForm } from "./generate-note";

export async function generateAIContent(formData: NursingForm) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GEMINI_API_KEY no configurada");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" }); 

  const rawNote = generateNote(formData);

  const systemInstruction = `
    Eres un profesional experto en enfermería de cuidados intensivos. 
    Tu única función es transformar información clínica en notas de enfermería profesionales, 
    técnicas y cronológicas. 
    
    REGLAS DE FORMATO:
    - NO uses asteriscos (**), negritas, ni ningún formato Markdown.
    - Usa texto plano.
    - Usa mayúsculas para los títulos de las secciones.
    - Orden Cefalocaudal estricto.
    - NO saludes ni te presentes.
    - Responde ÚNICAMENTE con la nota clínica.
    
    ESTRUCTURA:
    1. Inicio (Recibo paciente...)
    2. Orden Cefalocaudal (CABEZA, CUELLO, RESPIRATORIO, TÓRAX, EXTREMIDADES, ABDOMEN, GENITALES, EXTREMIDADES INFERIORES)
    3. Final obligatorio: "Paciente continúa bajo monitorización continua y manejo integral conforme a indicaciones médicas."
  `;

  const prompt = `${systemInstruction} \n\n DATOS CLÍNICOS: ${rawNote}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error en Gemini:", error);
    throw new Error("Error al generar la nota clínica.");
  }
}