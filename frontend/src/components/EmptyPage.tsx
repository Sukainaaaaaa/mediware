type EmptyPageProps = {
  title: string;
};

function EmptyPage({ title }: EmptyPageProps) {
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
          margin: "0 0 16px",
          fontSize: "24px",
          textAlign: "center",
        }}
      >
        {title}
      </h2>

      <div
        aria-hidden="true"
        style={{
          minHeight: "160px",
          borderRadius: "8px",
          border: "1px solid #d8e5dc",
          backgroundColor: "white",
          boxShadow: "0 8px 18px rgba(26, 83, 52, 0.08)",
        }}
      />
    </section>
  );
}

export default EmptyPage;
