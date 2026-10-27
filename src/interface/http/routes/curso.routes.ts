import { Router } from "express";
import { CursoController } from "../controllers/curso.controller.js";
import { PrismaCursoRepository } from "../../../infrastructure/repositories/prisma-curso.repository.js";
import { ListCursosUseCase } from "../../../application/use-cases/cursos/list-cursos.use-case.js";
import { GetCursoByIdUseCase } from "../../../application/use-cases/cursos/get-curso-by-id.use-case.js";
import { CreateCursoUseCase } from "../../../application/use-cases/cursos/create-curso.use-case.js";
import { UpdateCursoUseCase } from "../../../application/use-cases/cursos/update-curso.use-case.js";
import { DeleteCursoUseCase } from "../../../application/use-cases/cursos/delete-curso.use-case.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  cursoQuerySchema,
  cursoParamIdSchema,
  createCursoSchema,
  updateCursoSchema
} from "../schemas/curso.schema.js";

export function createCursoRouter(): Router {
  const router = Router();

  const cursoRepository = new PrismaCursoRepository();

  const listCursosUseCase = new ListCursosUseCase(cursoRepository);
  const getCursoByIdUseCase = new GetCursoByIdUseCase(cursoRepository);
  const createCursoUseCase = new CreateCursoUseCase(cursoRepository);
  const updateCursoUseCase = new UpdateCursoUseCase(cursoRepository);
  const deleteCursoUseCase = new DeleteCursoUseCase(cursoRepository);

  const controller = new CursoController(
    listCursosUseCase,
    getCursoByIdUseCase,
    createCursoUseCase,
    updateCursoUseCase,
    deleteCursoUseCase
  );

  // Rutas públicas
  router.get("/", validate(cursoQuerySchema, "query"), controller.list);
  router.get("/:id", validate(cursoParamIdSchema, "params"), controller.getById);

  // Rutas protegidas solo para administradores
  router.post("/", authMiddleware, soloAdmin, validate(createCursoSchema), controller.create);
  router.put(
    "/:id",
    authMiddleware,
    soloAdmin,
    validate(cursoParamIdSchema, "params"),
    validate(updateCursoSchema),
    controller.update
  );
  router.delete(
    "/:id",
    authMiddleware,
    soloAdmin,
    validate(cursoParamIdSchema, "params"),
    controller.delete
  );

  return router;
}
