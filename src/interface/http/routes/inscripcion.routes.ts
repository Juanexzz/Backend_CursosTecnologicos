import { Router } from "express";
import { InscripcionController } from "../controllers/inscripcion.controller.js";
import { PrismaInscripcionRepository } from "../../../infrastructure/repositories/prisma-inscripcion.repository.js";
import { PrismaCursoRepository } from "../../../infrastructure/repositories/prisma-curso.repository.js";
import { CreateInscripcionUseCase } from "../../../application/use-cases/inscripciones/create-inscripcion.use-case.js";
import { ListMyInscripcionesUseCase } from "../../../application/use-cases/inscripciones/list-my-inscripciones.use-case.js";
import { ListAllInscripcionesUseCase } from "../../../application/use-cases/inscripciones/list-all-inscripciones.use-case.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createInscripcionSchema, paginationQuerySchema } from "../schemas/inscripcion.schema.js";

export function createInscripcionRouter(): Router {
  const router = Router();

  const inscripcionRepository = new PrismaInscripcionRepository();
  const cursoRepository = new PrismaCursoRepository();

  const createInscripcionUseCase = new CreateInscripcionUseCase(inscripcionRepository, cursoRepository);
  const listMyInscripcionesUseCase = new ListMyInscripcionesUseCase(inscripcionRepository);
  const listAllInscripcionesUseCase = new ListAllInscripcionesUseCase(inscripcionRepository);

  const controller = new InscripcionController(
    createInscripcionUseCase,
    listMyInscripcionesUseCase,
    listAllInscripcionesUseCase
  );

  // IMPORTANTE: /mias se declara antes que cualquier parámetro :id
  router.get(
    "/mias",
    authMiddleware,
    validate(paginationQuerySchema, "query"),
    controller.listMine
  );

  // Crear inscripción (usuario autenticado)
  router.post(
    "/",
    authMiddleware,
    validate(createInscripcionSchema),
    controller.create
  );

  // Listar todas las inscripciones (solo admin)
  router.get(
    "/",
    authMiddleware,
    soloAdmin,
    validate(paginationQuerySchema, "query"),
    controller.listAll
  );

  return router;
}
