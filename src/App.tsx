import { useState } from "react";

function App() {

  // State for selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getDateLabel = (date: Date) => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dateText = date
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
      .toUpperCase();

    if (isSameDay(date, today)) {
      return `TODAY, ${dateText}`;
    }

    if (isSameDay(date, yesterday)) {
      return `YESTERDAY, ${dateText}`;
    }

    if (isSameDay(date, tomorrow)) {
      return `TOMORROW, ${dateText}`;
    }

    const weekday = date
      .toLocaleDateString("en-GB", {
        weekday: "long",
      })
      .toUpperCase();

    return `${weekday}, ${dateText}`;
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // State for showing add medication form

  const [showAddForm, setShowAddForm] = useState(false);

  return (

    <main style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Top bar */}
      <header
        style={{
          height: "70px",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          boxShadow: "0 2px 8px #1a5334",
        }}
      >
        {/* App name */}
        <h1 style={{ fontSize: "26px", margin: 0, color: "#1a5334" }}>
          mediware
        </h1>

        {/* Right side icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Account icon */}
          <button
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: "1px solid #1a5334",
              backgroundColor: "#f1f5f9",
              fontSize: "20px",
              cursor: "pointer",

            }}
          >
            👤
          </button>

          {/* Add medication button */}
          <button
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#1a5334",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: "42px",
            }}
            onClick={() => setShowAddForm(true)}>
            +
          </button>
        </div>
      </header>

      {/* Page content */}
      <section style={{ padding: "24px", color: "#1a5334" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          {/* Left arrow */}
          <button
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#1a5334",
              fontSize: "28px",
              cursor: "pointer",
            }}
            onClick={goToPreviousDay}>
            ‹
          </button>

          {/* Date center */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <span style={{ fontSize: "24px" }}>📅</span>
            <span>{getDateLabel(selectedDate)}</span>
          </div>

          {/* Right arrow */}
          <button
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#1a5334",
              fontSize: "28px",
              cursor: "pointer",
            }}
            onClick={goToNextDay}
          >
            ›
          </button>
        </div>

        <p>Manage your medications, reminders, and side effects.</p>
      </section>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          zIndex: 1000,
          padding: "24px",
          boxSizing: "border-box",
          color: "#1a5334",
          overflowY: "auto",

          transform: showAddForm ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <h2 style={{ margin: 0 }}>Add medication</h2>

            <button
              onClick={() => setShowAddForm(false)}
              style={{
                border: "none",
                backgroundColor: "transparent",
                fontSize: "28px",
                cursor: "pointer",
                color: "#1a5334",
              }}
            >
              ×
            </button>
          </div>

          <input
            placeholder="Medication name"
            style={{
              display: "block",
              width: "100%",
              marginBottom: "16px",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
          <input
            placeholder="Medication form"
            style={{
              display: "block",
              width: "100%",
              marginBottom: "16px",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
          <input
            placeholder="Dosage"
            style={{
              display: "block",
              width: "100%",
              marginBottom: "16px",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />

          <input
            placeholder="Frequency"
            style={{
              display: "block",
              width: "100%",
              marginBottom: "24px",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
          <input
            placeholder="Times per day"
            style={{
              display: "block",
              width: "100%",
              marginBottom: "24px",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
          <input
            placeholder="Indication"
            style={{
              display: "block",
              width: "100%",
              marginBottom: "24px",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
          <button
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1a5334",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Save medication
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;