export interface Curso {
  id: number;
  titulo: string;
  slug: string;
  categoria: string;
  categoriaNombre: string;
  nivel: string;
  duracionHoras: number;
  precio: number;
  calificacion: number;
  totalResenas: number;
  estudiantes: number;
  instructorNombre: string;
  instructorEspecialidad: string;
  instructorAvatar: string;
  instructorBio: string;
  destacado: boolean;
  imagen: string;
  tecnologias: string[];
  descripcionCorta: string;
  descripcionLarga: string;
  requisitos: string[];
  temario: string[];
  createdAt: Date;
  updatedAt: Date;
}
