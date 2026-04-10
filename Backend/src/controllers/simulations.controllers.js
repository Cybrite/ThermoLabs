import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Resolve project root paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..");
const SIMULATIONS_SRC = path.join(PROJECT_ROOT, "Simulations", "src");
const BUILD_DIR = path.join(PROJECT_ROOT, "Backend", "build");

// Joule-Thomson simulation is now handled via WebSocket (see websockets/jt-socket.js)

// Hello Test
// POST /simulate/hello
// Body: { x }
const helloTest = async (req, res) => {
    console.log("Hello test starting...");

    const { x } = req.body;

    if (x == null || isNaN(x) || x <= 0 || !Number.isInteger(Number(x))) {
        return res.status(400).json({
            success: false,
            error: "Please provide 'x' as a positive integer.",
        });
    }

    if (x > 10000) {
        return res.status(400).json({
            success: false,
            error: "'x' must be 10000 or less.",
        });
    }

    const helloCpp = path.join(SIMULATIONS_SRC, "hello.cpp");
    const outputExe = path.join(BUILD_DIR, "hello.exe");

    const compileCommand = `g++ "${helloCpp}" -o "${outputExe}"`;

    exec(compileCommand, (compileError, _compileStdout, compileStderr) => {
        if (compileError) {
            console.error("Compilation error:", compileStderr);
            return res.status(500).json({
                success: false,
                error: `Compilation failed: ${compileStderr}`,
            });
        }

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

export { helloTest };