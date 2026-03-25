import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const rolesClaim = import.meta.env.VITE_ROLES_CLAIM;
const mgmtApiAudience =
  import.meta.env.VITE_AUTH0_MGMT_AUDIENCE || `https://${auth0Domain}/api/v2/`;

const ROLES = [
  {
    id: "prof",
    label: "Professor",
    description: "Create courses, manage students, and grade assignments.",
  },
  {
    id: "student",
    label: "Student",
    description: "Enroll in courses, submit assignments, and track progress.",
  },
];

// ── Role Selection Screen ─────────────────────────────────────────────────────
function RoleSelection({ onDone }) {
  const { getAccessTokenSilently, user } = useAuth0();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: mgmtApiAudience,
          scope: "update:current_user_metadata",
        },
      });

      const res = await fetch(
        `https://${auth0Domain}/api/v2/users/${user.sub}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_metadata: { requested_role: selected } }),
        },
      );

      if (!res.ok) throw new Error("Failed to save role. Please try again.");

      // Force token refresh → triggers Post-Login Action → role gets assigned
      await getAccessTokenSilently({ cacheMode: "off" });

      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Choose your role</h1>
      <p>Select how you'll use this app. This cannot be changed later.</p>

      <div style={{ display: "flex", gap: 12, margin: "1.5rem 0" }}>
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelected(role.id)}
            style={{
              border:
                selected === role.id ? "2px solid #2563eb" : "1px solid #ccc",
              borderRadius: 8,
              padding: "1rem 1.25rem",
              cursor: "pointer",
              background: selected === role.id ? "#eff6ff" : "white",
              textAlign: "left",
              minWidth: 180,
            }}
          >
            <strong>{role.label}</strong>
            <p style={{ fontSize: 13, color: "#555", margin: "6px 0 0" }}>
              {role.description}
            </p>
          </button>
        ))}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleConfirm} disabled={!selected || loading}>
        {loading ? "Saving…" : "Continue →"}
      </button>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect: login,
    logout: auth0Logout,
    user,
  } = useAuth0();

  const hasRole = Boolean(rolesClaim && user?.[rolesClaim]?.length);

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) return "Loading...";

  if (!isAuthenticated) {
    return (
      <>
        {error && <p>Error: {error.message}</p>}
        <button onClick={signup}>Signup</button>
        <button onClick={login}>Login</button>
      </>
    );
  }

  // Authenticated but no role yet → show role picker
  if (!hasRole) {
    return <RoleSelection onDone={() => window.location.reload()} />;
  }

  // Authenticated + has role → normal app
  return (
    <>
      <p>Logged in as {user.email}</p>
      <p>
        Role: {rolesClaim ? user?.[rolesClaim]?.[0] : "(claim not configured)"}
      </p>

      <h1>User Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <button onClick={logout}>Logout</button>
    </>
  );
}

export default App;
