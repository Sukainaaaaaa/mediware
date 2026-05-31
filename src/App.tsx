import { useState } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import EmptyPage from "./components/EmptyPage";
import MedicationsPage from "./components/MedicationsPage";
import MedicationDetailsOverlay from "./components/MedicationDetailsOverlay";
import TrackerPage from "./components/TrackerPage";
import MedicationWizard from "./components/MedicationWizard";
import type { Medication, Page } from "./types";
import { getScheduledDosesForDate, } from "./utils/medicationSchedule";

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
  const [editingMedicationId, setEditingMedicationId] = useState<number | null>(null);

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const selectedMedication = medications.find(
    (medication) => medication.id === selectedMedicationId
  );

  const resetAddMedicationForm = () => {
    setAddMedicationStep(0);
    setEditingMedicationId(null);
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

  const populateMedicationForm = (medication: Medication) => {
    setMedicationName(medication.medicationName);
    setMedicationForm(medication.medicationForm);
    setStrength(medication.strength);
    setStrengthUnit(medication.strengthUnit);
    setMedicationFrequency(medication.medicationFrequency);
    setTimesPerDay(medication.timesPerDay);
    setSelectedWeekDays(medication.selectedWeekDays);
    setWeeklyDay(medication.weeklyDay);
    setNextDoseDate(medication.nextDoseDate);
    setAsNeededNote(medication.asNeededNote);
    setOtherSchedule(medication.otherSchedule);
    setIndication(medication.indication);
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

  const handleSaveMedication = () => {
    const medicationId = editingMedicationId ?? Date.now();
    const medicationToSave: Medication = {
      id: medicationId,
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

    if (editingMedicationId === null) {
      setMedications([...medications, medicationToSave]);
    } else {
      const medicationDoseIdPrefix = `${editingMedicationId}-`;

      setMedications((currentMedications) =>
        currentMedications.map((medication) =>
          medication.id === editingMedicationId ? medicationToSave : medication
        )
      );
      setTakenDoseIds((currentIds) =>
        currentIds.filter((doseId) => !doseId.startsWith(medicationDoseIdPrefix))
      );
      setCompletingDoseIds((currentIds) =>
        currentIds.filter((doseId) => !doseId.startsWith(medicationDoseIdPrefix))
      );
    }

    setShowAddForm(false);
    setSelectedMedicationId(null);
    setIsConfirmingDeleteMedication(false);
    resetAddMedicationForm();
  };

  const scheduledDoses = getScheduledDosesForDate(selectedDate, medications);

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

  const startEditingMedication = (medication: Medication) => {
    populateMedicationForm(medication);
    setEditingMedicationId(medication.id);
    setAddMedicationStep(1);
    setShowAddForm(true);
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

          .start-medication-button {
            transition:
              background-color 0.2s ease,
              box-shadow 0.2s ease;
          }

          .start-medication-button:hover {
            background-color: #236b43 !important;
            box-shadow: inset 0 0 18px rgba(255, 255, 255, 0.22);
          }

          .wizard-option-button {
            transition:
              background-color 0.2s ease,
              box-shadow 0.2s ease;
          }

          .wizard-option-button:hover {
            background-color: #236b43 !important;
            box-shadow: inset 0 0 18px rgba(255, 255, 255, 0.22);
          }
        `}
      </style>
      {/* Top bar */}
      <Header
        onAddMedication={() => {
          resetAddMedicationForm();
          setShowAddForm(true);
        }}
      />

      {activePage === "tracker" && (
        <TrackerPage
          dateLabel={getDateLabel(selectedDate)}
          dosesToTake={dosesToTake}
          dosesTaken={dosesTaken}
          completingDoseIds={completingDoseIds}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
          onMarkDoseAsTaken={markDoseAsTaken}
          onUndoTakenDose={undoTakenDose}
        />
      )}

      {activePage === "adherence" && <EmptyPage title="Adherence" />}
      {activePage === "sideEffects" && <EmptyPage title="Side effects" />}

      {activePage === "medications" && (
        <MedicationsPage
          medications={medications}
          onSelectMedication={setSelectedMedicationId}
        />
      )}

      <MedicationDetailsOverlay
        medication={selectedMedication}
        isOpen={activePage === "medications" && Boolean(selectedMedication)}
        isConfirmingDelete={isConfirmingDeleteMedication}
        onClose={() => {
          setSelectedMedicationId(null);
          setIsConfirmingDeleteMedication(false);
        }}
        onEditMedication={startEditingMedication}
        onStartDelete={() => setIsConfirmingDeleteMedication(true)}
        onCancelDelete={() => setIsConfirmingDeleteMedication(false)}
        onDeleteMedication={deleteSelectedMedication}
      />

      <BottomNav
        activePage={activePage}
        onChangePage={(page) => {
          setActivePage(page);
          setSelectedMedicationId(null);
          setIsConfirmingDeleteMedication(false);
        }}
      />
      <MedicationWizard
        isOpen={showAddForm}
        step={addMedicationStep}
        editingMedicationId={editingMedicationId}
        medicationName={medicationName}
        medicationForm={medicationForm}
        strength={strength}
        strengthUnit={strengthUnit}
        medicationFrequency={medicationFrequency}
        timesPerDay={timesPerDay}
        selectedWeekDays={selectedWeekDays}
        weeklyDay={weeklyDay}
        nextDoseDate={nextDoseDate}
        asNeededNote={asNeededNote}
        otherSchedule={otherSchedule}
        indication={indication}
        weekDays={weekDays}
        scheduleSummary={getScheduleSummary()}
        onClose={() => {
          setShowAddForm(false);
          resetAddMedicationForm();
        }}
        onSave={handleSaveMedication}
        setStep={setAddMedicationStep}
        setMedicationName={setMedicationName}
        setMedicationForm={setMedicationForm}
        setStrength={setStrength}
        setStrengthUnit={setStrengthUnit}
        setMedicationFrequency={setMedicationFrequency}
        setTimesPerDay={setTimesPerDay}
        setWeeklyDay={setWeeklyDay}
        setNextDoseDate={setNextDoseDate}
        setAsNeededNote={setAsNeededNote}
        setOtherSchedule={setOtherSchedule}
        setIndication={setIndication}
        toggleSelectedWeekDay={toggleSelectedWeekDay}
      />
    </main>
  );
}

export default App;
