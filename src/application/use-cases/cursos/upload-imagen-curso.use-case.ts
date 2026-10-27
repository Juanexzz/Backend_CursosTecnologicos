import { ICursoRepository } from "../../../domain/repositories/curso.repository.interface.js";
import { IImagenCursoRepository } from "../../../domain/repositories/imagen-curso.repository.interface.js";
import { NotFoundError } from "../../../domain/errors/domain-errors.js";

export interface UploadImagenInput {
  cursoId: number;
  datos: Buffer;
  mimeType: string;
  publicApiUrl: string;
}

export class UploadImagenCursoUseCase {
  constructor(
    private readonly cursoRepository: ICursoRepository,
    private readonly imagenRepository: IImagenCursoRepository
  ) {}

  async execute(input: UploadImagenInput): Promise<{ imagen: string }> {
    const curso = await this.cursoRepository.findById(input.cursoId);
    if (!curso) {
      throw new NotFoundError("Curso no encontrado");
    }

    // Guarda (o actualiza) los bytes en la tabla imagenes_curso
    await this.imagenRepository.upsert(input.cursoId, input.datos, input.mimeType);

    // La URL absoluta que quedará guardada en cursos.imagen
    const imagenUrl = `${input.publicApiUrl}/api/cursos/${input.cursoId}/imagen`;

    // Actualiza el campo imagen del curso con la URL absoluta
    await this.cursoRepository.update(input.cursoId, { imagen: imagenUrl });

    return { imagen: imagenUrl };
  }
}
