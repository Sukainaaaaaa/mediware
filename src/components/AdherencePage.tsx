import { useState } from "react";
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

const formatRangeStart = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const formatRangeEnd = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatSelectedChartDate = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDayLabel = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
  });
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getSelectedDaySummary = (
  day:
    | {
        date: Date;
        taken: number;
        missed: number;
        pending: number;
        total: number;
      }
    | undefined,
  today: Date
) => {
  if (!day || day.total === 0) {
    return { label: "No doses", value: "" };
  }

  const dayStart = getStartOfDay(day.date);
  const todayStart = getStartOfDay(today);

  if (dayStart.getTime() > todayStart.getTime()) {
    return {
      label: "Scheduled",
      value: `${day.total} dose${day.total === 1 ? "" : "s"}`,
    };
  }

  if (day.pending > 0) {
    return {
      label: "Progress",
      value: `${Math.round((day.taken / day.total) * 100)}%`,
    };
  }

  const completedOrMissed = day.taken + day.missed;

  return {
    label: "Adherence",
    value:
      completedOrMissed > 0
        ? `${Math.round((day.taken / completedOrMissed) * 100)}%`
        : "0%",
  };
};

function AdherencePage({ medications, takenDoseIds }: AdherencePageProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMissedDosesOpen, setIsMissedDosesOpen] = useState(false);
  const [isMissedFilterOpen, setIsMissedFilterOpen] = useState(false);
  const [missedMedicationFilter, setMissedMedicationFilter] = useState("All");
  const [selectedDayKey, setSelectedDayKey] = useState(() =>
    getDateKey(new Date())
  );
  const today = getStartOfDay(new Date());
  const weeklyDays = getLastSevenDays().map((date) => {
    const doses = getScheduledDosesWithStatusForDate(
      date,
      medications,
      takenDoseIds,
      today
    );

    const taken = doses.filter((dose) => dose.status === "taken").length;
    const missed = doses.filter((dose) => dose.status === "missed").length;
    const pending = doses.filter((dose) => dose.status === "pending").length;

    return {
      date,
      doses,
      taken,
      missed,
      pending,
      total: doses.length,
    };
  });
  const weeklyDoses = weeklyDays.flatMap((day) =>
    day.doses.map((dose) => ({ ...dose, date: day.date }))
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
  const missedMedicationNames = Array.from(
    new Set(missedDoses.map((dose) => dose.medication.medicationName))
  );
  const filteredMissedDoses =
    missedMedicationFilter === "All"
      ? missedDoses
      : missedDoses.filter(
          (dose) => dose.medication.medicationName === missedMedicationFilter
        );
  const weekStartDate = weeklyDays[0]?.date;
  const weekEndDate = weeklyDays[weeklyDays.length - 1]?.date;
  const weekRangeLabel =
    weekStartDate && weekEndDate
      ? `${formatRangeStart(weekStartDate)} - ${formatRangeEnd(weekEndDate)}`
      : "";
  const selectedDay =
    weeklyDays.find((day) => getDateKey(day.date) === selectedDayKey) ??
    weeklyDays[weeklyDays.length - 1];
  const selectedDaySummary = getSelectedDaySummary(selectedDay, today);

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
          position: "relative",
          borderRadius: "8px",
          border: "1px solid #d8e5dc",
          backgroundColor: "white",
          boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
          padding: "20px",
          marginBottom: "16px",
        }}
      >
        <button
          aria-label="Show adherence calculation information"
          onClick={() => setIsInfoOpen((currentValue) => !currentValue)}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "1px solid #1a5334",
            backgroundColor: isInfoOpen ? "#1a5334" : "white",
            color: isInfoOpen ? "white" : "#1a5334",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          !
        </button>

        <p
          style={{
            margin: "0 0 4px",
            fontSize: "13px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Last 7 days
        </p>
        <p style={{ margin: "0 0 6px", color: "#64748b", fontSize: "14px" }}>
          {weekRangeLabel}
        </p>
        <p style={{ margin: 0, fontSize: "44px", fontWeight: "bold" }}>
          {adherencePercent}%
        </p>

        {isInfoOpen && (
          <p style={{ margin: "8px 40px 0 0", color: "#64748b", fontSize: "14px" }}>
            Based on doses that are already due.
          </p>
        )}
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

      <div
        style={{
          borderRadius: "8px",
          border: "1px solid #d8e5dc",
          backgroundColor: "white",
          boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
          padding: "16px",
          marginBottom: "28px",
        }}
      >
        <div
          aria-label="Adherence range"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "6px",
            padding: "4px",
            borderRadius: "8px",
            backgroundColor: "#eef7f1",
            marginBottom: "18px",
          }}
        >
          {["D", "W", "M", "6M", "Y"].map((range) => {
            const isActive = range === "W";

            return (
              <button
                key={range}
                style={{
                  minHeight: "34px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: isActive ? "white" : "transparent",
                  color: "#1a5334",
                  fontWeight: isActive ? "bold" : "normal",
                  cursor: "pointer",
                  boxShadow: isActive
                    ? "0 4px 10px rgba(26, 83, 52, 0.12)"
                    : "none",
                }}
              >
                {range}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "10px",
            alignItems: "end",
            minHeight: "170px",
          }}
        >
          {weeklyDays.map((day) => {
            const takenHeight = day.total > 0 ? (day.taken / day.total) * 112 : 0;
            const missedHeight = day.total > 0 ? (day.missed / day.total) * 112 : 0;

            return (
              <button
                key={day.date.toISOString()}
                onClick={() => setSelectedDayKey(getDateKey(day.date))}
                style={{
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  border: "none",
                  backgroundColor: "transparent",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <div
                  title={`${day.taken} taken, ${day.missed} missed`}
                  style={{
                    width: "100%",
                    maxWidth: "34px",
                    height: "112px",
                    borderRadius: "999px",
                    backgroundColor: "#eef2f7",
                    border:
                      getDateKey(day.date) === selectedDayKey
                        ? "2px solid #1a5334"
                        : "1px solid #d8e5dc",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column-reverse",
                    boxSizing: "border-box",
                  }}
                >
                  {takenHeight > 0 && (
                    <span
                      style={{
                        height: `${takenHeight}px`,
                        backgroundColor: "#1a5334",
                      }}
                    />
                  )}
                  {missedHeight > 0 && (
                    <span
                      style={{
                        height: `${missedHeight}px`,
                        backgroundColor: "#dc2626",
                      }}
                    />
                  )}
                </div>
                <p
                  style={{
                    margin: 0,
                    color:
                      getDateKey(day.date) === selectedDayKey ? "#1a5334" : "#64748b",
                    fontSize: "12px",
                    fontWeight:
                      getDateKey(day.date) === selectedDayKey ? "bold" : "normal",
                  }}
                >
                  {formatDayLabel(day.date)}
                </p>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "16px",
            color: "#64748b",
            fontSize: "12px",
          }}
        >
          {[
            ["#1a5334", "Taken"],
            ["#dc2626", "Missed"],
          ].map(([color, label]) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span
                aria-hidden="true"
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: color,
                }}
              />
              {label}
            </span>
          ))}
        </div>

        {selectedDay && (
          <div
            style={{
              marginTop: "16px",
              padding: "14px",
              borderRadius: "8px",
              backgroundColor: "#eef7f1",
              color: "#1a5334",
              textAlign: "center",
            }}
          >
            <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "bold" }}>
              {formatSelectedChartDate(selectedDay.date)}
            </p>
            <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: "13px" }}>
              {selectedDaySummary.label}
            </p>
            <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
              {selectedDaySummary.value}
            </p>
          </div>
        )}
      </div>

      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <button
            onClick={() => setIsMissedDosesOpen((currentValue) => !currentValue)}
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#1a5334",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: 0,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                fontSize: "16px",
                transform: isMissedDosesOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              {">"}
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Missed doses
            </span>
          </button>

          <div
            style={{
              position: "relative",
              maxWidth: "190px",
              minWidth: "150px",
            }}
          >
            <button
              aria-label="Filter missed doses by medication"
              onClick={() => setIsMissedFilterOpen((currentValue) => !currentValue)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #1a5334",
                backgroundColor: "#1a5334",
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {missedMedicationFilter === "All"
                  ? "All medication"
                  : missedMedicationFilter}
              </span>
              <span aria-hidden="true">{isMissedFilterOpen ? "^" : "v"}</span>
            </button>

            {isMissedFilterOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  zIndex: 20,
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #d8e5dc",
                  backgroundColor: "white",
                  boxShadow: "0 10px 24px rgba(26, 83, 52, 0.16)",
                  overflow: "hidden",
                }}
              >
                {["All", ...missedMedicationNames].map((medicationName) => {
                  const label =
                    medicationName === "All" ? "All medication" : medicationName;
                  const isSelected = missedMedicationFilter === medicationName;

                  return (
                    <button
                      key={medicationName}
                      onClick={() => {
                        setMissedMedicationFilter(medicationName);
                        setIsMissedFilterOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "none",
                        borderBottom: "1px solid #eef2f7",
                        backgroundColor: isSelected ? "#1a5334" : "white",
                        color: isSelected ? "white" : "#1a5334",
                        fontSize: "14px",
                        fontWeight: isSelected ? "bold" : "normal",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {isMissedDosesOpen &&
          (filteredMissedDoses.length === 0 ? (
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
              {filteredMissedDoses.map((dose) => (
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
          ))}
      </section>
    </section>
  );
}

export default AdherencePage;
