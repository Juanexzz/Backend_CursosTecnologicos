import { Curso } from "../entities/curso.entity.js";

export interface CursoFilterOptions {
  q?: string;
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
  page?: number;
  limit?: number;
}

export interface ICursoRepository {
  findAll(options: CursoFilterOptions): Promise<{ data: Curso[]; total: number }>;
  findById(id: number): Promise<Curso | null>;
  findBySlug(slug: string): Promise<Curso | null>;
  create(cursoData: Omit<Curso, "id" | "createdAt" | "updatedAt">): Promise<Curso>;
  update(id: number, cursoData: Partial<Omit<Curso, "id" | "createdAt" | "updatedAt">>): Promise<Curso | null>;
  delete(id: number): Promise<boolean>;
}
