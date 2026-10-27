import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Carga las variables de entorno del archivo .env antes de correr los tests
    // Esto asegura que JWT_SECRET esté disponible para los tests de supertest
    // sin necesidad de conectar a la base de datos real.
    env: {
      // JWT_SECRET mínimo para tests — no es el secreto de producción
      JWT_SECRET: process.env["JWT_SECRET"] ?? "test-secret-de-al-menos-32-caracteres-ok!!",
      JWT_EXPIRES_IN: process.env["JWT_EXPIRES_IN"] ?? "1h",
      // NODE_ENV test para que el módulo env.ts no falle en validación
      NODE_ENV: "test",
      // Evitamos que env.ts muera por falta de DATABASE_URL o CORS_ORIGIN en tests unitarios
      DATABASE_URL: process.env["DATABASE_URL"] ?? "postgresql://test:test@localhost:5432/test",
      CORS_ORIGIN: process.env["CORS_ORIGIN"] ?? "http://localhost:3000",
      PUBLIC_API_URL: process.env["PUBLIC_API_URL"] ?? "http://localhost:4000",
    },
  },
});
