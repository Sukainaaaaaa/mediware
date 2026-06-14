import { useState } from "react";
import type { ScheduledDoseWithStatus } from "../types";
import { DrawnCheck, DrawnChevron, DrawnPlus, DrawnX } from "./DrawnIcons";
import { IconButton } from "./IconButton";

type TrackerPageProps = {
  dateLabel: string;
  selectedDate: Date;
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
  missedCount: number;
  takenCount: number;
  totalCount: number;
};

const groupDosesByMedication = (doses: ScheduledDoseWithStatus[]) => {
  const groups = new Map<number, MedicationDoseGroup>();

  doses.forEach((dose) => {
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
          missedCount: dose.status === "missed" ? 1 : 0,
          takenCount: dose.status === "taken" ? 1 : 0,
          totalCount: 1,
        });

        return;
      }

      existingGroup.doses.push(dose);
      existingGroup.pendingCount += dose.status === "pending" ? 1 : 0;
      existingGroup.missedCount += dose.status === "missed" ? 1 : 0;
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

function TrackerPage({
  dateLabel,
  selectedDate,
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
  const groupsToTake = doseGroups.filter(
    (group) => group.pendingCount > 0 || group.missedCount > 0
  );
  const groupsTaken = doseGroups.filter(
    (group) => group.totalCount > 0 && group.takenCount === group.totalCount
  );
  const selectedGroup =
    doseGroups.find((group) => group.medicationId === selectedMedicationId) ??
    null;
  const isFutureDate = (() => {
    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    return selectedDateStart.getTime() > todayStart.getTime();
  })();

  return (
    <section style={{ padding: "24px", color: "#1a5334" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "42px minmax(0, 1fr) 42px",
          alignItems: "center",
          columnGap: "8px",
          marginBottom: "24px",
        }}
      >
        <button
          className="round-icon-button"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "1px solid transparent",
            backgroundColor: "rgba(255, 255, 255, 0.62)",
            color: "#1a5334",
            fontSize: "28px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            lineHeight: 1,
          }}
          onClick={onPreviousDay}
        >
          <DrawnChevron direction="left" />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
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
          className="round-icon-button"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "1px solid transparent",
            backgroundColor: "rgba(255, 255, 255, 0.62)",
            color: "#1a5334",
            fontSize: "28px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            lineHeight: 1,
          }}
          onClick={onNextDay}
        >
          <DrawnChevron direction="right" />
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
                {group.takenCount}/{group.totalCount} doses taken
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
                width: "36px",
                height: "36px",
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
              <DrawnPlus size={22} />
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
                    backgroundColor: "#1a5334",
                    color: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {group.medicationName}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: "14px", opacity: 0.85 }}>
                      {group.takenCount}/{group.totalCount} doses taken
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      border: "1px solid white",
                      backgroundColor: "transparent",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <DrawnX color="white" />
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
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>
                  {selectedGroup.medicationName}
                </h3>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
                  {selectedGroup.takenCount}/{selectedGroup.totalCount} doses taken
                </p>
              </div>

              <IconButton
                ariaLabel="Close dose options"
                onClick={() => setSelectedMedicationId(null)}
              >
                <DrawnX />
              </IconButton>
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
                      border: isTaken ? "1px solid #1a5334" : "1px solid #d8e5dc",
                      backgroundColor: isTaken ? "#1a5334" : "white",
                      color: isTaken ? "white" : "#1a5334",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {dose.doseLabel}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: isTaken ? "rgba(255, 255, 255, 0.82)" : "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        {isTaken ? "Taken" : isFutureDate ? "Scheduled" : "Not taken yet"}
                      </p>
                    </div>

                    {isTaken ? (
                      <IconButton
                        ariaLabel={`Move ${dose.doseLabel} back to medication to take`}
                        onClick={() => onUndoTakenDose(dose.id)}
                        size={38}
                        border="1px solid white"
                      >
                        <DrawnX color="white" />
                      </IconButton>
                    ) : (
                      <IconButton
                        ariaLabel={`Mark ${dose.doseLabel} as taken`}
                        onClick={() => onMarkDoseAsTaken(dose.id)}
                        disabled={isFutureDate}
                        size={42}
                        border="2px solid #1a5334"
                        backgroundColor="white"
                        style={{
                          animation: isCompleting
                            ? "medicationCompleteSpin 0.65s ease forwards"
                            : "none",
                        }}
                      >
                        <DrawnCheck color="#1a5334" />
                      </IconButton>
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
