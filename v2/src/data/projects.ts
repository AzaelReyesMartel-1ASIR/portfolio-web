export type ProjectAccent = "sky" | "violet" | "green";

export interface ProjectItem {
  id:
    | "portfolio-web"
    | "lotusblack-ecommerce"
    | "shopping-cart-e2e"
    | "openbio-waas"
    | "zero-trust-edge";
  title: string;
  description: string;
  accent: ProjectAccent;
  featured: boolean;
  isNew?: boolean;
  stack: readonly string[];
  githubUrl: string;
  /** Optional dual-theme preview image paths (from /public) */
  imageDark?: string;
  imageLight?: string;
  videoSrc?: string;
  videoPoster?: string;
  singleImage?: string;
  singleImageAlt?: string;
}

export const PROJECTS: readonly ProjectItem[] = [
  {
    id: "lotusblack-ecommerce",
    title: "Lotusblack E-commerce",
    description:
      "E-commerce fullstack desplegado con arquitectura real de producción, CI/CD y contenedores.",
    accent: "violet",
    featured: true,
    stack: ["Laravel", "React", "Docker", "AWS EC2", "PostgreSQL", "Nginx"],
    githubUrl: "https://github.com/ItsBreo/tienda-magic",
  },
  {
    id: "zero-trust-edge",
    title: "Zero-Trust Edge API",
    description:
      "API Gateway Serverless desplegado en la red perimetral (Edge). Arquitectura protegida por autenticación de JWT efímeros, políticas WAF y mitigación de inyecciones SQL por diseño.",
    accent: "green",
    featured: false,
    isNew: true,
    stack: ["Cloudflare Workers", "Hono.js", "D1 SQLite", "Drizzle ORM"],
    githubUrl: "https://github.com/AzaelReyesMartel-1ASIR/zero-trust-edge",
    singleImage: "/img/architecture-diagram.webp",
    singleImageAlt: "Diagrama de Arquitectura Zero-Trust",
  },
  {
    id: "openbio-waas",
    title: "OpenBio & WaaS Console",
    description:
      "Plataforma Link-in-Bio de alto rendimiento con panel de administración privado. Implementación de Drag & Drop nativo, estado global optimista e integración de notificaciones en tiempo real vía Webhooks (Discord).",
    accent: "sky",
    featured: false,
    isNew: true,
    stack: ["React 19", "Zustand", "TailwindCSS", "Vercel"],
    githubUrl: "https://github.com/AzaelReyesMartel-1ASIR/dashboard-waas",
    videoSrc: "/video/openbio-demo.mp4",
    videoPoster: "/img/openbio-poster.webp",
  },
  {
    id: "portfolio-web",
    title: "Portfolio Profesional",
    description:
      "Portfolio personal orientado a conversión con foco en backend, sistemas y despliegue.",
    accent: "sky",
    featured: false,
    stack: ["Astro", "TypeScript", "Tailwind CSS", "Docker", "Nginx"],
    githubUrl: "https://github.com/AzaelReyesMartel-1ASIR/portfolio-web",
    imageDark:  "/img/portfolio.webp",
    imageLight: "/img/portfolio-claro.webp",
  },
  {
    id: "shopping-cart-e2e",
    title: "Carrito & E2E Testing",
    description:
      "Aplicación de carrito con cobertura de pruebas end-to-end y enfoque en QA automatizado.",
    accent: "green",
    featured: false,
    stack: ["JavaScript", "Selenium", "QA", "Testing"],
    githubUrl: "https://github.com/AzaelReyesMartel-1ASIR/shopping-cart-js",
  },
] as const;
