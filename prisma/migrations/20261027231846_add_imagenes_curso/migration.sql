-- CreateTable
CREATE TABLE "imagenes_curso" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "datos" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imagenes_curso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "imagenes_curso_cursoId_key" ON "imagenes_curso"("cursoId");

-- AddForeignKey
ALTER TABLE "imagenes_curso" ADD CONSTRAINT "imagenes_curso_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
