import { Prisma } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { User, UserRole } from "../../domain/entities/user.entity.js";
import { prisma } from "../database/prisma.client.js";
import {
  ConflictError,
  NotFoundError,
} from "../../domain/errors/domain-errors.js";

export class PrismaUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { id } });
    if (!record) return null;
    return {
      ...record,
      role: record.role as UserRole
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    if (!record) return null;
    return {
      ...record,
      role: record.role as UserRole
    };
  }

  async create(userData: {
    nombre: string;
    email: string;
    password: string;
    role?: "admin" | "user";
  }): Promise<User> {
    try {
      const record = await prisma.user.create({
        data: {
          nombre: userData.nombre.trim(),
          email: userData.email.toLowerCase().trim(),
          password: userData.password,
          role: userData.role ?? "user",
        },
      });
      return { ...record, role: record.role as UserRole };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new ConflictError(
          "El email ya se encuentra registrado",
          [{ field: "email", message: "Este email ya está registrado" }]
        );
      }
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        throw new NotFoundError("Usuario no encontrado");
      }
      throw err;
    }
  }
}
