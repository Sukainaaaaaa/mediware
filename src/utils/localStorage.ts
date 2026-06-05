import type { Medication, SideEffectLog } from "../types";

export {
  loadMedications,
  saveMedications,
  loadTakenDoseIds,
  saveTakenDoseIds,
  loadSideEffectLogs,
  saveSideEffectLogs,
};

const medicationsKey = "mediware-medications";
const takenDoseIdsKey = "mediware-taken-dose-ids";
const sideEffectLogsKey = "mediware-side-effect-logs";

const readStoredArray = <T,>(key: string): T[] => {
  try {
    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

const saveStoredArray = <T,>(key: string, value: T[]) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const loadMedications = () => {
  return readStoredArray<Medication>(medicationsKey);
};

const saveMedications = (medications: Medication[]) => {
  saveStoredArray(medicationsKey, medications);
};

const loadTakenDoseIds = () => {
  return readStoredArray<string>(takenDoseIdsKey);
};

const saveTakenDoseIds = (takenDoseIds: string[]) => {
  saveStoredArray(takenDoseIdsKey, takenDoseIds);
};

const loadSideEffectLogs = () => {
  return readStoredArray<SideEffectLog>(sideEffectLogsKey);
};

const saveSideEffectLogs = (sideEffectLogs: SideEffectLog[]) => {
  saveStoredArray(sideEffectLogsKey, sideEffectLogs);
};
