import { z } from "zod";

export const cursoQuerySchema = z.object({
  q: z.string().optional(),
  categoria: z.string().optional(),
  precioMin: z.coerce.number().min(0, "El precio mínimo debe ser mayor o igual a 0").optional(),
  precioMax: z.coerce.number().min(0, "El precio máximo debe ser mayor o igual a 0").optional(),
  page: z.coerce.number().int().min(1, "La página debe ser mayor a 0").optional(),
  limit: z.coerce.number().int().min(1).max(50, "El límite máximo por página es 50").optional()
});

export const cursoParamIdSchema = z.object({
  id: z.string().min(1, "El parámetro identificador es requerido")
});

export const createCursoSchema = z.object({
  titulo: z.string({ required_error: "El título es obligatorio" }).min(5, "El título debe tener al menos 5 caracteres"),
  slug: z.string().optional(),
  categoria: z.string({ required_error: "La categoría es obligatoria" }),
  categoriaNombre: z.string({ required_error: "El nombre de la categoría es obligatorio" }),
  nivel: z.string({ required_error: "El nivel es obligatorio" }),
  duracionHoras: z.coerce.number({ required_error: "La duración en horas es obligatoria" }).min(1),
  precio: z.coerce.number({ required_error: "El precio es obligatorio" }).min(0),
  calificacion: z.coerce.number().min(0).max(5).default(5.0),
  totalResenas: z.coerce.number().min(0).default(0),
  estudiantes: z.coerce.number().min(0).default(0),
  instructorNombre: z.string({ required_error: "El nombre del instructor es obligatorio" }),
  instructorEspecialidad: z.string({ required_error: "La especialidad del instructor es obligatoria" }),
  instructorAvatar: z.string({ required_error: "El avatar del instructor es obligatorio" }),
  instructorBio: z.string({ required_error: "La biografía del instructor es obligatoria" }),
  destacado: z.boolean().default(false),
  imagen: z.string({ required_error: "La imagen es obligatoria" }),
  tecnologias: z.array(z.string()).min(1, "Debe incluir al menos una tecnología"),
  descripcionCorta: z.string({ required_error: "La descripción corta es obligatoria" }).min(10),
  descripcionLarga: z.string({ required_error: "La descripción larga es obligatoria" }).min(20),
  requisitos: z.array(z.string()).default([]),
  temario: z.array(z.string()).default([])
});

export const updateCursoSchema = createCursoSchema.partial();
