import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { createAuthMiddleware } from "../src/interface/http/middlewares/auth.middleware.js";
import { requireRole } from "../src/interface/http/middlewares/role.middleware.js";
import { ITokenService, TokenPayload } from "../src/domain/services/token-service.interface.js";

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
