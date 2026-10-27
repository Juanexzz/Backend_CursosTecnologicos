/**
 * container.ts — raíz de composición (Composition Root).
 * Aquí y solo aquí se instancian las dependencias concretas y se conectan las capas.
 * Ninguna otra capa hace `new` de infraestructura ni conoce las implementaciones concretas.
 */

import { PrismaUserRepository } from "./infrastructure/repositories/prisma-user.repository.js";
import { PrismaCursoRepository } from "./infrastructure/repositories/prisma-curso.repository.js";
import { PrismaInscripcionRepository } from "./infrastructure/repositories/prisma-inscripcion.repository.js";
import { BcryptPasswordHasher } from "./infrastructure/security/bcrypt-password-hasher.js";
import { JwtTokenService } from "./infrastructure/security/jwt-token-service.js";

import { RegisterUserUseCase } from "./application/use-cases/auth/register-user.use-case.js";
import { LoginUserUseCase } from "./application/use-cases/auth/login-user.use-case.js";
import { GetCurrentUserUseCase } from "./application/use-cases/auth/get-current-user.use-case.js";
import { ListCursosUseCase } from "./application/use-cases/cursos/list-cursos.use-case.js";
import { GetCursoByIdUseCase } from "./application/use-cases/cursos/get-curso-by-id.use-case.js";
import { CreateCursoUseCase } from "./application/use-cases/cursos/create-curso.use-case.js";
import { UpdateCursoUseCase } from "./application/use-cases/cursos/update-curso.use-case.js";
import { DeleteCursoUseCase } from "./application/use-cases/cursos/delete-curso.use-case.js";
import { CreateInscripcionUseCase } from "./application/use-cases/inscripciones/create-inscripcion.use-case.js";
import { ListMyInscripcionesUseCase } from "./application/use-cases/inscripciones/list-my-inscripciones.use-case.js";
import { ListAllInscripcionesUseCase } from "./application/use-cases/inscripciones/list-all-inscripciones.use-case.js";

import { AuthController } from "./interface/http/controllers/auth.controller.js";
import { CursoController } from "./interface/http/controllers/curso.controller.js";
import { InscripcionController } from "./interface/http/controllers/inscripcion.controller.js";

// 1. Infraestructura
const userRepository = new PrismaUserRepository();
const cursoRepository = new PrismaCursoRepository();
const inscripcionRepository = new PrismaInscripcionRepository();
const passwordHasher = new BcryptPasswordHasher();
export const tokenService = new JwtTokenService();

// 2. Casos de uso — Auth
export const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
export const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

// Casos de uso — Cursos
export const listCursosUseCase = new ListCursosUseCase(cursoRepository);
export const getCursoByIdUseCase = new GetCursoByIdUseCase(cursoRepository);
export const createCursoUseCase = new CreateCursoUseCase(cursoRepository);
export const updateCursoUseCase = new UpdateCursoUseCase(cursoRepository);
export const deleteCursoUseCase = new DeleteCursoUseCase(cursoRepository);

// Casos de uso — Inscripciones
export const createInscripcionUseCase = new CreateInscripcionUseCase(inscripcionRepository, cursoRepository);
export const listMyInscripcionesUseCase = new ListMyInscripcionesUseCase(inscripcionRepository);
export const listAllInscripcionesUseCase = new ListAllInscripcionesUseCase(inscripcionRepository);

// 3. Controladores
export const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
  getCurrentUserUseCase
);
export const cursoController = new CursoController(
  listCursosUseCase,
  getCursoByIdUseCase,
  createCursoUseCase,
  updateCursoUseCase,
  deleteCursoUseCase
);
export const inscripcionController = new InscripcionController(
  createInscripcionUseCase,
  listMyInscripcionesUseCase,
  listAllInscripcionesUseCase
);
