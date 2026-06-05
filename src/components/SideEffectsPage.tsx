import { useState } from "react";
import type { Medication, SideEffectLog, SideEffectSeverity } from "../types";
import { DrawnPlus, DrawnX } from "./DrawnIcons";
import { IconButton } from "./IconButton";

type SideEffectsPageProps = {
  medications: Medication[];
  sideEffectLogs: SideEffectLog[];
  onAddSideEffectLog: (sideEffectLog: SideEffectLog) => void;
  onDeleteSideEffectLog: (sideEffectLogId: number) => void;
};

const severityOptions: SideEffectSeverity[] = ["Mild", "Moderate", "Severe"];
const calendarWeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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

const formatLogDate = (dateValue: string) => {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const getSuspectedMedicationLabel = (log: SideEffectLog) => {
  if (log.medicationNames?.length > 0) {
    return log.medicationNames.join(", ");
  }

  return log.medicationName || "I don't know";
};

function SideEffectsPage({
  medications,
  sideEffectLogs,
  onAddSideEffectLog,
  onDeleteSideEffectLog,
}: SideEffectsPageProps) {
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [suspectedMedicationIds, setSuspectedMedicationIds] = useState<number[]>(
    []
  );
  const [isUnknownMedication, setIsUnknownMedication] = useState(false);
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState<SideEffectSeverity | "">("");
  const [date, setDate] = useState(() => getDateInputValue(new Date()));
  const [notes, setNotes] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [visibleCalendarDate, setVisibleCalendarDate] = useState(() =>
    getDateFromInputValue(date)
  );

  const selectedMedications = medications.filter((medication) =>
    suspectedMedicationIds.includes(medication.id)
  );
  const canSave =
    symptom.trim().length > 0 &&
    (suspectedMedicationIds.length > 0 || isUnknownMedication) &&
    severity !== "";
  const visibleCalendarYear = visibleCalendarDate.getFullYear();
  const visibleCalendarMonth = visibleCalendarDate.getMonth();
  const firstDayOfMonth = new Date(visibleCalendarYear, visibleCalendarMonth, 1);
  const emptyDaysBeforeMonth = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(
    visibleCalendarYear,
    visibleCalendarMonth + 1,
    0
  ).getDate();
  const selectedDate = getDateFromInputValue(date);

  const closeLogger = () => {
    setIsLoggerOpen(false);
    setSuspectedMedicationIds([]);
    setIsUnknownMedication(false);
    setSymptom("");
    setSeverity("");
    setDate(getDateInputValue(new Date()));
    setNotes("");
    setIsDatePickerOpen(false);
  };

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
    setDate(
      getDateInputValue(new Date(visibleCalendarYear, visibleCalendarMonth, day))
    );
    setIsDatePickerOpen(false);
  };

  const saveLog = () => {
    if (
      symptom.trim().length === 0 ||
      (suspectedMedicationIds.length === 0 && !isUnknownMedication) ||
      severity === ""
    ) {
      return;
    }

    onAddSideEffectLog({
      id: Date.now(),
      medicationIds: selectedMedications.map((medication) => medication.id),
      medicationNames:
        selectedMedications.length > 0
          ? selectedMedications.map((medication) => medication.medicationName)
          : ["I don't know"],
      symptom: symptom.trim(),
      severity,
      date,
      notes: notes.trim(),
    });
    closeLogger();
  };

  const toggleSuspectedMedication = (medicationId: number) => {
    setIsUnknownMedication(false);
    setSuspectedMedicationIds((currentIds) =>
      currentIds.includes(medicationId)
        ? currentIds.filter((currentId) => currentId !== medicationId)
        : [...currentIds, medicationId]
    );
  };

  const selectUnknownMedication = () => {
    setSuspectedMedicationIds([]);
    setIsUnknownMedication(true);
  };

  return (
    <section
      style={{
        padding: "32px 24px",
        color: "#1a5334",
        maxWidth: "520px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          margin: "0 0 16px",
          fontSize: "24px",
          textAlign: "center",
        }}
      >
        Side effects
      </h2>

      <button
        className="start-medication-button"
        onClick={() => setIsLoggerOpen(true)}
        style={{
          width: "100%",
          minHeight: "58px",
          marginBottom: "28px",
          padding: "14px 18px",
          borderRadius: "999px",
          border: "2px solid #1a5334",
          backgroundColor: "#1a5334",
          color: "white",
          boxShadow: "0 8px 18px rgba(26, 83, 52, 0.18)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            border: "2px solid white",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <DrawnPlus size={13} color="white" />
        </span>
        <span
          style={{
            display: "inline-flex",
            fontSize: "17px",
            fontWeight: "bold",
            letterSpacing: 0,
          }}
        >
          Log symptom
        </span>
      </button>

      <p
        style={{
          margin: "0 0 14px",
          fontSize: "14px",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        Logged side effects
      </p>

      <div style={{ display: "grid", gap: "12px" }}>
        {sideEffectLogs.length === 0 ? (
          <div
            aria-hidden="true"
            style={{
              minHeight: "120px",
              borderRadius: "8px",
              border: "1px solid #d8e5dc",
              backgroundColor: "white",
              boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
            }}
          />
        ) : (
          sideEffectLogs
            .slice()
            .reverse()
            .map((log) => (
              <div
                key={log.id}
                style={{
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #d8e5dc",
                  backgroundColor: "white",
                  color: "#1a5334",
                  boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                    {log.symptom}
                  </p>
                  <IconButton
                    ariaLabel={`Delete ${log.symptom} side effect log`}
                    onClick={() => onDeleteSideEffectLog(log.id)}
                    size={30}
                    border="1px solid #d8e5dc"
                    backgroundColor="white"
                    style={{ marginTop: "-4px" }}
                  >
                    <DrawnX size={12} />
                  </IconButton>
                </div>
                <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
                  {log.severity} - {formatLogDate(log.date)}
                </p>
                <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
                  Suspected medication: {getSuspectedMedicationLabel(log)}
                </p>
                {log.notes && (
                  <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
                    {log.notes}
                  </p>
                )}
              </div>
            ))
        )}
      </div>

      {isLoggerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 950,
            padding: "24px",
            boxSizing: "border-box",
            backgroundColor: "white",
            overflowY: "auto",
            animation: "medicationDetailSlideDown 0.28s ease",
          }}
        >
          <div
            style={{
              maxWidth: "520px",
              margin: "0 auto",
              padding: "16px",
              backgroundColor: "white",
              color: "#1a5334",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "28px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 4px",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Side effects
                </p>
                <h3 style={{ margin: 0, fontSize: "22px" }}>
                  Log symptom
                </h3>
              </div>

              <IconButton ariaLabel="Close side effect log" onClick={closeLogger}>
                <DrawnX />
              </IconButton>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
              <label style={{ display: "grid", gap: "10px" }}>
                <span style={{ fontWeight: "bold" }}>Symptom</span>
                <input
                  value={symptom}
                  onChange={(event) => setSymptom(event.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid #d8e5dc",
                    color: "#1a5334",
                    fontSize: "16px",
                  }}
                />
              </label>

              <div>
                <p style={{ margin: "0 0 10px", fontWeight: "bold" }}>
                  Suspected medication
                </p>
                <div style={{ display: "grid", gap: "8px" }}>
                  {medications.map((medication) => {
                    const isSelected = suspectedMedicationIds.includes(
                      medication.id
                    );

                    return (
                      <button
                        key={medication.id}
                        className="wizard-option-button"
                        onClick={() => toggleSuspectedMedication(medication.id)}
                        style={{
                          minHeight: "48px",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #1a5334",
                          backgroundColor: isSelected ? "white" : "#1a5334",
                          color: isSelected ? "#1a5334" : "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        {medication.medicationName}
                      </button>
                    );
                  })}

                  <button
                    className="wizard-option-button"
                    onClick={selectUnknownMedication}
                    style={{
                      minHeight: "48px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #1a5334",
                      backgroundColor: isUnknownMedication ? "white" : "#1a5334",
                      color: isUnknownMedication ? "#1a5334" : "white",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    I don't know
                  </button>
                </div>
              </div>

              <div>
                <p style={{ margin: "0 0 10px", fontWeight: "bold" }}>
                  Severity
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {severityOptions.map((option) => {
                    const isSelected = severity === option;

                    return (
                      <button
                        key={option}
                        className="wizard-option-button"
                        onClick={() => setSeverity(option)}
                        style={{
                          minHeight: "48px",
                          borderRadius: "8px",
                          border: "1px solid #1a5334",
                          backgroundColor: isSelected ? "white" : "#1a5334",
                          color: isSelected ? "#1a5334" : "white",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label style={{ display: "grid", gap: "10px" }}>
                <span style={{ fontWeight: "bold" }}>Date</span>
                <button
                  className="wizard-option-button"
                  onClick={() => {
                    setVisibleCalendarDate(getDateFromInputValue(date));
                    setIsDatePickerOpen((currentValue) => !currentValue);
                  }}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid #1a5334",
                    backgroundColor: "#1a5334",
                    color: "white",
                    fontSize: "16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{formatDateForDisplay(date)}</span>
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
              </label>

              {isDatePickerOpen && (
                <div
                  style={{
                    marginTop: "-8px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #1a5334",
                    backgroundColor: "#1a5334",
                    color: "white",
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
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "white",
                        fontSize: "22px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      {"<"}
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
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "white",
                        fontSize: "22px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      {">"}
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
                    {Array.from({ length: emptyDaysBeforeMonth }).map(
                      (_, index) => (
                        <span key={`empty-${index}`} />
                      )
                    )}

                    {Array.from({ length: daysInMonth }, (_, index) => {
                      const day = index + 1;
                      const isSelected =
                        selectedDate.getFullYear() === visibleCalendarYear &&
                        selectedDate.getMonth() === visibleCalendarMonth &&
                        selectedDate.getDate() === day &&
                        Boolean(date);

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

              <label style={{ display: "grid", gap: "10px" }}>
                <span style={{ fontWeight: "bold" }}>Notes</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={5}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid #d8e5dc",
                    color: "#1a5334",
                    fontSize: "16px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </label>

              <button
                disabled={!canSave}
                onClick={saveLog}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid #1a5334",
                  backgroundColor: "#1a5334",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: canSave ? "pointer" : "not-allowed",
                  opacity: canSave ? 1 : 0.45,
                }}
              >
                Save side effect
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SideEffectsPage;
