import type { Medication, ScheduledDose } from "../types";
export { getScheduledDosesForDate, getMedicationScheduleSummary };

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

    return false;
  };

  const getDoseCount = (medication: Medication) => {
    if (medication.medicationFrequency !== "Every day") {
      return 1;
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

  const getMedicationScheduleSummary = (medication: Medication) => {
    if (medication.medicationFrequency === "Every day") {
      return medication.timesPerDay
        ? `Every day, ${medication.timesPerDay} time(s) per day`
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
