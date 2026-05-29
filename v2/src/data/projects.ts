export type ProjectAccent = "sky" | "violet" | "green";

export interface ProjectItem {
  id: "portfolio-web" | "lotusblack-ecommerce" | "shopping-cart-e2e";
  title: string;
  description: string;
  accent: ProjectAccent;
  featured: boolean;
  stack: readonly string[];
  githubUrl: string;
  /** Optional dual-theme preview image paths (from /public) */
  imageDark?: string;
  imageLight?: string;
}

export const PROJECTS: readonly ProjectItem[] = [
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
