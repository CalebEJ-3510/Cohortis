export type PatientRecord = {
  id: string;
  name: string;
  age: number;
  sex: "female" | "male" | "other";
  condition: string;
  stage: string;
  biomarkers: string[];
  priorTherapies: number;
  ecog: number;
  city: string;
  travelKm: number;
  comorbidities: string[];
  submittedAt: string;
};

export type Trial = {
  id: string;
  code: string;
  title: string;
  sponsor: string;
  phase: "I" | "I/II" | "II" | "III";
  condition: string;
  stages: string[];
  biomarkers: string[];
  ageRange: [number, number];
  maxPriorTherapies: number;
  maxEcog: number;
  sites: string[];
  radiusKm: number;
  excludes: string[];
  enrollTarget: number;
};

export const CONDITIONS = [
  "Non-small cell lung cancer",
  "Type 2 diabetes",
  "Rheumatoid arthritis",
  "Heart failure",
  "Metastatic breast cancer",
];

export const STAGES = ["Newly diagnosed", "Stable", "Progressive", "Relapsed / refractory"];

export const BIOMARKERS = [
  "EGFR+",
  "ALK+",
  "PD-L1 high",
  "HER2+",
  "HbA1c > 8",
  "Anti-CCP+",
  "NT-proBNP elevated",
];

export const COMORBIDITIES = [
  "Hypertension",
  "Chronic kidney disease",
  "Autoimmune disease",
  "Active infection",
  "Prior transplant",
];

export const TRIALS: Trial[] = [
  {
    id: "t1",
    code: "NCT-40218",
    title: "Osimertinib + novel MET inhibitor in EGFR-mutant NSCLC",
    sponsor: "Helix Oncology",
    phase: "II",
    condition: "Non-small cell lung cancer",
    stages: ["Progressive", "Relapsed / refractory"],
    biomarkers: ["EGFR+"],
    ageRange: [18, 78],
    maxPriorTherapies: 3,
    maxEcog: 2,
    sites: ["Boston", "New York", "Philadelphia"],
    radiusKm: 150,
    excludes: ["Active infection"],
    enrollTarget: 120,
  },
  {
    id: "t2",
    code: "NCT-51907",
    title: "Checkpoint-inhibitor doublet in PD-L1 high advanced NSCLC",
    sponsor: "Northline Bio",
    phase: "III",
    condition: "Non-small cell lung cancer",
    stages: ["Newly diagnosed", "Progressive"],
    biomarkers: ["PD-L1 high"],
    ageRange: [18, 85],
    maxPriorTherapies: 1,
    maxEcog: 1,
    sites: ["Chicago", "Boston", "Austin"],
    radiusKm: 250,
    excludes: ["Autoimmune disease", "Prior transplant"],
    enrollTarget: 400,
  },
  {
    id: "t3",
    code: "NCT-33740",
    title: "Once-weekly dual incretin agonist for glycemic control",
    sponsor: "Meridian Metabolics",
    phase: "III",
    condition: "Type 2 diabetes",
    stages: ["Stable", "Progressive"],
    biomarkers: ["HbA1c > 8"],
    ageRange: [25, 75],
    maxPriorTherapies: 2,
    maxEcog: 2,
    sites: ["Austin", "Phoenix", "Chicago"],
    radiusKm: 120,
    excludes: ["Chronic kidney disease"],
    enrollTarget: 600,
  },
  {
    id: "t4",
    code: "NCT-27614",
    title: "Selective JAK1 inhibitor in seropositive rheumatoid arthritis",
    sponsor: "Corvus Immunology",
    phase: "II",
    condition: "Rheumatoid arthritis",
    stages: ["Progressive", "Relapsed / refractory"],
    biomarkers: ["Anti-CCP+"],
    ageRange: [18, 70],
    maxPriorTherapies: 3,
    maxEcog: 2,
    sites: ["New York", "Seattle", "Denver"],
    radiusKm: 200,
    excludes: ["Active infection"],
    enrollTarget: 180,
  },
  {
    id: "t5",
    code: "NCT-19022",
    title: "SGLT2 inhibitor add-on in HFpEF with elevated natriuretic peptides",
    sponsor: "Cardia Therapeutics",
    phase: "III",
    condition: "Heart failure",
    stages: ["Stable", "Progressive"],
    biomarkers: ["NT-proBNP elevated"],
    ageRange: [40, 88],
    maxPriorTherapies: 4,
    maxEcog: 3,
    sites: ["Cleveland", "Chicago", "Boston"],
    radiusKm: 180,
    excludes: [],
    enrollTarget: 320,
  },
  {
    id: "t6",
    code: "NCT-88431",
    title: "Antibody-drug conjugate in HER2+ metastatic breast cancer",
    sponsor: "Helix Oncology",
    phase: "I/II",
    condition: "Metastatic breast cancer",
    stages: ["Relapsed / refractory", "Progressive"],
    biomarkers: ["HER2+"],
    ageRange: [18, 75],
    maxPriorTherapies: 4,
    maxEcog: 2,
    sites: ["Seattle", "New York", "Phoenix"],
    radiusKm: 220,
    excludes: ["Prior transplant"],
    enrollTarget: 90,
  },
];

export const CITIES = [
  "Boston",
  "New York",
  "Chicago",
  "Austin",
  "Seattle",
  "Phoenix",
  "Denver",
  "Cleveland",
  "Philadelphia",
];

export type MatchReason = { label: string; kind: "pro" | "con" | "block" };

export type Match = {
  trial: Trial;
  patient: PatientRecord;
  score: number;
  eligible: boolean;
  reasons: MatchReason[];
};

export function scoreMatch(patient: PatientRecord, trial: Trial): Match {
  const reasons: MatchReason[] = [];
  let score = 0;
  let eligible = true;

  if (patient.condition === trial.condition) {
    score += 35;
    reasons.push({ label: `Indication match: ${trial.condition}`, kind: "pro" });
  } else {
    eligible = false;
    reasons.push({ label: `Different indication (${patient.condition})`, kind: "block" });
  }

  const bioHit = trial.biomarkers.filter((b) => patient.biomarkers.includes(b));
  if (trial.biomarkers.length === 0) {
    score += 10;
  } else if (bioHit.length > 0) {
    score += 25;
    reasons.push({ label: `Biomarker match: ${bioHit.join(", ")}`, kind: "pro" });
  } else {
    eligible = false;
    reasons.push({ label: `Requires ${trial.biomarkers.join(" / ")}`, kind: "block" });
  }

  if (trial.stages.includes(patient.stage)) {
    score += 12;
    reasons.push({ label: `Disease stage fits protocol (${patient.stage})`, kind: "pro" });
  } else {
    score -= 8;
    reasons.push({ label: `Stage "${patient.stage}" outside preferred window`, kind: "con" });
  }

  if (patient.age >= trial.ageRange[0] && patient.age <= trial.ageRange[1]) {
    score += 8;
  } else {
    eligible = false;
    reasons.push({
      label: `Age ${patient.age} outside ${trial.ageRange[0]}–${trial.ageRange[1]}`,
      kind: "block",
    });
  }

  if (patient.priorTherapies <= trial.maxPriorTherapies) {
    score += 8;
    reasons.push({
      label: `${patient.priorTherapies} prior lines (limit ${trial.maxPriorTherapies})`,
      kind: "pro",
    });
  } else {
    eligible = false;
    reasons.push({
      label: `Too many prior lines (${patient.priorTherapies} > ${trial.maxPriorTherapies})`,
      kind: "block",
    });
  }

  if (patient.ecog <= trial.maxEcog) {
    score += 6;
  } else {
    eligible = false;
    reasons.push({ label: `ECOG ${patient.ecog} exceeds max ${trial.maxEcog}`, kind: "block" });
  }

  const conflicts = trial.excludes.filter((e) => patient.comorbidities.includes(e));
  if (conflicts.length > 0) {
    eligible = false;
    reasons.push({ label: `Exclusion criteria: ${conflicts.join(", ")}`, kind: "block" });
  }

  if (trial.sites.includes(patient.city)) {
    score += 12;
    reasons.push({ label: `Trial site in ${patient.city}`, kind: "pro" });
  } else if (patient.travelKm >= trial.radiusKm) {
    score += 6;
    reasons.push({ label: `Willing to travel to ${trial.sites[0]}`, kind: "pro" });
  } else {
    score -= 10;
    reasons.push({ label: `Nearest site ${trial.sites[0]} beyond travel limit`, kind: "con" });
  }

  const normalized = Math.max(0, Math.min(100, Math.round((score / 106) * 100)));
  return { trial, patient, score: eligible ? normalized : Math.min(normalized, 42), eligible, reasons };
}

export function rankTrialsForPatient(patient: PatientRecord): Match[] {
  return TRIALS.map((t) => scoreMatch(patient, t)).sort((a, b) => b.score - a.score);
}

export function rankPatientsForTrial(patients: PatientRecord[], trial: Trial): Match[] {
  return patients.map((p) => scoreMatch(p, trial)).sort((a, b) => b.score - a.score);
}

export const SEED_PATIENTS: PatientRecord[] = [
  {
    id: "p1",
    name: "Patient A-1042",
    age: 61,
    sex: "female",
    condition: "Non-small cell lung cancer",
    stage: "Progressive",
    biomarkers: ["EGFR+"],
    priorTherapies: 1,
    ecog: 1,
    city: "Boston",
    travelKm: 200,
    comorbidities: ["Hypertension"],
    submittedAt: "2026-08-11T09:12:00Z",
  },
  {
    id: "p2",
    name: "Patient B-2231",
    age: 54,
    sex: "male",
    condition: "Non-small cell lung cancer",
    stage: "Newly diagnosed",
    biomarkers: ["PD-L1 high"],
    priorTherapies: 0,
    ecog: 1,
    city: "Chicago",
    travelKm: 100,
    comorbidities: [],
    submittedAt: "2026-08-12T14:40:00Z",
  },
  {
    id: "p3",
    name: "Patient C-7781",
    age: 68,
    sex: "male",
    condition: "Type 2 diabetes",
    stage: "Stable",
    biomarkers: ["HbA1c > 8"],
    priorTherapies: 2,
    ecog: 1,
    city: "Austin",
    travelKm: 60,
    comorbidities: ["Hypertension"],
    submittedAt: "2026-08-13T08:05:00Z",
  },
  {
    id: "p4",
    name: "Patient D-3390",
    age: 44,
    sex: "female",
    condition: "Rheumatoid arthritis",
    stage: "Relapsed / refractory",
    biomarkers: ["Anti-CCP+"],
    priorTherapies: 2,
    ecog: 1,
    city: "Seattle",
    travelKm: 150,
    comorbidities: [],
    submittedAt: "2026-08-14T11:22:00Z",
  },
  {
    id: "p5",
    name: "Patient E-5518",
    age: 73,
    sex: "female",
    condition: "Heart failure",
    stage: "Progressive",
    biomarkers: ["NT-proBNP elevated"],
    priorTherapies: 3,
    ecog: 2,
    city: "Cleveland",
    travelKm: 80,
    comorbidities: ["Chronic kidney disease"],
    submittedAt: "2026-08-15T16:31:00Z",
  },
  {
    id: "p6",
    name: "Patient F-9014",
    age: 39,
    sex: "female",
    condition: "Metastatic breast cancer",
    stage: "Relapsed / refractory",
    biomarkers: ["HER2+"],
    priorTherapies: 3,
    ecog: 1,
    city: "New York",
    travelKm: 250,
    comorbidities: [],
    submittedAt: "2026-08-16T10:02:00Z",
  },
  {
    id: "p7",
    name: "Patient G-2205",
    age: 82,
    sex: "male",
    condition: "Non-small cell lung cancer",
    stage: "Progressive",
    biomarkers: ["PD-L1 high"],
    priorTherapies: 2,
    ecog: 2,
    city: "Denver",
    travelKm: 40,
    comorbidities: ["Autoimmune disease"],
    submittedAt: "2026-08-17T07:44:00Z",
  },
];

const STORAGE_KEY = "ctri.patients.v1";

/** Validates that an unknown value structurally matches PatientRecord. */
function isPatientRecord(v: unknown): v is PatientRecord {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p["id"] === "string" &&
    typeof p["name"] === "string" &&
    typeof p["age"] === "number" &&
    (p["sex"] === "female" || p["sex"] === "male" || p["sex"] === "other") &&
    typeof p["condition"] === "string" &&
    typeof p["stage"] === "string" &&
    Array.isArray(p["biomarkers"]) &&
    typeof p["priorTherapies"] === "number" &&
    typeof p["ecog"] === "number" &&
    typeof p["city"] === "string" &&
    typeof p["travelKm"] === "number" &&
    Array.isArray(p["comorbidities"]) &&
    typeof p["submittedAt"] === "string"
  );
}

/** Clamps a number between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function loadPatients(): PatientRecord[] {
  if (typeof window === "undefined") return SEED_PATIENTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_PATIENTS;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED_PATIENTS;
    const extra = parsed.filter(isPatientRecord);
    return [...extra, ...SEED_PATIENTS];
  } catch {
    return SEED_PATIENTS;
  }
}

export function savePatient(patient: PatientRecord) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const existing = Array.isArray(parsed) ? parsed.filter(isPatientRecord) : [];
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([patient, ...existing].slice(0, 40)),
    );
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded, etc.)
    console.warn("[Cohortis] Could not persist patient to localStorage.");
  }
}
