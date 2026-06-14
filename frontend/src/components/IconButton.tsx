import type { CSSProperties, ReactNode } from "react";

export { IconButton };

type IconButtonProps = {
  ariaLabel: string;
  children: ReactNode;
  onClick: () => void;
  size?: number;
  border?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: CSSProperties;
};

function IconButton({
  ariaLabel,
  children,
  onClick,
  size = 36,
  border = "1px solid #d8e5dc",
  backgroundColor = "transparent",
  disabled = false,
  style,
}: IconButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className="round-icon-button"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        border,
        backgroundColor,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        position: "relative",
        flexShrink: 0,
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
