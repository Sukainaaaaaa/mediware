import { apiRequest } from "./client";
import type { Medication } from "../types";

export type FrequencyType =
  | "DAILY"
  | "EVERY_OTHER_DAY"
  | "WEEKLY"
  | "EVERY_TWO_WEEKS"
  | "ONCE_MONTHLY"
  | "EVERY_FEW_MONTHS"
  | "AS_NEEDED"
  | "CUSTOM";

export type DailyType = "TIMES_PER_DAY" | "EVERY_X_HOURS";

export type MedicationScheduleRequest = {
  frequencyType: FrequencyType;
  dailyType?: DailyType;
  timesPerDay?: string;
  everyXHours?: string;
  weekDays?: string;
  nextDoseDate?: string;
  monthInterval?: string;
  asNeededNote?: string;
  customScheduleNote?: string;
};

export type CreateMedicationRequest = {
  name: string;
  form: string;
  strength: string;
  strengthUnit: string;
  indication?: string;
  schedule: MedicationScheduleRequest;
};

export type MedicationScheduleResponse = MedicationScheduleRequest & {
  id: number;
};

export type MedicationResponse = {
  id: number;
  name: string;
  form: string;
  strength: string;
  strengthUnit: string;
  indication: string;
  trackingStartDate: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  schedule: MedicationScheduleResponse;
};

export const getMedications = () => {
  return apiRequest<MedicationResponse[]>("/api/medications/");
};

export const mapMedicationResponseToMedication = (
  response: MedicationResponse
): Medication => {
  const schedule = response.schedule;
  const weekDays = schedule.weekDays
    ? schedule.weekDays.split(",").map((day) => day.trim()).filter(Boolean)
    : [];
  const isWeeklyOnce = schedule.frequencyType === "WEEKLY" && weekDays.length <= 1;

  return {
    id: response.id,
    startDate: response.trackingStartDate,
    medicationName: response.name,
    medicationForm: response.form,
    strength: response.strength,
    strengthUnit: response.strengthUnit,
    medicationFrequency: getFrontendFrequency(schedule.frequencyType, isWeeklyOnce),
    dailySchedule: getFrontendDailySchedule(schedule.dailyType),
    dailyScheduleDetail: schedule.everyXHours ?? "",
    timesPerDay: schedule.timesPerDay ?? "",
    selectedWeekDays: isWeeklyOnce ? [] : weekDays,
    weeklyDay: isWeeklyOnce ? weekDays[0] ?? "" : "",
    nextDoseDate: schedule.nextDoseDate ?? "",
    fewMonthsInterval: schedule.monthInterval ?? "",
    asNeededNote: schedule.asNeededNote ?? "",
    otherSchedule: schedule.customScheduleNote ?? "",
    indication: response.indication ?? "",
  };
};

export const mapMedicationToCreateRequest = (
  medication: Medication
): CreateMedicationRequest => {
  return {
    name: medication.medicationName,
    form: medication.medicationForm,
    strength: medication.strength,
    strengthUnit: medication.strengthUnit,
    indication: medication.indication,
    schedule: getBackendSchedule(medication),
  };
};

const getBackendSchedule = (medication: Medication): MedicationScheduleRequest => {
  if (medication.medicationFrequency === "Every day") {
    if (medication.dailySchedule === "Every number of hours") {
      return {
        frequencyType: "DAILY",
        dailyType: "EVERY_X_HOURS",
        everyXHours: medication.dailyScheduleDetail,
      };
    }

    return {
      frequencyType: "DAILY",
      dailyType: "TIMES_PER_DAY",
      timesPerDay: medication.timesPerDay,
    };
  }

  if (medication.medicationFrequency === "A few days a week") {
    return {
      frequencyType: "WEEKLY",
      weekDays: medication.selectedWeekDays.join(", "),
    };
  }

  if (medication.medicationFrequency === "Once a week") {
    return {
      frequencyType: "WEEKLY",
      weekDays: medication.weeklyDay,
    };
  }

  if (medication.medicationFrequency === "Every 2 weeks") {
    return {
      frequencyType: "EVERY_TWO_WEEKS",
      nextDoseDate: medication.nextDoseDate,
    };
  }

  if (medication.medicationFrequency === "Once a month") {
    return {
      frequencyType: "ONCE_MONTHLY",
      nextDoseDate: medication.nextDoseDate,
    };
  }

  if (medication.medicationFrequency === "Every few months") {
    return {
      frequencyType: "EVERY_FEW_MONTHS",
      monthInterval: medication.fewMonthsInterval,
      nextDoseDate: medication.nextDoseDate,
    };
  }

  if (medication.medicationFrequency === "Only when needed") {
    return {
      frequencyType: "AS_NEEDED",
      asNeededNote: medication.asNeededNote,
    };
  }

  return {
    frequencyType: "CUSTOM",
    customScheduleNote: medication.otherSchedule,
  };
};

const getFrontendFrequency = (
  frequencyType: FrequencyType,
  isWeeklyOnce: boolean
) => {
  if (frequencyType === "DAILY") {
    return "Every day";
  }

  if (frequencyType === "WEEKLY") {
    return isWeeklyOnce ? "Once a week" : "A few days a week";
  }

  if (frequencyType === "EVERY_TWO_WEEKS") {
    return "Every 2 weeks";
  }

  if (frequencyType === "ONCE_MONTHLY") {
    return "Once a month";
  }

  if (frequencyType === "EVERY_FEW_MONTHS") {
    return "Every few months";
  }

  if (frequencyType === "AS_NEEDED") {
    return "Only when needed";
  }

  return "Other schedule";
};

const getFrontendDailySchedule = (dailyType?: DailyType) => {
  if (dailyType === "TIMES_PER_DAY") {
    return "Times per day";
  }

  if (dailyType === "EVERY_X_HOURS") {
    return "Every number of hours";
  }

  return "";
};

export const getMedicationById = (id: number) => {
  return apiRequest<MedicationResponse>(`/api/medications/${id}`);
};

export const createMedication = (medication: CreateMedicationRequest) => {
  return apiRequest<MedicationResponse>("/api/medications/", {
    method: "POST",
    body: medication,
  });
};

export const updateMedication = (
  id: number,
  medication: CreateMedicationRequest
) => {
  return apiRequest<MedicationResponse>(`/api/medications/${id}`, {
    method: "PUT",
    body: medication,
  });
};

export const deleteMedication = (id: number) => {
  return apiRequest<void>(`/api/medications/${id}`, {
    method: "DELETE",
  });
};
