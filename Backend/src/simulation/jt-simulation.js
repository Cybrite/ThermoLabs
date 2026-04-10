/**
 * Joule-Thomson Simulation Engine (JavaScript port)
 *
 * Mirrors the C++ JouleThomsonSimulation class logic.
 * Fixed parameters: dt = 1s, totalTime = 3600s (1 hour).
 */

/**
 * Determine the initial temperature from inlet and outlet pressures.
 * TODO: Replace with a real thermodynamic model.
 *
 * @param {number} P1 - Inlet pressure (Pa)
 * @param {number} P2 - Outlet pressure (Pa)
 * @returns {number} Initial temperature (K)
 */
function determineTemperature(P1, P2) {
    // Placeholder — always returns 300 K for now
    return 300;
}

class JTSimulation {
    /**
     * @param {number} P1 - Inlet pressure (Pa)
     * @param {number} P2 - Outlet pressure (Pa)
     */
    constructor(P1, P2) {
        this.dt = 1;                // fixed time step (seconds)
        this.totalTime = 3600;      // fixed total duration (seconds)
        this.currentTime = 0;

        this.P1 = P1;
        this.P2 = P2;
        this.T = determineTemperature(P1, P2);
        this.muJT = this._computeMuJT(this.T, this.P1);
    }

    /**
     * Gaussian noise generator (Box-Muller transform).
     * @param {number} sigma - Standard deviation (default 0.05)
     * @returns {number}
     */
    _noise(sigma = 0.05) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z * sigma;
    }

    /**
     * Joule-Thomson coefficient approximation.
     * Same formula as the C++ implementation.
     * @param {number} T - Temperature (K)
     * @param {number} P - Pressure (Pa)
     * @returns {number}
     */
    _computeMuJT(T, P) {
        return (1e-5) * (300.0 / T) * (P / 1e5);
    }

    /**
     * Advance the simulation by one time step (dt = 1s).
     * @returns {{ time: number, pressure: number, temperature: number }}
     */
    step() {
        if (this.currentTime >= this.totalTime) {
            return null; // simulation complete
        }

        const dP = (this.P2 - this.P1) * (this.dt / this.totalTime);
        this.muJT = this._computeMuJT(this.T, this.P1);

        let dT = this.muJT * dP;

        // Add noise
        dT += this._noise();
        const dPNoisy = dP + this._noise();

        this.T += dT;
        this.P1 += dPNoisy;
        this.currentTime += this.dt;

        return {
            time: this.currentTime,
            pressure: this.P1,
            temperature: this.T,
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
     * Update P1 and P2 mid-session. Timer continues; new values take effect
     * immediately on subsequent steps.
     * @param {number} newP1 - New inlet pressure (Pa)
     * @param {number} newP2 - New outlet pressure (Pa)
     */
    updatePressures(newP1, newP2) {
        this.P1 = newP1;
        this.P2 = newP2;
        this.T = determineTemperature(newP1, newP2);
        this.muJT = this._computeMuJT(this.T, this.P1);
    }

    /**
     * Return the current final state snapshot.
     * @returns {{ time: number, pressure: number, temperature: number }}
     */
    getFinalState() {
        return {
            time: this.currentTime,
            pressure: this.P1,
            temperature: this.T,
        };
    }

    /** Whether the simulation has completed its full duration. */
    get isComplete() {
        return this.currentTime >= this.totalTime;
    }
}

export { JTSimulation, determineTemperature };
