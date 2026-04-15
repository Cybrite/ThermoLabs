/**
 * Joule-Thomson Simulation Engine (JavaScript port)
 * Authentic Chemical Engineering Literature Model (Nitrogen)
 * Reference: Smith, Van Ness, Abbott / Perry's Chemical Engineers' Handbook
 */

// Literature value for Nitrogen (N2) at ~300 K
// mu_JT approx 0.22 K/bar = 2.2e-6 K/Pa
const N2_MU_JT = 2.2e-6; 
const INITIAL_T = 300.0; // Standard room temperature (K)

class JTSimulation {
    /**
     * @param {number} P1 - Inlet pressure (Pa)
     * @param {number} P2 - Outlet pressure (Pa)
     */
    constructor(P1, P2) {
        this.dt = 1;                  // fixed time step (seconds)
        this.totalTime = 900;         // 15 minutes to reach steady state
        this.currentTime = 0;

        this.P1 = P1;
        this.P2 = P2;
        this.T = INITIAL_T;
        
        // Theoretical steady-state temperature after the throttle valve
        this.targetT = INITIAL_T + N2_MU_JT * (this.P2 - this.P1);
        
        // Convergence rate (k) tuned for 15 min. (e^-kt -> 0.01 over 900s implies k ~ 0.005)
        this.k = 0.005;
    }

    /**
     * Gaussian noise generator (Box-Muller transform).
     * @param {number} sigma - Standard deviation
     * @returns {number}
     */
    _noise(sigma = 0.05) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1 + 1e-9)) * Math.cos(2.0 * Math.PI * u2);
        return z * sigma;
    }

    /**
     * Advance the simulation by one time step (dt = 1s).
     * The thermometer slowly converges to the target theoretical T.
     * @returns {{ time: number, pressure: number, temperature: number }}
     */
    step() {
        if (this.currentTime >= this.totalTime) {
            return null; // simulation complete
        }

        // Exponential thermal convergence
        const dT = this.k * (this.targetT - this.T) * this.dt;
        this.T += dT;

        this.currentTime += this.dt;

        // Apply sensor noise only for reporting, internal state remains ideal
        const reportedT = this.T + this._noise(0.02);
        const reportedP1 = this.P1 + this._noise(500); // 500 Pa noise on a high pressure sensor

        return {
            time: this.currentTime,
            pressure: reportedP1, 
            temperature: reportedT,
        };
    }

    /**
     * Generate a packet of 5 data points (5 simulation steps).
     * @returns {{ dataPoints: Array, done: boolean }}
     */
    generatePacket() {
        const dataPoints = [];

        for (let i = 0; i < 5; i++) {
            const point = this.step();
            if (point === null) {
                break;
            }
            dataPoints.push(point);
        }

        return {
            dataPoints,
            done: this.currentTime >= this.totalTime,
        };
    }

    /**
     * Update P1 and P2 mid-session.
     * The target temperature shifts immediately, and the current T 
     * begins converging toward the new target.
     * @param {number} newP1 - New inlet pressure (Pa)
     * @param {number} newP2 - New outlet pressure (Pa)
     */
    updatePressures(newP1, newP2) {
        this.P1 = newP1;
        this.P2 = newP2;
        this.targetT = INITIAL_T + N2_MU_JT * (newP2 - newP1);
    }

    /**
     * Return the current final state snapshot.
     * @returns {{ time: number, pressure: number, temperature: number }}
     */
    getFinalState() {
        return {
            time: this.currentTime,
            pressure: this.P1 + this._noise(500),
            temperature: this.T + this._noise(0.02),
        };
    }

    /** Whether the simulation has completed its full duration. */
    get isComplete() {
        return this.currentTime >= this.totalTime;
    }
}

export { JTSimulation };
