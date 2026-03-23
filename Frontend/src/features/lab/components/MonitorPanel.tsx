import type { SimulationPoint } from "../types";
import { formatLarge, linePath } from "../utils";

type MonitorPanelProps = {
  latestPoint: SimulationPoint;
  timelinePercent: number;
  thermalPercent: number;
  inletPressurePercent: number;
  outletPressurePercent: number;
  temperatureSeries: number[];
  pressureSeries: number[];
  history: SimulationPoint[];
};

export const MonitorPanel = ({
  latestPoint,
  timelinePercent,
  thermalPercent,
  inletPressurePercent,
  outletPressurePercent,
  temperatureSeries,
  pressureSeries,
  history,
}: MonitorPanelProps) => {
  return (
    <article className="card monitor-card">
      <h2>Live Process View</h2>

      <div className="metric-grid">
        <div className="metric-card">
          <span>Simulation Time</span>
          <strong>{latestPoint.time.toFixed(2)} s</strong>
        </div>
        <div className="metric-card">
          <span>Inlet Pressure</span>
          <strong>
            {formatLarge(Math.round(latestPoint.inletPressure))} Pa
          </strong>
        </div>
        <div className="metric-card">
          <span>Temperature</span>
          <strong>{latestPoint.temperature.toFixed(2)} K</strong>
        </div>
        <div className="metric-card">
          <span>JT Coefficient</span>
          <strong>{latestPoint.muJT.toExponential(2)}</strong>
        </div>
      </div>

      <div className="timeline" aria-label="Simulation progress">
        <div
          className="timeline-fill"
          style={{ width: `${timelinePercent}%` }}
        />
      </div>

      <div className="visual-strip">
        <div className="visual-card">
          <p>Thermal Column</p>
          <div className="vertical-meter">
            <div
              className="vertical-meter-fill"
              style={{ height: `${thermalPercent}%` }}
            />
          </div>
          <span>{latestPoint.temperature.toFixed(1)} K</span>
        </div>

        <div className="visual-card">
          <p>Pressure Balance</p>
          <div className="horizontal-meter">
            <div
              className="horizontal-meter-fill inlet"
              style={{ width: `${inletPressurePercent}%` }}
            />
          </div>
          <div className="horizontal-meter">
            <div
              className="horizontal-meter-fill outlet"
              style={{ width: `${outletPressurePercent}%` }}
            />
          </div>
          <span>Inlet vs outlet reference</span>
        </div>
      </div>

      <div className="chart-grid">
        <section className="chart-card">
          <h3>Temperature Trend</h3>
          <svg viewBox="0 0 420 150" role="img" aria-label="Temperature chart">
            <path
              d={linePath(temperatureSeries, 420, 150)}
              className="line line-temp"
            />
          </svg>
        </section>

        <section className="chart-card">
          <h3>Pressure Trend</h3>
          <svg viewBox="0 0 420 150" role="img" aria-label="Pressure chart">
            <path
              d={linePath(pressureSeries, 420, 150)}
              className="line line-pressure"
            />
          </svg>
        </section>
      </div>

      <section className="table-wrap">
        <h3>Recent Readings</h3>
        <table>
          <thead>
            <tr>
              <th>t (s)</th>
              <th>Pressure (Pa)</th>
              <th>Temp (K)</th>
              <th>muJT</th>
            </tr>
          </thead>
          <tbody>
            {history
              .slice(-8)
              .reverse()
              .map((point) => (
                <tr key={`${point.time}-${point.inletPressure}`}>
                  <td>{point.time.toFixed(2)}</td>
                  <td>{formatLarge(Math.round(point.inletPressure))}</td>
                  <td>{point.temperature.toFixed(2)}</td>
                  <td>{point.muJT.toExponential(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </article>
  );
};
