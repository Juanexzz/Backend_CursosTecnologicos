# Backend - NexTech Academy API

API REST robusta, escalable y segura desarrollada con Node.js, Express, TypeScript, Prisma ORM y PostgreSQL (Supabase), estructurada bajo una arquitectura en cuatro capas (Clean Architecture).

Este proyecto corresponde al backend del sistema web para **NexTech Academy** (plataforma de formación tecnológica especializada en desarrollo web, computación en la nube, inteligencia artificial y ciberseguridad), desarrollado para la Entrega 3 de la asignatura Desarrollo Web.

---

## Enlaces de despliegue

- **API Desplegada (Render / Railway):** `[MARCADOR: URL_API_DESPLIEGUE]`
- **Frontend Desplegado (Vercel):** `[MARCADOR: URL_FRONTEND_VERCEL]`

---

## Decisiones técnicas

Las siguientes reflexiones corresponden a los cuatro dilemas de diseño técnico del backend:

### 1. ¿Por qué separamos el backend en cuatro capas (Domain, Application, Infrastructure, Interface) en lugar de usar la estructura clásica MVC (Model-View-Controller) de Express?
> [ESPACIO_PARA_RESPUESTA_DEL_ESTUDIANTE]

### 2. ¿Por qué las contraseñas se almacenan mediante bcrypt con salt y nunca en texto plano ni con algoritmos rápidos como SHA-256 o MD5?
> [ESPACIO_PARA_RESPUESTA_DEL_ESTUDIANTE]

### 3. ¿Por qué el payload del JWT solo incluye identificadores no sensibles (`id`, `role`) y no contiene el correo electrónico, datos de perfil ni permisos detallados?
> [ESPACIO_PARA_RESPUESTA_DEL_ESTUDIANTE]

### 4. ¿Por qué es fundamental que la política de CORS verifique una lista explícita de orígenes autorizados y prohíba el uso de comodines (`*`) cuando se manejan credenciales?
> [ESPACIO_PARA_RESPUESTA_DEL_ESTUDIANTE]

---

## Evidencia de funcionamiento (Network)

> [MARCADOR: Captura de pantalla de la pestaña Network del navegador mostrando la petición con cabecera Authorization y la respuesta del backend]

---

## Arquitectura en cuatro capas

El código se organiza estrictamente en cuatro capas concéntricas con regla de dependencia hacia adentro:

```
src/
├── domain/                  # Capa de Dominio (pura, sin dependencias externas)
│   ├── entities/            # Entidades de negocio (User, Curso, Inscripcion)
│   ├── errors/              # Errores tipificados de dominio (AppError, ValidationError, etc.)
│   ├── repositories/        # Interfaces de repositorios (ICursoRepository, etc.)
│   └── services/            # Interfaces de servicios (ITokenService, IPasswordHasher)
│
├── application/             # Capa de Aplicación (Casos de uso y orquestación)
│   ├── errors/              # Errores específicos de aplicación
│   └── use-cases/           # Casos de uso divididos por módulo
│       ├── auth/            # register, login, me
│       ├── cursos/          # list, getById, create, update, delete, uploadImagen
│       └── inscripciones/   # create, listMy, listAll
│
├── infrastructure/          # Capa de Infraestructura (adaptadores externos y librerías)
│   ├── config/              # Validación de variables de entorno con Zod
│   ├── database/            # Conexión Prisma Client
│   ├── repositories/        # Implementaciones Prisma de los repositorios
│   └── security/            # Implementación Bcrypt y JWT (jsonwebtoken)
│
├── interface/               # Capa de Interfaz (HTTP, Express)
│   └── http/
│       ├── controllers/     # Controladores HTTP desacoplados
│       ├── middlewares/     # Auth, Roles, Validación, Subida (Multer), Error Handler
│       ├── routes/          # Declaración de endpoints y prefijos
│       ├── schemas/         # Esquemas de validación Zod (body, params, query)
│       └── app.ts           # Configuración de Express, CORS y Helmet
│
├── container.ts             # Raíz de composición (Inyección de dependencias)
└── server.ts                # Punto de entrada y listener en 0.0.0.0
```

---

## Tabla de endpoints y permisos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/health` | Público | Verificación del estado de salud del servicio |
| `POST` | `/api/auth/register` | Público | Registro de usuarios nuevos (asigna siempre rol `user`) |
| `POST` | `/api/auth/login` | Público | Autenticación de credenciales; retorna token JWT |
| `GET` | `/api/auth/me` | Autenticado | Obtiene la información del usuario en sesión |
| `GET` | `/api/cursos` | Público | Lista paginada de cursos con soporte para filtros (`q`, `categoria`, rango de precios) |
| `GET` | `/api/cursos/:id` | Público | Detalle completo de un curso |
| `POST` | `/api/cursos` | Solo Admin | Creación de un nuevo curso en el catálogo |
| `PUT` | `/api/cursos/:id` | Solo Admin | Actualización integral de un curso existente |
| `DELETE` | `/api/cursos/:id` | Solo Admin | Eliminación de un curso del catálogo |
| `POST` | `/api/cursos/:id/imagen` | Solo Admin | Subida de imagen (multipart, max 2 MB, magic bytes). Guarda bytes en PostgreSQL y actualiza la URL absoluta |
| `GET` | `/api/cursos/:id/imagen` | Público | Sirve los bytes binarios de la imagen con Content-Type y Cache-Control |
| `POST` | `/api/inscripciones` | Autenticado | Inscripción a un curso; el solicitante se extrae del token JWT |
| `GET` | `/api/inscripciones/mias` | Autenticado | Listado paginado de inscripciones propias del usuario |
| `GET` | `/api/inscripciones` | Solo Admin | Listado global paginado de todas las inscripciones |

---

## Credenciales de prueba (Ambiente de evaluación)

> Estas credenciales son de uso exclusivo para las pruebas del entorno de evaluación de la Entrega 3:

| Rol | Correo electrónico | Contraseña |
|---|---|---|
| **Administrador** | `admin@nextech.com` | `Admin123*` |
| **Estudiante (User)**| `estudiante@nextech.com` | `User123*` |

---

## Variables de entorno

Crea un archivo `.env` en la raíz de `Backend_CursosTecnologicos/` siguiendo esta estructura (ver `.env.example`):

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto de escucha del servidor HTTP | `4000` |
| `DATABASE_URL` | Cadena de conexión al pooler de Supabase (puerto 6543) | `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Cadena de conexión directa para migraciones (puerto 5432) | `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:5432/postgres` |
| `JWT_SECRET` | Secreto criptográfico de al menos 32 caracteres | Clave generada aleatoriamente |
| `JWT_EXPIRES_IN` | Duración del token de sesión | `24h` |
| `CORS_ORIGIN` | Lista de orígenes frontend permitidos, separados por coma | `http://localhost:3000,https://mi-frontend.vercel.app` |
| `PUBLIC_API_URL` | URL base accesible públicamente de la API | `http://localhost:4000` o `https://tu-backend.onrender.com` |

---

## Ejecución en entorno local

### 1. Clonar e instalar dependencias
```bash
cd Backend_CursosTecnologicos
npm install
```

### 2. Configurar base de datos
```bash
# Aplicar migraciones existentes
npx prisma migrate deploy

# Generar cliente tipado de Prisma
npx prisma generate

# Poblar catálogo inicial e instructores
npm run seed
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

### 4. Ejecutar pruebas unitarias y de integración
```bash
npm test
```

---

## Configuración para despliegue (Render / Railway)

- **Entorno de ejecución:** Node.js (versión compatible `>= 20.0.0`)
- **Build Command:**
  ```bash
  npm install && npm run build
  ```
- **Start Command:**
  ```bash
  npm run start:prod
  ```
  *(El comando `npm run start:prod` aplica automáticamente las migraciones pendientes con `prisma migrate deploy` antes de levantar `node dist/server.js`).*
- **Variables de entorno requeridas en la plataforma de hosting:**
  1. `NODE_ENV` = `production`
  2. `PORT` = `4000` (o el asignado dinámicamente por la plataforma)
  3. `DATABASE_URL` = Cadena con transaction pooling de Supabase
  4. `DIRECT_URL` = Cadena directa de Supabase
  5. `JWT_SECRET` = Clave segura de más de 32 caracteres
  6. `JWT_EXPIRES_IN` = `24h`
  7. `CORS_ORIGIN` = URL exacta de producción del frontend en Vercel
  8. `PUBLIC_API_URL` = URL pública del backend en Render o Railway
