/**
 * Middleware de subida de imagen en memoria (multer).
 *
 * Reglas:
 * - Campo multipart: "imagen"
 * - Tamaño máximo: 2 MB (2 097 152 bytes) → 413 si se supera
 * - Tipos permitidos: image/jpeg, image/png, image/webp
 * - Validación por magic bytes (primeros bytes del buffer), NO por extensión ni header Content-Type
 *
 * Magic bytes:
 *   JPEG → FF D8 FF
 *   PNG  → 89 50 4E 47 0D 0A 1A 0A
 *   WebP → 52 49 46 46 ?? ?? ?? ?? 57 45 42 50
 */

import multer, { Multer } from "multer";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../domain/errors/domain-errors.js";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Detecta el tipo MIME real del buffer usando magic bytes. Devuelve null si no reconoce. */
function detectMimeType(buf: Buffer): string | null {
  if (buf.length < 4) return null;

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) return "image/png";

  // WebP: RIFF????WEBP (bytes 0-3 = 52 49 46 46, bytes 8-11 = 57 45 42 50)
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) return "image/webp";

  return null;
}

// Instancia de multer: memoryStorage, sin filtro de tipo (lo hacemos después con magic bytes)
const upload: Multer = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
});

/**
 * Middleware compuesto: primero multer sube a memoria, luego validamos magic bytes.
 * En caso de error de tamaño multer lanza MulterError con code "LIMIT_FILE_SIZE".
 */
export function uploadImagenMiddleware(req: Request, res: Response, next: NextFunction): void {
  const multerSingle = upload.single("imagen");

  multerSingle(req, res, (err: unknown) => {
    // 1. Error de tamaño → 413
    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_FILE_SIZE"
    ) {
      res.status(413).json({
        message: "El archivo supera el tamaño máximo permitido de 2 MB.",
      });
      return;
    }

    // 2. Cualquier otro error de multer
    if (err instanceof multer.MulterError || err instanceof Error) {
      next(err);
      return;
    }

    // 3. No se envió ningún archivo
    if (!req.file || !req.file.buffer) {
      next(new ValidationError("Debes enviar un archivo en el campo 'imagen'.", [
        { field: "imagen", message: "El campo 'imagen' es obligatorio." },
      ]));
      return;
    }

    // 4. Validar por magic bytes (NO por extensión ni header)
    const detected = detectMimeType(req.file.buffer);
    if (!detected || !ALLOWED_MIME.has(detected)) {
      next(new ValidationError("Tipo de archivo no permitido.", [
        {
          field: "imagen",
          message: "Solo se aceptan imágenes JPEG, PNG o WebP. Verifica que el archivo no esté corrompido.",
        },
      ]));
      return;
    }

    // Sobreescribe el mimeType con el detectado por bytes (más confiable que el header)
    req.file.mimetype = detected;

    next();
  });
}
