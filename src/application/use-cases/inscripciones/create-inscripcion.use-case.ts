import { IInscripcionRepository } from "../../../domain/repositories/inscripcion.repository.interface.js";
import { ICursoRepository } from "../../../domain/repositories/curso.repository.interface.js";
import { Inscripcion } from "../../../domain/entities/inscripcion.entity.js";
import { NotFoundError, ConflictError } from "../../errors/application-errors.js";

export interface CreateInscripcionInput {
  userId: number; // Sale del token, NUNCA del body
  cursoId: number;
  telefono: string;
  nivel: string;
  motivacion: string;
}

export class CreateInscripcionUseCase {
  constructor(
    private readonly inscripcionRepository: IInscripcionRepository,
    private readonly cursoRepository: ICursoRepository
  ) {}

  async execute(input: CreateInscripcionInput): Promise<Inscripcion> {
    const curso = await this.cursoRepository.findById(input.cursoId);
    if (!curso) {
      throw new NotFoundError("El curso seleccionado para la inscripción no existe");
    }

    const existing = await this.inscripcionRepository.findByUserAndCurso(input.userId, input.cursoId);
    if (existing) {
      throw new ConflictError("Ya estás inscrito en este curso", [
        { field: "cursoId", message: "Ya existe una inscripción para este curso" }
      ]);
    }

    return this.inscripcionRepository.create({
      userId: input.userId,
      cursoId: input.cursoId,
      telefono: input.telefono.trim(),
      nivel: input.nivel.trim(),
      motivacion: input.motivacion.trim()
    });
  }
}
