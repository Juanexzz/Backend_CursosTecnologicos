import { Prisma } from "@prisma/client";
import { ICursoRepository, CursoFilterOptions } from "../../domain/repositories/curso.repository.interface.js";
import { Curso } from "../../domain/entities/curso.entity.js";
import { prisma } from "../database/prisma.client.js";

export class PrismaCursoRepository implements ICursoRepository {
  async findAll(options: CursoFilterOptions): Promise<{ data: Curso[]; total: number }> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(50, Math.max(1, options.limit ?? 9));
    const skip = (page - 1) * limit;

    const where: Prisma.CursoWhereInput = {};

    if (options.categoria && options.categoria !== "all") {
      where.categoria = options.categoria;
    }

    if (options.q && options.q.trim().length > 0) {
      const search = options.q.trim();
      where.OR = [
        { titulo: { contains: search, mode: "insensitive" } },
        { descripcionCorta: { contains: search, mode: "insensitive" } },
        { tecnologias: { hasSome: [search] } }
      ];
    }

    if (options.precioMin !== undefined || options.precioMax !== undefined) {
      where.precio = {};
      if (options.precioMin !== undefined) {
        where.precio.gte = options.precioMin;
      }
      if (options.precioMax !== undefined) {
        where.precio.lte = options.precioMax;
      }
    }

    const [total, data] = await Promise.all([
      prisma.curso.count({ where }),
      prisma.curso.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ destacado: "desc" }, { id: "asc" }]
      })
    ]);

    return { total, data };
  }

  async findById(id: number): Promise<Curso | null> {
    return prisma.curso.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Curso | null> {
    return prisma.curso.findUnique({ where: { slug } });
  }

  async create(cursoData: Omit<Curso, "id" | "createdAt" | "updatedAt">): Promise<Curso> {
    return prisma.curso.create({
      data: {
        titulo: cursoData.titulo,
        slug: cursoData.slug,
        categoria: cursoData.categoria,
        categoriaNombre: cursoData.categoriaNombre,
        nivel: cursoData.nivel,
        duracionHoras: cursoData.duracionHoras,
        precio: cursoData.precio,
        calificacion: cursoData.calificacion,
        totalResenas: cursoData.totalResenas,
        estudiantes: cursoData.estudiantes,
        instructorNombre: cursoData.instructorNombre,
        instructorEspecialidad: cursoData.instructorEspecialidad,
        instructorAvatar: cursoData.instructorAvatar,
        instructorBio: cursoData.instructorBio,
        destacado: cursoData.destacado,
        imagen: cursoData.imagen,
        tecnologias: cursoData.tecnologias,
        descripcionCorta: cursoData.descripcionCorta,
        descripcionLarga: cursoData.descripcionLarga,
        requisitos: cursoData.requisitos,
        temario: cursoData.temario
      }
    });
  }

  async update(id: number, cursoData: Partial<Omit<Curso, "id" | "createdAt" | "updatedAt">>): Promise<Curso | null> {
    const existing = await prisma.curso.findUnique({ where: { id } });
    if (!existing) return null;

    return prisma.curso.update({
      where: { id },
      data: cursoData
    });
  }

  async delete(id: number): Promise<boolean> {
    const existing = await prisma.curso.findUnique({ where: { id } });
    if (!existing) return false;

    await prisma.curso.delete({ where: { id } });
    return true;
  }
}
