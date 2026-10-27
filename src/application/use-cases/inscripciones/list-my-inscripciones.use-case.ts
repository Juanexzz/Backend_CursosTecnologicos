import { IInscripcionRepository } from "../../../domain/repositories/inscripcion.repository.interface.js";
import { Inscripcion } from "../../../domain/entities/inscripcion.entity.js";
import { PaginationMeta } from "../cursos/list-cursos.use-case.js";

export interface ListMyInscripcionesOutput {
  pagination: PaginationMeta;
  data: Inscripcion[];
}

export class ListMyInscripcionesUseCase {
  constructor(private readonly inscripcionRepository: IInscripcionRepository) {}

  async execute(userId: number, page = 1, limit = 9): Promise<ListMyInscripcionesOutput> {
    const currentPage = Math.max(1, page);
    const take = Math.min(50, Math.max(1, limit));

    const { total, data } = await this.inscripcionRepository.findByUserId(userId, currentPage, take);
    const totalPages = Math.ceil(total / take) || 1;

    return {
      pagination: {
        page: currentPage,
        limit: take,
        total,
        totalPages
      },
      data
    };
  }
}
