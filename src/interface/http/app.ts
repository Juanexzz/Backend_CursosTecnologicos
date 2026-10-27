import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { allowedOrigins } from "../../infrastructure/config/env.js";
import { createAuthRouter } from "./routes/auth.routes.js";
import { createCursoRouter } from "./routes/curso.routes.js";
import { createInscripcionRouter } from "./routes/inscripcion.routes.js";
import { createHealthRouter } from "./routes/health.routes.js";
import { errorHandler } from "./middlewares/error.handler.js";

export function createApp(): Express {
  const app = express();

  // Helmet: cabeceras de seguridad HTTP; crossOriginResourcePolicy en cross-origin
  // para que las imágenes SVG puedan ser servidas a otro dominio (frontend en Vercel)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS: SOLO los orígenes de CORS_ORIGIN (nunca *)
  app.use(
    cors({
      origin: (origin, callback) => {
        // Peticiones sin origin (Postman, curl) solo en no-producción
        if (!origin) {
          callback(null, process.env["NODE_ENV"] !== "production");
          return;
        }
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origen no permitido por la política de CORS: ${origin}`));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Límite razonable para el body JSON (evita ataques de payload gigante)
  app.use(express.json({ limit: "1mb" }));

  // Rutas bajo el prefijo /api
  app.use("/api/health", createHealthRouter());
  app.use("/api/auth", createAuthRouter());
  app.use("/api/cursos", createCursoRouter());
  app.use("/api/inscripciones", createInscripcionRouter());

  // Respuesta JSON 404 para rutas desconocidas
  app.use((_req, res) => {
    res.status(404).json({
      message: "Ruta no encontrada en la API de NexTech Academy.",
    });
  });

  // Manejador centralizado de errores (siempre al final)
  app.use(errorHandler);

  return app;
}

