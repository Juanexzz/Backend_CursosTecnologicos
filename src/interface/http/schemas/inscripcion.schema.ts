import { z } from "zod";

export const createInscripcionSchema = z.object({
  cursoId: z.coerce
    .number({ required_error: "Debes seleccionar un curso válido" })
    .int()
    .positive("Identificador de curso inválido"),
  telefono: z
    .string({ required_error: "El número telefónico o WhatsApp es obligatorio" })
    .min(7, "El teléfono debe contener al menos 7 dígitos")
    .max(20, "El teléfono no debe exceder 20 caracteres"),
  nivel: z.string({ required_error: "El nivel actual de conocimientos es obligatorio" }),
  motivacion: z
    .string({ required_error: "Por favor describe tu principal objetivo profesional" })
    .min(10, "El objetivo profesional debe contener al menos 10 caracteres")
    .max(1000, "El mensaje no debe exceder 1000 caracteres")
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "La página debe ser mayor a 0").optional(),
  limit: z.coerce.number().int().min(1).max(50, "El límite máximo por página es 50").optional()
});
