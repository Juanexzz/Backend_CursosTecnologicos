import express, { Express } from "express";
import cors from "cors";
import { createAuthRouter } from "./routes/auth.routes.js";
import { createCursoRouter } from "./routes/curso.routes.js";
import { createInscripcionRouter } from "./routes/inscripcion.routes.js";
import { createHealthRouter } from "./routes/health.routes.js";
import { errorHandler } from "./middlewares/error.handler.js";

export function createApp(): Express {
  const app = express();

  // Configuración de CORS segura (no '*')
  const allowedOrigins = [
    process.env["FRONTEND_URL"] ?? "http://localhost:3000",
    "http://localhost:3000"
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Permitir peticiones sin origin (como Postman o curl) o en desarrollo
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
          callback(null, true);
        } else {
          callback(new Error("Origen no permitido por la política de CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );

  app.use(express.json());

  // Rutas bajo el prefijo /api
  app.use("/api/health", createHealthRouter());
  app.use("/api/auth", createAuthRouter());
  app.use("/api/cursos", createCursoRouter());
  app.use("/api/inscripciones", createInscripcionRouter());

  // Manejo de rutas inexistentes (404)
  app.use((_req, res) => {
    res.status(404).json({
      message: "Ruta no encontrada en la API de NexTech Academy."
    });
  });

  // Manejador centralizado de errores
  app.use(errorHandler);

  return app;
}
