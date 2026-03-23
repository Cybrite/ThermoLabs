import type { Scenario, SimulationConfig } from "../types";

type ControlPanelProps = {
  simulationConfig: SimulationConfig;
  isRunning: boolean;
  showProfessorRole: boolean;
  quickScenarios: Scenario[];
  onUpdateConfig: (field: keyof SimulationConfig, value: number) => void;
  onToggleRun: () => void;
  onRunSingleStep: () => void;
  onResetSimulation: () => void;
  onApplyScenario: (config: SimulationConfig) => void;
};

export const ControlPanel = ({
  simulationConfig,
  isRunning,
  showProfessorRole,
  quickScenarios,
  onUpdateConfig,
  onToggleRun,
  onRunSingleStep,
  onResetSimulation,
  onApplyScenario,
}: ControlPanelProps) => {
  return (
    <article className="card controls-card">
      <h2>Experiment Controls</h2>
      <p>Adjust boundary conditions and run the simulated expansion cycle.</p>

      <div className="field-grid">
        <label>
          Inlet Pressure (Pa)
          <input
            type="number"
            min={10000}
            step={1000}
            value={simulationConfig.inletPressure}
            onChange={(event) =>
              onUpdateConfig(
                "inletPressure",
                Number(event.target.value) || 10000,
              )
            }
          />
        </label>

        <label>
          Outlet Pressure (Pa)
          <input
            type="number"
            min={10000}
            step={1000}
            value={simulationConfig.outletPressure}
            onChange={(event) =>
              onUpdateConfig(
                "outletPressure",
                Number(event.target.value) || 10000,
              )
            }
          />
        </label>

        <label>
          Temperature (K)
          <input
            type="number"
            min={150}
            step={1}
            value={simulationConfig.temperature}
            onChange={(event) =>
              onUpdateConfig("temperature", Number(event.target.value) || 150)
            }
          />
        </label>

        <label>
          Time Step (s)
          <input
            type="number"
            min={0.1}
            step={0.05}
            value={simulationConfig.timeStep}
            onChange={(event) =>
              onUpdateConfig("timeStep", Number(event.target.value) || 0.1)
            }
          />
        </label>

        <label>
          Total Time (s)
          <input
            type="number"
            min={2}
            step={1}
            value={simulationConfig.totalTime}
            onChange={(event) =>
              onUpdateConfig("totalTime", Number(event.target.value) || 2)
            }
          />
        </label>
      </div>

      <div className="button-row">
        <button className="btn" onClick={onToggleRun}>
          {isRunning ? "Pause" : "Run"}
        </button>
        <button className="btn btn-ghost" onClick={onRunSingleStep}>
          Step Once
        </button>
        <button className="btn btn-ghost" onClick={onResetSimulation}>
          Reset
        </button>
      </div>

      {showProfessorRole && (
        <>
          <h3>Professor Quick Scenarios</h3>
          <div className="scenario-grid">
            {quickScenarios.map((scenario) => (
              <button
                key={scenario.label}
                className="scenario-btn"
                onClick={() => onApplyScenario(scenario.values)}
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </>
      )}
    </article>
  );
};
