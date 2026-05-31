import type { Page } from "../types";

type BottomNavProps = {
  activePage: Page;
  onChangePage: (page: Page) => void;
};

const bottomNavItems: { page: Page; label: string; icon: string }[] = [
  { page: "tracker", label: "Tracker", icon: "✓" },
  { page: "adherence", label: "Adherence", icon: "%" },
  { page: "medications", label: "Medications", icon: "+" },
  { page: "sideEffects", label: "Side effects", icon: "!" },
];

function BottomNav({ activePage, onChangePage }: BottomNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed",
        left: "16px",
        right: "16px",
        bottom: "16px",
        zIndex: 900,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        maxWidth: "620px",
        margin: "0 auto",
        padding: "8px",
        borderRadius: "28px",
        backgroundColor: "#1a5334",
        boxShadow: "0 14px 32px rgba(26, 83, 52, 0.28)",
      }}
    >
      {bottomNavItems.map((item) => {
        const isActive = activePage === item.page;

        return (
          <button
            key={item.page}
            onClick={() => onChangePage(item.page)}
            style={{
              minWidth: 0,
              minHeight: "62px",
              border: "none",
              borderRadius: "22px",
              backgroundColor: isActive ? "white" : "transparent",
              color: isActive ? "#1a5334" : "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              cursor: "pointer",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontSize: "20px",
                lineHeight: 1,
                fontWeight: "bold",
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: isActive ? "bold" : "normal",
                lineHeight: 1.2,
                textAlign: "center",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
