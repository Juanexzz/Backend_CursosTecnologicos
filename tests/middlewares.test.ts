import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { createAuthMiddleware } from "../src/interface/http/middlewares/auth.middleware.js";
import { requireRole } from "../src/interface/http/middlewares/role.middleware.js";
import { ITokenService, TokenPayload } from "../src/domain/services/token-service.interface.js";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { CursoController } from "../src/interface/http/controllers/curso.controller.js";
import { ImagenCursoController } from "../src/interface/http/controllers/imagen-curso.controller.js";

// Mockeamos el container para evitar que Prisma intente conectar a la BD en tests
vi.mock("../src/container.js", () => ({
  cursoController: {},
  imagenCursoController: {},
  inscripcionController: {},
  authController: {},
  tokenService: {},
}));

const { createCursoRouter } = await import("../src/interface/http/routes/curso.routes.js");

function buildTestToken(payload: TokenPayload): string {
  const secret = process.env["JWT_SECRET"] ?? "test-secret-de-al-menos-32-caracteres-ok!!";
  return jwt.sign(payload, secret, { algorithm: "HS256", expiresIn: "1h" });
}

function makeMockCursoController(): CursoController {
  return {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } as unknown as CursoController;
}

function makeMockImagenController(): ImagenCursoController {
  return {
    upload: vi.fn(),
    serve: vi.fn(),
  } as unknown as ImagenCursoController;
}

function buildTestApp() {
  const app = express();
  app.use(express.json());
  app.use(
    "/api/cursos",
    createCursoRouter(makeMockCursoController(), makeMockImagenController())
  );
  return app;
}

describe("Pruebas del AuthMiddleware", () => {
  it("debe responder 401 si no se envía la cabecera Authorization", () => {
    const middleware = createAuthMiddleware();
    const req = { headers: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("No se proporcionó token de autenticación")
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("debe responder 401 si el formato de la cabecera no es Bearer", () => {
    const middleware = createAuthMiddleware();
    const req = {
      headers: { authorization: "Basic token-invalido" }
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Formato de token inválido")
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("debe responder 401 si el token es inválido o expirado", () => {
    const mockTokenService: ITokenService = {
      generateToken: vi.fn(),
      verifyToken: vi.fn().mockImplementation(() => {
        throw new Error("Token expirado");
      })
    };

    const middleware = createAuthMiddleware(mockTokenService);
    const req = {
      headers: { authorization: "Bearer token-falso" }
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("El token es inválido o ha expirado")
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("debe inyectar el usuario en req.user y llamar a next() si el token es válido", () => {
    const expectedPayload: TokenPayload = { id: 10, role: "user" };
    const mockTokenService: ITokenService = {
      generateToken: vi.fn(),
      verifyToken: vi.fn().mockReturnValue(expectedPayload)
    };

    const middleware = createAuthMiddleware(mockTokenService);
    const req = {
      headers: { authorization: "Bearer token-valido" }
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(req.user).toEqual(expectedPayload);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("Pruebas del RoleMiddleware", () => {
  const soloAdmin = requireRole("admin");

  it("debe responder 401 si no hay usuario autenticado en la petición", () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    soloAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("No autenticado")
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("debe responder 403 si el rol del usuario no coincide con el requerido", () => {
    const req = { user: { id: 5, role: "user" } } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    soloAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Acceso denegado: se requieren permisos de administrador")
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("debe llamar a next() si el rol coincide con el requerido", () => {
    const req = { user: { id: 1, role: "admin" } } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    soloAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("debe permitir acceso a requireRole con múltiples roles permitidos", () => {
    const permitAll = requireRole("admin", "user");
    const req = { user: { id: 2, role: "user" } } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    permitAll(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/cursos/:id — autenticación y autorización", () => {
  const app = buildTestApp();

  it("debe responder 401 si no se envía token", async () => {
    const res = await request(app).delete("/api/cursos/1");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("debe responder 403 si el token pertenece a un usuario con rol 'user'", async () => {
    const token = buildTestToken({ id: 99, role: "user" });
    const res = await request(app)
      .delete("/api/cursos/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  });
});
