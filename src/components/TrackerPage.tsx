import type { ScheduledDose } from "../types";

type TrackerPageProps = {
  dateLabel: string;
  dosesToTake: ScheduledDose[];
  dosesTaken: ScheduledDose[];
  completingDoseIds: string[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  onMarkDoseAsTaken: (doseId: string) => void;
  onUndoTakenDose: (doseId: string) => void;
};

function TrackerPage({
  dateLabel,
  dosesToTake,
  dosesTaken,
  completingDoseIds,
  onPreviousDay,
  onNextDay,
  onMarkDoseAsTaken,
  onUndoTakenDose,
}: TrackerPageProps) {
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
          ‹
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
            fontSize: "14px",
            color: "#1a5334",
            textAlign: "left",
            fontWeight: "bold",
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
              onClick={() => onMarkDoseAsTaken(dose.id)}
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
              fontSize: "14px",
              color: "#1a5334",
              textAlign: "left",
              fontWeight: "bold",
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
                    onClick={() => onUndoTakenDose(dose.id)}
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
  );
}

export default TrackerPage;
