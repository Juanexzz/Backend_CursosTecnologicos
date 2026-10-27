import { Router } from "express";
import { CursoController } from "../controllers/curso.controller.js";
import { ImagenCursoController } from "../controllers/imagen-curso.controller.js";
import {
  cursoController as defaultController,
  imagenCursoController as defaultImagenController,
} from "../../../container.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { uploadImagenMiddleware } from "../middlewares/upload.middleware.js";
import {
  cursoQuerySchema,
  cursoParamIdSchema,
  createCursoSchema,
  updateCursoSchema,
} from "../schemas/curso.schema.js";

export function createCursoRouter(
  controller: CursoController = defaultController,
  imagenController: ImagenCursoController = defaultImagenController
): Router {
  const router = Router();

  // Rutas públicas
  router.get("/", validate(cursoQuerySchema, "query"), controller.list);

  // GET /:id/imagen debe ir ANTES de GET /:id para no ser absorbida por el param genérico
  router.get("/:id/imagen", validate(cursoParamIdSchema, "params"), imagenController.serve);
  router.get("/:id", validate(cursoParamIdSchema, "params"), controller.getById);

  // Rutas protegidas solo para administradores
  router.post("/", authenticate, soloAdmin, validate(createCursoSchema), controller.create);
  router.put(
    "/:id",
    authenticate,
    soloAdmin,
    validate(cursoParamIdSchema, "params"),
    validate(updateCursoSchema),
    controller.update
  );
  router.delete(
    "/:id",
    authenticate,
    soloAdmin,
    validate(cursoParamIdSchema, "params"),
    controller.delete
  );

  // POST /:id/imagen — solo admin, multipart
  router.post(
    "/:id/imagen",
    authenticate,
    soloAdmin,
    validate(cursoParamIdSchema, "params"),
    uploadImagenMiddleware,
    imagenController.upload
  );

  return router;
}
