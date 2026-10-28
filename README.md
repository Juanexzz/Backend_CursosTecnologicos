# Backend - NexTech Academy API

API REST robusta, escalable y segura desarrollada con Node.js, Express, TypeScript, Prisma ORM y PostgreSQL (Supabase), estructurada bajo una arquitectura en cuatro capas (Clean Architecture).

Este proyecto corresponde al backend del sistema web para **NexTech Academy** (plataforma de formación tecnológica especializada en desarrollo web, computación en la nube, inteligencia artificial y ciberseguridad), desarrollado para la Entrega 3 de la asignatura Desarrollo Web.

---

## Enlaces de despliegue

- **API Desplegada (Render / Railway):** `[MARCADOR: URL_API_DESPLIEGUE]`
- **Frontend Desplegado (Vercel):** `[MARCADOR: URL_FRONTEND_VERCEL]`

---

## Decisiones técnicas

### 1. ¿Por qué separamos el backend en cuatro capas (Domain, Application, Infrastructure, Interface) en lugar de usar la estructura clásica MVC (Model-View-Controller) de Express?
En la arquitectura MVC tradicional de Express, los controladores suelen acumular múltiples responsabilidades: validación de peticiones, lógica de negocio y consultas directas a la base de datos con el ORM. Esto genera un alto acoplamiento y dificulta las pruebas unitarias y el mantenimiento.

Al separar el backend en cuatro capas concéntricas con regla de dependencia hacia adentro (Clean Architecture):
- **Domain:** Alberga las entidades de negocio puras, reglas fundamentales y contratos de repositorio sin depender de ningún framework, base de datos ni librería externa.
- **Application:** Orquesta los casos de uso específicos (`CreateCursoUseCase`, `LoginUseCase`, etc.), garantizando que la lógica del negocio sea agnóstica a la infraestructura.
- **Infrastructure:** Aísla las dependencias externas (Prisma ORM, PostgreSQL, Supabase, bcryptjs, jsonwebtoken, etc.). Si el día de mañana se cambia la base de datos o el proveedor de autenticación, el dominio y los casos de uso permanecen intactos.
- **Interface:** Se encarga únicamente del protocolo HTTP con Express (enrutadores, controladores y middlewares), transformando los datos entrantes (con validación de Zod) y entregando las respuestas.

Esta separación facilita testear los casos de uso mediante mocks o stubs de repositorios sin levantar la base de datos y permite una clara trazabilidad de responsabilidades.

### 2. ¿Por qué las contraseñas se almacenan mediante bcrypt con salt y nunca en texto plano ni con algoritmos rápidos como SHA-256 o MD5?
Almacenar contraseñas en texto plano es una falta grave de seguridad: cualquier filtración accidental o acceso no autorizado a la base de datos expondría inmediatamente las credenciales de todos los usuarios.

Por otro lado, funciones criptográficas rápidas como SHA-256 o MD5 fueron diseñadas para calcular sumas de verificación a alta velocidad (millones por segundo), lo que las hace extremadamente vulnerables a ataques de fuerza bruta modernos y descifrado mediante tablas de arcoíris (Rainbow Tables) utilizando tarjetas gráficas (GPUs).

**Bcrypt**, en cambio:
1. **Es intencionalmente lento y costoso computacionalmente:** Utiliza un factor de costo (`cost factor` o rondas de salt, configurado en 10-12), lo que obliga a un atacante a gastar tiempo y recursos significativos por cada intento de clave, neutralizando los ataques masivos de fuerza bruta.
2. **Genera una sal (`salt`) criptográfica aleatoria única por usuario:** La sal se combina con la contraseña antes del hash, garantizando que dos usuarios con la misma contraseña tengan hashes totalmente distintos almacenados en la base de datos. Esto invalida por completo el uso de tablas preconocidas de arcoíris.

### 3. ¿Por qué el payload del JWT solo incluye identificadores no sensibles (`id`, `role`) y no contiene el correo electrónico, datos de perfil ni permisos detallados?
El payload de un token JWT firmado (JWS) está codificado en Base64Url, lo que significa que **no está cifrado**; cualquier persona o cliente que intercepte el token puede decodificarlo e inspeccionar su contenido directamente sin conocer la clave secreta.

Por esta razón:
1. **Principio de menor exposición y privacidad:** No incluir datos personales como el correo electrónico, nombres o teléfonos evita la filtración de información sensible del usuario en caso de que el token sea visible en logs de red, encabezados o herramientas de depuración.
2. **Prevención de información obsoleta:** Si los datos del perfil o permisos cambiaran en la base de datos, un JWT con datos quemados seguiría mostrando información desactualizada hasta su expiración. Al incluir únicamente `id` y `role`, el backend puede resolver o verificar información actualizada en base de datos cuando sea estrictamente necesario.
3. **Eficiencia y sobrecarga de red:** El token se envía en cada petición HTTP protegida a través del encabezado `Authorization: Bearer <token>`. Mantener un payload mínimo (`id` y `role`) reduce el peso de las cabeceras HTTP y el consumo de ancho de banda.

### 4. ¿Por qué es fundamental que la política de CORS verifique una lista explícita de orígenes autorizados y prohíba el uso de comodines (`*`) cuando se manejan credenciales?
CORS (Cross-Origin Resource Sharing) es un mecanismo de seguridad del navegador que restringe cómo una aplicación web alojada en un origen (dominio/puerto) puede solicitar recursos a una API ubicada en otro origen.

1. **Incompatibilidad estricta del estándar web:** La especificación de CORS prohíbe explícitamente el uso de `Access-Control-Allow-Origin: *` cuando la petición incluye credenciales (`credentials: include` o encabezados de autorización). Si se usara `*`, los navegadores modernos bloquearían automáticamente la respuesta por seguridad.
2. **Prevención de ataques Cross-Origin y robo de sesión:** Si una API autenticada permitiera cualquier origen con un comodín (`*`), cualquier sitio web malicioso visitado por un usuario podría ejecutar peticiones silenciosas a la API aprovechando la sesión o credenciales del usuario (ataques de tipo CSRF / cross-origin data theft).
3. **Control explícito:** Al configurar una lista blanca estricta con `CORS_ORIGIN` (como `http://localhost:3000` en local y la URL definitiva de Vercel en producción), el backend asegura que únicamente el frontend legítimo de NexTech Academy pueda comunicarse con la API y leer las respuestas con datos sensibles.

---

## Evidencia de funcionamiento (Network)

A continuación se muestra la evidencia de la petición HTTP protegida hacia la API con el encabezado `Authorization: Bearer <token>` y la respuesta con código 200 OK del backend:

![Petición de red con cabecera Authorization](docs/network-authorization.png)

*(Ubicación del archivo de captura: `docs/network-authorization.png`)*

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
| **Administrador** | `admin@nextech.com` | `Admin1234!` |
| **Estudiante (User)**| `estudiante@nextech.com` | `User1234!` |

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
