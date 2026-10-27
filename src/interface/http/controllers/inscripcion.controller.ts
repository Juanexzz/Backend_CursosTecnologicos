import { Request, Response, NextFunction } from "express";
import { CreateInscripcionUseCase } from "../../../application/use-cases/inscripciones/create-inscripcion.use-case.js";
import { ListMyInscripcionesUseCase } from "../../../application/use-cases/inscripciones/list-my-inscripciones.use-case.js";
import { ListAllInscripcionesUseCase } from "../../../application/use-cases/inscripciones/list-all-inscripciones.use-case.js";
import { UnauthorizedError } from "../../../application/errors/application-errors.js";

export class InscripcionController {
  constructor(
    private readonly createInscripcionUseCase: CreateInscripcionUseCase,
    private readonly listMyInscripcionesUseCase: ListMyInscripcionesUseCase,
    private readonly listAllInscripcionesUseCase: ListAllInscripcionesUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Debes iniciar sesión para postularte a un curso");
      }

      const { cursoId, telefono, nivel, motivacion } = req.body as {
        cursoId: number;
        telefono: string;
        nivel: string;
        motivacion: string;
      };

      const inscripcion = await this.createInscripcionUseCase.execute({
        userId: req.user.id, // Directamente del token
        cursoId,
        telefono,
        nivel,
        motivacion
      });

      res.status(201).json(inscripcion);
    } catch (error) {
      next(error);
    }
  };

  listMine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Debes iniciar sesión para consultar tus inscripciones");
      }

      const page = req.query["page"] ? Number(req.query["page"]) : 1;
      const limit = req.query["limit"] ? Number(req.query["limit"]) : 9;

      const result = await this.listMyInscripcionesUseCase.execute(req.user.id, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query["page"] ? Number(req.query["page"]) : 1;
      const limit = req.query["limit"] ? Number(req.query["limit"]) : 9;

      const result = await this.listAllInscripcionesUseCase.execute(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
