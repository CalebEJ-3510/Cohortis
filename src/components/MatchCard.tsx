import { Check, MinusCircle, X } from "lucide-react";
import type { Match } from "@/lib/trials";

export function ScoreRing({ score, eligible }: { score: number; eligible: boolean }) {
  return (
    <div className="relative flex size-14 shrink-0 items-center justify-center">
      <svg viewBox="0 0 36 36" className="size-14 -rotate-90">
        <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" className="stroke-secondary" />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 97.4} 97.4`}
          className={eligible ? "stroke-accent" : "stroke-muted-foreground"}
        />
      </svg>
      <span className="absolute font-display text-sm font-semibold">{score}</span>
    </div>
  );
}

const ICONS = {
  pro: Check,
  con: MinusCircle,
  block: X,
} as const;

export function ReasonList({ match }: { match: Match }) {
  return (
    <ul className="mt-3 grid gap-1.5 text-sm">
      {match.reasons.map((r) => {
        const Icon = ICONS[r.kind];
        return (
          <li key={r.label} className="flex items-start gap-2">
            <Icon
              className={
                r.kind === "pro"
                  ? "mt-0.5 size-3.5 shrink-0 text-accent"
                  : r.kind === "block"
                    ? "mt-0.5 size-3.5 shrink-0 text-destructive"
                    : "mt-0.5 size-3.5 shrink-0 text-muted-foreground"
              }
            />
            <span className={r.kind === "pro" ? "text-foreground" : "text-muted-foreground"}>
              {r.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function EligibilityPill({ eligible }: { eligible: boolean }) {
  return (
    <span
      className={
        eligible
          ? "rounded-full bg-accent/12 px-2.5 py-0.5 text-xs font-medium text-accent"
          : "rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
      }
    >
      {eligible ? "Eligible" : "Screen fail"}
    </span>
  );
}
