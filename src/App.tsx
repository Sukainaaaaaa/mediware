function App() {
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
        <h1 style={{ fontSize: "26px", margin: 0, color:"#1a5334"}}>
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
              backgroundColor: " #1a5334",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: "42px",
            }}
          >
            +
          </button>
        </div>
      </header>

      {/* Page content */}
      <section style={{ padding: "24px", color:"#1a5334"}}>
        <h2>TODAY</h2>
        <p>Manage your medications, reminders, and side effects.</p>
      </section>
    </main>
  );
}

export default App;