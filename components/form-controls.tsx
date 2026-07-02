"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/* ---------- Section card ---------- */

export function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string
  description?: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <section
      aria-label={title}
      className="rounded-xl border border-border bg-card shadow-sm"
    >
      <header className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-tight text-card-foreground text-balance">
            {title}
          </h2>
          {description ? (
            <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
              {description}
            </p>
          ) : null}
        </div>
      </header>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
        {children}
      </div>
    </section>
  )
}

/* ---------- Field wrapper ---------- */

function FieldShell({
  label,
  htmlFor,
  full,
  children,
}: {
  label: string
  htmlFor?: string
  full?: boolean
  children: ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "sm:col-span-2")}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

const controlBase =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"

/* ---------- Text input ---------- */

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  full,
  type = "text",
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  full?: boolean
  type?: string
}) {
  return (
    <FieldShell label={label} htmlFor={id} full={full}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={controlBase}
      />
    </FieldShell>
  )
}

/* ---------- Select ---------- */

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  full,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  full?: boolean
}) {
  return (
    <FieldShell label={label} htmlFor={id} full={full}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(controlBase, "appearance-none bg-[length:1rem] bg-[right_0.6rem_center] bg-no-repeat pr-9")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23667' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

/* ---------- Textarea ---------- */

export function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  full = true,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  full?: boolean
}) {
  return (
    <FieldShell label={label} htmlFor={id} full={full}>
      <textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(controlBase, "resize-y leading-relaxed")}
      />
    </FieldShell>
  )
}

/* ---------- Checkbox pill group ---------- */

export function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  full = true,
}: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
  full?: boolean
}) {
  return (
    <FieldShell label={label} full={full}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(opt)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-muted-foreground hover:border-ring hover:text-foreground",
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </FieldShell>
  )
}
