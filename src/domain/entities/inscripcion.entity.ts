import { Curso } from "./curso.entity.js";
import { SafeUser } from "./user.entity.js";

export interface Inscripcion {
  id: number;
  userId: number;
  cursoId: number;
  telefono: string;
  nivel: string;
  motivacion: string;
  createdAt: Date;
  curso?: Curso;
  user?: Pick<SafeUser, "id" | "nombre" | "email">;
}
