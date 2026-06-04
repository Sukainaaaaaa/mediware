import { DrawnPlus } from "./DrawnIcons";
import { IconButton } from "./IconButton";

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
          gap: "10px",
          marginRight: "-12px",
        }}
      >
        <button
          aria-label="Account"
          className="round-icon-button"
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
