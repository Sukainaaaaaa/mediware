export { DrawnCheck, DrawnChevron, DrawnPlus, DrawnX };

type DrawnXProps = {
  size?: number;
  color?: string;
};

type DrawnCheckProps = {
  color?: string;
};

type DrawnPlusProps = {
  size?: number;
  color?: string;
};

type DrawnChevronProps = {
  direction: "left" | "right";
  color?: string;
};

function DrawnX({ size = 14, color = "#1a5334" }: DrawnXProps) {
  return (
    <>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          width: `${size}px`,
          height: "2px",
          borderRadius: "999px",
          backgroundColor: color,
          transform: "rotate(45deg)",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          width: `${size}px`,
          height: "2px",
          borderRadius: "999px",
          backgroundColor: color,
          transform: "rotate(-45deg)",
        }}
      />
    </>
  );
}

function DrawnCheck({ color = "white" }: DrawnCheckProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: "16px",
        height: "9px",
        borderLeft: `3px solid ${color}`,
        borderBottom: `3px solid ${color}`,
        transform: "rotate(-45deg) translate(1px, -1px)",
        boxSizing: "border-box",
      }}
    />
  );
}

function DrawnPlus({ size = 20, color = "white" }: DrawnPlusProps) {
  return (
    <>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          width: `${size}px`,
          height: "3px",
          borderRadius: "999px",
          backgroundColor: color,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "3px",
          height: `${size}px`,
          borderRadius: "999px",
          backgroundColor: color,
        }}
      />
    </>
  );
}

function DrawnChevron({
  direction,
  color = "#1a5334",
}: DrawnChevronProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: "12px",
        height: "12px",
        borderTop: `3px solid ${color}`,
        borderRight: `3px solid ${color}`,
        transform: direction === "left" ? "rotate(-135deg)" : "rotate(45deg)",
        boxSizing: "border-box",
      }}
    />
  );
}
