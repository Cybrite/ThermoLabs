import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Resolve project root paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..");
const SIMULATIONS_SRC = path.join(PROJECT_ROOT, "Simulations", "src");
const SIMULATIONS_INCLUDE = path.join(PROJECT_ROOT, "Simulations", "include");
const BUILD_DIR = path.join(PROJECT_ROOT, "Backend", "src", "build");

// ─── Test Route ──────────────────────────────────────────────────────────────
const testRoute = async (req, res) => {
    console.log("test working");

    return res.status(200).json({
        success: true,
        message: "Test route working successfully",
    });
};

// ─── Joule-Thomson Simulation ────────────────────────────────────────────────
// POST /simulate/jt
// Body: { P1, P2, T, dt, totalTime }
const simulateJT = async (req, res) => {
    console.log("Joule-Thomson simulation starting...");

    const { P1, P2, T, dt, totalTime } = req.body;

    // Validate required parameters
    if (P1 == null || P2 == null || T == null || dt == null || totalTime == null) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters. Provide P1, P2, T, dt, totalTime.",
        });
    }

    const mainCpp = path.join(SIMULATIONS_SRC, "main.cpp");
    const jtCpp = path.join(SIMULATIONS_SRC, "joule_thompson.cpp");
    const outputExe = path.join(BUILD_DIR, "jt_sim.exe");

    // Compile: main.cpp + joule_thompson.cpp with include path
    const compileCommand = `g++ "${mainCpp}" "${jtCpp}" -I"${SIMULATIONS_INCLUDE}" -o "${outputExe}"`;

    exec(compileCommand, (compileError, _compileStdout, compileStderr) => {
        if (compileError) {
            console.error("Compilation error:", compileStderr);
            return res.status(500).json({
                success: false,
                error: `Compilation failed: ${compileStderr}`,
            });
        }

        // Run the compiled executable with simulation parameters
        const runCommand = `"${outputExe}" ${P1} ${P2} ${T} ${dt} ${totalTime}`;

        exec(runCommand, (runError, stdout, runStderr) => {
            if (runError) {
                console.error("Execution error:", runStderr);
                return res.status(500).json({
                    success: false,
                    error: `Execution failed: ${runStderr}`,
                });
            }

            // Parse the tab-separated output into structured data
            const lines = stdout.trim().split("\n");
            const simulationData = [];

            // Skip the header line (index 0) and parse data rows
            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].trim().split(/\s+/);
                if (parts.length >= 3) {
                    simulationData.push({
                        time: parseFloat(parts[0]),
                        pressure: parseFloat(parts[1]),
                        temperature: parseFloat(parts[2]),
                    });
                }
            }

            // Extract final state from the last lines
            const finalPressureLine = lines.find((l) => l.includes("Pressure:"));
            const finalTempLine = lines.find((l) => l.includes("Temperature:"));

            const finalState = {
                pressure: finalPressureLine
                    ? parseFloat(finalPressureLine.split(":")[1])
                    : null,
                temperature: finalTempLine
                    ? parseFloat(finalTempLine.split(":")[1])
                    : null,
            };

            console.log("Simulation completed successfully.");

            res.status(200).json({
                success: true,
                data: simulationData,
                finalState,
                rawOutput: stdout,
            });
        });
    });
};

// ─── Hello Test (prints "hello" x times) ─────────────────────────────────────
// POST /simulate/hello
// Body: { x }
const helloTest = async (req, res) => {
    console.log("Hello test starting...");

    const { x } = req.body;

    // Validate input
    if (x == null || isNaN(x) || x <= 0 || !Number.isInteger(Number(x))) {
        return res.status(400).json({
            success: false,
            error: "Please provide 'x' as a positive integer.",
        });
    }

    // Cap x to prevent abuse
    if (x > 10000) {
        return res.status(400).json({
            success: false,
            error: "'x' must be 10000 or less.",
        });
    }

    const helloCpp = path.join(SIMULATIONS_SRC, "hello.cpp");
    const outputExe = path.join(BUILD_DIR, "hello.exe");

    // Compile the hello.cpp file
    const compileCommand = `g++ "${helloCpp}" -o "${outputExe}"`;

    exec(compileCommand, (compileError, _compileStdout, compileStderr) => {
        if (compileError) {
            console.error("Compilation error:", compileStderr);
            return res.status(500).json({
                success: false,
                error: `Compilation failed: ${compileStderr}`,
            });
        }

        // Run the compiled executable with x as argument
        const runCommand = `"${outputExe}" ${x}`;

        exec(runCommand, (runError, stdout, runStderr) => {
            if (runError) {
                console.error("Execution error:", runStderr);
                return res.status(500).json({
                    success: false,
                    error: `Execution failed: ${runStderr}`,
                });
            }

            const lines = stdout.trim().split("\n").map((l) => l.trim());

            console.log("Hello test completed successfully.");

            res.status(200).json({
                success: true,
                count: parseInt(x),
                output: lines,
                rawOutput: stdout,
            });
        });
    });
};

// ─── Legacy cpptest (kept for backward compatibility) ────────────────────────
const cpptest = async (req, res) => {
    console.log("cpp test running (legacy)");

    const { P1, P2, T, dt, totalTime } = req.body;

    const mainCpp = path.join(SIMULATIONS_SRC, "main.cpp");
    const jtCpp = path.join(SIMULATIONS_SRC, "joule_thompson.cpp");
    const outputExe = path.join(BUILD_DIR, "main.exe");

    const compileCommand = `g++ "${mainCpp}" "${jtCpp}" -I"${SIMULATIONS_INCLUDE}" -o "${outputExe}"`;
    const runCommand = `"${outputExe}" ${P1} ${P2} ${T} ${dt} ${totalTime}`;

    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
            return res.status(500).json({ error: compileStderr });
        }
        exec(runCommand, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({ error: stderr });
            }
            const lines = stdout.split("\n");
            let data = [];
            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].trim().split(/\s+/);
                data.push(parts);
            }
            res.status(200).json({
                success: true,
                data,
            });
        });
    });
};

export { testRoute, cpptest, simulateJT, helloTest };