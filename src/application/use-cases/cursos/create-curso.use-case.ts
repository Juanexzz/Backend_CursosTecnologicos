import { ICursoRepository } from "../../../domain/repositories/curso.repository.interface.js";
import { Curso } from "../../../domain/entities/curso.entity.js";
import { ConflictError } from "../../errors/application-errors.js";

export type CreateCursoInput = Omit<Curso, "id" | "createdAt" | "updatedAt">;

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export class CreateCursoUseCase {
  constructor(private readonly cursoRepository: ICursoRepository) {}

  async execute(input: CreateCursoInput): Promise<Curso> {
    const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.titulo);

    const existingSlug = await this.cursoRepository.findBySlug(slug);
    if (existingSlug) {
      throw new ConflictError("Ya existe un curso con un título o slug idéntico", [
        { field: "slug", message: "Este slug ya está en uso por otro curso" }
      ]);
    }

    return this.cursoRepository.create({
      ...input,
      slug
    });
  }
}
