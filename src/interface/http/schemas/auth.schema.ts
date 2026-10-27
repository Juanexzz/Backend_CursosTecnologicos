import { z } from "zod";

export const registerSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre completo es requerido" })
    .min(3, "El nombre debe contener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email("Ingresa un correo electrónico con formato válido"),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe contener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres")
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email("Ingresa un correo electrónico con formato válido"),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(1, "La contraseña no puede estar vacía")
});
