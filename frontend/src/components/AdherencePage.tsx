import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { Medication, ScheduledDoseWithStatus } from "../types";
import { getScheduledDosesWithStatusForDate } from "../utils/medicationSchedule";

type AdherencePageProps = {
  medications: Medication[];
  takenDoseIds: string[];
};

type AdherenceRange = "W" | "M" | "6M" | "Y";

type ChartDose = ScheduledDoseWithStatus & { date: Date };

type ChartItem = {
  key: string;
  date: Date;
  title: string;
  xLabel: string;
  doses: ChartDose[];
  taken: number;
  missed: number;
  pending: number;
  total: number;
};

const getStartOfDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  return startOfDay;
};

const getVisibleDays = (dayOffset: number, dayCount: number) => {
  const today = getStartOfDay(new Date());
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + dayOffset);

  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (dayCount - 1 - index));

    return date;
  });
};

const getDaysBetween = (startDate: Date, endDate: Date) => {
  const start = getStartOfDay(startDate);
  const end = getStartOfDay(endDate);
  const dayCount =
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

  return Array.from({ length: Math.max(0, dayCount) }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

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

const formatMonthLabel = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    month: "short",
  });
};

const formatMonthTitle = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
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
  day: ChartItem | undefined,
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

const summarizeDoses = (
  key: string,
  date: Date,
  title: string,
  xLabel: string,
  doses: ChartDose[]
): ChartItem => {
  const taken = doses.filter((dose) => dose.status === "taken").length;
  const missed = doses.filter((dose) => dose.status === "missed").length;
  const pending = doses.filter((dose) => dose.status === "pending").length;

  return {
    key,
    date,
    title,
    xLabel,
    doses,
    taken,
    missed,
    pending,
    total: doses.length,
  };
};

function AdherencePage({ medications, takenDoseIds }: AdherencePageProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMissedDosesOpen, setIsMissedDosesOpen] = useState(false);
  const [isMissedFilterOpen, setIsMissedFilterOpen] = useState(false);
  const [missedMedicationFilter, setMissedMedicationFilter] = useState("All");
  const [weekDayOffset, setWeekDayOffset] = useState(0);
  const [activeRange, setActiveRange] = useState<AdherenceRange>("W");
  const [selectedDayKey, setSelectedDayKey] = useState(() =>
    getDateKey(new Date())
  );
  const chartDragStartX = useRef<number | null>(null);
  const today = getStartOfDay(new Date());
  const rangeEndDate = new Date(today);
  rangeEndDate.setDate(today.getDate() + weekDayOffset);
  const getDosesForDate = (date: Date): ChartDose[] =>
    getScheduledDosesWithStatusForDate(
      date,
      medications,
      takenDoseIds,
      today
    ).map((dose) => ({ ...dose, date }));

  const chartItems: ChartItem[] = (() => {
    if (activeRange === "6M") {
      return Array.from({ length: 26 }, (_, index) => {
        const weekEnd = new Date(rangeEndDate);
        weekEnd.setDate(rangeEndDate.getDate() - (25 - index) * 7);
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekEnd.getDate() - 6);
        const doses = getDaysBetween(weekStart, weekEnd).flatMap(getDosesForDate);
        const shouldShowMonth =
          index === 0 ||
          index === 25 ||
          weekStart.getMonth() !==
            new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() - 7).getMonth();

        return summarizeDoses(
          `${getDateKey(weekStart)}-${getDateKey(weekEnd)}`,
          weekEnd,
          `${formatRangeStart(weekStart)} - ${formatRangeEnd(weekEnd)}`,
          shouldShowMonth ? formatMonthLabel(weekStart) : "",
          doses
        );
      });
    }

    if (activeRange === "Y") {
      return Array.from({ length: 12 }, (_, index) => {
        const monthDate = new Date(
          rangeEndDate.getFullYear(),
          rangeEndDate.getMonth() - (11 - index),
          1
        );
        const monthStart = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth(),
          1
        );
        const monthEnd = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth() + 1,
          0
        );
        const doses = getDaysBetween(monthStart, monthEnd).flatMap(getDosesForDate);

        return summarizeDoses(
          `${monthStart.getFullYear()}-${monthStart.getMonth()}`,
          monthEnd,
          formatMonthTitle(monthStart),
          formatMonthLabel(monthStart),
          doses
        );
      });
    }

    const visibleDayCount = activeRange === "M" ? 30 : 7;

    return getVisibleDays(weekDayOffset, visibleDayCount).map((date, index) => {
      const doses = getDosesForDate(date);
      const xLabel =
        activeRange === "M"
          ? index % 7 === 0 || index === visibleDayCount - 1
            ? String(date.getDate())
            : ""
          : formatDayLabel(date);

      return summarizeDoses(
        getDateKey(date),
        date,
        formatSelectedChartDate(date),
        xLabel,
        doses
      );
    });
  })();
  const chartDoses = chartItems.flatMap((item) => item.doses);

  const takenCount = chartDoses.filter((dose) => dose.status === "taken").length;
  const missedCount = chartDoses.filter((dose) => dose.status === "missed").length;
  const pendingCount = chartDoses.filter((dose) => dose.status === "pending").length;
  const completedOrMissedCount = takenCount + missedCount;
  const adherencePercent =
    completedOrMissedCount > 0
      ? Math.round((takenCount / completedOrMissedCount) * 100)
      : 0;
  const missedDoses = chartDoses.filter(
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
  const rangeStartItem = chartItems[0];
  const rangeEndItem = chartItems[chartItems.length - 1];
  const weekRangeLabel =
    rangeStartItem && rangeEndItem
      ? activeRange === "Y"
        ? `${formatMonthTitle(rangeStartItem.date)} - ${formatMonthTitle(
            rangeEndItem.date
          )}`
        : activeRange === "6M"
          ? `${rangeStartItem.title.split(" - ")[0]} - ${formatRangeEnd(
              rangeEndItem.date
            )}`
          : `${formatRangeStart(rangeStartItem.date)} - ${formatRangeEnd(
              rangeEndItem.date
            )}`
      : "";
  const rangeTitle =
    activeRange === "Y"
      ? "Last year"
      : activeRange === "6M"
        ? "Last 6 months"
        : activeRange === "M"
          ? "Last 30 days"
          : "Last 7 days";
  const selectedDay =
    chartItems.find((item) => item.key === selectedDayKey) ??
    chartItems[chartItems.length - 1];
  const selectedChartKey = selectedDay?.key;
  const selectedDaySummary = getSelectedDaySummary(selectedDay, today);

  const moveVisibleDays = (dayChange: number) => {
    setWeekDayOffset((currentOffset) => {
      const nextOffset = currentOffset + dayChange;
      const nextEndDate = getStartOfDay(new Date());
      nextEndDate.setDate(nextEndDate.getDate() + nextOffset);
      setSelectedDayKey(getDateKey(nextEndDate));

      return nextOffset;
    });
  };

  const handleChartPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    chartDragStartX.current = event.clientX;
  };

  const handleChartPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (chartDragStartX.current === null) {
      return;
    }

    const dragDistance = event.clientX - chartDragStartX.current;
    chartDragStartX.current = null;

    if (Math.abs(dragDistance) < 36) {
      return;
    }

    const dragPixelsPerDay =
      activeRange === "Y" ? 42 : activeRange === "6M" ? 24 : activeRange === "M" ? 18 : 56;
    const dayMultiplier =
      activeRange === "Y" ? 30 : activeRange === "6M" ? 7 : 1;
    const dayChange = Math.max(
      1,
      Math.round(Math.abs(dragDistance) / dragPixelsPerDay)
    ) * dayMultiplier;

    moveVisibleDays(dragDistance > 0 ? -dayChange : dayChange);
  };

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
          {rangeTitle}
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
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "6px",
            padding: "4px",
            borderRadius: "8px",
            backgroundColor: "#eef7f1",
            marginBottom: "18px",
          }}
        >
          {(["W", "M", "6M", "Y"] as AdherenceRange[]).map((range) => {
            const isActive = range === activeRange;

            return (
              <button
                key={range}
                onClick={() => {
                  setActiveRange(range);
                  setSelectedDayKey("");
                }}
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
          onPointerDown={handleChartPointerDown}
          onPointerUp={handleChartPointerUp}
          onPointerCancel={() => {
            chartDragStartX.current = null;
          }}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${chartItems.length}, 1fr)`,
            gap:
              activeRange === "Y"
                ? "8px"
                : activeRange === "6M"
                  ? "4px"
                  : activeRange === "M"
                    ? "3px"
                    : "10px",
            alignItems: "end",
            minHeight: "170px",
            cursor: "grab",
            touchAction: "pan-y",
          }}
        >
          {chartItems.map((item) => {
            const takenHeight = item.total > 0 ? (item.taken / item.total) * 112 : 0;
            const missedHeight = item.total > 0 ? (item.missed / item.total) * 112 : 0;

            return (
              <button
                key={item.key}
                onClick={() => setSelectedDayKey(item.key)}
                style={{
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: activeRange === "W" ? "8px" : "6px",
                  border: "none",
                  backgroundColor: "transparent",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <div
                  title={`${item.taken} taken, ${item.missed} missed`}
                  style={{
                    width: "100%",
                    maxWidth:
                      activeRange === "Y"
                        ? "24px"
                        : activeRange === "6M"
                          ? "12px"
                          : activeRange === "M"
                            ? "10px"
                            : "34px",
                    height: "112px",
                    borderRadius: "999px",
                    backgroundColor: "#eef2f7",
                    border:
                      item.key === selectedChartKey
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
                      item.key === selectedChartKey ? "#1a5334" : "#64748b",
                    fontSize: activeRange === "W" ? "12px" : "10px",
                    fontWeight: item.key === selectedChartKey ? "bold" : "normal",
                    minHeight: "14px",
                  }}
                >
                  {item.xLabel}
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
              {selectedDay.title}
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
            onClick={() => {
              setIsMissedDosesOpen((currentValue) => {
                if (currentValue) {
                  setIsMissedFilterOpen(false);
                }

                return !currentValue;
              });
            }}
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#1a5334",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              padding: 0,
              minHeight: "34px",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "16px",
                height: "16px",
                fontSize: "18px",
                fontWeight: 900,
                lineHeight: 1,
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

          {isMissedDosesOpen && (
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
          )}
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
