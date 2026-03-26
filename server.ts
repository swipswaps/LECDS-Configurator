import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route for simulation
  app.post("/api/simulate", async (req, res) => {
    const params = req.body;

    // Input validation
    if (!params || typeof params.fabricPermeability !== "number") {
      return res.status(400).json({ error: "Invalid parameters" });
    }

    // Mock CFD Simulation Logic (based on the user's provided logic)
    // In a real environment, this would call OpenFOAM via Docker.
    try {
      // Simulate some processing time
      await new Promise((resolve) => setTimeout(resolve, 500));

      const {
        hydrogelType = "PNIPAM_PAM",
        fabricPermeability = 1e-9,
        pcmLoading = 15,
        saltPercent = 5,
        vacuumKPa = 40,
      } = params;

      // Base constants from project literature
      const baseDeltaT = 15; // °C without enhancements
      const vacuumFactor = (101 - vacuumKPa) / 60;
      const saltBPEFactor = 1 + saltPercent * 0.08;
      const pcmFactor = 1 + (pcmLoading / 100) * 0.4;
      
      // Compute final values
      let deltaT = baseDeltaT * vacuumFactor * saltBPEFactor * pcmFactor;
      deltaT = Math.min(25, Math.max(8, deltaT));

      const distillateYield = Math.max(0.7, 1.2 * ((101 - vacuumKPa) / 30) * (1 + saltPercent * 0.08));
      const efficiencyGain = Math.min(18, Math.max(4, 8 * (deltaT / 15)));
      const pvhiMitigation = Math.min(3, Math.max(0.8, deltaT * 0.12));

      // Generate temperature profile (20 cm channel, 21 points)
      const tempProfile = [];
      for (let i = 0; i <= 20; i += 1) {
        let t = 75 - deltaT * (i / 20);
        // Zone modulation
        if (i > 12 && i < 16) t += 3; // wicking zone
        if (i >= 16) t += 6; // hydrophobic diode
        tempProfile.push({ pos: i, temp: Math.max(45, t) });
      }

      res.json({
        deltaT,
        distillateYield,
        efficiencyGain,
        pvhiMitigation,
        tempProfile,
      });
    } catch (err: any) {
      console.error("Simulation failure:", err.message);
      res.status(500).json({ error: "Simulation failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 LECDS Backend ready at http://localhost:${PORT}`);
  });
}

startServer();
