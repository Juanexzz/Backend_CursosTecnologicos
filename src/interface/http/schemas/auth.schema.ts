import { z } from "zod";

export const registerSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre completo es requerido" })
    .trim()
    .min(2, "El nombre debe contener al menos 2 caracteres")
    .max(80, "El nombre no puede exceder 80 caracteres"),
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .trim()
    .toLowerCase()
    .email("Ingresa un correo electrónico con formato válido"),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(8, "La contraseña debe contener al menos 8 caracteres")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "La contraseña debe contener al menos una letra y un número")
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .trim()
    .toLowerCase()
    .email("Ingresa un correo electrónico con formato válido"),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(1, "La contraseña no puede estar vacía")
});
