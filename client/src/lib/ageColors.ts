// lib/ageColors.ts
export type AgeBracketKey = "1-4" | "5-8" | "9-12" | "13-18" | "unknown";

export const AGE_BRACKETS: {
  key: AgeBracketKey;
  label: string;
  min: number;
  max: number;
  chip: string;     // for small chips
  block: string;    // for big blocks
  ring?: string;
}[] = [
  { key: "1-4",   label: "Ages 1–4",   min: 1,  max: 4,
    chip: "bg-rose-100 text-rose-800 border border-rose-200",
    block:"bg-rose-100 text-rose-900" },
  { key: "5-8",   label: "Ages 5–8",   min: 5,  max: 8,
    chip: "bg-sky-100 text-sky-800 border border-sky-200",
    block:"bg-sky-100 text-sky-900" },
  { key: "9-12",  label: "Ages 9–12",  min: 9,  max: 12,
    chip: "bg-amber-100 text-amber-900 border border-amber-200",
    block:"bg-amber-100 text-amber-900" },
  { key: "13-18", label: "Teens",      min: 13, max: 18,
    chip: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    block:"bg-emerald-100 text-emerald-900" },
];

export function bracketForAge(age?: number): typeof AGE_BRACKETS[number] {
  if (typeof age !== "number" || Number.isNaN(age)) {
    return { key: "unknown", label: "Unknown", min: 0, max: 0,
      chip: "bg-slate-100 text-slate-700 border border-slate-200",
      block:"bg-slate-100 text-slate-800" };
  }
  return AGE_BRACKETS.find(b => age >= b.min && age <= b.max)
    ?? { key: "unknown", label: "Unknown", min: 0, max: 0,
         chip: "bg-slate-100 text-slate-700 border border-slate-200",
         block:"bg-slate-100 text-slate-800" };
}
