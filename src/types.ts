
export type { Medication, ScheduledDose, ScheduledDoseWithStatus, DoseStatus, Page };

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

type Page = "tracker" | "adherence" | "medications" | "sideEffects";
