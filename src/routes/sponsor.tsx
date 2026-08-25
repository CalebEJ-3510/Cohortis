import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { EligibilityPill, ReasonList, ScoreRing } from "@/components/MatchCard";
import { Button } from "@/components/ui/button";
import {
  TRIALS,
  loadPatients,
  rankPatientsForTrial,
  type PatientRecord,
} from "@/lib/trials";

export const Route = createFileRoute("/sponsor")({
  component: SponsorView,
});

function SponsorView() {
  const firstTrial = TRIALS[0];
  const [trialId, setTrialId] = useState(firstTrial?.id ?? "");
  const [onlyEligible, setOnlyEligible] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const patients = useMemo<PatientRecord[]>(() => loadPatients(), []);

  // Must call useMemo unconditionally (Rules of Hooks) — guard with nullish fallback
  const trial = TRIALS.find((t) => t.id === trialId) ?? firstTrial;
  const ranked = useMemo(
    () => (trial ? rankPatientsForTrial(patients, trial) : []),
    [patients, trial],
  );
  const shown = onlyEligible ? ranked.filter((m) => m.eligible) : ranked;
  const eligibleCount = ranked.filter((m) => m.eligible).length;

  if (!firstTrial || !trial) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">No trials configured.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Sponsor console
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Ranked recruitment pipeline
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          De-identified candidates scored against protocol criteria, ordered by match strength.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <Stat label="Candidates screened" value={String(ranked.length)} />
          <Stat label="Protocol-eligible" value={String(eligibleCount)} />
          <Stat
            label="Enrollment target"
            value={`${eligibleCount}/${trial.enrollTarget}`}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="grid gap-2 self-start rounded-xl border border-border bg-card p-3">
            <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Protocols
            </p>
            {TRIALS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTrialId(t.id)}
                className={
                  t.id === trialId
                    ? "rounded-lg border border-accent/40 bg-accent/8 p-3 text-left"
                    : "rounded-lg border border-transparent p-3 text-left transition-colors hover:bg-secondary"
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{t.code}</span>
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                    Ph {t.phase}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium leading-snug">{t.title}</p>
              </button>
            ))}
          </aside>

          <section>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold">{trial.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {trial.sponsor} · Phase {trial.phase} · {trial.condition}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="size-4" /> Export cohort
                </Button>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Criterion label="Required biomarkers" value={trial.biomarkers.join(", ") || "None"} />
                <Criterion label="Age range" value={`${trial.ageRange[0]}–${trial.ageRange[1]}`} />
                <Criterion label="Max prior lines" value={String(trial.maxPriorTherapies)} />
                <Criterion label="Max ECOG" value={String(trial.maxEcog)} />
                <Criterion label="Sites" value={trial.sites.join(", ")} />
                <Criterion label="Key exclusions" value={trial.excludes.join(", ") || "None"} />
              </dl>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Users className="size-4 text-accent" /> Ranked candidates
              </h3>
              <button
                onClick={() => setOnlyEligible((v) => !v)}
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                {onlyEligible ? "Show screen fails" : "Hide screen fails"}
              </button>
            </div>

            <ol className="mt-3 grid gap-3">
              {shown.map((m, i) => (
                <li key={m.patient.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start gap-4">
                    <ScoreRing score={m.score} eligible={m.eligible} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{i + 1}
                        </span>
                        <span className="font-medium">{m.patient.name}</span>
                        <EligibilityPill eligible={m.eligible} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {m.patient.age}y {m.patient.sex} · {m.patient.condition} ·{" "}
                        {m.patient.stage} · ECOG {m.patient.ecog} · {m.patient.city}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.patient.biomarkers.map((b) => (
                          <span
                            key={b}
                            className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => setOpen(open === m.patient.id ? null : m.patient.id)}
                        className="mt-2 text-sm text-accent underline-offset-4 hover:underline"
                      >
                        {open === m.patient.id ? "Hide rationale" : "Why this rank?"}
                      </button>
                      {open === m.patient.id && <ReasonList match={m} />}
                    </div>
                  </div>
                </li>
              ))}
              {shown.length === 0 && (
                <li className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No eligible candidates for this protocol yet.
                </li>
              )}
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Criterion({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}
