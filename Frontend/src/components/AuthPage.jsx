import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const initialSignup = {
  fullName: "",
  email: "",
  password: "",
  role: "student",
};

const initialLogin = {
  email: "",
  password: "",
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [signupForm, setSignupForm] = useState(initialSignup);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (mode === "login") {
        await login(loginForm);
      } else {
        await signup(signupForm);
      }
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#020617_0%,#0f172a_38%,#1e293b_100%)] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.22),transparent_45%),radial-gradient(circle_at_88%_78%,rgba(251,191,36,0.16),transparent_45%)]" />

      <section className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <aside className="rounded-2xl border border-cyan-200/30 bg-slate-900/70 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.65)] backdrop-blur-md sm:p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
            ThermoLabs Access Portal
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
            Run Guided Thermodynamics Experiments.
          </h1>
          <p className="mt-5 max-w-lg text-sm text-slate-300 sm:text-base">
            Sign in as a professor or student. Students can launch the
            Joule-Thomson simulator directly from their dashboard.
          </p>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-300/20 bg-slate-900/85 p-6 shadow-[0_16px_55px_rgba(2,6,23,0.55)] backdrop-blur-lg sm:p-8"
        >
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-800/75 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-cyan-300 text-slate-900"
                  : "text-slate-200 hover:bg-slate-700"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-amber-300 text-slate-900"
                  : "text-slate-200 hover:bg-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === "signup" ? (
            <>
              <label className="mb-3 block text-sm text-slate-200">
                Full name
                <input
                  required
                  value={signupForm.fullName}
                  onChange={(event) =>
                    setSignupForm((prev) => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950/90 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300"
                  placeholder="Ada Lovelace"
                />
              </label>

              <label className="mb-3 block text-sm text-slate-200">
                Email
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(event) =>
                    setSignupForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950/90 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300"
                  placeholder="name@campus.edu"
                />
              </label>

              <label className="mb-3 block text-sm text-slate-200">
                Password
                <input
                  type="password"
                  minLength={6}
                  required
                  value={signupForm.password}
                  onChange={(event) =>
                    setSignupForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950/90 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300"
                />
              </label>

              <label className="mb-4 block text-sm text-slate-200">
                Role
                <select
                  value={signupForm.role}
                  onChange={(event) =>
                    setSignupForm((prev) => ({
                      ...prev,
                      role: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950/90 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                </select>
              </label>
            </>
          ) : (
            <>
              <label className="mb-3 block text-sm text-slate-200">
                Email
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950/90 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300"
                  placeholder="name@campus.edu"
                />
              </label>

              <label className="mb-4 block text-sm text-slate-200">
                Password
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950/90 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300"
                />
              </label>
            </>
          )}

          {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-300 to-emerald-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AuthPage;
