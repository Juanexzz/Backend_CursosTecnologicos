-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "categoriaNombre" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "duracionHoras" INTEGER NOT NULL,
    "precio" INTEGER NOT NULL,
    "calificacion" DOUBLE PRECISION NOT NULL,
    "totalResenas" INTEGER NOT NULL DEFAULT 0,
    "estudiantes" INTEGER NOT NULL DEFAULT 0,
    "instructorNombre" TEXT NOT NULL,
    "instructorEspecialidad" TEXT NOT NULL,
    "instructorAvatar" TEXT NOT NULL,
    "instructorBio" TEXT NOT NULL,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "imagen" TEXT NOT NULL,
    "tecnologias" TEXT[],
    "descripcionCorta" TEXT NOT NULL,
    "descripcionLarga" TEXT NOT NULL,
    "requisitos" TEXT[],
    "temario" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "telefono" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "motivacion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_slug_key" ON "cursos"("slug");

-- CreateIndex
CREATE INDEX "cursos_categoria_idx" ON "cursos"("categoria");

-- CreateIndex
CREATE INDEX "inscripciones_userId_idx" ON "inscripciones"("userId");

-- CreateIndex
CREATE INDEX "inscripciones_cursoId_idx" ON "inscripciones"("cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_userId_cursoId_key" ON "inscripciones"("userId", "cursoId");

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
