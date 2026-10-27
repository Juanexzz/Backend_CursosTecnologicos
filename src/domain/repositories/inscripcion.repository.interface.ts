import { Inscripcion } from "../entities/inscripcion.entity.js";

export interface IInscripcionRepository {
  findByUserAndCurso(userId: number, cursoId: number): Promise<Inscripcion | null>;
  create(data: {
    userId: number;
    cursoId: number;
    telefono: string;
    nivel: string;
    motivacion: string;
  }): Promise<Inscripcion>;
  findByUserId(userId: number, page: number, limit: number): Promise<{ data: Inscripcion[]; total: number }>;
  findAll(page: number, limit: number): Promise<{ data: Inscripcion[]; total: number }>;
}
