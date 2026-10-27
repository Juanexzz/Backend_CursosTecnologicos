import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app.js";

const PORT = Number(process.env["PORT"] ?? 4000);
const app = createApp();

app.listen(PORT, () => {
  console.log(`[NexTech API] Servidor iniciado y escuchando en el puerto ${PORT}`);
  console.log(`[NexTech API] Endpoint de salud: http://localhost:${PORT}/api/health`);
});
