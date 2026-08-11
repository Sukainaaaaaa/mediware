import { useState } from "react";
import { DrawnPlus } from "./DrawnIcons";
import { IconButton } from "./IconButton";

type HeaderProps = {
  onAddMedication: () => void;
  onLogout: () => void;
  userName: string;
  userEmail: string;
};

function Header({ onAddMedication, onLogout, userName, userEmail }: HeaderProps) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

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
          gap: "10px",
          marginRight: "-12px",
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            aria-label="Account menu"
            aria-expanded={isAccountMenuOpen}
            className="round-icon-button"
            onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              border: "1px solid #1a5334",
              backgroundColor: "#1a5334",
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
                width: "13px",
                height: "13px",
                borderRadius: "50%",
                backgroundColor: "white",
                position: "relative",
                boxSizing: "border-box",
                marginTop: "-9px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "18px",
                  width: "25px",
                  height: "13px",
                  backgroundColor: "white",
                  borderRadius: "16px 16px 5px 5px",
                  transform: "translateX(-50%)",
                  boxSizing: "border-box",
                }}
              />
            </span>
          </button>

          {isAccountMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "48px",
                right: 0,
                width: "210px",
                backgroundColor: "white",
                border: "1px solid rgba(26, 83, 52, 0.18)",
                borderRadius: "16px",
                boxShadow: "0 16px 32px rgba(26, 83, 52, 0.18)",
                padding: "14px",
                zIndex: 20,
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  color: "#1a5334",
                  fontSize: "14px",
                  fontWeight: 800,
                }}
              >
                {userName}
              </p>
              <p
                style={{
                  margin: "0 0 14px",
                  color: "rgba(26, 83, 52, 0.72)",
                  fontSize: "12px",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userEmail}
              </p>
              <button
                className="round-icon-button"
                onClick={onLogout}
                style={{
                  width: "100%",
                  minHeight: "42px",
                  border: "1px solid #1a5334",
                  borderRadius: "999px",
                  backgroundColor: "#1a5334",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                }}
              >
                LOG OUT
              </button>
            </div>
          )}
        </div>

        <IconButton
          ariaLabel="Add medication"
          onClick={onAddMedication}
          size={38}
          border="none"
          backgroundColor="#1a5334"
        >
          <DrawnPlus size={22} />
        </IconButton>
      </div>
    </header>
  );
}

export default Header;
