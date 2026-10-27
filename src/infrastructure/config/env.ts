/**
 * Validación de variables de entorno al arrancar.
 * Falla rápido con mensaje claro si falta algo crítico.
 * CORS_ORIGIN acepta lista separada por comas → el servidor usa SOLO esa lista (nunca *).
 */

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(65535))
    .default("4000"),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL es obligatoria"),

  DIRECT_URL: z
    .string()
    .min(1, "DIRECT_URL es obligatoria para migraciones y pooling directo")
    .optional(),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET debe tener al menos 32 caracteres"),

  JWT_EXPIRES_IN: z
    .string()
    .default("24h"),

  // Lista de orígenes permitidos separada por comas (ej: "http://localhost:3000,https://mi-app.vercel.app")
  CORS_ORIGIN: z
    .string()
    .min(1, "CORS_ORIGIN es obligatoria; usa una lista separada por comas"),

  PUBLIC_API_URL: z
    .string()
    .url("PUBLIC_API_URL debe ser una URL válida")
    .optional(),
});

function parseEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const messages = result.error.errors
      .map((e) => `  [${e.path.join(".")}] ${e.message}`)
      .join("\n");

    console.error(
      `\n[NexTech API] ❌ Variables de entorno inválidas:\n${messages}\n` +
        `Copia .env.example a .env y completa los valores reales.\n`
    );
    process.exit(1);
  }

  return result.data;
}

export const env = parseEnv();

/** Lista de orígenes CORS parseada a partir de CORS_ORIGIN (separado por comas) */
export const allowedOrigins: string[] = env.CORS_ORIGIN.split(",")
  .map((o) => o.trim())
  .filter((o) => o.length > 0);
