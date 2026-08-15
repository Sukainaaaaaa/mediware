import type { Medication, SideEffectLog } from "../types";

export {
  loadAuthSession,
  loadMedications,
  saveMedications,
  saveAuthSession,
  clearAuthSession,
  loadTakenDoseIds,
  saveTakenDoseIds,
  loadSideEffectLogs,
  saveSideEffectLogs,
};

export type AuthSession = {
  token: string;
  name: string;
  email: string;
  userId: number;
};

const authSessionKey = "mediware-auth-session";
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

const loadAuthSession = () => {
  try {
    const storedValue = window.localStorage.getItem(authSessionKey);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue) as Partial<AuthSession>;

    if (
      typeof parsedValue.token !== "string" ||
      typeof parsedValue.name !== "string" ||
      typeof parsedValue.email !== "string" ||
      typeof parsedValue.userId !== "number"
    ) {
      return null;
    }

    return parsedValue as AuthSession;
  } catch {
    return null;
  }
};

const saveAuthSession = (authSession: AuthSession) => {
  window.localStorage.setItem(authSessionKey, JSON.stringify(authSession));
};

const clearAuthSession = () => {
  window.localStorage.removeItem(authSessionKey);
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
