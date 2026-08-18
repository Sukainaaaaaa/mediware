import { apiRequest } from "./client";

export type CreateDoseLogRequest = {
  medicationId: number;
  doseDate: string;
  doseIndex: number;
};

export type DoseLogResponse = {
  id: number;
  medicationId: number;
  doseDate: string;
  doseIndex: number;
  markedAt: string;
  status: "PENDING" | "TAKEN" | "MISSED";
};

export const getDoseLogs = () => {
  return apiRequest<DoseLogResponse[]>("/api/dose-logs/");
};

export const logDoseTaken = (doseLog: CreateDoseLogRequest) => {
  return apiRequest<DoseLogResponse>("/api/dose-logs/", {
    method: "POST",
    body: doseLog,
  });
};

export const deleteDoseLog = (doseLog: CreateDoseLogRequest) => {
  return apiRequest<void>(
    `/api/dose-logs/medications/${doseLog.medicationId}/dates/${doseLog.doseDate}/doses/${doseLog.doseIndex}`,
    {
      method: "DELETE",
    }
  );
};

export const mapDoseLogResponseToDoseId = (doseLog: DoseLogResponse) => {
  return `${doseLog.medicationId}-${doseLog.doseDate}-${doseLog.doseIndex}`;
};
