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
  timesPerDay: string;
  selectedWeekDays: string[];
  weeklyDay: string;
  nextDoseDate: string;
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
  setTimesPerDay: (value: string) => void;
  setWeeklyDay: (value: string) => void;
  setNextDoseDate: (value: string) => void;
  setAsNeededNote: (value: string) => void;
  setOtherSchedule: (value: string) => void;
  setIndication: (value: string) => void;
  toggleSelectedWeekDay: (day: string) => void;
};

const panelStyle = {
  width: "12.5%",
  flexShrink: 0,
  paddingLeft: "12px",
  boxSizing: "border-box",
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
  flex: 1,
  padding: "14px",
  borderRadius: "8px",
  border: "2px solid white",
  backgroundColor: "#1a5334",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
} as const;

const lightButtonStyle = {
  flex: 1,
  padding: "14px",
  borderRadius: "8px",
  border: "2px solid white",
  backgroundColor: "white",
  color: "#1a5334",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
} as const;

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
  "Only when needed",
  "Other schedule",
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
  timesPerDay,
  selectedWeekDays,
  weeklyDay,
  nextDoseDate,
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
  setTimesPerDay,
  setWeeklyDay,
  setNextDoseDate,
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
              width: "800%",
              transform: `translateX(-${step * 12.5}%)`,
              transition: "transform 0.3s ease",
            }}
          >
            <div
              style={{
                width: "12.5%",
                flexShrink: 0,
                paddingRight: "12px",
                boxSizing: "border-box",
              }}
            >
              <button
                className="start-medication-button"
                onClick={() => setStep(1)}
                style={{
                  width: "100%",
                  minHeight: "96px",
                  padding: "18px",
                  borderRadius: "8px",
                  border: "2px solid white",
                  backgroundColor: "#1a5334",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textAlign: "center",
                  letterSpacing: "0.08em",
                }}
              >
                START
              </button>
            </div>

            <div style={panelStyle}>
              <label htmlFor="medication-name" style={{ display: "block", marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}>
                What is the name of your medication?
              </label>
              <input
                id="medication-name"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                placeholder="Metformin"
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(0)} style={darkButtonStyle}>Back</button>
                <button onClick={() => setStep(2)} style={lightButtonStyle}>Next</button>
              </div>
            </div>

            <div style={panelStyle}>
              <label htmlFor="medication-form" style={{ display: "block", marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}>
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
                        fontWeight: isSelected ? "bold" : "normal",
                        cursor: "pointer",
                      }}
                    >
                      {form}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(1)} style={darkButtonStyle}>Back</button>
                <button onClick={() => setStep(3)} style={lightButtonStyle}>Next</button>
              </div>
            </div>

            <div style={panelStyle}>
              <label htmlFor="medication-strength" style={{ display: "block", marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}>
                What is your medication strength or dosage?
              </label>
              <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                <input
                  id="medication-strength"
                  type="text"
                  inputMode="decimal"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  placeholder="2.5"
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
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(2)} style={darkButtonStyle}>Back</button>
                <button onClick={() => setStep(4)} style={lightButtonStyle}>Next</button>
              </div>
            </div>

            <div style={panelStyle}>
              <p style={{ marginTop: 0, marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}>
                How often do you take your medication?
              </p>
              <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
                {frequencies.map((frequency) => (
                  <button
                    key={frequency}
                    className="wizard-option-button"
                    onClick={() => setMedicationFrequency(frequency)}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: medicationFrequency === frequency ? "white" : "#1a5334",
                      color: medicationFrequency === frequency ? "#1a5334" : "white",
                      fontSize: "16px",
                      fontWeight: medicationFrequency === frequency ? "bold" : "normal",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {frequency}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(3)} style={darkButtonStyle}>Back</button>
                <button onClick={() => setStep(5)} style={lightButtonStyle}>Next</button>
              </div>
            </div>

            <div style={panelStyle}>
              <p style={{ marginTop: 0, marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}>
                {medicationFrequency === "Every day" && "How many times per day?"}
                {medicationFrequency === "A few days a week" && "Which days do you take it?"}
                {medicationFrequency === "Once a week" && "Which day do you take it?"}
                {medicationFrequency === "Every 2 weeks" && "When is your next dose?"}
                {medicationFrequency === "Once a month" && "When is your next dose?"}
                {medicationFrequency === "Only when needed" && "When do you usually take it?"}
                {medicationFrequency === "Other schedule" && "Describe your schedule"}
                {!medicationFrequency && "Tell us more about your schedule"}
              </p>

              {medicationFrequency === "Every day" && (
                <input
                  type="text"
                  inputMode="numeric"
                  value={timesPerDay}
                  onChange={(e) => setTimesPerDay(e.target.value)}
                  placeholder="2"
                  style={inputStyle}
                />
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
                        fontWeight: selectedWeekDays.includes(day) ? "bold" : "normal",
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
                        fontWeight: weeklyDay === day ? "bold" : "normal",
                        cursor: "pointer",
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}

              {(medicationFrequency === "Every 2 weeks" || medicationFrequency === "Once a month") && (
                <div style={{ marginBottom: "24px" }}>
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
                                fontWeight: isSelected ? "bold" : "normal",
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

              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(4)} style={darkButtonStyle}>Back</button>
                <button onClick={() => setStep(6)} style={lightButtonStyle}>Next</button>
              </div>
            </div>

            <div style={panelStyle}>
              <label htmlFor="medication-indication" style={{ display: "block", marginBottom: "8px", fontSize: "24px", fontWeight: "bold" }}>
                Why are you taking this medication?
              </label>
              <p style={{ marginTop: 0, marginBottom: "16px", fontSize: "15px" }}>Optional</p>
              <textarea
                id="medication-indication"
                value={indication}
                onChange={(e) => setIndication(e.target.value)}
                placeholder="Blood pressure, pain, allergy"
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(5)} style={darkButtonStyle}>Back</button>
                <button onClick={() => setStep(7)} style={lightButtonStyle}>Next</button>
              </div>
            </div>

            <div style={panelStyle}>
              <p style={{ marginTop: 0, marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}>
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
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(6)} style={darkButtonStyle}>Back</button>
                <button onClick={onSave} style={lightButtonStyle}>
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
