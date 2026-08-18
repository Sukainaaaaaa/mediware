import { useEffect, useState } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import AdherencePage from "./components/AdherencePage";
import AuthPage from "./components/AuthPage";
import MedicationsPage from "./components/MedicationsPage";
import MedicationDetailsOverlay from "./components/MedicationDetailsOverlay";
import SideEffectsPage from "./components/SideEffectsPage";
import TrackerPage from "./components/TrackerPage";
import MedicationWizard from "./components/MedicationWizard";
import { ApiError } from "./api/client";
import {
  createMedication,
  deleteMedication,
  getMedications,
  mapMedicationToCreateRequest,
  mapMedicationResponseToMedication,
  updateMedication,
} from "./api/medications";
import {
  deleteDoseLog,
  getDoseLogs,
  logDoseTaken,
  mapDoseLogResponseToDoseId,
} from "./api/doseLogs";
import type {
  Medication,
  Page,
  ScheduledDoseWithStatus,
  SideEffectLog,
} from "./types";
import { getScheduledDosesWithStatusForDate } from "./utils/medicationSchedule";
import {
  loadMedications,
  loadAuthSession,
  loadSideEffectLogs,
  loadTakenDoseIds,
  clearAuthSession,
  saveAuthSession,
  saveMedications,
  saveSideEffectLogs,
  saveTakenDoseIds,
} from "./utils/localStorage";

function App() {
  const [authSession, setAuthSession] = useState(loadAuthSession);

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

  const getDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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
  const [dailySchedule, setDailySchedule] = useState("");
  const [dailyScheduleDetail, setDailyScheduleDetail] = useState("");
  const [timesPerDay, setTimesPerDay] = useState("");
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]);
  const [weeklyDay, setWeeklyDay] = useState("");
  const [nextDoseDate, setNextDoseDate] = useState("");
  const [fewMonthsInterval, setFewMonthsInterval] = useState("");
  const [asNeededNote, setAsNeededNote] = useState("");
  const [otherSchedule, setOtherSchedule] = useState("");
  const [indication, setIndication] = useState("");
  const [medications, setMedications] = useState<Medication[]>(loadMedications);
  const [medicationsLoadError, setMedicationsLoadError] = useState("");
  const [medicationSaveError, setMedicationSaveError] = useState("");
  const [takenDoseIds, setTakenDoseIds] = useState<string[]>(loadTakenDoseIds);
  const [sideEffectLogs, setSideEffectLogs] =
    useState<SideEffectLog[]>(loadSideEffectLogs);
  const [completingDoseIds, setCompletingDoseIds] = useState<string[]>([]);
  const [selectedMedicationId, setSelectedMedicationId] = useState<number | null>(null);
  const [isConfirmingDeleteMedication, setIsConfirmingDeleteMedication] = useState(false);
  const [editingMedicationId, setEditingMedicationId] = useState<number | null>(null);

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const selectedMedication = medications.find(
    (medication) => medication.id === selectedMedicationId
  );

  useEffect(() => {
    saveMedications(medications);
  }, [medications]);

  useEffect(() => {
    if (!authSession) {
      return;
    }

    let shouldUseResponse = true;

    setMedicationsLoadError("");

    getMedications()
      .then((backendMedications) => {
        if (!shouldUseResponse) {
          return;
        }

        setMedications(
          backendMedications.map(mapMedicationResponseToMedication)
        );
      })
      .catch((error) => {
        if (!shouldUseResponse) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          clearAuthSession();
          setAuthSession(null);
          return;
        }

        setMedicationsLoadError("Could not load medications from the backend.");
      });

    getDoseLogs()
      .then((backendDoseLogs) => {
        if (!shouldUseResponse) {
          return;
        }

        setTakenDoseIds(
          backendDoseLogs
            .filter((doseLog) => doseLog.status === "TAKEN")
            .map(mapDoseLogResponseToDoseId)
        );
      })
      .catch((error) => {
        if (!shouldUseResponse) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          clearAuthSession();
          setAuthSession(null);
          return;
        }

        setMedicationsLoadError("Could not load dose history from the backend.");
      });

    return () => {
      shouldUseResponse = false;
    };
  }, [authSession]);

  useEffect(() => {
    saveTakenDoseIds(takenDoseIds);
  }, [takenDoseIds]);

  useEffect(() => {
    saveSideEffectLogs(sideEffectLogs);
  }, [sideEffectLogs]);

  const resetAddMedicationForm = () => {
    setAddMedicationStep(0);
    setEditingMedicationId(null);
    setMedicationName("");
    setMedicationForm("");
    setStrength("");
    setStrengthUnit("mg");
    setMedicationFrequency("");
    setDailySchedule("");
    setDailyScheduleDetail("");
    setTimesPerDay("");
    setSelectedWeekDays([]);
    setWeeklyDay("");
    setNextDoseDate("");
    setFewMonthsInterval("");
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
    setDailySchedule(medication.dailySchedule);
    setDailyScheduleDetail(medication.dailyScheduleDetail);
    setTimesPerDay(medication.timesPerDay);
    setSelectedWeekDays(medication.selectedWeekDays);
    setWeeklyDay(medication.weeklyDay);
    setNextDoseDate(medication.nextDoseDate);
    setFewMonthsInterval(medication.fewMonthsInterval);
    setAsNeededNote(medication.asNeededNote);
    setOtherSchedule(medication.otherSchedule);
    setIndication(medication.indication);
  };

  const getScheduleSummary = () => {
    if (medicationFrequency === "Every day") {
      if (dailySchedule === "Times per day") {
        return timesPerDay ? `Every day, ${timesPerDay} dose(s) per day` : "Every day";
      }

      if (dailySchedule === "Every number of hours") {
        return dailyScheduleDetail ? `Every ${dailyScheduleDetail} hours` : "A dose every few hours";
      }

      return dailySchedule ? `Every day, ${dailySchedule}` : "Every day";
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

    if (medicationFrequency === "Every few months") {
      if (fewMonthsInterval && nextDoseDate) {
        return `${fewMonthsInterval}, next dose ${nextDoseDate}`;
      }

      return fewMonthsInterval || "Every few months";
    }

    if (medicationFrequency === "Only when needed") {
      return asNeededNote ? `Only when needed: ${asNeededNote}` : "Only when needed";
    }

    if (medicationFrequency === "Other schedule") {
      return otherSchedule || "Other schedule";
    }

    return "Not selected";
  };

  const handleSaveMedication = async () => {
    const medicationId = editingMedicationId ?? Date.now();
    const existingMedication = medications.find(
      (medication) => medication.id === editingMedicationId
    );
    const medicationToSave: Medication = {
      id: medicationId,
      startDate: existingMedication?.startDate ?? getDateInputValue(new Date()),
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
    };

    setMedicationSaveError("");

    if (editingMedicationId === null) {
      try {
        const savedMedication = await createMedication(
          mapMedicationToCreateRequest(medicationToSave)
        );

        setMedications((currentMedications) => [
          ...currentMedications,
          mapMedicationResponseToMedication(savedMedication),
        ]);
      } catch {
        setMedicationSaveError("Could not save medication to the backend.");
        return;
      }
    } else {
      const medicationDoseIdPrefix = `${editingMedicationId}-`;

      try {
        const savedMedication = await updateMedication(
          editingMedicationId,
          mapMedicationToCreateRequest(medicationToSave)
        );

        setMedications((currentMedications) =>
          currentMedications.map((medication) =>
            medication.id === editingMedicationId
              ? mapMedicationResponseToMedication(savedMedication)
              : medication
          )
        );
      } catch {
        setMedicationSaveError("Could not update medication in the backend.");
        return;
      }

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

  const scheduledDoses = getScheduledDosesWithStatusForDate(
    selectedDate,
    medications,
    takenDoseIds
  );

  const markDoseAsTaken = async (dose: ScheduledDoseWithStatus) => {
    setCompletingDoseIds((currentIds) =>
      currentIds.includes(dose.id) ? currentIds : [...currentIds, dose.id]
    );

    try {
      await logDoseTaken({
        medicationId: dose.medication.id,
        doseDate: dose.doseDate,
        doseIndex: dose.doseIndex,
      });
    } catch {
      setCompletingDoseIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== dose.id)
      );
      setMedicationsLoadError("Could not save dose as taken to the backend.");
      return;
    }

    window.setTimeout(() => {
      setCompletingDoseIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== dose.id)
      );
      setTakenDoseIds((currentIds) =>
        currentIds.includes(dose.id) ? currentIds : [...currentIds, dose.id]
      );
    }, 650);
  };

  const undoTakenDose = async (dose: ScheduledDoseWithStatus) => {
    try {
      await deleteDoseLog({
        medicationId: dose.medication.id,
        doseDate: dose.doseDate,
        doseIndex: dose.doseIndex,
      });
    } catch {
      setMedicationsLoadError("Could not move dose back to medication to take.");
      return;
    }

    setTakenDoseIds((currentIds) =>
      currentIds.filter((currentId) => currentId !== dose.id)
    );
  };

  const deleteSelectedMedication = async () => {
    if (selectedMedicationId === null) {
      return;
    }

    const medicationDoseIdPrefix = `${selectedMedicationId}-`;

    try {
      await deleteMedication(selectedMedicationId);
    } catch {
      setMedicationsLoadError("Could not delete medication from the backend.");
      return;
    }

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
    setAddMedicationStep(0);
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

  if (!authSession) {
    return (
      <AuthPage
        onAuthenticated={(newAuthSession) => {
          saveAuthSession(newAuthSession);
          setAuthSession(newAuthSession);
        }}
      />
    );
  }

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

          .round-icon-button {
            -webkit-tap-highlight-color: transparent;
            outline: none;
            transition:
              background-color 0.16s ease,
              box-shadow 0.16s ease,
              transform 0.16s ease;
          }

          .round-icon-button:active {
            background-color: rgba(26, 83, 52, 0.1) !important;
            transform: scale(0.96);
          }

          .round-icon-button:focus-visible {
            box-shadow: 0 0 0 3px rgba(26, 83, 52, 0.18);
          }

          button {
            -webkit-tap-highlight-color: transparent;
            appearance: none;
            outline: none;
            touch-action: manipulation;
            user-select: none;
          }

          button::-moz-focus-inner {
            border: 0;
          }

          button:active {
            filter: brightness(0.96);
          }

          button:focus-visible {
            box-shadow: 0 0 0 3px rgba(26, 83, 52, 0.18);
          }
        `}
      </style>
      {/* Top bar */}
      <Header
        onAddMedication={() => {
          resetAddMedicationForm();
          setShowAddForm(true);
        }}
        onLogout={() => {
          clearAuthSession();
          setAuthSession(null);
        }}
        userName={authSession.name}
        userEmail={authSession.email}
      />

      {medicationsLoadError && (
        <div
          style={{
            margin: "16px auto 0",
            width: "min(560px, calc(100% - 32px))",
            border: "1px solid rgba(26, 83, 52, 0.22)",
            borderRadius: "14px",
            backgroundColor: "white",
            color: "#1a5334",
            padding: "12px 14px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          {medicationsLoadError}
        </div>
      )}

      {activePage === "tracker" && (
        <TrackerPage
          dateLabel={getDateLabel(selectedDate)}
          selectedDate={selectedDate}
          scheduledDoses={scheduledDoses}
          completingDoseIds={completingDoseIds}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
          onMarkDoseAsTaken={markDoseAsTaken}
          onUndoTakenDose={undoTakenDose}
        />
      )}

      {activePage === "adherence" && (
        <AdherencePage
          medications={medications}
          takenDoseIds={takenDoseIds}
        />
      )}
      {activePage === "sideEffects" && (
        <SideEffectsPage
          medications={medications}
          sideEffectLogs={sideEffectLogs}
          onAddSideEffectLog={(sideEffectLog) =>
            setSideEffectLogs((currentLogs) => [...currentLogs, sideEffectLog])
          }
          onDeleteSideEffectLog={(sideEffectLogId) =>
            setSideEffectLogs((currentLogs) =>
              currentLogs.filter((log) => log.id !== sideEffectLogId)
            )
          }
        />
      )}

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
        dailySchedule={dailySchedule}
        dailyScheduleDetail={dailyScheduleDetail}
        timesPerDay={timesPerDay}
        selectedWeekDays={selectedWeekDays}
        weeklyDay={weeklyDay}
        nextDoseDate={nextDoseDate}
        fewMonthsInterval={fewMonthsInterval}
        asNeededNote={asNeededNote}
        otherSchedule={otherSchedule}
        indication={indication}
        weekDays={weekDays}
        scheduleSummary={getScheduleSummary()}
        saveError={medicationSaveError}
        onClose={() => {
          setShowAddForm(false);
          setMedicationSaveError("");
          resetAddMedicationForm();
        }}
        onSave={handleSaveMedication}
        setStep={setAddMedicationStep}
        setMedicationName={setMedicationName}
        setMedicationForm={setMedicationForm}
        setStrength={setStrength}
        setStrengthUnit={setStrengthUnit}
        setMedicationFrequency={setMedicationFrequency}
        setDailySchedule={setDailySchedule}
        setDailyScheduleDetail={setDailyScheduleDetail}
        setTimesPerDay={setTimesPerDay}
        setWeeklyDay={setWeeklyDay}
        setNextDoseDate={setNextDoseDate}
        setFewMonthsInterval={setFewMonthsInterval}
        setAsNeededNote={setAsNeededNote}
        setOtherSchedule={setOtherSchedule}
        setIndication={setIndication}
        toggleSelectedWeekDay={toggleSelectedWeekDay}
      />
    </main>
  );
}

export default App;
