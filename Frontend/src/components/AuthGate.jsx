import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthGate = ({ children, allowedRoles = null }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-100">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
          Loading session...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthGate;
