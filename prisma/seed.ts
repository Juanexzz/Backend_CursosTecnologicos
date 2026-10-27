import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CURSOS_REALES = [
  {
    titulo: "Desarrollo Full Stack Moderno con Node.js & TypeScript",
    slug: "full-stack-node-typescript",
    categoria: "web",
    categoriaNombre: "Desarrollo Web",
    nivel: "Intermedio",
    duracionHoras: 48,
    precio: 65,
    calificacion: 4.9,
    totalResenas: 182,
    estudiantes: 1240,
    instructorNombre: "Mateo Silvestre",
    instructorEspecialidad: "Senior Full Stack Engineer & Mentor Open Source",
    instructorAvatar: "assets/img/instructor-mateo.svg",
    instructorBio:
      "Especialista en arquitecturas web modernas con JavaScript/TypeScript, microservicios y diseño de interfaces reactivas y accesibles. Contribuidor activo en librerías open source.",
    destacado: true,
    imagen: "assets/img/curso-fullstack.svg",
    tecnologias: ["Node.js", "TypeScript", "Express", "PostgreSQL", "REST APIs"],
    descripcionCorta:
      "Domina el desarrollo backend y frontend moderno creando arquitecturas escalables y tipadas con TypeScript.",
    descripcionLarga:
      "Aprende a construir aplicaciones web completas y robustas desde cero. Comprenderás la arquitectura cliente-servidor, modelado de bases de datos relacionales con PostgreSQL, autenticación JWT segura y despliegue continuo de APIs de alto rendimiento.",
    requisitos: [
      "Conocimientos sólidos de JavaScript (ES6+)",
      "Conceptos fundamentales de HTML y CSS",
      "Manejo básico de terminal y Git"
    ],
    temario: [
      "Módulo 1: Fundamentos avanzados de TypeScript y configuración modular",
      "Módulo 2: Servidores RESTful con Node.js, Express y Middlewares",
      "Módulo 3: Persistencia relacional con PostgreSQL y migraciones",
      "Módulo 4: Autenticación, seguridad, pruebas unitarias y despliegue"
    ]
  },
  {
    titulo: "Arquitectura Cloud con AWS y Orquestación en Kubernetes",
    slug: "cloud-aws-kubernetes",
    categoria: "cloud",
    categoriaNombre: "Cloud & DevOps",
    nivel: "Avanzado",
    duracionHoras: 60,
    precio: 85,
    calificacion: 4.9,
    totalResenas: 145,
    estudiantes: 980,
    instructorNombre: "Ing. Carlos Mendoza",
    instructorEspecialidad: "Cloud Solutions Architect & DevOps Lead",
    instructorAvatar: "assets/img/instructor-carlos.svg",
    instructorBio:
      "Más de 12 años de trayectoria diseñando infraestructuras distribuidas y de alta disponibilidad en AWS y GCP. Ex-Tech Lead en empresas Fintech de escala internacional.",
    destacado: true,
    imagen: "assets/img/curso-cloud.svg",
    tecnologias: ["AWS", "Kubernetes", "Docker", "Terraform", "EKS"],
    descripcionCorta:
      "Diseña e implementa infraestructura en la nube resiliente, escalable y con alta disponibilidad.",
    descripcionLarga:
      "Profundiza en los servicios esenciales de Amazon Web Services (EC2, VPC, S3, RDS, IAM) y automatiza el aprovisionamiento mediante Infraestructura como Código (IaC) con Terraform. Aprende a orquestar microservicios con Kubernetes y Helm en clusters de producción.",
    requisitos: [
      "Familiaridad con sistemas operativos Linux y bash",
      "Conceptos básicos de redes y virtualización",
      "Manejo fundamental de contenedores Docker"
    ],
    temario: [
      "Módulo 1: Redes seguras (VPC), cómputo elástico (EC2) y almacenamiento S3",
      "Módulo 2: Infraestructura como Código con Terraform",
      "Módulo 3: Arquitectura interna de Kubernetes: Pods, Services e Ingress",
      "Módulo 4: Gestión de clústeres en AWS EKS, escalado automático y monitoreo"
    ]
  },
  {
    titulo: "Machine Learning y Ciencia de Datos Aplicada con Python",
    slug: "machine-learning-python",
    categoria: "ia",
    categoriaNombre: "Inteligencia Artificial",
    nivel: "Intermedio",
    duracionHoras: 52,
    precio: 75,
    calificacion: 5.0,
    totalResenas: 210,
    estudiantes: 1560,
    instructorNombre: "Dra. Elena Ramos",
    instructorEspecialidad: "Ph.D. en Inteligencia Artificial & Data Scientist",
    instructorAvatar: "assets/img/instructor-elena.svg",
    instructorBio:
      "Doctora en Computación e investigadora en redes neuronales profundas y procesamiento del lenguaje natural. Más de una década liderando proyectos de Machine Learning en salud y finanzas.",
    destacado: true,
    imagen: "assets/img/curso-ml.svg",
    tecnologias: ["Python", "Pandas", "Scikit-Learn", "NumPy", "Matplotlib"],
    descripcionCorta:
      "Transforma datos en modelos predictivos de alto valor con algoritmos de aprendizaje supervisado.",
    descripcionLarga:
      "Domina el ciclo de vida completo de un proyecto de Data Science: desde la ingesta, limpieza y análisis exploratorio de datos (EDA), hasta el entrenamiento, validación y optimización de hiperparámetros de modelos de regresión, clasificación y agrupamiento.",
    requisitos: [
      "Fundamentos de programación en Python",
      "Nociones básicas de álgebra lineal y estadística descriptiva",
      "Ganas de resolver problemas orientados a datos"
    ],
    temario: [
      "Módulo 1: Manipulación de datos con NumPy y Pandas",
      "Módulo 2: Visualización avanzada y estadística exploratoria",
      "Módulo 3: Modelos de regresión, árboles de decisión y bosques aleatorios",
      "Módulo 4: Métricas de evaluación, validación cruzada y empaquetado de modelos"
    ]
  },
  {
    titulo: "Ciberseguridad Defensiva y Hacking Ético Profesional",
    slug: "ciberseguridad-hacking-etico",
    categoria: "seguridad",
    categoriaNombre: "Ciberseguridad",
    nivel: "Avanzado",
    duracionHoras: 56,
    precio: 80,
    calificacion: 4.8,
    totalResenas: 168,
    estudiantes: 1120,
    instructorNombre: "Sofía Valenzuela",
    instructorEspecialidad: "Lead Security Analyst & Certified Ethical Hacker (CEH)",
    instructorAvatar: "assets/img/instructor-sofia.svg",
    instructorBio:
      "Consultora senior de seguridad ofensiva y defensiva. Certificada en CISSP y OSCP, con amplia experiencia auditando plataformas críticas bancarias y de comercio electrónico.",
    destacado: true,
    imagen: "assets/img/curso-seguridad.svg",
    tecnologias: ["Kali Linux", "Wireshark", "Burp Suite", "Metasploit", "Nmap"],
    descripcionCorta:
      "Identifica vulnerabilidades críticas, analiza vectores de ataque y protege ecosistemas tecnológicos.",
    descripcionLarga:
      "Aprende la metodología empleada por los analistas de seguridad para auditar redes y aplicaciones web. Realiza escaneos de vulnerabilidades, explota fallos en entornos de prueba controlados (OWASP Top 10) e implementa defensas proactivas para mitigar incidentes.",
    requisitos: [
      "Comprensión de protocolos de red (TCP/IP, HTTP/S, DNS)",
      "Manejo fluido de consola Linux",
      "Fundamentos de desarrollo web y bases de datos"
    ],
    temario: [
      "Módulo 1: Reconocimiento pasivo y activo, escaneo con Nmap y Wireshark",
      "Módulo 2: Vulnerabilidades en aplicaciones web y auditoría con Burp Suite",
      "Módulo 3: Pruebas de penetración controladas y frameworks de explotación",
      "Módulo 4: Bastionado de servidores (Hardening) y respuesta a incidentes"
    ]
  },
  {
    titulo: "Fundamentos de Desarrollo Frontend con HTML5 Semántico & CSS3",
    slug: "frontend-html-css-javascript",
    categoria: "web",
    categoriaNombre: "Desarrollo Web",
    nivel: "Principiante",
    duracionHoras: 36,
    precio: 45,
    calificacion: 4.8,
    totalResenas: 134,
    estudiantes: 1890,
    instructorNombre: "Mateo Silvestre",
    instructorEspecialidad: "Senior Full Stack Engineer & Mentor Open Source",
    instructorAvatar: "assets/img/instructor-mateo.svg",
    instructorBio:
      "Especialista en arquitecturas web modernas con JavaScript/TypeScript, microservicios y diseño de interfaces reactivas y accesibles. Contribuidor activo en librerías open source.",
    destacado: false,
    imagen: "assets/img/curso-frontend.svg",
    tecnologias: ["HTML5", "CSS3", "Grid", "Flexbox", "JavaScript"],
    descripcionCorta:
      "Inicia en el desarrollo web creando páginas semánticas, accesibles y adaptadas a cualquier pantalla.",
    descripcionLarga:
      "Aprende las bases fundamentales sobre las que se construye la web moderna. Comprende el valor de la semántica para el SEO y la accesibilidad, domina los sistemas de maquetación Flexbox y Grid, y añade interactividad pura con JavaScript vanilla.",
    requisitos: [
      "No se requiere experiencia previa en programación",
      "Computador con navegador web y editor de texto (VS Code o similar)",
      "Curiosidad por crear sitios web"
    ],
    temario: [
      "Módulo 1: Estructura semántica de documentos HTML5 y jerarquías de contenido",
      "Módulo 2: Modelo de caja, tipografías y variables de diseño en CSS3",
      "Módulo 3: Layouts modernos y responsive con Flexbox y CSS Grid",
      "Módulo 4: Manipulación del DOM, eventos e interactividad con JavaScript"
    ]
  },
  {
    titulo: "Deep Learning y Modelos Generativos de Lenguaje (LLMs)",
    slug: "deep-learning-llms-pytorch",
    categoria: "ia",
    categoriaNombre: "Inteligencia Artificial",
    nivel: "Avanzado",
    duracionHoras: 64,
    precio: 95,
    calificacion: 5.0,
    totalResenas: 98,
    estudiantes: 740,
    instructorNombre: "Dra. Elena Ramos",
    instructorEspecialidad: "Ph.D. en Inteligencia Artificial & Data Scientist",
    instructorAvatar: "assets/img/instructor-elena.svg",
    instructorBio:
      "Doctora en Computación e investigadora en redes neuronales profundas y procesamiento del lenguaje natural. Más de una década liderando proyectos de Machine Learning en salud y finanzas.",
    destacado: false,
    imagen: "assets/img/curso-deeplearning.svg",
    tecnologias: ["PyTorch", "Hugging Face", "Transformers", "RAG", "Embeddings"],
    descripcionCorta:
      "Construye y ajusta redes neuronales profundas y sistemas basados en arquitecturas Transformers.",
    descripcionLarga:
      "Explora la frontera de la inteligencia artificial generativa. Conoce los principios de los Transformers, la generación de embeddings semánticos, arquitecturas de Retrieval-Augmented Generation (RAG) y técnicas de Fine-Tuning para resolver casos prácticos de negocio.",
    requisitos: [
      "Experiencia intermedia en Python y librerías científicas",
      "Comprensión de cálculo diferencial y álgebra vectorial",
      "Bases sólidas de Machine Learning clásico"
    ],
    temario: [
      "Módulo 1: Redes Neuronales Artificiales y optimización con PyTorch",
      "Módulo 2: Redes convolucionales (CNN) y secuenciales (RNN/LSTM)",
      "Módulo 3: Mecanismos de atención y arquitectura Transformer",
      "Módulo 4: Ecosistema Hugging Face, arquitecturas RAG y Fine-Tuning"
    ]
  },
  {
    titulo: "Automatización DevOps: CI/CD con GitHub Actions y Docker",
    slug: "devops-cicd-github-actions",
    categoria: "cloud",
    categoriaNombre: "Cloud & DevOps",
    nivel: "Intermedio",
    duracionHoras: 40,
    precio: 60,
    calificacion: 4.7,
    totalResenas: 112,
    estudiantes: 860,
    instructorNombre: "Ing. Carlos Mendoza",
    instructorEspecialidad: "Cloud Solutions Architect & DevOps Lead",
    instructorAvatar: "assets/img/instructor-carlos.svg",
    instructorBio:
      "Más de 12 años de trayectoria diseñando infraestructuras distribuidas y de alta disponibilidad en AWS y GCP. Ex-Tech Lead en empresas Fintech de escala internacional.",
    destacado: false,
    imagen: "assets/img/curso-devops.svg",
    tecnologias: ["Docker", "GitHub Actions", "CI/CD", "Linux", "Bash"],
    descripcionCorta:
      "Automatiza pruebas, empaquetado y despliegues continuos sin fricción en tus proyectos de software.",
    descripcionLarga:
      "Aprende a diseñar pipelines de integración y entrega continua para garantizar código confiable en producción. Empaqueta servicios en imágenes Docker livianas y seguras, automatiza suites de testing y despliega hacia servidores remotos de forma transparente.",
    requisitos: [
      "Conocimiento de Git (branches, pull requests, tags)",
      "Uso de línea de comandos en Linux",
      "Experiencia básica desarrollando aplicaciones web"
    ],
    temario: [
      "Módulo 1: Creación de imágenes Docker optimizadas y multi-stage builds",
      "Módulo 2: Orquestación local de microservicios con Docker Compose",
      "Módulo 3: Sintaxis y flujos de trabajo con GitHub Actions",
      "Módulo 4: Publicación en registros (Docker Hub/GHCR) y despliegue automatizado"
    ]
  },
  {
    titulo: "Auditoría de Seguridad y Gestión de Vulnerabilidades Web",
    slug: "auditoria-seguridad-owasp",
    categoria: "seguridad",
    categoriaNombre: "Ciberseguridad",
    nivel: "Principiante",
    duracionHoras: 32,
    precio: 50,
    calificacion: 4.9,
    totalResenas: 87,
    estudiantes: 670,
    instructorNombre: "Sofía Valenzuela",
    instructorEspecialidad: "Lead Security Analyst & Certified Ethical Hacker (CEH)",
    instructorAvatar: "assets/img/instructor-sofia.svg",
    instructorBio:
      "Consultora senior de seguridad ofensiva y defensiva. Certificada en CISSP y OSCP, con amplia experiencia auditando plataformas críticas bancarias y de comercio electrónico.",
    destacado: false,
    imagen: "assets/img/curso-auditoria.svg",
    tecnologias: ["OWASP", "ZAP Proxy", "ISO 27001", "Security Headers", "DevSecOps"],
    descripcionCorta:
      "Aprende a evaluar riesgos, implementar controles y proteger activos digitales según estándares internacionales.",
    descripcionLarga:
      "Comprende los pilares de la seguridad de la información: confidencialidad, integridad y disponibilidad. Aprende a aplicar las recomendaciones de OWASP, analizar cabeceras HTTP de seguridad y estructurar reportes profesionales de vulnerabilidades.",
    requisitos: [
      "Conocimientos generales de cómo opera la web e Internet",
      "Ganas de orientar tu perfil hacia la seguridad informática",
      "Ningún conocimiento previo de hacking requerido"
    ],
    temario: [
      "Módulo 1: Principios de la seguridad de la información y normativas",
      "Módulo 2: El decálogo OWASP Top 10 explicado punto por punto",
      "Módulo 3: Análisis de seguridad automatizado con OWASP ZAP",
      "Módulo 4: Redacción de informes de auditoría y remediación técnica"
    ]
  }
];

async function main() {
  console.log("[Seed] Iniciando siembra idempotente...");

  const saltRounds = 10;

  // Credenciales configurables por variables SEED_* o valores de demostración
  const adminEmail = (process.env["SEED_ADMIN_EMAIL"] ?? "admin@nextech.com").toLowerCase().trim();
  const adminRawPassword = process.env["SEED_ADMIN_PASSWORD"] ?? "Admin1234!";
  const adminPasswordHash = await bcrypt.hash(adminRawPassword, saltRounds);

  const userEmail = (process.env["SEED_USER_EMAIL"] ?? "estudiante@nextech.com").toLowerCase().trim();
  const userRawPassword = process.env["SEED_USER_PASSWORD"] ?? "User1234!";
  const userPasswordHash = await bcrypt.hash(userRawPassword, saltRounds);

  // 1. Usuarios: upsert por email único
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      nombre: "Administrador NexTech",
      role: Role.admin,
      password: adminPasswordHash
    },
    create: {
      nombre: "Administrador NexTech",
      email: adminEmail,
      password: adminPasswordHash,
      role: Role.admin
    }
  });

  const estudiante = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      nombre: "Estudiante NexTech",
      role: Role.user,
      password: userPasswordHash
    },
    create: {
      nombre: "Estudiante NexTech",
      email: userEmail,
      password: userPasswordHash,
      role: Role.user
    }
  });

  console.log(`[Seed] Usuarios verificados: admin (${admin.email}), user (${estudiante.email})`);

  // 2. Cursos reales: upsert por slug único
  let cursosProcesados = 0;
  for (const cursoData of CURSOS_REALES) {
    await prisma.curso.upsert({
      where: { slug: cursoData.slug },
      update: cursoData,
      create: cursoData
    });
    cursosProcesados++;
  }

  console.log(`[Seed] ${cursosProcesados} cursos del catálogo oficial procesados con upsert.`);

  // 3. Inscripción de demostración: upsert por composite unique (userId, cursoId)
  const primerCurso = await prisma.curso.findUnique({
    where: { slug: "full-stack-node-typescript" }
  });

  if (primerCurso) {
    await prisma.inscripcion.upsert({
      where: {
        userId_cursoId: {
          userId: estudiante.id,
          cursoId: primerCurso.id
        }
      },
      update: {
        telefono: "+57 300 123 4567",
        nivel: "intermedio",
        motivacion: "Deseo especializarme en desarrollo full stack y crear aplicaciones robustas con TypeScript y React."
      },
      create: {
        userId: estudiante.id,
        cursoId: primerCurso.id,
        telefono: "+57 300 123 4567",
        nivel: "intermedio",
        motivacion: "Deseo especializarme en desarrollo full stack y crear aplicaciones robustas con TypeScript y React."
      }
    });

    console.log("[Seed] Inscripción de demostración verificada con upsert.");
  }

  const totalCursos = await prisma.curso.count();
  const totalUsuarios = await prisma.user.count();
  const totalInscripciones = await prisma.inscripcion.count();

  console.log(
    `[Seed] Completado con éxito. Estado actual en base de datos: ${totalCursos} cursos, ${totalUsuarios} usuarios, ${totalInscripciones} inscripciones.`
  );
}

main()
  .catch((e) => {
    console.error("[Seed] Error al sembrar la base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
