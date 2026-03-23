import {
  PROFESSOR_ROLE_NAME,
  STUDENT_ROLE_NAME,
  type RoleName,
} from "../../../auth/roles";

type AuthLandingProps = {
  errorMessage?: string;
  onStartAuth: (role: RoleName, signupMode: boolean) => void;
};

export const AuthLanding = ({
  errorMessage,
  onStartAuth,
}: AuthLandingProps) => {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">ThermoLabs</p>
        <h1>Enter the Virtual Lab</h1>
        <p>
          Choose a role to access a guided thermodynamics experiment workspace.
        </p>

        {errorMessage && <p>Error: {errorMessage}</p>}

        <div className="auth-grid">
          <button
            className="btn"
            onClick={() => onStartAuth(PROFESSOR_ROLE_NAME, false)}
          >
            Login as Professor
          </button>

          <button
            className="btn"
            onClick={() => onStartAuth(STUDENT_ROLE_NAME, false)}
          >
            Login as Student
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => onStartAuth(PROFESSOR_ROLE_NAME, true)}
          >
            Signup as Professor
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => onStartAuth(STUDENT_ROLE_NAME, true)}
          >
            Signup as Student
          </button>
        </div>
      </section>
    </main>
  );
};
