import type { Medication, ScheduledDose, ScheduledDoseWithStatus } from "../types";
export {
  getScheduledDosesForDate,
  getScheduledDosesWithStatusForDate,
  getMedicationScheduleSummary,
};

const getMonthInterval = (interval: string) => {
  if (interval === "Every 2 months") {
    return 2;
  }

  if (interval === "Every 3 months") {
    return 3;
  }

  if (interval === "Every 6 months") {
    return 6;
  }

  if (interval === "Once a year") {
    return 12;
  }

  return 0;
};

const getDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getStartOfDay = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    return startOfDay;
  };

  const isMedicationDueOnDate = (medication: Medication, date: Date) => {
    if (
      medication.startDate &&
      getStartOfDay(date).getTime() <
        getStartOfDay(new Date(medication.startDate)).getTime()
    ) {
      return false;
    }

    if (medication.medicationFrequency === "Every day") {
      return true;
    }

    const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });

    if (medication.medicationFrequency === "A few days a week") {
      return medication.selectedWeekDays.includes(weekday);
    }

    if (medication.medicationFrequency === "Once a week") {
      return medication.weeklyDay === weekday;
    }

    if (
      medication.medicationFrequency === "Every 2 weeks" &&
      medication.nextDoseDate
    ) {
      const selectedDateStart = getStartOfDay(date);
      const nextDoseStart = getStartOfDay(new Date(medication.nextDoseDate));
      const daysSinceNextDose = Math.round(
        (selectedDateStart.getTime() - nextDoseStart.getTime()) / 86400000
      );

      return daysSinceNextDose >= 0 && daysSinceNextDose % 14 === 0;
    }

    if (
      medication.medicationFrequency === "Once a month" &&
      medication.nextDoseDate
    ) {
      const nextDose = new Date(medication.nextDoseDate);

      return (
        getStartOfDay(date).getTime() >= getStartOfDay(nextDose).getTime() &&
        date.getDate() === nextDose.getDate()
      );
    }

    if (
      medication.medicationFrequency === "Every few months" &&
      medication.nextDoseDate &&
      medication.fewMonthsInterval
    ) {
      const nextDose = new Date(medication.nextDoseDate);
      const selectedDateStart = getStartOfDay(date);
      const nextDoseStart = getStartOfDay(nextDose);
      const monthInterval = getMonthInterval(medication.fewMonthsInterval);
      const monthsSinceNextDose =
        (date.getFullYear() - nextDose.getFullYear()) * 12 +
        date.getMonth() -
        nextDose.getMonth();

      return (
        monthInterval > 0 &&
        selectedDateStart.getTime() >= nextDoseStart.getTime() &&
        date.getDate() === nextDose.getDate() &&
        monthsSinceNextDose % monthInterval === 0
      );
    }

    return false;
  };

  const getDoseCount = (medication: Medication) => {
    if (medication.medicationFrequency !== "Every day") {
      return 1;
    }

    if (medication.dailySchedule === "Every number of hours") {
      const parsedHours = Number.parseInt(medication.dailyScheduleDetail, 10);

      return Number.isFinite(parsedHours) && parsedHours > 0
        ? Math.max(1, Math.floor(24 / parsedHours))
        : 1;
    }

    const parsedTimesPerDay = Number.parseInt(medication.timesPerDay, 10);

    return Number.isFinite(parsedTimesPerDay) && parsedTimesPerDay > 0
      ? parsedTimesPerDay
      : 1;
  };

  const getScheduledDosesForDate = (date: Date, medications: Medication[]): ScheduledDose[] => {
    const dateKey = getDateKey(date);

    return medications.flatMap((medication) => {
      if (!isMedicationDueOnDate(medication, date)) {
        return [];
      }

      const doseCount = getDoseCount(medication);

      return Array.from({ length: doseCount }, (_, index) => ({
        id: `${medication.id}-${dateKey}-${index + 1}`,
        medication,
        doseLabel:
          doseCount > 1 ? `Dose ${index + 1} of ${doseCount}` : "Dose 1 of 1",
      }));
    });
  };

  const getScheduledDosesWithStatusForDate = (
    date: Date,
    medications: Medication[],
    takenDoseIds: string[],
    today = new Date()
  ): ScheduledDoseWithStatus[] => {
    const selectedDateStart = getStartOfDay(date);
    const todayStart = getStartOfDay(today);

    return getScheduledDosesForDate(date, medications).map((dose) => {
      if (takenDoseIds.includes(dose.id)) {
        return { ...dose, status: "taken" };
      }

      if (selectedDateStart.getTime() < todayStart.getTime()) {
        return { ...dose, status: "missed" };
      }

      return { ...dose, status: "pending" };
    });
  };

  const getMedicationScheduleSummary = (medication: Medication) => {
    if (medication.medicationFrequency === "Every day") {
      if (medication.dailySchedule === "Times per day") {
        return medication.timesPerDay
          ? `Every day, ${medication.timesPerDay} dose(s) per day`
          : "Every day";
      }

      if (medication.dailySchedule === "Every number of hours") {
        return medication.dailyScheduleDetail
          ? `Every ${medication.dailyScheduleDetail} hours`
          : "A dose every few hours";
      }

      return medication.dailySchedule
        ? `Every day, ${medication.dailySchedule}`
        : "Every day";
    }

    if (medication.medicationFrequency === "A few days a week") {
      return medication.selectedWeekDays.length > 0
        ? `A few days a week: ${medication.selectedWeekDays.join(", ")}`
        : "A few days a week";
    }

    if (medication.medicationFrequency === "Once a week") {
      return medication.weeklyDay
        ? `Once a week on ${medication.weeklyDay}`
        : "Once a week";
    }

    if (medication.medicationFrequency === "Every 2 weeks") {
      return medication.nextDoseDate
        ? `Every 2 weeks, next dose ${medication.nextDoseDate}`
        : "Every 2 weeks";
    }

    if (medication.medicationFrequency === "Once a month") {
      return medication.nextDoseDate
        ? `Once a month, next dose ${medication.nextDoseDate}`
        : "Once a month";
    }

    if (medication.medicationFrequency === "Every few months") {
      if (medication.fewMonthsInterval && medication.nextDoseDate) {
        return `${medication.fewMonthsInterval}, next dose ${medication.nextDoseDate}`;
      }

      return medication.fewMonthsInterval || "Every few months";
    }

    if (medication.medicationFrequency === "Only when needed") {
      return medication.asNeededNote
        ? `Only when needed: ${medication.asNeededNote}`
        : "Only when needed";
    }

    if (medication.medicationFrequency === "Other schedule") {
      return medication.otherSchedule || "Other schedule";
    }

    return "Schedule not selected";
  };
