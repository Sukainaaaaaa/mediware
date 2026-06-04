import type { Medication } from "../types";
import { DrawnX } from "./DrawnIcons";
import { IconButton } from "./IconButton";
import { getMedicationScheduleSummary } from "../utils/medicationSchedule";

type MedicationDetailsOverlayProps = {
  medication: Medication | undefined;
  isOpen: boolean;
  isConfirmingDelete: boolean;
  onClose: () => void;
  onEditMedication: (medication: Medication) => void;
  onStartDelete: () => void;
  onCancelDelete: () => void;
  onDeleteMedication: () => void;
};

function MedicationDetailsOverlay({
  medication,
  isOpen,
  isConfirmingDelete,
  onClose,
  onEditMedication,
  onStartDelete,
  onCancelDelete,
  onDeleteMedication,
}: MedicationDetailsOverlayProps) {
  if (!isOpen || !medication) {
    return null;
  }

  return (
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
            {medication.medicationName}
          </h3>

          <IconButton
            ariaLabel="Close medication details"
            onClick={onClose}
          >
            <DrawnX />
          </IconButton>
        </div>

        {[
          ["Form", medication.medicationForm || "Not selected"],
          [
            "Strength",
            medication.strength
              ? `${medication.strength} ${medication.strengthUnit}`
              : "Not added",
          ],
          ["Schedule", getMedicationScheduleSummary(medication)],
          ["Reason", medication.indication || "Not added"],
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

        {!isConfirmingDelete ? (
          <div
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "18px",
            }}
          >
            <button
              onClick={() => onEditMedication(medication)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid #1a5334",
                backgroundColor: "#1a5334",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Edit medication
            </button>

            <button
              onClick={onStartDelete}
              style={{
                width: "100%",
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
          </div>
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
                onClick={onCancelDelete}
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
                onClick={onDeleteMedication}
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
  );
}

export default MedicationDetailsOverlay;
