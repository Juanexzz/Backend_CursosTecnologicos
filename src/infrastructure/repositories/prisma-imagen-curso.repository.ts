import { IImagenCursoRepository } from "../../domain/repositories/imagen-curso.repository.interface.js";
import { prisma } from "../database/prisma.client.js";

export class PrismaImagenCursoRepository implements IImagenCursoRepository {
  async upsert(cursoId: number, datos: Buffer, mimeType: string): Promise<void> {
    // Prisma 6 espera Uint8Array<ArrayBuffer>; copiamos el Buffer en un ArrayBuffer limpio
    const uint8 = new Uint8Array(datos.buffer.slice(datos.byteOffset, datos.byteOffset + datos.byteLength)) as Uint8Array<ArrayBuffer>;
    await prisma.imagenCurso.upsert({
      where: { cursoId },
      update: { datos: uint8, mimeType },
      create: { cursoId, datos: uint8, mimeType },
    });
  }

  async findByCursoId(cursoId: number): Promise<{ datos: Buffer; mimeType: string } | null> {
    const row = await prisma.imagenCurso.findUnique({ where: { cursoId } });
    if (!row) return null;
    // row.datos es Uint8Array en Prisma 6; lo convertimos a Buffer para la interfaz
    return { datos: Buffer.from(row.datos), mimeType: row.mimeType };
  }
}
