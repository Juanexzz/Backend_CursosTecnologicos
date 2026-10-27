import { ICursoRepository } from "../../../domain/repositories/curso.repository.interface.js";
import { NotFoundError } from "../../errors/application-errors.js";

export class DeleteCursoUseCase {
  constructor(private readonly cursoRepository: ICursoRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.cursoRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("El curso a eliminar no existe");
    }

    const deleted = await this.cursoRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError("No se pudo eliminar el curso");
    }
  }
}
