import { Prisma } from "@prisma/client";
import { IInscripcionRepository } from "../../domain/repositories/inscripcion.repository.interface.js";
import { Inscripcion } from "../../domain/entities/inscripcion.entity.js";
import { prisma } from "../database/prisma.client.js";
import {
  ConflictError,
  NotFoundError,
} from "../../domain/errors/domain-errors.js";

export class PrismaInscripcionRepository implements IInscripcionRepository {
  async findByUserAndCurso(userId: number, cursoId: number): Promise<Inscripcion | null> {
    const record = await prisma.inscripcion.findUnique({
      where: {
        userId_cursoId: { userId, cursoId }
      },
      include: {
        curso: true
      }
    });

    if (!record) return null;
    return record as Inscripcion;
  }

  async create(data: {
    userId: number;
    cursoId: number;
    telefono: string;
    nivel: string;
    motivacion: string;
  }): Promise<Inscripcion> {
    try {
      const record = await prisma.inscripcion.create({
        data: {
          userId: data.userId,
          cursoId: data.cursoId,
          telefono: data.telefono,
          nivel: data.nivel,
          motivacion: data.motivacion,
        },
        include: { curso: true },
      });
      return record as Inscripcion;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new ConflictError("Ya estás inscrito en este curso", [
            { field: "cursoId", message: "Ya existe una inscripción para este curso" },
          ]);
        }
        if (err.code === "P2003") {
          throw new ConflictError(
            "El curso o usuario indicado no existe",
            [{ field: "cursoId", message: "Referencia a curso o usuario inválida" }]
          );
        }
        if (err.code === "P2025") {
          throw new NotFoundError("Curso o usuario no encontrado");
        }
      }
      throw err;
    }
  }

  async findByUserId(userId: number, page = 1, limit = 9): Promise<{ data: Inscripcion[]; total: number }> {
    const currentPage = Math.max(1, page);
    const take = Math.min(50, Math.max(1, limit));
    const skip = (currentPage - 1) * take;

    const [total, records] = await Promise.all([
      prisma.inscripcion.count({ where: { userId } }),
      prisma.inscripcion.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          curso: true
        }
      })
    ]);

    return {
      total,
      data: records as Inscripcion[]
    };
  }

  async findAll(page = 1, limit = 9): Promise<{ data: Inscripcion[]; total: number }> {
    const currentPage = Math.max(1, page);
    const take = Math.min(50, Math.max(1, limit));
    const skip = (currentPage - 1) * take;

    const [total, records] = await Promise.all([
      prisma.inscripcion.count(),
      prisma.inscripcion.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          curso: true,
          user: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      })
    ]);

    return {
      total,
      data: records as Inscripcion[]
    };
  }
}
