import { Request, Response, NextFunction } from "express";
import { UploadImagenCursoUseCase } from "../../../application/use-cases/cursos/upload-imagen-curso.use-case.js";
import { IImagenCursoRepository } from "../../../domain/repositories/imagen-curso.repository.interface.js";
import { NotFoundError } from "../../../domain/errors/domain-errors.js";
import { env } from "../../../infrastructure/config/env.js";

export class ImagenCursoController {
  constructor(
    private readonly uploadImagenUseCase: UploadImagenCursoUseCase,
    private readonly imagenRepository: IImagenCursoRepository
  ) {}

  /**
   * POST /api/cursos/:id/imagen
   * Solo admin. Multipart con campo "imagen".
   * Guarda bytes en PostgreSQL y actualiza cursos.imagen con la URL absoluta.
   */
  upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cursoId = Number(req.params["id"]);
      const file = req.file!; // garantizado por uploadImagenMiddleware

      const publicApiUrl = env.PUBLIC_API_URL ?? `http://localhost:${env.PORT}`;

      const result = await this.uploadImagenUseCase.execute({
        cursoId,
        datos: file.buffer,
        mimeType: file.mimetype,
        publicApiUrl,
      });

      res.status(200).json({
        message: "Imagen subida correctamente.",
        imagen: result.imagen,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/cursos/:id/imagen
   * Público. Devuelve los bytes con Content-Type correcto y Cache-Control.
   */
  serve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cursoId = Number(req.params["id"]);
      const row = await this.imagenRepository.findByCursoId(cursoId);

      if (!row) {
        throw new NotFoundError("Este curso no tiene imagen subida.");
      }

      res.setHeader("Content-Type", row.mimeType);
      // 7 días en CDN / proxies, 1 día en el navegador
      res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800");
      res.send(row.datos);
    } catch (error) {
      next(error);
    }
  };
}
