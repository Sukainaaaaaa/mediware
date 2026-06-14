import type { Medication } from "../types";
import { getMedicationScheduleSummary } from "../utils/medicationSchedule";

type MedicationsPageProps = {
  medications: Medication[];
  onSelectMedication: (medicationId: number) => void;
};

function MedicationsPage({
  medications,
  onSelectMedication,
}: MedicationsPageProps) {
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
        Medications
      </h2>

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
              onClick={() => onSelectMedication(medication.id)}
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
                {[
                  medication.strength &&
                    `${medication.strength} ${medication.strengthUnit}`,
                  medication.medicationForm,
                ]
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
    </section>
  );
}

export default MedicationsPage;
