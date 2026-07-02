"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateNote, type NursingForm } from "./generate-note";

export async function generateAIContent(formData: NursingForm) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GEMINI_API_KEY no configurada");

  const genAI = new GoogleGenerativeAI(apiKey);
  // Usamos el modelo que ya confirmamos que te funciona
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" }); 

  const rawNote = generateNote(formData);

  // Aquí insertamos el System Prompt que te pasó tu novio
  const systemInstruction = `
    Eres un profesional experto en enfermería de cuidados intensivos. 
    Tu única función es transformar información clínica en notas de enfermería completas, 
    técnicas, objetivas y cronológicas, siguiendo estrictamente el orden cefalocaudal 
    y la estructura que te proporcionaré. No inventas datos. Si no se suministra un dato, 
    no aparece. Responde ÚNICAMENTE con la nota clínica, sin saludos ni presentaciones.
    
    ESTRUCTURA OBLIGATORIA:
    1. Inicio (Recibo paciente...)
    2. Orden Cefalocaudal (Cabeza, Cuello, Respiratorio, Tórax, Extremidades, Abdomen, Genitales, Ext. Inferiores)
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