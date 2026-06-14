import { useState } from "react";

type MedicationWizardProps = {
  isOpen: boolean;
  step: number;
  editingMedicationId: number | null;
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
  weekDays: string[];
  scheduleSummary: string;
  onClose: () => void;
  onSave: () => void;
  setStep: (step: number) => void;
  setMedicationName: (value: string) => void;
  setMedicationForm: (value: string) => void;
  setStrength: (value: string) => void;
  setStrengthUnit: (value: string) => void;
  setMedicationFrequency: (value: string) => void;
  setDailySchedule: (value: string) => void;
  setDailyScheduleDetail: (value: string) => void;
  setTimesPerDay: (value: string) => void;
  setWeeklyDay: (value: string) => void;
  setNextDoseDate: (value: string) => void;
  setFewMonthsInterval: (value: string) => void;
  setAsNeededNote: (value: string) => void;
  setOtherSchedule: (value: string) => void;
  setIndication: (value: string) => void;
  toggleSelectedWeekDay: (day: string) => void;
};

const panelStyle = {
  width: "14.285714%",
  flexShrink: 0,
  minHeight: "calc(100vh - 150px)",
  padding: "0 12px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
} as const;

const questionStyle = {
  marginTop: "clamp(58px, 11vh, 100px)",
  marginBottom: "clamp(32px, 6vh, 56px)",
  fontSize: "24px",
  fontWeight: "bold",
} as const;

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "24px",
  padding: "14px",
  borderRadius: "8px",
  border: "2px solid white",
  boxSizing: "border-box",
  backgroundColor: "#1a5334",
  color: "white",
  fontSize: "16px",
} as const;

const darkButtonStyle = {
  minWidth: "118px",
  padding: "13px 22px",
  borderRadius: "999px",
  border: "2px solid white",
  backgroundColor: "#1a5334",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
} as const;

const lightButtonStyle = {
  minWidth: "118px",
  padding: "13px 22px",
  borderRadius: "999px",
  border: "2px solid white",
  backgroundColor: "white",
  color: "#1a5334",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
} as const;

const navigationStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "16px",
  marginTop: "32px",
} as const;

const getButtonStateStyle = (
  style: typeof darkButtonStyle | typeof lightButtonStyle,
  isEnabled: boolean
) => ({
  ...style,
  opacity: isEnabled ? 1 : 0.45,
  cursor: isEnabled ? "pointer" : "not-allowed",
});

const medicationForms = [
  "Tablet",
  "Capsule",
  "Liquid",
  "Injection",
  "Cream",
  "Ointment",
  "Patch",
  "Drops",
  "Spray",
  "Inhaler",
  "Other",
];

const strengthUnits = [
  "mg",
  "g",
  "mcg",
  "mL",
  "mg/mL",
  "mcg/mL",
  "L",
  "uL",
  "%",
  "IE",
  "units",
  "puffs",
  "drops",
  "other",
];

const frequencies = [
  "Every day",
  "A few days a week",
  "Once a week",
  "Every 2 weeks",
  "Once a month",
  "Every few months",
  "Only when needed",
  "Other schedule",
];

const dailyTimesPerDayOption = "Times per day";
const dailyEveryHoursOption = "Every number of hours";

const fewMonthsOptions = [
  "Every 2 months",
  "Every 3 months",
  "Every 6 months",
  "Once a year",
];

const calendarWeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatDateForDisplay = (dateString: string) => {
  if (!dateString) {
    return "dd/mm/yyyy";
  }

  const [year, month, day] = dateString.split("-");

  if (!year || !month || !day) {
    return "dd/mm/yyyy";
  }

  return `${day}/${month}/${year}`;
};

const getDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateFromInputValue = (dateString: string) => {
  if (!dateString) {
    return new Date();
  }

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
};

function MedicationWizard({
  isOpen,
  step,
  editingMedicationId,
  medicationName,
  medicationForm,
  strength,
  strengthUnit,
  medicationFrequency,
  dailySchedule,
  dailyScheduleDetail,
  timesPerDay,
  selectedWeekDays,
  weeklyDay,
  nextDoseDate,
  fewMonthsInterval,
  asNeededNote,
  otherSchedule,
  indication,
  weekDays,
  scheduleSummary,
  onClose,
  onSave,
  setStep,
  setMedicationName,
  setMedicationForm,
  setStrength,
  setStrengthUnit,
  setMedicationFrequency,
  setDailySchedule,
  setDailyScheduleDetail,
  setTimesPerDay,
  setWeeklyDay,
  setNextDoseDate,
  setFewMonthsInterval,
  setAsNeededNote,
  setOtherSchedule,
  setIndication,
  toggleSelectedWeekDay,
}: MedicationWizardProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [visibleCalendarDate, setVisibleCalendarDate] = useState(() =>
    getDateFromInputValue(nextDoseDate)
  );

  const visibleCalendarYear = visibleCalendarDate.getFullYear();
  const visibleCalendarMonth = visibleCalendarDate.getMonth();
  const firstDayOfMonth = new Date(visibleCalendarYear, visibleCalendarMonth, 1);
  const emptyDaysBeforeMonth = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(
    visibleCalendarYear,
    visibleCalendarMonth + 1,
    0
  ).getDate();
  const selectedDate = getDateFromInputValue(nextDoseDate);

  const goToPreviousCalendarMonth = () => {
    setVisibleCalendarDate(
      new Date(visibleCalendarYear, visibleCalendarMonth - 1, 1)
    );
  };

  const goToNextCalendarMonth = () => {
    setVisibleCalendarDate(
      new Date(visibleCalendarYear, visibleCalendarMonth + 1, 1)
    );
  };

  const selectCalendarDate = (day: number) => {
    setNextDoseDate(
      getDateInputValue(new Date(visibleCalendarYear, visibleCalendarMonth, day))
    );
    setIsDatePickerOpen(false);
  };

  const isStepComplete = (stepToCheck: number) => {
    if (stepToCheck === 0) {
      return medicationName.trim().length > 0;
    }

    if (stepToCheck === 1) {
      return medicationForm.trim().length > 0;
    }

    if (stepToCheck === 2) {
      return strength.trim().length > 0;
    }

    if (stepToCheck === 3) {
      return medicationFrequency.trim().length > 0;
    }

    if (stepToCheck === 4) {
      if (medicationFrequency === "Every day") {
        if (dailySchedule === dailyTimesPerDayOption) {
          return timesPerDay.trim().length > 0;
        }

        if (dailySchedule === dailyEveryHoursOption) {
          return dailyScheduleDetail.trim().length > 0;
        }

        return false;
      }

      if (medicationFrequency === "A few days a week") {
        return selectedWeekDays.length > 0;
      }

      if (medicationFrequency === "Once a week") {
        return weeklyDay.trim().length > 0;
      }

      if (
        medicationFrequency === "Every 2 weeks" ||
        medicationFrequency === "Once a month"
      ) {
        return nextDoseDate.trim().length > 0;
      }

      if (medicationFrequency === "Every few months") {
        return (
          fewMonthsInterval.trim().length > 0 &&
          nextDoseDate.trim().length > 0
        );
      }

      if (medicationFrequency === "Only when needed") {
        return true;
      }

      if (medicationFrequency === "Other schedule") {
        return otherSchedule.trim().length > 0;
      }

      return false;
    }

    return true;
  };

  const canSaveMedication =
    isStepComplete(0) &&
    isStepComplete(1) &&
    isStepComplete(2) &&
    isStepComplete(3) &&
    isStepComplete(4);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#1a5334",
        zIndex: 1000,
        padding: "24px",
        boxSizing: "border-box",
        color: "white",
        overflowY: "auto",
        transform: isOpen ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease",
      }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <h2 style={{ margin: 0, textAlign: "center" }}>
            {editingMedicationId === null ? "Add medication" : "Edit medication"}
          </h2>

          <button
            onClick={onClose}
            style={{
              position: "absolute",
              right: 0,
              border: "none",
              backgroundColor: "transparent",
              fontSize: "28px",
              cursor: "pointer",
              color: "white",
            }}
          >
            x
          </button>
        </div>

        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              width: "700%",
              transform: `translateX(-${step * 14.285714}%)`,
              transition: "transform 0.3s ease",
            }}
          >
            <div style={panelStyle}>
              <label htmlFor="medication-name" style={{ ...questionStyle, display: "block" }}>
                What is the name of your medication?
              </label>
              <input
                id="medication-name"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                placeholder=""
                style={inputStyle}
              />
              <div style={navigationStyle}>
                <button
                  disabled={!isStepComplete(0)}
                  onClick={() => setStep(1)}
                  style={getButtonStateStyle(lightButtonStyle, isStepComplete(0))}
                >
                  Next
                </button>
              </div>
            </div>

            <div style={panelStyle}>
              <label htmlFor="medication-form" style={{ ...questionStyle, display: "block" }}>
                What form is your medication?
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                {medicationForms.map((form) => {
                  const isSelected = medicationForm === form;

                  return (
                    <button
                      key={form}
                      className="wizard-option-button"
                      onClick={() => setMedicationForm(form)}
                      style={{
                        minHeight: "52px",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid white",
                        backgroundColor: isSelected ? "white" : "#1a5334",
                        color: isSelected ? "#1a5334" : "white",
                        fontSize: "15px",
                        fontWeight: isSelected ? "bold" : 600,
                        cursor: "pointer",
                      }}
                    >
                      {form}
                    </button>
                  );
                })}
              </div>
              <div style={navigationStyle}>
                <button onClick={() => setStep(0)} style={darkButtonStyle}>Back</button>
                <button
                  disabled={!isStepComplete(1)}
                  onClick={() => setStep(2)}
                  style={getButtonStateStyle(lightButtonStyle, isStepComplete(1))}
                >
                  Next
                </button>
              </div>
            </div>

            <div style={panelStyle}>
              <label htmlFor="medication-strength" style={{ ...questionStyle, display: "block" }}>
                What is your medication strength or dosage?
              </label>
              <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                <input
                  id="medication-strength"
                  type="text"
                  inputMode="decimal"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  placeholder=""
                  style={{ ...inputStyle, flex: 1, minWidth: 0, marginBottom: 0 }}
                />
                <select
                  value={strengthUnit}
                  onChange={(e) => setStrengthUnit(e.target.value)}
                  style={{ ...inputStyle, width: "130px", marginBottom: 0 }}
                >
                  {strengthUnits.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div style={navigationStyle}>
                <button onClick={() => setStep(1)} style={darkButtonStyle}>Back</button>
                <button
                  disabled={!isStepComplete(2)}
                  onClick={() => setStep(3)}
                  style={getButtonStateStyle(lightButtonStyle, isStepComplete(2))}
                >
                  Next
                </button>
              </div>
            </div>

            <div style={panelStyle}>
              <p
                style={{
                  ...questionStyle,
                  marginTop: "clamp(36px, 7vh, 60px)",
                  marginBottom: "clamp(20px, 4vh, 34px)",
                }}
              >
                How often do you take your medication?
              </p>
              <div style={{ display: "grid", gap: "8px", marginBottom: "18px" }}>
                {frequencies.map((frequency) => (
                  <button
                    key={frequency}
                    className="wizard-option-button"
                    onClick={() => setMedicationFrequency(frequency)}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: medicationFrequency === frequency ? "white" : "#1a5334",
                      color: medicationFrequency === frequency ? "#1a5334" : "white",
                      fontSize: "16px",
                      fontWeight: medicationFrequency === frequency ? "bold" : 600,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {frequency}
                  </button>
                ))}
              </div>
              <div style={navigationStyle}>
                <button onClick={() => setStep(2)} style={darkButtonStyle}>Back</button>
                <button
                  disabled={!isStepComplete(3)}
                  onClick={() => setStep(4)}
                  style={getButtonStateStyle(lightButtonStyle, isStepComplete(3))}
                >
                  Next
                </button>
              </div>
            </div>

            <div style={panelStyle}>
              <p style={questionStyle}>
                {medicationFrequency === "Every day" && "How often per day?"}
                {medicationFrequency === "A few days a week" && "Which days do you take it?"}
                {medicationFrequency === "Once a week" && "Which day do you take it?"}
                {medicationFrequency === "Every 2 weeks" && "When is your next dose?"}
                {medicationFrequency === "Once a month" && "When is your next dose?"}
                {medicationFrequency === "Every few months" && "How often, and when is your next dose?"}
                {medicationFrequency === "Only when needed" && "When do you usually take it?"}
                {medicationFrequency === "Other schedule" && "Describe your schedule"}
                {!medicationFrequency && "Tell us more about your schedule"}
              </p>

              {medicationFrequency === "Every day" && (
                <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
                  <label
                    className="wizard-option-button"
                    htmlFor="daily-dose-count"
                    onClick={() => {
                      setDailySchedule(dailyTimesPerDayOption);
                      setDailyScheduleDetail("");
                    }}
                    style={{
                      minHeight: "58px",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor:
                        dailySchedule === dailyTimesPerDayOption ? "white" : "#1a5334",
                      color:
                        dailySchedule === dailyTimesPerDayOption ? "#1a5334" : "white",
                      fontSize: "16px",
                      fontWeight:
                        dailySchedule === dailyTimesPerDayOption ? "bold" : 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      id="daily-dose-count"
                      type="text"
                      inputMode="numeric"
                      value={timesPerDay}
                      onFocus={() => {
                        setDailySchedule(dailyTimesPerDayOption);
                        setDailyScheduleDetail("");
                      }}
                      onChange={(e) => {
                        setDailySchedule(dailyTimesPerDayOption);
                        setDailyScheduleDetail("");
                        setTimesPerDay(e.target.value);
                      }}
                      placeholder=""
                      style={{
                        width: "58px",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "2px solid currentColor",
                        backgroundColor: "transparent",
                        color: "inherit",
                        fontSize: "16px",
                        fontWeight: "bold",
                        textAlign: "center",
                        boxSizing: "border-box",
                      }}
                    />
                    <span>times per day</span>
                  </label>

                  <label
                    className="wizard-option-button"
                    htmlFor="hours-between-doses"
                    onClick={() => {
                      setDailySchedule(dailyEveryHoursOption);
                      setTimesPerDay("");
                    }}
                    style={{
                      minHeight: "58px",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor:
                        dailySchedule === dailyEveryHoursOption ? "white" : "#1a5334",
                      color:
                        dailySchedule === dailyEveryHoursOption ? "#1a5334" : "white",
                      fontSize: "16px",
                      fontWeight:
                        dailySchedule === dailyEveryHoursOption ? "bold" : 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>Every</span>
                    <input
                      id="hours-between-doses"
                      type="text"
                      inputMode="numeric"
                      value={dailyScheduleDetail}
                      onFocus={() => {
                        setDailySchedule(dailyEveryHoursOption);
                        setTimesPerDay("");
                      }}
                      onChange={(e) => {
                        setDailySchedule(dailyEveryHoursOption);
                        setTimesPerDay("");
                        setDailyScheduleDetail(e.target.value);
                      }}
                      placeholder=""
                      style={{
                        width: "58px",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "2px solid currentColor",
                        backgroundColor: "transparent",
                        color: "inherit",
                        fontSize: "16px",
                        fontWeight: "bold",
                        textAlign: "center",
                        boxSizing: "border-box",
                      }}
                    />
                    <span>hours</span>
                  </label>
                </div>
              )}

              {medicationFrequency === "A few days a week" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px", marginBottom: "24px" }}>
                  {weekDays.map((day) => (
                    <button
                      key={day}
                      className="wizard-option-button"
                      onClick={() => toggleSelectedWeekDay(day)}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: "2px solid white",
                        backgroundColor: selectedWeekDays.includes(day) ? "white" : "#1a5334",
                        color: selectedWeekDays.includes(day) ? "#1a5334" : "white",
                        fontSize: "16px",
                        fontWeight: selectedWeekDays.includes(day) ? "bold" : 600,
                        cursor: "pointer",
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}

              {medicationFrequency === "Once a week" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px", marginBottom: "24px" }}>
                  {weekDays.map((day) => (
                    <button
                      key={day}
                      className="wizard-option-button"
                      onClick={() => setWeeklyDay(day)}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: "2px solid white",
                        backgroundColor: weeklyDay === day ? "white" : "#1a5334",
                        color: weeklyDay === day ? "#1a5334" : "white",
                        fontSize: "16px",
                        fontWeight: weeklyDay === day ? "bold" : 600,
                        cursor: "pointer",
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}

              {medicationFrequency === "Every few months" && (
                <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
                  {fewMonthsOptions.map((option) => (
                    <button
                      key={option}
                      className="wizard-option-button"
                      onClick={() => setFewMonthsInterval(option)}
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "8px",
                        border: "2px solid white",
                        backgroundColor: fewMonthsInterval === option ? "white" : "#1a5334",
                        color: fewMonthsInterval === option ? "#1a5334" : "white",
                        fontSize: "16px",
                        fontWeight: fewMonthsInterval === option ? "bold" : 600,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {(medicationFrequency === "Every 2 weeks" ||
                medicationFrequency === "Once a month" ||
                medicationFrequency === "Every few months") && (
                <div style={{ marginBottom: "24px" }}>
                  {medicationFrequency === "Every few months" && (
                    <p style={{ marginTop: 0, marginBottom: "10px", fontWeight: "bold" }}>
                      When is your next dose?
                    </p>
                  )}
                  <button
                    className="wizard-option-button"
                    onClick={() => {
                      setVisibleCalendarDate(getDateFromInputValue(nextDoseDate));
                      setIsDatePickerOpen((currentValue) => !currentValue);
                    }}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      boxSizing: "border-box",
                      backgroundColor: "#1a5334",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{formatDateForDisplay(nextDoseDate)}</span>
                    <span
                      aria-hidden="true"
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid white",
                        borderRadius: "5px",
                        display: "inline-flex",
                        position: "relative",
                        boxSizing: "border-box",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "5px",
                          left: 0,
                          right: 0,
                          borderTop: "2px solid white",
                        }}
                      />
                    </span>
                  </button>

                  {isDatePickerOpen && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid white",
                        backgroundColor: "#1a5334",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <button
                          onClick={goToPreviousCalendarMonth}
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                            fontSize: "22px",
                            cursor: "pointer",
                          }}
                        >
                          ‹
                        </button>
                        <p style={{ margin: 0, fontWeight: "bold" }}>
                          {visibleCalendarDate.toLocaleDateString("en-GB", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <button
                          onClick={goToNextCalendarMonth}
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                            fontSize: "22px",
                            cursor: "pointer",
                          }}
                        >
                          ›
                        </button>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(7, 1fr)",
                          gap: "6px",
                          marginBottom: "6px",
                        }}
                      >
                        {calendarWeekDays.map((day) => (
                          <span
                            key={day}
                            style={{
                              textAlign: "center",
                              fontSize: "12px",
                              opacity: 0.8,
                            }}
                          >
                            {day}
                          </span>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(7, 1fr)",
                          gap: "6px",
                        }}
                      >
                        {Array.from({ length: emptyDaysBeforeMonth }).map((_, index) => (
                          <span key={`empty-${index}`} />
                        ))}

                        {Array.from({ length: daysInMonth }, (_, index) => {
                          const day = index + 1;
                          const isSelected =
                            selectedDate.getFullYear() === visibleCalendarYear &&
                            selectedDate.getMonth() === visibleCalendarMonth &&
                            selectedDate.getDate() === day &&
                            Boolean(nextDoseDate);

                          return (
                            <button
                              key={day}
                              onClick={() => selectCalendarDate(day)}
                              className="wizard-option-button"
                              style={{
                                aspectRatio: "1",
                                borderRadius: "8px",
                                border: "1px solid white",
                                backgroundColor: isSelected ? "white" : "#1a5334",
                                color: isSelected ? "#1a5334" : "white",
                                cursor: "pointer",
                                fontWeight: isSelected ? "bold" : 600,
                              }}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {medicationFrequency === "Only when needed" && (
                <textarea value={asNeededNote} onChange={(e) => setAsNeededNote(e.target.value)} placeholder="When I have pain" rows={4} style={{ ...inputStyle, resize: "vertical" }} />
              )}

              {medicationFrequency === "Other schedule" && (
                <textarea value={otherSchedule} onChange={(e) => setOtherSchedule(e.target.value)} placeholder="Every other day" rows={4} style={{ ...inputStyle, resize: "vertical" }} />
              )}

              <div style={navigationStyle}>
                <button onClick={() => setStep(3)} style={darkButtonStyle}>Back</button>
                <button
                  disabled={!isStepComplete(4)}
                  onClick={() => setStep(5)}
                  style={getButtonStateStyle(lightButtonStyle, isStepComplete(4))}
                >
                  Next
                </button>
              </div>
            </div>

            <div style={panelStyle}>
              <label htmlFor="medication-indication" style={{ ...questionStyle, display: "block" }}>
                Why are you taking this medication?
              </label>
              <textarea
                id="medication-indication"
                value={indication}
                onChange={(e) => setIndication(e.target.value)}
                placeholder=""
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <div style={navigationStyle}>
                <button onClick={() => setStep(4)} style={darkButtonStyle}>Back</button>
                <button onClick={() => setStep(6)} style={lightButtonStyle}>
                  {indication.trim() ? "Next" : "Skip"}
                </button>
              </div>
            </div>

            <div style={panelStyle}>
              <p style={questionStyle}>
                Review your medication
              </p>
              <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
                {[
                  ["Name", medicationName || "Not added"],
                  ["Form", medicationForm || "Not selected"],
                  ["Strength", strength ? `${strength} ${strengthUnit}` : "Not added"],
                  ["Schedule", scheduleSummary],
                  ["Reason", indication || "Not added"],
                ].map(([label, value]) => (
                  <div key={label} style={{ border: "2px solid white", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "14px", opacity: 0.85 }}>{label}</p>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>{value}</p>
                  </div>
                ))}
              </div>
              <div style={navigationStyle}>
                <button onClick={() => setStep(5)} style={darkButtonStyle}>Back</button>
                <button
                  disabled={!canSaveMedication}
                  onClick={onSave}
                  style={getButtonStateStyle(lightButtonStyle, canSaveMedication)}
                >
                  {editingMedicationId === null ? "Save" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicationWizard;
