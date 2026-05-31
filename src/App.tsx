import { useState } from "react";

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

function App() {

  // State for selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getDateLabel = (date: Date) => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dateText = date
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
      .toUpperCase();

    if (isSameDay(date, today)) {
      return `TODAY, ${dateText}`;
    }

    if (isSameDay(date, yesterday)) {
      return `YESTERDAY, ${dateText}`;
    }

    if (isSameDay(date, tomorrow)) {
      return `TOMORROW, ${dateText}`;
    }

    const weekday = date
      .toLocaleDateString("en-GB", {
        weekday: "long",
      })
      .toUpperCase();

    return `${weekday}, ${dateText}`;
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // State for showing add medication form

  const [showAddForm, setShowAddForm] = useState(false);
  const [addMedicationStep, setAddMedicationStep] = useState(0);
  const [activePage, setActivePage] = useState<Page>("tracker");

  // State for form fields
  const [medicationName, setMedicationName] = useState("");
  const [medicationForm, setMedicationForm] = useState("");
  const [strength, setStrength] = useState("");
  const [strengthUnit, setStrengthUnit] = useState("mg");
  const [medicationFrequency, setMedicationFrequency] = useState("");
  const [timesPerDay, setTimesPerDay] = useState("");
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]);
  const [weeklyDay, setWeeklyDay] = useState("");
  const [nextDoseDate, setNextDoseDate] = useState("");
  const [asNeededNote, setAsNeededNote] = useState("");
  const [otherSchedule, setOtherSchedule] = useState("");
  const [indication, setIndication] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [takenDoseIds, setTakenDoseIds] = useState<string[]>([]);
  const [completingDoseIds, setCompletingDoseIds] = useState<string[]>([]);
  const [selectedMedicationId, setSelectedMedicationId] = useState<number | null>(null);
  const [isConfirmingDeleteMedication, setIsConfirmingDeleteMedication] = useState(false);

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const bottomNavItems: { page: Page; label: string; icon: string }[] = [
    { page: "tracker", label: "Tracker", icon: "✓" },
    { page: "adherence", label: "Adherence", icon: "%" },
    { page: "medications", label: "Medications", icon: "+" },
    { page: "sideEffects", label: "Side effects", icon: "!" },
  ];

  const selectedMedication = medications.find(
    (medication) => medication.id === selectedMedicationId
  );

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

  const getScheduledDosesForDate = (date: Date): ScheduledDose[] => {
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

  const resetAddMedicationForm = () => {
    setAddMedicationStep(0);
    setMedicationName("");
    setMedicationForm("");
    setStrength("");
    setStrengthUnit("mg");
    setMedicationFrequency("");
    setTimesPerDay("");
    setSelectedWeekDays([]);
    setWeeklyDay("");
    setNextDoseDate("");
    setAsNeededNote("");
    setOtherSchedule("");
    setIndication("");
  };

  const getScheduleSummary = () => {
    if (medicationFrequency === "Every day") {
      return timesPerDay ? `Every day, ${timesPerDay} time(s) per day` : "Every day";
    }

    if (medicationFrequency === "A few days a week") {
      return selectedWeekDays.length > 0
        ? `A few days a week: ${selectedWeekDays.join(", ")}`
        : "A few days a week";
    }

    if (medicationFrequency === "Once a week") {
      return weeklyDay ? `Once a week on ${weeklyDay}` : "Once a week";
    }

    if (medicationFrequency === "Every 2 weeks") {
      return nextDoseDate ? `Every 2 weeks, next dose ${nextDoseDate}` : "Every 2 weeks";
    }

    if (medicationFrequency === "Once a month") {
      return nextDoseDate ? `Once a month, next dose ${nextDoseDate}` : "Once a month";
    }

    if (medicationFrequency === "Only when needed") {
      return asNeededNote ? `Only when needed: ${asNeededNote}` : "Only when needed";
    }

    if (medicationFrequency === "Other schedule") {
      return otherSchedule || "Other schedule";
    }

    return "Not selected";
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

  const handleSaveMedication = () => {
    const newMedication: Medication = {
      id: Date.now(),
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
    };

    setMedications([...medications, newMedication]);
    setShowAddForm(false);
    resetAddMedicationForm();
  };

  const scheduledDoses = getScheduledDosesForDate(selectedDate);

  const dosesToTake = scheduledDoses.filter(
    (dose) =>
      !takenDoseIds.includes(dose.id) &&
      !completingDoseIds.includes(dose.id)
  );

  const dosesTaken = scheduledDoses.filter((dose) =>
    takenDoseIds.includes(dose.id)
  );

  const markDoseAsTaken = (doseId: string) => {
    setCompletingDoseIds((currentIds) => [...currentIds, doseId]);

    window.setTimeout(() => {
      setCompletingDoseIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== doseId)
      );
      setTakenDoseIds((currentIds) => [...currentIds, doseId]);
    }, 650);
  };

  const undoTakenDose = (doseId: string) => {
    setTakenDoseIds((currentIds) =>
      currentIds.filter((currentId) => currentId !== doseId)
    );
  };

  const deleteSelectedMedication = () => {
    if (selectedMedicationId === null) {
      return;
    }

    const medicationDoseIdPrefix = `${selectedMedicationId}-`;

    setMedications((currentMedications) =>
      currentMedications.filter((medication) => medication.id !== selectedMedicationId)
    );
    setTakenDoseIds((currentIds) =>
      currentIds.filter((doseId) => !doseId.startsWith(medicationDoseIdPrefix))
    );
    setCompletingDoseIds((currentIds) =>
      currentIds.filter((doseId) => !doseId.startsWith(medicationDoseIdPrefix))
    );
    setSelectedMedicationId(null);
    setIsConfirmingDeleteMedication(false);
  };

  const toggleSelectedWeekDay = (day: string) => {
    setSelectedWeekDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((currentDay) => currentDay !== day)
        : [...currentDays, day]
    );
  };

  return (


    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        paddingBottom: "112px",
      }}
    >
      <style>
        {`
          @keyframes medicationCompleteSpin {
            0% {
              opacity: 1;
              transform: rotate(0deg) scale(1);
            }
            70% {
              opacity: 1;
              transform: rotate(300deg) scale(1.15);
            }
            100% {
              opacity: 0;
              transform: rotate(360deg) scale(0.2);
            }
          }

          @keyframes medicationDetailSlideDown {
            0% {
              opacity: 0;
              transform: translateY(-100%);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      {/* Top bar */}
      <header
        style={{
          height: "70px",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          boxShadow: "0 2px 8px #1a5334",
        }}
      >
        {/* App name */}
        <h1 style={{ fontSize: "26px", margin: 0, color: "#1a5334" }}>
          mediware
        </h1>

        {/* Right side icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Account icon */}
          <button
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: "1px solid #1a5334",
              backgroundColor: "#f1f5f9",
              fontSize: "20px",
              cursor: "pointer",

            }}
          >
            👤
          </button>

          {/* Add medication button */}
          <button
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#1a5334",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: 1,
            }}
            onClick={() => {
              resetAddMedicationForm();
              setShowAddForm(true);
            }}>
            +
          </button>
        </div>
      </header>

      {/* Page content */}
      {activePage === "tracker" && (
      <section style={{ padding: "24px", color: "#1a5334" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          {/* Left arrow */}
          <button
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#1a5334",
              fontSize: "28px",
              cursor: "pointer",
            }}
            onClick={goToPreviousDay}>
            ‹
          </button>

          {/* Date center */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <span style={{ fontSize: "24px" }}>📅</span>
            <span>{getDateLabel(selectedDate)}</span>
          </div>

          {/* Right arrow */}
          <button
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#1a5334",
              fontSize: "28px",
              cursor: "pointer",
            }}
            onClick={goToNextDay}
          >
            ›
          </button>
        </div>

        <div
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            display: "grid",
            gap: "14px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              color: "#1a5334",
              textAlign: "center",
            }}
          >
            MEDICATION TO TAKE
          </h2>

          {dosesToTake.length === 0 && (
            <div
              aria-hidden="true"
              style={{
                minHeight: "52px",
                borderRadius: "8px",
                border: "1px solid #d8e5dc",
                backgroundColor: "white",
                boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
              }}
            />
          )}

          {dosesToTake.map((dose) => (
            <div
              key={dose.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #d8e5dc",
                backgroundColor: "white",
                boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {dose.medication.medicationName}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  {dose.doseLabel}
                </p>
                {dose.medication.strength && (
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    {dose.medication.strength} {dose.medication.strengthUnit}
                  </p>
                )}
              </div>

              <button
                aria-label={`Mark ${dose.medication.medicationName} ${dose.doseLabel} as taken`}
                onClick={() => markDoseAsTaken(dose.id)}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "2px solid #1a5334",
                  backgroundColor: "#1a5334",
                  color: "white",
                  fontSize: "22px",
                  cursor: "pointer",
                  animation: completingDoseIds.includes(dose.id)
                    ? "medicationCompleteSpin 0.65s ease forwards"
                    : "none",
                }}
              >
                ✓
              </button>
            </div>
          ))}

          <section
            style={{
              marginTop: "32px",
            }}
          >
            <h2
              style={{
                margin: "0 0 14px",
                fontSize: "20px",
                color: "#1a5334",
                textAlign: "center",
              }}
            >
              MEDICATION TAKEN
            </h2>

            {dosesTaken.length === 0 ? (
              <div
                aria-hidden="true"
                style={{
                  minHeight: "52px",
                  borderRadius: "8px",
                  border: "1px solid #d8e5dc",
                  backgroundColor: "white",
                  boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
                }}
              />
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {dosesTaken.map((dose) => (
                  <div
                    key={dose.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "1px solid #d8e5dc",
                      backgroundColor: "#eef7f1",
                      color: "#1a5334",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {dose.medication.medicationName}
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: "14px" }}>
                        {dose.doseLabel}
                      </p>
                    </div>

                    <button
                      aria-label={`Move ${dose.medication.medicationName} ${dose.doseLabel} back to medication to take`}
                      onClick={() => undoTakenDose(dose.id)}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "1px solid #1a5334",
                        backgroundColor: "transparent",
                        color: "#1a5334",
                        fontSize: "20px",
                        cursor: "pointer",
                        lineHeight: "30px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
      )}

      {activePage !== "tracker" && (
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
            {activePage === "adherence" && "Adherence"}
            {activePage === "medications" && "Medications"}
            {activePage === "sideEffects" && "Side effects"}
          </h2>

          {activePage === "medications" ? (
            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {medications.length === 0 ? (
                <div
                  aria-hidden="true"
                  style={{
                    minHeight: "160px",
                    borderRadius: "8px",
                    border: "1px solid #d8e5dc",
                    backgroundColor: "white",
                    boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
                  }}
                />
              ) : (
                medications.map((medication) => (
                  <button
                    key={medication.id}
                    onClick={() => setSelectedMedicationId(medication.id)}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #d8e5dc",
                      backgroundColor: "white",
                      color: "#1a5334",
                      boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      {medication.medicationName}
                    </p>

                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      {[medication.strength && `${medication.strength} ${medication.strengthUnit}`, medication.medicationForm]
                        .filter(Boolean)
                        .join(" ")}
                    </p>

                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      {getMedicationScheduleSummary(medication)}
                    </p>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div
              aria-hidden="true"
              style={{
                minHeight: "160px",
                borderRadius: "8px",
                border: "1px solid #d8e5dc",
                backgroundColor: "white",
                boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
              }}
            />
          )}
        </section>
      )}

      {activePage === "medications" && selectedMedication && (
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
              borderRadius: "8px",
              border: "none",
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
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "22px",
                }}
              >
                {selectedMedication.medicationName}
              </h3>

              <button
                aria-label="Close medication details"
                onClick={() => {
                  setSelectedMedicationId(null);
                  setIsConfirmingDeleteMedication(false);
                }}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "1px solid #1a5334",
                  backgroundColor: "transparent",
                  color: "#1a5334",
                  fontSize: "20px",
                  cursor: "pointer",
                  lineHeight: "30px",
                }}
              >
                ×
              </button>
            </div>

            {[
              ["Form", selectedMedication.medicationForm || "Not selected"],
              [
                "Strength",
                selectedMedication.strength
                  ? `${selectedMedication.strength} ${selectedMedication.strengthUnit}`
                  : "Not added",
              ],
              ["Schedule", getMedicationScheduleSummary(selectedMedication)],
              ["Reason", selectedMedication.indication || "Not added"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: "12px 0",
                  borderTop: "1px solid #d8e5dc",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                  }}
                >
                {value}
              </p>
            </div>
          ))}

            {!isConfirmingDeleteMedication ? (
              <button
                onClick={() => setIsConfirmingDeleteMedication(true)}
                style={{
                  width: "100%",
                  marginTop: "18px",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid #b91c1c",
                  backgroundColor: "white",
                  color: "#b91c1c",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Delete medication
              </button>
            ) : (
              <div
                style={{
                  marginTop: "18px",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid #fecaca",
                  backgroundColor: "#fef2f2",
                }}
              >
                <p
                  style={{
                    margin: "0 0 12px",
                    color: "#7f1d1d",
                    fontWeight: "bold",
                  }}
                >
                  Delete this medication?
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => setIsConfirmingDeleteMedication(false)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #1a5334",
                      backgroundColor: "white",
                      color: "#1a5334",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={deleteSelectedMedication}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #b91c1c",
                      backgroundColor: "#b91c1c",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <nav
        aria-label="Main navigation"
        style={{
          position: "fixed",
          left: "16px",
          right: "16px",
          bottom: "16px",
          zIndex: 900,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          maxWidth: "620px",
          margin: "0 auto",
          padding: "8px",
          borderRadius: "28px",
          backgroundColor: "#1a5334",
          boxShadow: "0 14px 32px rgba(26, 83, 52, 0.28)",
        }}
      >
        {bottomNavItems.map((item) => {
          const isActive = activePage === item.page;

          return (
            <button
              key={item.page}
              onClick={() => {
                setActivePage(item.page);
                setSelectedMedicationId(null);
                setIsConfirmingDeleteMedication(false);
              }}
              style={{
                minWidth: 0,
                minHeight: "62px",
                border: "none",
                borderRadius: "22px",
                backgroundColor: isActive ? "white" : "transparent",
                color: isActive ? "#1a5334" : "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: "20px",
                  lineHeight: 1,
                  fontWeight: "bold",
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: isActive ? "bold" : "normal",
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
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

          transform: showAddForm ? "translateY(0)" : "translateY(-100%)",
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
            <h2 style={{ margin: 0, textAlign: "center" }}>Add medication</h2>

            <button
              onClick={() => {
                setShowAddForm(false);
                resetAddMedicationForm();
              }}
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
              ×
            </button>
          </div>

          <div
            style={{
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "800%",
                transform: `translateX(-${addMedicationStep * 12.5}%)`,
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
                  onClick={() => setAddMedicationStep(1)}
                  style={{
                    width: "100%",
                    minHeight: "140px",
                    padding: "24px",
                    borderRadius: "8px",
                    border: "2px solid white",
                    backgroundColor: "#1a5334",
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  Start adding medication
                </button>
              </div>

              <div
                style={{
                  width: "12.5%",
                  flexShrink: 0,
                  paddingLeft: "12px",
                  boxSizing: "border-box",
                }}
              >
                <label
                  htmlFor="medication-name"
                  style={{
                    display: "block",
                    marginBottom: "16px",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  What is the name of your medication?
                </label>

                <input
                  id="medication-name"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="Example: Metformin"
                  style={{
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
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => setAddMedicationStep(0)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "#1a5334",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setAddMedicationStep(2)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "white",
                      color: "#1a5334",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: "12.5%",
                  flexShrink: 0,
                  paddingLeft: "12px",
                  boxSizing: "border-box",
                }}
              >
                <label
                  htmlFor="medication-form"
                  style={{
                    display: "block",
                    marginBottom: "16px",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  What form is your medication?
                </label>

                <select
                  id="medication-form"
                  value={medicationForm}
                  onChange={(e) => setMedicationForm(e.target.value)}
                  style={{
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
                  }}
                >
                  <option value="">Select medication form</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Liquid">Liquid</option>
                  <option value="Injection">Injection</option>
                  <option value="Cream">Cream</option>
                  <option value="Ointment">Ointment</option>
                  <option value="Patch">Patch</option>
                  <option value="Drops">Drops</option>
                  <option value="Spray">Spray</option>
                  <option value="Inhaler">Inhaler</option>
                  <option value="Other">Other</option>
                </select>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => setAddMedicationStep(1)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "#1a5334",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setAddMedicationStep(3)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "white",
                      color: "#1a5334",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: "12.5%",
                  flexShrink: 0,
                  paddingLeft: "12px",
                  boxSizing: "border-box",
                }}
              >
                <label
                  htmlFor="medication-strength"
                  style={{
                    display: "block",
                    marginBottom: "16px",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  What is your medication strength or dosage?
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  <input
                    id="medication-strength"
                    type="text"
                    inputMode="decimal"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    placeholder="Example: 2.5"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      boxSizing: "border-box",
                      backgroundColor: "#1a5334",
                      color: "white",
                      fontSize: "16px",
                    }}
                  />

                  <select
                    value={strengthUnit}
                    onChange={(e) => setStrengthUnit(e.target.value)}
                    style={{
                      width: "130px",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      boxSizing: "border-box",
                      backgroundColor: "#1a5334",
                      color: "white",
                      fontSize: "16px",
                    }}
                  >
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="μg">μg</option>
                    <option value="mL">mL</option>
                    <option value="mg/mL">mg/mL</option>
                    <option value="μg/mL">μg/mL</option>
                    <option value="L">L</option>
                    <option value="uL">uL</option>
                    <option value="%">%</option>
                    <option value="IE">IE</option>
                    <option value="units">units</option>
                    <option value="puffs">puffs</option>
                    <option value="drops">drops</option>
                    <option value="other">other</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => setAddMedicationStep(2)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "#1a5334",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setAddMedicationStep(4)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "white",
                      color: "#1a5334",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: "12.5%",
                  flexShrink: 0,
                  paddingLeft: "12px",
                  boxSizing: "border-box",
                }}
              >
                <p
                  style={{
                    marginTop: 0,
                    marginBottom: "16px",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  How often do you take your medication?
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {[
                    "Every day",
                    "A few days a week",
                    "Once a week",
                    "Every 2 weeks",
                    "Once a month",
                    "Only when needed",
                    "Other schedule",
                  ].map((frequency) => (
                    <button
                      key={frequency}
                      onClick={() => setMedicationFrequency(frequency)}
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "8px",
                        border: "2px solid white",
                        backgroundColor:
                          medicationFrequency === frequency ? "white" : "#1a5334",
                        color:
                          medicationFrequency === frequency ? "#1a5334" : "white",
                        fontSize: "16px",
                        fontWeight:
                          medicationFrequency === frequency ? "bold" : "normal",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {frequency}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => setAddMedicationStep(3)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "#1a5334",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setAddMedicationStep(5)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "white",
                      color: "#1a5334",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: "12.5%",
                  flexShrink: 0,
                  paddingLeft: "12px",
                  boxSizing: "border-box",
                }}
              >
                <p
                  style={{
                    marginTop: 0,
                    marginBottom: "16px",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
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
                    placeholder="Example: 2"
                    style={{
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
                    }}
                  />
                )}

                {medicationFrequency === "A few days a week" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "12px",
                      marginBottom: "24px",
                    }}
                  >
                    {weekDays.map((day) => (
                      <button
                        key={day}
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
                  <select
                    value={weeklyDay}
                    onChange={(e) => setWeeklyDay(e.target.value)}
                    style={{
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
                    }}
                  >
                    <option value="">Select day</option>
                    {weekDays.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                )}

                {(medicationFrequency === "Every 2 weeks" ||
                  medicationFrequency === "Once a month") && (
                  <input
                    type="date"
                    value={nextDoseDate}
                    onChange={(e) => setNextDoseDate(e.target.value)}
                    style={{
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
                    }}
                  />
                )}

                {medicationFrequency === "Only when needed" && (
                  <textarea
                    value={asNeededNote}
                    onChange={(e) => setAsNeededNote(e.target.value)}
                    placeholder="Example: When I have pain"
                    rows={4}
                    style={{
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
                      resize: "vertical",
                    }}
                  />
                )}

                {medicationFrequency === "Other schedule" && (
                  <textarea
                    value={otherSchedule}
                    onChange={(e) => setOtherSchedule(e.target.value)}
                    placeholder="Example: Every other day"
                    rows={4}
                    style={{
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
                      resize: "vertical",
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => setAddMedicationStep(4)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "#1a5334",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setAddMedicationStep(6)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "white",
                      color: "#1a5334",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: "12.5%",
                  flexShrink: 0,
                  paddingLeft: "12px",
                  boxSizing: "border-box",
                }}
              >
                <label
                  htmlFor="medication-indication"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  Why are you taking this medication?
                </label>

                <p
                  style={{
                    marginTop: 0,
                    marginBottom: "16px",
                    fontSize: "15px",
                  }}
                >
                  Optional
                </p>

                <textarea
                  id="medication-indication"
                  value={indication}
                  onChange={(e) => setIndication(e.target.value)}
                  placeholder="Example: Blood pressure, pain, allergy"
                  rows={4}
                  style={{
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
                    resize: "vertical",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => setAddMedicationStep(5)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "#1a5334",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setAddMedicationStep(7)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "white",
                      color: "#1a5334",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: "12.5%",
                  flexShrink: 0,
                  paddingLeft: "12px",
                  boxSizing: "border-box",
                }}
              >
                <p
                  style={{
                    marginTop: 0,
                    marginBottom: "16px",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  Review your medication
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {[
                    ["Name", medicationName || "Not added"],
                    ["Form", medicationForm || "Not selected"],
                    ["Strength", strength ? `${strength} ${strengthUnit}` : "Not added"],
                    ["Schedule", getScheduleSummary()],
                    ["Reason", indication || "Not added"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        border: "2px solid white",
                        borderRadius: "8px",
                        padding: "12px",
                      }}
                    >
                      <p style={{ margin: "0 0 4px", fontSize: "14px", opacity: 0.85 }}>
                        {label}
                      </p>
                      <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => setAddMedicationStep(6)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "#1a5334",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>

                  <button
                    onClick={handleSaveMedication}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid white",
                      backgroundColor: "white",
                      color: "#1a5334",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
