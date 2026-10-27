import { z } from "zod";

const emptyToUndefined = (val: unknown) => (val === "" || val === undefined ? undefined : val);

export const cursoQuerySchema = z
  .object({
    q: z.preprocess(emptyToUndefined, z.string().optional()),
    categoria: z.preprocess(emptyToUndefined, z.string().optional()),
    precioMin: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number({ invalid_type_error: "El precio mínimo debe ser un número" })
        .min(0, "El precio mínimo debe ser mayor o igual a 0")
        .optional()
    ),
    precioMax: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number({ invalid_type_error: "El precio máximo debe ser un número" })
        .min(0, "El precio máximo debe ser mayor o igual a 0")
        .optional()
    ),
    page: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number({ invalid_type_error: "La página debe ser un número" })
        .int("La página debe ser un número entero")
        .min(1, "La página debe ser mayor o igual a 1")
        .optional()
    ),
    limit: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number({ invalid_type_error: "El límite debe ser un número" })
        .int("El límite debe ser un número entero")
        .min(1, "El límite mínimo por página es 1")
        .max(50, "El límite máximo por página es 50")
        .optional()
    )
  })
  .refine(
    (data) => {
      if (data.precioMin !== undefined && data.precioMax !== undefined) {
        return data.precioMin <= data.precioMax;
      }
      return true;
    },
    {
      message: "El precio mínimo no puede ser mayor al precio máximo",
      path: ["precioMin"]
    }
  );

export const cursoParamIdSchema = z.object({
  id: z
    .string({ required_error: "El parámetro identificador es requerido" })
    .regex(/^[1-9]\d*$/, "El identificador debe ser un número entero positivo")
});

export const createCursoSchema = z.object({
  titulo: z
    .string({ required_error: "El título es obligatorio", invalid_type_error: "El título debe ser un texto" })
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(150, "El título no debe exceder 150 caracteres"),
  slug: z.string().optional(),
  categoria: z
    .string({ required_error: "La categoría es obligatoria", invalid_type_error: "La categoría debe ser un texto" })
    .min(1, "La categoría es obligatoria"),
  categoriaNombre: z
    .string({ required_error: "El nombre de la categoría es obligatorio", invalid_type_error: "El nombre de la categoría debe ser un texto" })
    .min(1, "El nombre de la categoría es obligatorio"),
  nivel: z
    .string({ required_error: "El nivel es obligatorio", invalid_type_error: "El nivel debe ser un texto" })
    .min(1, "El nivel es obligatorio"),
  duracionHoras: z.coerce
    .number({ required_error: "La duración en horas es obligatoria", invalid_type_error: "La duración en horas debe ser un número" })
    .int("La duración en horas debe ser un número entero")
    .min(1, "La duración debe ser de al menos 1 hora"),
  precio: z.coerce
    .number({ required_error: "El precio es obligatorio", invalid_type_error: "El precio debe ser un número" })
    .min(0, "El precio no puede ser negativo"),
  calificacion: z.coerce
    .number({ invalid_type_error: "La calificación debe ser un número" })
    .min(0, "La calificación mínima es 0")
    .max(5, "La calificación máxima es 5")
    .default(5.0),
  totalResenas: z.coerce
    .number({ invalid_type_error: "El total de reseñas debe ser un número" })
    .int("El total de reseñas debe ser un número entero")
    .min(0, "El total de reseñas no puede ser negativo")
    .default(0),
  estudiantes: z.coerce
    .number({ invalid_type_error: "El total de estudiantes debe ser un número" })
    .int("El total de estudiantes debe ser un número entero")
    .min(0, "El total de estudiantes no puede ser negativo")
    .default(0),
  instructorNombre: z
    .string({ required_error: "El nombre del instructor es obligatorio", invalid_type_error: "El nombre del instructor debe ser un texto" })
    .min(2, "El nombre del instructor debe tener al menos 2 caracteres"),
  instructorEspecialidad: z
    .string({ required_error: "La especialidad del instructor es obligatoria", invalid_type_error: "La especialidad del instructor debe ser un texto" })
    .min(2, "La especialidad del instructor debe tener al menos 2 caracteres"),
  instructorAvatar: z
    .string({ required_error: "El avatar del instructor es obligatorio", invalid_type_error: "El avatar del instructor debe ser un texto" })
    .min(1, "El avatar del instructor es obligatorio"),
  instructorBio: z
    .string({ required_error: "La biografía del instructor es obligatoria", invalid_type_error: "La biografía del instructor debe ser un texto" })
    .min(5, "La biografía del instructor debe tener al menos 5 caracteres"),
  destacado: z.boolean({ invalid_type_error: "El campo destacado debe ser un booleano" }).default(false),
  imagen: z
    .string({ required_error: "La imagen es obligatoria", invalid_type_error: "La imagen debe ser un texto" })
    .min(1, "La imagen es obligatoria"),
  tecnologias: z
    .array(z.string(), { required_error: "Las tecnologías son obligatorias" })
    .min(1, "Debe incluir al menos una tecnología"),
  descripcionCorta: z
    .string({ required_error: "La descripción corta es obligatoria", invalid_type_error: "La descripción corta debe ser un texto" })
    .min(10, "La descripción corta debe tener al menos 10 caracteres"),
  descripcionLarga: z
    .string({ required_error: "La descripción larga es obligatoria", invalid_type_error: "La descripción larga debe ser un texto" })
    .min(20, "La descripción larga debe tener al menos 20 caracteres"),
  requisitos: z.array(z.string()).default([]),
  temario: z.array(z.string()).default([])
});

// PUT valida el cuerpo completo, no parcial
export const updateCursoSchema = createCursoSchema;

