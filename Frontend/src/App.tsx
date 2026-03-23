import { useAuth0, User } from "@auth0/auth0-react";

function App() {
  const { isLoading, isAuthenticated, error, loginWithRedirect, logout, user } =
    useAuth0<User>();

  const signup = () =>
    loginWithRedirect({
      authorizationParams: { screen_hint: "signup" },
    });

  const handleLogout = () =>
    logout({
      logoutParams: { returnTo: window.location.origin },
    });

  if (isLoading) return <p>Loading...</p>;

  return isAuthenticated ? (
    <>
      <p>Logged in as {user?.email}</p>

      <h1>User Profile</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <button onClick={handleLogout}>Logout</button>
    </>
  ) : (
    <>
      {error && <p>Error: {error.message}</p>}

      <button onClick={signup}>Signup</button>

      <button onClick={() => loginWithRedirect()}>Login</button>
    </>
  );
}

export default App;
