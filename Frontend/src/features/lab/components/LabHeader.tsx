import { roleLabel, type RoleName } from "../../../auth/roles";
import { statusClass, statusLabel } from "../utils";
import type { BackendStatus } from "../types";

type LabHeaderProps = {
  userEmail: string | undefined;
  roleName: string;
  backendStatus: BackendStatus;
  backendMessage: string;
  hasKnownRole: boolean;
  preferredRole: RoleName | null;
  onLogout: () => void;
};

export const LabHeader = ({
  userEmail,
  roleName,
  backendStatus,
  backendMessage,
  hasKnownRole,
  preferredRole,
  onLogout,
}: LabHeaderProps) => {
  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">ThermoLabs Virtual Experiment</p>
          <h1>Joule-Thomson Interactive Workbench</h1>
          <p className="subtitle">
            Logged in as {userEmail} with {roleName} access
          </p>
        </div>
        <div className="status-grid">
          <span className={statusClass(backendStatus)}>
            {statusLabel(backendStatus)}
          </span>
          <span className="status-pill status-pill-note">{backendMessage}</span>
          <button className="btn btn-ghost" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {!hasKnownRole && preferredRole && (
        <section className="notice">
          Using selected role from login: {roleLabel(preferredRole)}. Assign
          actual Auth0 role claims for strict production authorization.
        </section>
      )}
    </>
  );
};
