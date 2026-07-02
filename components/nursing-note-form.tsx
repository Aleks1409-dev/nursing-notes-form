"use client"

import { useRef, useState } from "react"
import {
  Brain,
  HeartPulse,
  Wind,
  Stethoscope,
  Ribbon,
  Activity,
  CircleDot,
  Droplets,
  Bandage,
  ClipboardList,
  FileText,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  FormSection,
  TextField,
  SelectField,
  TextareaField,
  CheckboxGroup,
} from "@/components/form-controls"

import { generateAIContent } from "@/lib/generate-ai";
import { initialForm, type NursingForm } from "@/lib/generate-note";

export function NursingNoteForm() {
  const [form, setForm] = useState<NursingForm>(initialForm)
  const [note, setNote] = useState("")
  const [copied, setCopied] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  function set<K extends keyof NursingForm>(key: K, value: NursingForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggle(key: keyof NursingForm, value: string) {
    setForm((prev) => {
      const current = prev[key] as string[]
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
  }

  async function handleGenerate() {
    setNote("Generando nota con IA...")
    setCopied(false)
    try {
      const aiNote = await generateAIContent(form)
      setNote(aiNote)
    } catch (error) {
      setNote("Error al generar la nota. Revisa tu API Key en Vercel.")
    }
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  async function handleCopy() {
    if (!note) return
    try {
      await navigator.clipboard.writeText(note)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silencioso: el navegador puede bloquear el portapapeles
    }
  }

  function handleReset() {
    setForm(initialForm)
    setNote("")
    setCopied(false)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      {/* Encabezado */}
      <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Stethoscope className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-card-foreground text-balance sm:text-xl">
              Notas de Enfermería
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              Valoración clínica por sistemas y generación automática de la nota.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Limpiar
        </Button>
      </header>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await handleGenerate()
        }}
        className="grid grid-cols-1 gap-5"
      >
        {/* Datos del paciente */}
        <FormSection
          title="Datos del paciente"
          description="Identificación y contexto del registro."
          icon={<ClipboardList className="size-5" />}
        >
          <TextField
            id="paciente"
            label="Paciente"
            value={form.paciente}
            onChange={(v) => set("paciente", v)}
            placeholder="Nombre y apellidos / N.º historia"
          />
          <TextField
            id="cama"
            label="Cama / Ubicación"
            value={form.cama}
            onChange={(v) => set("cama", v)}
            placeholder="Ej. UCI - Cama 4"
          />
          <TextField
            id="fecha"
            label="Fecha"
            type="date"
            value={form.fecha}
            onChange={(v) => set("fecha", v)}
          />
          <SelectField
            id="turno"
            label="Turno"
            value={form.turno}
            onChange={(v) => set("turno", v)}
            options={["Mañana", "Tarde", "Noche"]}
          />
        </FormSection>

        {/* Neurológico */}
        <FormSection
          title="Neurológico"
          description="Estado de conciencia, Glasgow y pupilas."
          icon={<Brain className="size-5" />}
        >
          <SelectField
            id="conciencia"
            label="Estado de conciencia"
            value={form.estadoConciencia}
            onChange={(v) => set("estadoConciencia", v)}
            options={["Alerta", "Somnoliento", "Estuporoso", "Sedado", "Inconsciente"]}
          />
          <SelectField
            id="glasgow"
            label="Escala de Glasgow"
            value={form.glasgow}
            onChange={(v) => set("glasgow", v)}
            options={["15", "14", "13", "12", "11", "10", "9", "8", "≤7"]}
          />
          <SelectField
            id="pupilas"
            label="Pupilas"
            value={form.pupilas}
            onChange={(v) => set("pupilas", v)}
            options={[
              "Isocóricas reactivas",
              "Anisocóricas",
              "Midriáticas",
              "Mióticas",
              "Arreactivas",
            ]}
          />
          <CheckboxGroup
            label="Hallazgos"
            options={["Orientado", "Desorientado", "Agitación", "Déficit motor", "Convulsiones", "Dolor"]}
            selected={form.neuroHallazgos}
            onToggle={(v) => toggle("neuroHallazgos", v)}
          />
          <TextareaField
            id="neuroObs"
            label="Observaciones neurológicas"
            value={form.neuroObs}
            onChange={(v) => set("neuroObs", v)}
            placeholder="Detalles adicionales..."
          />
        </FormSection>

        {/* Hemodinamia */}
        <FormSection
          title="Hemodinamia"
          description="Signos vitales y estado cardiovascular."
          icon={<HeartPulse className="size-5" />}
        >
          <TextField
            id="ta"
            label="Tensión arterial (mmHg)"
            value={form.presionArterial}
            onChange={(v) => set("presionArterial", v)}
            placeholder="Ej. 120/80"
          />
          <TextField
            id="fc"
            label="Frecuencia cardíaca (lpm)"
            value={form.frecuenciaCardiaca}
            onChange={(v) => set("frecuenciaCardiaca", v)}
            placeholder="Ej. 78"
          />
          <SelectField
            id="ritmo"
            label="Ritmo cardíaco"
            value={form.ritmo}
            onChange={(v) => set("ritmo", v)}
            options={["Regular", "Irregular", "Taquicárdico", "Bradicárdico"]}
          />
          <CheckboxGroup
            label="Hallazgos"
            options={[
              "Normotenso",
              "Hipotensión",
              "Hipertensión",
              "Con drogas vasoactivas",
              "Buen relleno capilar",
              "Frialdad distal",
            ]}
            selected={form.hemoHallazgos}
            onToggle={(v) => toggle("hemoHallazgos", v)}
          />
          <TextareaField
            id="hemoObs"
            label="Observaciones hemodinámicas"
            value={form.hemoObs}
            onChange={(v) => set("hemoObs", v)}
            placeholder="Detalles adicionales..."
          />
        </FormSection>

        {/* Respiratorio */}
        <FormSection
          title="Respiratorio"
          description="Patrón, oxigenación y soporte ventilatorio."
          icon={<Wind className="size-5" />}
        >
          <SelectField
            id="patron"
            label="Patrón respiratorio"
            value={form.patronRespiratorio}
            onChange={(v) => set("patronRespiratorio", v)}
            options={["Eupneico", "Taquipneico", "Bradipneico", "Disnea", "Uso de musculatura accesoria"]}
          />
          <TextField
            id="sat"
            label="Saturación O2 (%)"
            value={form.saturacion}
            onChange={(v) => set("saturacion", v)}
            placeholder="Ej. 97"
          />
          <SelectField
            id="soporte"
            label="Soporte de oxígeno"
            value={form.soporteO2}
            onChange={(v) => set("soporteO2", v)}
            options={[
              "Aire ambiente",
              "Cánula nasal",
              "Mascarilla",
              "Mascarilla reservorio",
              "Ventilación mecánica",
            ]}
          />
          <CheckboxGroup
            label="Hallazgos"
            options={["Secreciones", "Tos productiva", "Sibilancias", "Crepitantes", "Sin ruidos agregados"]}
            selected={form.respHallazgos}
            onToggle={(v) => toggle("respHallazgos", v)}
          />
          <TextareaField
            id="respObs"
            label="Observaciones respiratorias"
            value={form.respObs}
            onChange={(v) => set("respObs", v)}
            placeholder="Detalles adicionales..."
          />
        </FormSection>

        {/* Cuello */}
        <FormSection
          title="Cuello"
          description="Inspección y palpación cervical."
          icon={<Ribbon className="size-5" />}
        >
          <CheckboxGroup
            label="Hallazgos"
            options={[
              "Simétrico",
              "Ingurgitación yugular",
              "Adenopatías",
              "Rigidez de nuca",
              "Vía central yugular",
              "Traqueostomía",
            ]}
            selected={form.cuello}
            onToggle={(v) => toggle("cuello", v)}
          />
          <TextareaField
            id="cuelloObs"
            label="Observaciones"
            value={form.cuelloObs}
            onChange={(v) => set("cuelloObs", v)}
            placeholder="Detalles adicionales..."
          />
        </FormSection>

        {/* Tórax */}
        <FormSection
          title="Tórax"
          description="Auscultación y hallazgos torácicos."
          icon={<Activity className="size-5" />}
        >
          <SelectField
            id="auscultacion"
            label="Auscultación pulmonar"
            value={form.toraxAuscultacion}
            onChange={(v) => set("toraxAuscultacion", v)}
            options={[
              "Murmullo vesicular conservado",
              "Hipoventilación basal",
              "Hipoventilación generalizada",
              "Ruidos agregados bilaterales",
            ]}
            full
          />
          <CheckboxGroup
            label="Hallazgos"
            options={["Simétrico", "Tiraje", "Herida quirúrgica", "Drenaje torácico", "Enfisema subcutáneo"]}
            selected={form.torax}
            onToggle={(v) => toggle("torax", v)}
          />
          <TextareaField
            id="toraxObs"
            label="Observaciones"
            value={form.toraxObs}
            onChange={(v) => set("toraxObs", v)}
            placeholder="Detalles adicionales..."
          />
        </FormSection>

        {/* Extremidades */}
        <FormSection
          title="Extremidades"
          description="Perfusión, movilidad y accesos."
          icon={<CircleDot className="size-5" />}
        >
          <SelectField
            id="perfusion"
            label="Perfusión periférica"
            value={form.perfusion}
            onChange={(v) => set("perfusion", v)}
            options={["Adecuada", "Disminuida", "Frialdad distal", "Cianosis distal"]}
            full
          />
          <CheckboxGroup
            label="Hallazgos"
            options={[
              "Sin edemas",
              "Edema en MMII",
              "Movilidad conservada",
              "Limitación de movilidad",
              "Vía periférica",
              "Pulsos presentes",
            ]}
            selected={form.extremidades}
            onToggle={(v) => toggle("extremidades", v)}
          />
          <TextareaField
            id="extremidadesObs"
            label="Observaciones"
            value={form.extremidadesObs}
            onChange={(v) => set("extremidadesObs", v)}
            placeholder="Detalles adicionales..."
          />
        </FormSection>

        {/* Abdomen */}
        <FormSection
          title="Abdomen"
          description="Palpación, ruidos y eliminación."
          icon={<CircleDot className="size-5" />}
        >
          <SelectField
            id="abdomenForma"
            label="Palpación abdominal"
            value={form.abdomenForma}
            onChange={(v) => set("abdomenForma", v)}
            options={["Blando y depresible", "Distendido", "Doloroso a la palpación", "Rígido / en tabla"]}
          />
          <SelectField
            id="ruidos"
            label="Ruidos intestinales"
            value={form.ruidosIntestinales}
            onChange={(v) => set("ruidosIntestinales", v)}
            options={["Presentes", "Aumentados", "Disminuidos", "Ausentes"]}
          />
          <CheckboxGroup
            label="Hallazgos"
            options={["Tolera dieta", "Sonda nasogástrica", "Ostomía", "Deposiciones normales", "Náuseas / vómitos"]}
            selected={form.abdomen}
            onToggle={(v) => toggle("abdomen", v)}
          />
          <TextareaField
            id="abdomenObs"
            label="Observaciones"
            value={form.abdomenObs}
            onChange={(v) => set("abdomenObs", v)}
            placeholder="Detalles adicionales..."
          />
        </FormSection>

        {/* Genitales */}
        <FormSection
          title="Genitales"
          description="Eliminación urinaria y dispositivos."
          icon={<Droplets className="size-5" />}
        >
          <SelectField
            id="sonda"
            label="Sonda vesical"
            value={form.sondaVesical}
            onChange={(v) => set("sondaVesical", v)}
            options={["No", "Permeable", "Obstruida", "Recién colocada"]}
          />
          <CheckboxGroup
            label="Hallazgos"
            options={["Diuresis conservada", "Oliguria", "Anuria", "Sin alteraciones", "Signos de infección"]}
            selected={form.genitales}
            onToggle={(v) => toggle("genitales", v)}
          />
          <TextareaField
            id="genitalesObs"
            label="Observaciones"
            value={form.genitalesObs}
            onChange={(v) => set("genitalesObs", v)}
            placeholder="Detalles adicionales..."
          />
        </FormSection>

        {/* Lesiones */}
        <FormSection
          title="Lesiones / Piel"
          description="Integridad cutánea y heridas."
          icon={<Bandage className="size-5" />}
        >
          <CheckboxGroup
            label="Hallazgos"
            options={[
              "Piel íntegra",
              "Úlcera por presión",
              "Herida quirúrgica",
              "Flebitis",
              "Hematomas",
              "Edema / eritema",
            ]}
            selected={form.lesiones}
            onToggle={(v) => toggle("lesiones", v)}
          />
          <TextareaField
            id="lesionesObs"
            label="Descripción de lesiones (localización, estadio, curas)"
            value={form.lesionesObs}
            onChange={(v) => set("lesionesObs", v)}
            placeholder="Ej. UPP estadio II en sacro, cura con apósito hidrocoloide..."
          />
        </FormSection>

        {/* Eventos */}
        <FormSection
          title="Eventos"
          description="Incidencias del turno y actuaciones."
          icon={<ClipboardList className="size-5" />}
        >
          <TextareaField
            id="eventos"
            label="Eventos / observaciones del turno"
            value={form.eventos}
            onChange={(v) => set("eventos", v)}
            placeholder="Ej. Se administra analgesia según pauta, se avisa a facultativo por dolor..."
            rows={4}
          />
        </FormSection>

        {/* Botón generar */}
        <Button type="submit" size="lg" className="h-14 w-full text-base font-semibold">
          <Sparkles className="size-5" aria-hidden="true" />
          Generar Nota
        </Button>
      </form>

      {/* Resultado */}
      <div ref={resultRef} className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <h2 className="text-sm font-semibold text-card-foreground">Nota generada</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!note}
          >
            {copied ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="size-4" aria-hidden="true" />
                Copiar
              </>
            )}
          </Button>
        </header>
        <div className="p-4 sm:p-5">
          <label htmlFor="notaGenerada" className="sr-only">
            Nota de enfermería generada
          </label>
          <textarea
            id="notaGenerada"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={14}
            placeholder="La nota de enfermería aparecerá aquí al pulsar “Generar Nota”. Puedes editarla libremente antes de copiarla."
            className="w-full resize-y rounded-lg border border-input bg-secondary/40 px-3 py-3 font-mono text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
      </div>
    </div>
  )
}
