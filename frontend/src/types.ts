
export type {
  Medication,
  ScheduledDose,
  ScheduledDoseWithStatus,
  DoseStatus,
  Page,
  SideEffectLog,
  SideEffectSeverity,
};

type Medication = {
  id: number;
  startDate: string;
  medicationName: string;
  medicationForm: string;
  strength: string;
  strengthUnit: string;
  medicationFrequency: string;
  dailySchedule: string;
  dailyScheduleDetail: string;
  timesPerDay: string;
  selectedWeekDays: string[];
  weeklyDay: string;
  nextDoseDate: string;
  fewMonthsInterval: string;
  asNeededNote: string;
  otherSchedule: string;
  indication: string;
};

type ScheduledDose = {
  id: string;
  medication: Medication;
  doseLabel: string;
};

type DoseStatus = "taken" | "missed" | "pending";

type ScheduledDoseWithStatus = ScheduledDose & {
  status: DoseStatus;
};

type SideEffectSeverity = "Mild" | "Moderate" | "Severe";

type SideEffectLog = {
  id: number;
  medicationIds: number[];
  medicationNames: string[];
  medicationId?: number | null;
  medicationName?: string;
  symptom: string;
  severity: SideEffectSeverity;
  date: string;
  notes: string;
};

type Page = "tracker" | "adherence" | "medications" | "sideEffects";
