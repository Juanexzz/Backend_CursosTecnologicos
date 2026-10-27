import "dotenv/config";
import { env } from "./infrastructure/config/env.js";
import { createApp } from "./interface/http/app.js";

const app = createApp();

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`[NexTech API] Servidor iniciado y escuchando en 0.0.0.0:${env.PORT}`);
  console.log(`[NexTech API] Endpoint de salud: http://localhost:${env.PORT}/api/health`);
});
