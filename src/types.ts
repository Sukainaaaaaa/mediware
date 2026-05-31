
export type { Medication, ScheduledDose, Page };

type Medication = {
  id: number;
  medicationName: string;
  medicationForm: string;
  strength: string;
  strengthUnit: string;
  medicationFrequency: string;
  timesPerDay: string;
  selectedWeekDays: string[];
  weeklyDay: string;
  nextDoseDate: string;
  asNeededNote: string;
  otherSchedule: string;
  indication: string;
};

type ScheduledDose = {
  id: string;
  medication: Medication;
  doseLabel: string;
};

type Page = "tracker" | "adherence" | "medications" | "sideEffects";