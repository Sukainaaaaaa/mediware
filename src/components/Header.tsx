type HeaderProps = {
  onAddMedication: () => void;
};

function Header({ onAddMedication }: HeaderProps) {
  return (
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
      <h1 style={{ fontSize: "26px", margin: 0, color: "#1a5334" }}>
        mediware
      </h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          aria-label="Account"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "1px solid #1a5334",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "17px",
              height: "17px",
              borderRadius: "50%",
              border: "2px solid #1a5334",
              position: "relative",
              boxSizing: "border-box",
              marginTop: "-8px",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "19px",
                width: "27px",
                height: "15px",
                border: "2px solid #1a5334",
                borderBottom: "none",
                borderRadius: "16px 16px 0 0",
                transform: "translateX(-50%)",
                boxSizing: "border-box",
              }}
            />
          </span>
        </button>

        <button
          onClick={onAddMedication}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#1a5334",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "block",
              transform: "translateY(-2px)",
            }}
          >
            +
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
