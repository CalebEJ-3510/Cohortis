import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { EligibilityPill, ReasonList, ScoreRing } from "@/components/MatchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BIOMARKERS,
  CITIES,
  COMORBIDITIES,
  CONDITIONS,
  STAGES,
  clamp,
  rankTrialsForPatient,
  savePatient,
  type Match,
  type PatientRecord,
} from "@/lib/trials";

export const Route = createFileRoute("/")({
  component: PatientView,
});

const EMPTY = {
  name: "",
  age: "58",
  sex: "female" as PatientRecord["sex"],
  condition: CONDITIONS[0]!,
  stage: STAGES[1]!,
  biomarkers: [] as string[],
  priorTherapies: "1",
  ecog: "1",
  city: CITIES[0]!,
  travelKm: "150",
  comorbidities: [] as string[],
};

function PatientView() {
  const [form, setForm] = useState(EMPTY);
  const [results, setResults] = useState<Match[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: "biomarkers" | "comorbidities", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const submit = () => {
    const rawAge = Number(form.age);
    const rawPrior = Number(form.priorTherapies);
    const rawEcog = Number(form.ecog);
    const rawTravel = Number(form.travelKm);

    const patient: PatientRecord = {
      id: `local-${Date.now()}`,
      name: form.name.trim() || `Patient ${Math.floor(1000 + Math.random() * 8999)}`,
      age: clamp(Number.isFinite(rawAge) ? rawAge : 50, 1, 120),
      sex: form.sex,
      condition: form.condition,
      stage: form.stage,
      biomarkers: form.biomarkers,
      priorTherapies: clamp(Number.isFinite(rawPrior) ? rawPrior : 0, 0, 20),
      ecog: clamp(Number.isFinite(rawEcog) ? rawEcog : 0, 0, 4),
      city: form.city,
      travelKm: clamp(Number.isFinite(rawTravel) ? rawTravel : 0, 0, 10_000),
      comorbidities: form.comorbidities,
      submittedAt: new Date().toISOString(),
    };
    savePatient(patient);
    setResults(rankTrialsForPatient(patient));
    setOpen(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border bg-hero">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-3 py-1 text-xs font-medium text-accent">
            <Sparkles className="size-3.5" /> Trial matching intelligence
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            Find the clinical trials that actually fit your medical history.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Enter your diagnosis, biomarkers and treatment history. We score every open protocol
            against your record and rank the strongest matches — and show you exactly why.
          </p>
          <div className="mt-7 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" /> De-identified before sponsors see it
            </span>
            <span className="inline-flex items-center gap-2">
              <Stethoscope className="size-4 text-accent" /> Criteria-level explanations
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Your medical profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nothing identifying is required — a pseudonym works.
          </p>

          <div className="mt-6 grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name or pseudonym">
                <Input
                  value={form.name}
                  placeholder="e.g. Patient J-204"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Age">
                <Input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Primary condition">
              <Picker
                options={CONDITIONS}
                value={form.condition}
                onSelect={(v) => setForm({ ...form, condition: v })}
              />
            </Field>

            <Field label="Disease status">
              <Picker
                options={STAGES}
                value={form.stage}
                onSelect={(v) => setForm({ ...form, stage: v })}
              />
            </Field>

            <Field label="Biomarkers / lab findings">
              <Multi
                options={BIOMARKERS}
                selected={form.biomarkers}
                onToggle={(v) => toggle("biomarkers", v)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Prior treatment lines">
                <Input
                  type="number"
                  value={form.priorTherapies}
                  onChange={(e) => setForm({ ...form, priorTherapies: e.target.value })}
                />
              </Field>
              <Field label="ECOG status">
                <Input
                  type="number"
                  value={form.ecog}
                  onChange={(e) => setForm({ ...form, ecog: e.target.value })}
                />
              </Field>
              <Field label="Travel limit (km)">
                <Input
                  type="number"
                  value={form.travelKm}
                  onChange={(e) => setForm({ ...form, travelKm: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Nearest city">
              <Picker
                options={CITIES}
                value={form.city}
                onSelect={(v) => setForm({ ...form, city: v })}
              />
            </Field>

            <Field label="Other conditions">
              <Multi
                options={COMORBIDITIES}
                selected={form.comorbidities}
                onToggle={(v) => toggle("comorbidities", v)}
              />
            </Field>

            <Button onClick={submit} size="lg" className="mt-1">
              Match me to trials
            </Button>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold">Your ranked trials</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Highest-fit protocols first, based on your record.
          </p>

          {!results && (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Fill in your profile and run the match to see your shortlist.
            </div>
          )}

          <ol className="mt-6 grid gap-3">
            {results?.map((m, i) => (
              <li key={m.trial.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start gap-4">
                  <ScoreRing score={m.score} eligible={m.eligible} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {m.trial.code}
                      </span>
                      <EligibilityPill eligible={m.eligible} />
                    </div>
                    <p className="mt-1 font-medium leading-snug">{m.trial.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {m.trial.sponsor} · Phase {m.trial.phase} · Sites:{" "}
                      {m.trial.sites.join(", ")}
                    </p>
                    <button
                      onClick={() => setOpen(open === m.trial.id ? null : m.trial.id)}
                      className="mt-2 text-sm text-accent underline-offset-4 hover:underline"
                    >
                      {open === m.trial.id ? "Hide details" : "Why this score?"}
                    </button>
                    {open === m.trial.id && <ReasonList match={m} />}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Picker({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onSelect(o)}
          className={
            o === value
              ? "rounded-full border border-accent bg-accent/10 px-3 py-1.5 text-sm text-accent"
              : "rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          }
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Multi({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onToggle(o)}
          className={
            selected.includes(o)
              ? "rounded-full border border-accent bg-accent/10 px-3 py-1.5 text-sm text-accent"
              : "rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          }
        >
          {o}
        </button>
      ))}
    </div>
  );
}
