import heroImg from "./assets/hero.png";

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10 sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(46,196,182,0.14),transparent_44%),radial-gradient(circle_at_85%_10%,rgba(255,159,28,0.16),transparent_38%),radial-gradient(circle_at_50%_95%,rgba(58,134,255,0.18),transparent_42%)]" />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_20px_80px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-10">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <p className="inline-flex rounded-full border border-slate-300/70 bg-white/80 px-4 py-1 text-xs font-semibold tracking-[0.22em] text-slate-600 uppercase">
              THERMAL SYSTEMS LAB
            </p>
            <h1 className="text-balance text-4xl leading-tight font-semibold text-slate-900 sm:text-5xl lg:text-6xl">
              Simulate. Analyze. Optimize thermodynamic behavior.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              ThermoLabs gives you a clean workspace for Joule-Thomson and
              process simulation workflows, with fast iteration and clear
              experiment tracking.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
                Start Simulation
              </button>
              <button className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400">
                View Docs
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0">
            <div className="absolute -inset-4 -z-10 rounded-[2.1rem] bg-[conic-gradient(from_220deg,rgba(58,134,255,0.35),rgba(46,196,182,0.2),rgba(255,159,28,0.3),rgba(58,134,255,0.35))] blur-2xl" />
            <div className="rounded-[2rem] border border-slate-200/70 bg-slate-950 p-4 shadow-2xl">
              <img
                src={heroImg}
                alt="ThermoLabs core simulation block"
                className="w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Real-time Inputs
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Change pressure, inlet temperature, and fluid assumptions
              instantly without rebuilding the workflow.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Process Insights
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Surface turning points and coefficient shifts quickly so you can
              validate behavior before deployment.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Lab-ready Output
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Keep results in a structured format for reports, regression
              checks, and experimental comparison.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}

export default App;
