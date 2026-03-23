import { useAuth0, User } from "@auth0/auth0-react";
import {
  PROFESSOR_ROLE_NAME,
  STUDENT_ROLE_NAME,
  getRoleValues,
  hasProfessorRole,
  hasStudentRole,
  roleIdFor,
  roleLabel,
  type RoleName,
} from "./auth/roles";
import {
  getStoredPreferredRole,
  setStoredPreferredRole,
} from "./auth/preferredRole";

function App() {
  const { isLoading, isAuthenticated, error, loginWithRedirect, logout, user } =
    useAuth0<User>();

  const roleValues = getRoleValues(user);
  const userHasProfessorRole = hasProfessorRole(roleValues);
  const userHasStudentRole = hasStudentRole(roleValues);
  const hasKnownRole = userHasProfessorRole || userHasStudentRole;

  const preferredRole = getStoredPreferredRole();
  const showProfessorRole =
    userHasProfessorRole ||
    (!hasKnownRole && preferredRole === PROFESSOR_ROLE_NAME);
  const showStudentRole =
    userHasStudentRole ||
    (!hasKnownRole && preferredRole === STUDENT_ROLE_NAME);

  const startAuth = (role: RoleName, signupMode: boolean) => {
    setStoredPreferredRole(role);
    const roleId = roleIdFor(role);

    const authorizationParams = {
      ...(signupMode ? { screen_hint: "signup" } : {}),
      selected_role: role,
      selected_role_id: roleId,
    };

    loginWithRedirect({
      appState: { selectedRole: role },
      authorizationParams,
    });
  };

  const handleLogout = () =>
    logout({
      logoutParams: { returnTo: window.location.origin },
    });

  if (isLoading) return <p>Loading...</p>;

  return isAuthenticated ? (
    <>
      <p>Logged in as {user?.email}</p>

      <h2>Assigned Roles</h2>
      {showProfessorRole || showStudentRole ? (
        <ul>
          {showProfessorRole && <li>Professor</li>}
          {showStudentRole && <li>Student</li>}
        </ul>
      ) : (
        <p>
          No supported role found. Assign the user one of these roles in Auth0:
          professor or student.
        </p>
      )}

      {!hasKnownRole && preferredRole && (
        <p>
          Using selected role from login: {roleLabel(preferredRole)}. Configure
          an Auth0 Action to include role claims in tokens for strict role
          enforcement.
        </p>
      )}

      {showProfessorRole && (
        <section>
          <h3>Professor Panel</h3>
          <p>Professor-only tools can be rendered here.</p>
        </section>
      )}

      {showStudentRole && (
        <section>
          <h3>Student Panel</h3>
          <p>Student-only tools can be rendered here.</p>
        </section>
      )}

      <h1>User Profile</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <button onClick={handleLogout}>Logout</button>
    </>
  ) : (
    <>
      {error && <p>Error: {error.message}</p>}

      <h2>Choose Your Role</h2>
      <p>Select how you want to continue:</p>

      <button onClick={() => startAuth(PROFESSOR_ROLE_NAME, false)}>
        Login as Professor
      </button>

      <button onClick={() => startAuth(STUDENT_ROLE_NAME, false)}>
        Login as Student
      </button>

      <button onClick={() => startAuth(PROFESSOR_ROLE_NAME, true)}>
        Signup as Professor
      </button>

      <button onClick={() => startAuth(STUDENT_ROLE_NAME, true)}>
        Signup as Student
      </button>
    </>
  );
}

export default App;
