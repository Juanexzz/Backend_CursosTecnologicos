/**
 * Interfaz del repositorio de imágenes de cursos.
 * La capa de dominio define el contrato; la implementación concreta vive en infrastructure.
 */
export interface IImagenCursoRepository {
  /**
   * Crea o actualiza la fila de imagen para el curso dado.
   * Si ya existe una imagen para ese cursoId, la reemplaza.
   */
  upsert(cursoId: number, datos: Buffer, mimeType: string): Promise<void>;

  /**
   * Devuelve los bytes y el tipo MIME de la imagen, o null si no existe.
   */
  findByCursoId(cursoId: number): Promise<{ datos: Buffer; mimeType: string } | null>;
}
