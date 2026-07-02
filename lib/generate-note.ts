import { GoogleGenerativeAI } from "@google/generative-ai";

export type NursingForm = {
  paciente: string
  cama: string
  fecha: string
  turno: string
  estadoConciencia: string
  glasgow: string
  pupilas: string
  neuroHallazgos: string[]
  neuroObs: string
  presionArterial: string
  frecuenciaCardiaca: string
  ritmo: string
  hemoHallazgos: string[]
  hemoObs: string
  patronRespiratorio: string
  saturacion: string
  soporteO2: string
  respHallazgos: string[]
  respObs: string
  cuello: string[]
  cuelloObs: string
  toraxAuscultacion: string
  torax: string[]
  toraxObs: string
  perfusion: string
  extremidades: string[]
  extremidadesObs: string
  abdomenForma: string
  ruidosIntestinales: string
  abdomen: string[]
  abdomenObs: string
  genitales: string[]
  sondaVesical: string
  genitalesObs: string
  lesiones: string[]
  lesionesObs: string
  eventos: string
}

export const initialForm: NursingForm = {
  paciente: "",
  cama: "",
  fecha: new Date().toISOString().split('T')[0], // Pone la fecha de hoy automáticamente
  turno: "Mañana",
  estadoConciencia: "Alerta",
  glasgow: "15",
  pupilas: "Isocóricas reactivas",
  neuroHallazgos: [],
  neuroObs: "",
  presionArterial: "",
  frecuenciaCardiaca: "",
  ritmo: "Regular",
  hemoHallazgos: [],
  hemoObs: "",
  patronRespiratorio: "Eupneico",
  saturacion: "",
  soporteO2: "Aire ambiente",
  respHallazgos: [],
  respObs: "",
  cuello: [],
  cuelloObs: "",
  toraxAuscultacion: "Murmullo vesicular conservado",
  torax: [],
  toraxObs: "",
  perfusion: "Adecuada",
  extremidades: [],
  extremidadesObs: "",
  abdomenForma: "Blando y depresible",
  ruidosIntestinales: "Presentes",
  abdomen: [],
  abdomenObs: "",
  genitales: [],
  sondaVesical: "No",
  genitalesObs: "",
  lesiones: [],
  lesionesObs: "",
  eventos: ""
}


function join(items: string[]): string {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  return items.slice(0, -1).join(", ") + " y " + items[items.length - 1]
}

function line(label: string, parts: (string | undefined)[]): string {
  const clean = parts.map((p) => (p ?? "").trim()).filter(Boolean)
  if (clean.length === 0) return ""
  return `${label}: ${clean.join(". ")}.`
}

// NUEVA FUNCIÓN QUE CONECTA CON IA
export async function generateAIContent(formData: NursingForm) {
  // Primero generamos el formato base con tu función
  const rawNote = generateNote(formData);
  
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `Actúa como un enfermero experto. Mejora y redacta de forma profesional y clínica la siguiente nota de enfermería. Mantén los datos clínicos exactos pero mejora la redacción para un historial médico: \n\n${rawNote}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export function generateNote(f: NursingForm): string {
  const lines: string[] = []
  const header: string[] = []
  if (f.paciente) header.push(`Paciente: ${f.paciente}`)
  if (f.cama) header.push(`Cama/Ubicación: ${f.cama}`)
  if (f.fecha) header.push(`Fecha: ${f.fecha}`)
  header.push(`Turno: ${f.turno}`)
  lines.push(header.join("  |  "))
  lines.push("")

  lines.push(line("NEUROLÓGICO", [`Paciente ${f.estadoConciencia.toLowerCase()}`, f.glasgow ? `Glasgow ${f.glasgow}/15` : undefined, `pupilas ${f.pupilas.toLowerCase()}`, f.neuroHallazgos.length ? `se evidencia ${join(f.neuroHallazgos).toLowerCase()}` : undefined, f.neuroObs]))
  lines.push(line("HEMODINAMIA", [f.presionArterial ? `TA ${f.presionArterial} mmHg` : undefined, f.frecuenciaCardiaca ? `FC ${f.frecuenciaCardiaca} lpm` : undefined, `ritmo ${f.ritmo.toLowerCase()}`, f.hemoHallazgos.length ? join(f.hemoHallazgos) : undefined, f.hemoObs]))
  lines.push(line("RESPIRATORIO", [`Patrón ${f.patronRespiratorio.toLowerCase()}`, f.saturacion ? `SatO2 ${f.saturacion}%` : undefined, `con ${f.soporteO2.toLowerCase()}`, f.respHallazgos.length ? `presenta ${join(f.respHallazgos).toLowerCase()}` : undefined, f.respObs]))
  lines.push(line("CUELLO", [f.cuello.length ? join(f.cuello) : "Sin alteraciones", f.cuelloObs]))
  lines.push(line("TÓRAX", [f.toraxAuscultacion, f.torax.length ? join(f.torax) : undefined, f.toraxObs]))
  lines.push(line("EXTREMIDADES", [`Perfusión ${f.perfusion.toLowerCase()}`, f.extremidades.length ? join(f.extremidades) : "sin edemas ni signos de trombosis", f.extremidadesObs]))
  lines.push(line("ABDOMEN", [f.abdomenForma, `ruidos intestinales ${f.ruidosIntestinales.toLowerCase()}`, f.abdomen.length ? join(f.abdomen) : undefined, f.abdomenObs]))
  lines.push(line("GENITALES", [f.genitales.length ? join(f.genitales) : "Sin alteraciones", f.sondaVesical !== "No" ? `sonda vesical ${f.sondaVesical.toLowerCase()}` : undefined, f.genitalesObs]))
  lines.push(line("LESIONES / PIEL", [f.lesiones.length ? join(f.lesiones) : "Piel íntegra, sin lesiones", f.lesionesObs]))
  if (f.eventos.trim()) { lines.push(line("EVENTOS / OBSERVACIONES", [f.eventos])) }

  return lines.filter((l, i) => l !== "" || i === 1).join("\n")
}