import { Request, Response, NextFunction } from "express";
import { ListCursosUseCase } from "../../../application/use-cases/cursos/list-cursos.use-case.js";
import { GetCursoByIdUseCase } from "../../../application/use-cases/cursos/get-curso-by-id.use-case.js";
import { CreateCursoUseCase, CreateCursoInput } from "../../../application/use-cases/cursos/create-curso.use-case.js";
import { UpdateCursoUseCase, UpdateCursoInput } from "../../../application/use-cases/cursos/update-curso.use-case.js";
import { DeleteCursoUseCase } from "../../../application/use-cases/cursos/delete-curso.use-case.js";

export class CursoController {
  constructor(
    private readonly listCursosUseCase: ListCursosUseCase,
    private readonly getCursoByIdUseCase: GetCursoByIdUseCase,
    private readonly createCursoUseCase: CreateCursoUseCase,
    private readonly updateCursoUseCase: UpdateCursoUseCase,
    private readonly deleteCursoUseCase: DeleteCursoUseCase
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = req.query["q"] ? String(req.query["q"]) : undefined;
      const categoria = req.query["categoria"] ? String(req.query["categoria"]) : undefined;
      const precioMin = req.query["precioMin"] ? Number(req.query["precioMin"]) : undefined;
      const precioMax = req.query["precioMax"] ? Number(req.query["precioMax"]) : undefined;
      const page = req.query["page"] ? Number(req.query["page"]) : undefined;
      const limit = req.query["limit"] ? Number(req.query["limit"]) : undefined;

      const result = await this.listCursosUseCase.execute({
        q,
        categoria,
        precioMin,
        precioMax,
        page,
        limit
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const param = String(req.params["id"]);
      const curso = await this.getCursoByIdUseCase.execute(param);
      res.status(200).json(curso);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const curso = await this.createCursoUseCase.execute(req.body as CreateCursoInput);
      res.status(201).json(curso);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params["id"]);
      const curso = await this.updateCursoUseCase.execute(id, req.body as UpdateCursoInput);
      res.status(200).json(curso);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params["id"]);
      await this.deleteCursoUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
