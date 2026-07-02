export type NursingForm = {
  // Datos del paciente
  paciente: string
  cama: string
  fecha: string
  turno: string
  // Neurológico
  estadoConciencia: string
  glasgow: string
  pupilas: string
  neuroHallazgos: string[]
  neuroObs: string
  // Hemodinamia
  presionArterial: string
  frecuenciaCardiaca: string
  ritmo: string
  hemoHallazgos: string[]
  hemoObs: string
  // Respiratorio
  patronRespiratorio: string
  saturacion: string
  soporteO2: string
  respHallazgos: string[]
  respObs: string
  // Cuello
  cuello: string[]
  cuelloObs: string
  // Tórax
  toraxAuscultacion: string
  torax: string[]
  toraxObs: string
  // Extremidades
  perfusion: string
  extremidades: string[]
  extremidadesObs: string
  // Abdomen
  abdomenForma: string
  ruidosIntestinales: string
  abdomen: string[]
  abdomenObs: string
  // Genitales
  genitales: string[]
  sondaVesical: string
  genitalesObs: string
  // Lesiones
  lesiones: string[]
  lesionesObs: string
  // Eventos
  eventos: string
}

export const initialForm: NursingForm = {
  paciente: "",
  cama: "",
  fecha: "",
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
  eventos: "",
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

export function generateNote(f: NursingForm): string {
  const lines: string[] = []

  const header: string[] = []
  if (f.paciente) header.push(`Paciente: ${f.paciente}`)
  if (f.cama) header.push(`Cama/Ubicación: ${f.cama}`)
  if (f.fecha) header.push(`Fecha: ${f.fecha}`)
  header.push(`Turno: ${f.turno}`)
  lines.push(header.join("  |  "))
  lines.push("")

  lines.push(
    line("NEUROLÓGICO", [
      `Paciente ${f.estadoConciencia.toLowerCase()}`,
      f.glasgow ? `Glasgow ${f.glasgow}/15` : undefined,
      `pupilas ${f.pupilas.toLowerCase()}`,
      f.neuroHallazgos.length ? `se evidencia ${join(f.neuroHallazgos).toLowerCase()}` : undefined,
      f.neuroObs,
    ]),
  )

  lines.push(
    line("HEMODINAMIA", [
      f.presionArterial ? `TA ${f.presionArterial} mmHg` : undefined,
      f.frecuenciaCardiaca ? `FC ${f.frecuenciaCardiaca} lpm` : undefined,
      `ritmo ${f.ritmo.toLowerCase()}`,
      f.hemoHallazgos.length ? join(f.hemoHallazgos) : undefined,
      f.hemoObs,
    ]),
  )

  lines.push(
    line("RESPIRATORIO", [
      `Patrón ${f.patronRespiratorio.toLowerCase()}`,
      f.saturacion ? `SatO2 ${f.saturacion}%` : undefined,
      `con ${f.soporteO2.toLowerCase()}`,
      f.respHallazgos.length ? `presenta ${join(f.respHallazgos).toLowerCase()}` : undefined,
      f.respObs,
    ]),
  )

  lines.push(
    line("CUELLO", [
      f.cuello.length ? join(f.cuello) : "Sin alteraciones",
      f.cuelloObs,
    ]),
  )

  lines.push(
    line("TÓRAX", [
      f.toraxAuscultacion,
      f.torax.length ? join(f.torax) : undefined,
      f.toraxObs,
    ]),
  )

  lines.push(
    line("EXTREMIDADES", [
      `Perfusión ${f.perfusion.toLowerCase()}`,
      f.extremidades.length ? join(f.extremidades) : "sin edemas ni signos de trombosis",
      f.extremidadesObs,
    ]),
  )

  lines.push(
    line("ABDOMEN", [
      f.abdomenForma,
      `ruidos intestinales ${f.ruidosIntestinales.toLowerCase()}`,
      f.abdomen.length ? join(f.abdomen) : undefined,
      f.abdomenObs,
    ]),
  )

  lines.push(
    line("GENITALES", [
      f.genitales.length ? join(f.genitales) : "Sin alteraciones",
      f.sondaVesical !== "No" ? `sonda vesical ${f.sondaVesical.toLowerCase()}` : undefined,
      f.genitalesObs,
    ]),
  )

  lines.push(
    line("LESIONES / PIEL", [
      f.lesiones.length ? join(f.lesiones) : "Piel íntegra, sin lesiones",
      f.lesionesObs,
    ]),
  )

  if (f.eventos.trim()) {
    lines.push(line("EVENTOS / OBSERVACIONES", [f.eventos]))
  }

  return lines.filter((l, i) => l !== "" || i === 1).join("\n")
}
