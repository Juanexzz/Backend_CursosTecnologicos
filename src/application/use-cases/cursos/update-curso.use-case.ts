import { ICursoRepository } from "../../../domain/repositories/curso.repository.interface.js";
import { Curso } from "../../../domain/entities/curso.entity.js";
import { NotFoundError } from "../../errors/application-errors.js";

export type UpdateCursoInput = Partial<Omit<Curso, "id" | "createdAt" | "updatedAt">>;

export class UpdateCursoUseCase {
  constructor(private readonly cursoRepository: ICursoRepository) {}

  async execute(id: number, input: UpdateCursoInput): Promise<Curso> {
    const existing = await this.cursoRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("El curso a actualizar no fue encontrado");
    }

    const updated = await this.cursoRepository.update(id, input);
    if (!updated) {
      throw new NotFoundError("No se pudo actualizar el curso");
    }

    return updated;
  }
}
