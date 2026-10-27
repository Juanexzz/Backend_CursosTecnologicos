import { ICursoRepository, CursoFilterOptions } from "../../../domain/repositories/curso.repository.interface.js";
import { Curso } from "../../../domain/entities/curso.entity.js";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListCursosOutput {
  pagination: PaginationMeta;
  data: Curso[];
}

export class ListCursosUseCase {
  constructor(private readonly cursoRepository: ICursoRepository) {}

  async execute(options: CursoFilterOptions): Promise<ListCursosOutput> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(50, Math.max(1, options.limit ?? 9));

    const { total, data } = await this.cursoRepository.findAll({
      ...options,
      page,
      limit
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      data
    };
  }
}
