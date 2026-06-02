import type { Medication, ScheduledDoseWithStatus } from "../types";
import { getScheduledDosesWithStatusForDate } from "../utils/medicationSchedule";

type AdherencePageProps = {
  medications: Medication[];
  takenDoseIds: string[];
};

const getStartOfDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  return startOfDay;
};

const getLastSevenDays = () => {
  const today = getStartOfDay(new Date());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return date;
  });
};

const formatDoseDate = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

function AdherencePage({ medications, takenDoseIds }: AdherencePageProps) {
  const today = getStartOfDay(new Date());
  const weeklyDoses = getLastSevenDays().flatMap((date) =>
    getScheduledDosesWithStatusForDate(date, medications, takenDoseIds, today).map(
      (dose) => ({ ...dose, date })
    )
  );

  const takenCount = weeklyDoses.filter((dose) => dose.status === "taken").length;
  const missedCount = weeklyDoses.filter((dose) => dose.status === "missed").length;
  const pendingCount = weeklyDoses.filter((dose) => dose.status === "pending").length;
  const completedOrMissedCount = takenCount + missedCount;
  const adherencePercent =
    completedOrMissedCount > 0
      ? Math.round((takenCount / completedOrMissedCount) * 100)
      : 0;
  const missedDoses = weeklyDoses.filter(
    (dose): dose is ScheduledDoseWithStatus & { date: Date } =>
      dose.status === "missed"
  );

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
          margin: "0 0 18px",
          fontSize: "24px",
          textAlign: "center",
        }}
      >
        Adherence
      </h2>

      <div
        style={{
          borderRadius: "8px",
          border: "1px solid #d8e5dc",
          backgroundColor: "white",
          boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
          padding: "20px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            fontSize: "13px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Last 7 days
        </p>
        <p style={{ margin: 0, fontSize: "44px", fontWeight: "bold" }}>
          {adherencePercent}%
        </p>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
          Based on doses that are already due.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
        {[
          ["Taken", takenCount],
          ["Missed", missedCount],
          ["Pending", pendingCount],
        ].map(([label, count]) => (
          <div
            key={label}
            style={{
              minHeight: "78px",
              borderRadius: "8px",
              border: "1px solid #d8e5dc",
              backgroundColor: "white",
              padding: "12px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p style={{ margin: "0 0 6px", color: "#64748b", fontSize: "13px" }}>
              {label}
            </p>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
              {count}
            </p>
          </div>
        ))}
      </div>

      <h3
        style={{
          margin: "0 0 14px",
          fontSize: "14px",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        Needs attention
      </h3>

      {missedDoses.length === 0 ? (
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
        <div style={{ display: "grid", gap: "12px" }}>
          {missedDoses.map((dose) => (
            <div
              key={dose.id}
              style={{
                borderRadius: "8px",
                border: "1px solid #d8e5dc",
                backgroundColor: "white",
                boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
                padding: "14px 16px",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>
                {dose.medication.medicationName}
              </p>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
                {formatDoseDate(dose.date)} - {dose.doseLabel}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdherencePage;
