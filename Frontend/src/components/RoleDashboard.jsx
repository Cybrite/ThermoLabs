import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const experiments = [
  {
    id: "jt",
    title: "Joule-Thomson Experiment",
    description:
      "Explore how gas expansion through control valves influences pressure and temperature.",
    route: "/lab/joule-thomson",
  },
];

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-50">
        Available Experiments
      </h2>
      <div className="grid gap-4">
        {experiments.map((experiment) => (
          <article
            key={experiment.id}
            className="rounded-xl border border-emerald-300/35 bg-slate-900/70 p-5 shadow-[0_14px_40px_rgba(2,6,23,0.45)]"
          >
            <h3 className="text-lg font-semibold text-emerald-200">
              {experiment.title}
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              {experiment.description}
            </p>
            <button
              onClick={() => navigate(experiment.route)}
              className="mt-4 rounded-md bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-200"
            >
              Open Lab
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

const ProfessorDashboard = () => (
  <section className="space-y-4">
    <h2 className="text-2xl font-semibold text-slate-50">
      Professor Dashboard
    </h2>
    <div className="rounded-xl border border-amber-300/35 bg-slate-900/70 p-5 shadow-[0_14px_40px_rgba(2,6,23,0.45)]">
      <p className="text-sm text-slate-200">
        You are logged in as a professor. This area is reserved for instructor
        controls, class experiment tracking, and assignment setup.
      </p>
      <p className="mt-3 text-sm text-amber-200/90">
        Student lab access remains available through student accounts.
      </p>
    </div>
  </section>
);

const RoleDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#0f172a,#020617_55%,#000814)] px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-400/30 bg-slate-900/75 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.55)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/85">
              ThermoLabs
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              Welcome, {user?.fullName}
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Logged in as{" "}
              <span className="font-semibold text-emerald-200">
                {user?.role}
              </span>
            </p>
          </div>
          <button
            onClick={logout}
            className="self-start rounded-lg border border-slate-500 px-4 py-2 text-sm text-slate-100 transition hover:border-rose-300 hover:text-rose-200"
          >
            Logout
          </button>
        </header>

        {user?.role === "professor" ? (
          <ProfessorDashboard />
        ) : (
          <StudentDashboard />
        )}
      </div>
    </main>
  );
};

export default RoleDashboard;
