import { useState } from "react";
import type { ScheduledDoseWithStatus } from "../types";

type TrackerPageProps = {
  dateLabel: string;
  scheduledDoses: ScheduledDoseWithStatus[];
  completingDoseIds: string[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  onMarkDoseAsTaken: (doseId: string) => void;
  onUndoTakenDose: (doseId: string) => void;
};

type MedicationDoseGroup = {
  medicationId: number;
  medicationName: string;
  strengthLabel: string;
  doses: ScheduledDoseWithStatus[];
  pendingCount: number;
  takenCount: number;
  totalCount: number;
};

const groupDosesByMedication = (doses: ScheduledDoseWithStatus[]) => {
  const groups = new Map<number, MedicationDoseGroup>();

  doses
    .filter((dose) => dose.status !== "missed")
    .forEach((dose) => {
      const medication = dose.medication;
      const strengthLabel = medication.strength
        ? `${medication.strength} ${medication.strengthUnit}`
        : "";
      const existingGroup = groups.get(medication.id);

      if (!existingGroup) {
        groups.set(medication.id, {
          medicationId: medication.id,
          medicationName: medication.medicationName,
          strengthLabel,
          doses: [dose],
          pendingCount: dose.status === "pending" ? 1 : 0,
          takenCount: dose.status === "taken" ? 1 : 0,
          totalCount: 1,
        });

        return;
      }

      existingGroup.doses.push(dose);
      existingGroup.pendingCount += dose.status === "pending" ? 1 : 0;
      existingGroup.takenCount += dose.status === "taken" ? 1 : 0;
      existingGroup.totalCount += 1;
    });

  return Array.from(groups.values());
};

const EmptyTrackerBox = () => (
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
);

const DrawnX = ({ size = 14, color = "#1a5334" }) => (
  <>
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        width: `${size}px`,
        height: "2px",
        borderRadius: "999px",
        backgroundColor: color,
        transform: "rotate(45deg)",
      }}
    />
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        width: `${size}px`,
        height: "2px",
        borderRadius: "999px",
        backgroundColor: color,
        transform: "rotate(-45deg)",
      }}
    />
  </>
);

const DrawnCheck = () => (
  <span
    aria-hidden="true"
    style={{
      width: "16px",
      height: "9px",
      borderLeft: "3px solid white",
      borderBottom: "3px solid white",
      transform: "rotate(-45deg) translate(1px, -1px)",
      boxSizing: "border-box",
    }}
  />
);

const DrawnPlus = () => (
  <>
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        width: "16px",
        height: "2px",
        borderRadius: "999px",
        backgroundColor: "white",
      }}
    />
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        width: "2px",
        height: "16px",
        borderRadius: "999px",
        backgroundColor: "white",
      }}
    />
  </>
);

function TrackerPage({
  dateLabel,
  scheduledDoses,
  completingDoseIds,
  onPreviousDay,
  onNextDay,
  onMarkDoseAsTaken,
  onUndoTakenDose,
}: TrackerPageProps) {
  const [selectedMedicationId, setSelectedMedicationId] = useState<number | null>(
    null
  );
  const doseGroups = groupDosesByMedication(scheduledDoses);
  const groupsToTake = doseGroups.filter((group) => group.pendingCount > 0);
  const groupsTaken = doseGroups.filter(
    (group) => group.totalCount > 0 && group.takenCount === group.totalCount
  );
  const selectedGroup =
    doseGroups.find((group) => group.medicationId === selectedMedicationId) ??
    null;

  return (
    <section style={{ padding: "24px", color: "#1a5334" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            color: "#1a5334",
            fontSize: "28px",
            cursor: "pointer",
          }}
          onClick={onPreviousDay}
        >
          {"<"}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "22px",
              height: "22px",
              border: "2px solid #1a5334",
              borderRadius: "5px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
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
                borderTop: "2px solid #1a5334",
              }}
            />
          </span>
          <span>{dateLabel}</span>
        </div>

        <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            color: "#1a5334",
            fontSize: "28px",
            cursor: "pointer",
          }}
          onClick={onNextDay}
        >
          {">"}
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
            fontSize: "14px",
            color: "#1a5334",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          MEDICATION TO TAKE
        </h2>

        {groupsToTake.length === 0 && <EmptyTrackerBox />}

        {groupsToTake.map((group) => (
          <button
            key={group.medicationId}
            onClick={() => setSelectedMedicationId(group.medicationId)}
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
              color: "#1a5334",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                {group.medicationName}
              </p>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
                {group.takenCount}/{group.totalCount} doses taken today
              </p>
              {group.strengthLabel && (
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
                  {group.strengthLabel}
                </p>
              )}
            </div>

            <span
              aria-hidden="true"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "2px solid #1a5334",
                backgroundColor: "#1a5334",
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <DrawnPlus />
            </span>
          </button>
        ))}

        <section style={{ marginTop: "32px" }}>
          <h2
            style={{
              margin: "0 0 14px",
              fontSize: "14px",
              color: "#1a5334",
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            MEDICATION TAKEN
          </h2>

          {groupsTaken.length === 0 ? (
            <EmptyTrackerBox />
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {groupsTaken.map((group) => (
                <button
                  key={group.medicationId}
                  onClick={() => setSelectedMedicationId(group.medicationId)}
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
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {group.medicationName}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: "14px" }}>
                      {group.takenCount}/{group.totalCount} doses taken today
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      border: "1px solid #1a5334",
                      backgroundColor: "transparent",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <DrawnX />
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedGroup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedGroup.medicationName} doses`}
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
              backgroundColor: "white",
              color: "#1a5334",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "20px" }}>
                  {selectedGroup.medicationName}
                </h3>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
                  {selectedGroup.takenCount}/{selectedGroup.totalCount} doses taken today
                </p>
              </div>

              <button
                aria-label="Close dose options"
                onClick={() => setSelectedMedicationId(null)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid #d8e5dc",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <DrawnX />
              </button>
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              {selectedGroup.doses.map((dose) => {
                const isTaken = dose.status === "taken";
                const isCompleting = completingDoseIds.includes(dose.id);

                return (
                  <div
                    key={dose.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "14px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #d8e5dc",
                      backgroundColor: isTaken ? "#eef7f1" : "white",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {dose.doseLabel}
                      </p>
                      <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
                        {isTaken ? "Taken" : "Not taken yet"}
                      </p>
                    </div>

                    {isTaken ? (
                      <button
                        aria-label={`Move ${dose.doseLabel} back to medication to take`}
                        onClick={() => onUndoTakenDose(dose.id)}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          border: "1px solid #1a5334",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          position: "relative",
                        }}
                      >
                        <DrawnX />
                      </button>
                    ) : (
                      <button
                        aria-label={`Mark ${dose.doseLabel} as taken`}
                        onClick={() => onMarkDoseAsTaken(dose.id)}
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          border: "2px solid #1a5334",
                          backgroundColor: "#1a5334",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          animation: isCompleting
                            ? "medicationCompleteSpin 0.65s ease forwards"
                            : "none",
                        }}
                      >
                        <DrawnCheck />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TrackerPage;
