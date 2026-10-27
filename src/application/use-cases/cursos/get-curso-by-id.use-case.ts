import { ICursoRepository } from "../../../domain/repositories/curso.repository.interface.js";
import { Curso } from "../../../domain/entities/curso.entity.js";
import { NotFoundError } from "../../errors/application-errors.js";

export class GetCursoByIdUseCase {
  constructor(private readonly cursoRepository: ICursoRepository) {}

  async execute(idOrSlug: string | number): Promise<Curso> {
    let curso: Curso | null = null;

    if (typeof idOrSlug === "number" || !isNaN(Number(idOrSlug))) {
      curso = await this.cursoRepository.findById(Number(idOrSlug));
    } else {
      curso = await this.cursoRepository.findBySlug(idOrSlug);
    }

    if (!curso) {
      throw new NotFoundError("El curso solicitado no existe en la plataforma");
    }

    return curso;
  }
}
