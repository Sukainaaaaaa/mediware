import { useState } from "react";

type AuthSession = {
  token: string;
  name: string;
  email: string;
  userId: number;
};

type AuthMode = "register" | "login";

type AuthPageProps = {
  onAuthenticated: (authSession: AuthSession) => void;
};

type AuthResponse = AuthSession;

function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegistering = mode === "register";

  const submitAuthForm = async () => {
    if (!mode || !email.trim() || !password.trim()) {
      return;
    }

    if (isRegistering && (!firstName.trim() || !lastName.trim())) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    const body = isRegistering
      ? { firstName, lastName, email, password }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("We could not sign you in. Check your details and try again.");
      }

      const authResponse = (await response.json()) as AuthResponse;
      onAuthenticated(authResponse);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    Boolean(mode) &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    (!isRegistering ||
      (firstName.trim().length > 0 && lastName.trim().length > 0));

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a5334",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "clamp(18px, 6vw, 28px) clamp(16px, 6vw, 24px)",
        boxSizing: "border-box",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.16), transparent 28%), radial-gradient(circle at 82% 8%, rgba(255,255,255,0.12), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2))",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "clamp(30px, 10vw, 38px)",
            fontWeight: 800,
            letterSpacing: 0,
          }}
        >
          mediware
        </p>

        <section
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingBottom: "max(18px, env(safe-area-inset-bottom))",
            paddingTop: "clamp(28px, 8vh, 72px)",
            gap: "clamp(24px, 6vh, 44px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: "clamp(12px, 3.5vh, 18px)",
            }}
          >
            <div
              style={{
                width: "clamp(58px, 18vw, 74px)",
                height: "clamp(58px, 18vw, 74px)",
                border: "2px solid rgba(255,255,255,0.72)",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 0 24px rgba(255,255,255,0.16)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "clamp(24px, 8vw, 30px)",
                  height: "clamp(34px, 11vw, 42px)",
                  border: "3px solid white",
                  borderRadius: "999px",
                  transform: "rotate(32deg)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(34px, 11vw, 58px)",
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: 0,
              }}
            >
              Start your medication routine
            </h1>

            <p
              style={{
                margin: "clamp(14px, 4vh, 28px) 0 0",
                fontSize: "clamp(16px, 4.5vw, 20px)",
                lineHeight: 1.35,
                fontWeight: 600,
                opacity: 0.9,
                maxWidth: "380px",
              }}
            >
              Track what you take, what you have taken, and what needs your
              attention.
            </p>
          </div>

          {!mode && (
            <div
              style={{
                display: "grid",
                gap: "14px",
                marginTop: 0,
              }}
            >
              <button
                onClick={() => setMode("register")}
                style={primaryButtonStyle}
              >
                CREATE ACCOUNT
              </button>
              <button
                onClick={() => setMode("login")}
                style={secondaryButtonStyle}
              >
                LOG IN
              </button>
            </div>
          )}

          {mode && (
            <div
              style={{
                marginTop: 0,
                display: "grid",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  border: "2px solid white",
                  borderRadius: "999px",
                  padding: "4px",
                }}
              >
                <button
                  onClick={() => setMode("register")}
                  style={getModeButtonStyle(isRegistering)}
                >
                  Create
                </button>
                <button
                  onClick={() => setMode("login")}
                  style={getModeButtonStyle(!isRegistering)}
                >
                  Log in
                </button>
              </div>

              {isRegistering && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "10px",
                  }}
                >
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="First name"
                    style={inputStyle}
                  />
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Last name"
                    style={inputStyle}
                  />
                </div>
              )}

              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                type="email"
                autoComplete="email"
                style={inputStyle}
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                style={inputStyle}
              />

              {errorMessage && (
                <p
                  style={{
                    margin: "2px 0 0",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {errorMessage}
                </p>
              )}

              <button
                disabled={!canSubmit || isSubmitting}
                onClick={submitAuthForm}
                style={{
                  ...primaryButtonStyle,
                  opacity: canSubmit && !isSubmitting ? 1 : 0.5,
                  cursor: canSubmit && !isSubmitting ? "pointer" : "not-allowed",
                }}
              >
                {isSubmitting
                  ? "PLEASE WAIT"
                  : isRegistering
                    ? "CREATE ACCOUNT"
                    : "LOG IN"}
              </button>
              <button
                onClick={() => {
                  setMode(null);
                  setErrorMessage("");
                }}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 800,
                  cursor: "pointer",
                  padding: "8px",
                }}
              >
                Back
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const primaryButtonStyle = {
  width: "100%",
  minHeight: "clamp(54px, 13vw, 62px)",
  borderRadius: "8px",
  border: "2px solid white",
  backgroundColor: "white",
  color: "#1a5334",
  fontSize: "clamp(15px, 4vw, 17px)",
  fontWeight: 900,
  letterSpacing: "2px",
  cursor: "pointer",
} as const;

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  backgroundColor: "transparent",
  color: "white",
};

const inputStyle = {
  width: "100%",
  minHeight: "clamp(50px, 12vw, 54px)",
  padding: "0 14px",
  borderRadius: "8px",
  border: "2px solid white",
  backgroundColor: "rgba(26, 83, 52, 0.72)",
  color: "white",
  fontSize: "clamp(15px, 4vw, 16px)",
  fontWeight: 700,
  boxSizing: "border-box",
  outline: "none",
} as const;

const getModeButtonStyle = (isActive: boolean) =>
  ({
    flex: 1,
    minHeight: "clamp(42px, 11vw, 44px)",
    border: "none",
    borderRadius: "999px",
    backgroundColor: isActive ? "white" : "transparent",
    color: isActive ? "#1a5334" : "white",
    fontSize: "clamp(14px, 3.8vw, 15px)",
    fontWeight: 900,
    cursor: "pointer",
  }) as const;

export default AuthPage;
