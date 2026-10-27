import { IUserRepository } from "../../domain/repositories/user.repository.interface.js";
import { User, UserRole } from "../../domain/entities/user.entity.js";
import { prisma } from "../database/prisma.client.js";

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
    const record = await prisma.user.create({
      data: {
        nombre: userData.nombre.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        role: userData.role ?? "user"
      }
    });

    return {
      ...record,
      role: record.role as UserRole
    };
  }
}
