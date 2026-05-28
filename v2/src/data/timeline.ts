export type TimelineNodeType = "education" | "experience" | "certification";

export interface TimelineItem {
  id:
    | "bitbox-fullstack-qa-2026"
    | "daw-2024-2026"
    | "empire-webdev-2025"
    | "cloud-canary-sysadmin-2024"
    | "asir-2022-2024"
    | "certifications-active";
  yearLabel: string;
  role: string;
  period: string;
  organization: string;
  details: readonly string[];
  nodeType: TimelineNodeType;
}

export const TIMELINE_ITEMS: readonly TimelineItem[] = [
  {
    id: "bitbox-fullstack-qa-2026",
    yearLabel: "2026",
    role: "Full Stack Developer & QA",
    period: "Ene–Abr",
    organization: "Bitbox SL",
    details: ["PHP/Laravel", "Vue.js", "N-Tier Arch", "Docker", "AWS"],
    nodeType: "experience",
  },
  {
    id: "daw-2024-2026",
    yearLabel: "2024–2026",
    role: "Desarrollo de Aplicaciones Web (DAW)",
    period: "Técnico Superior",
    organization: "CIFP Villa de Agüimes",
    details: [],
    nodeType: "education",
  },
  {
    id: "empire-webdev-2025",
    yearLabel: "2025",
    role: "Desarrollador Web",
    period: "May–Jun",
    organization: "Empire Systems",
    details: ["SEO On-Page", "Accesibilidad UX", "Refactorización"],
    nodeType: "experience",
  },
  {
    id: "cloud-canary-sysadmin-2024",
    yearLabel: "2024",
    role: "SysAdmin & Soporte IT",
    period: "Mar–May",
    organization: "Cloud Canary Services",
    details: ["Auditorías preventivas HW", "Troubleshooting", "BIOS"],
    nodeType: "experience",
  },
  {
    id: "asir-2022-2024",
    yearLabel: "2022–2024",
    role: "Administración de Sistemas en Red (ASIR)",
    period: "Técnico Superior",
    organization: "CIFP Villa de Agüimes",
    details: [],
    nodeType: "education",
  },
  {
    id: "certifications-active",
    yearLabel: "ACTIVO",
    role: "Certificaciones y Formación Continua",
    period: "En curso",
    organization: "Actualización profesional permanente",
    details: ["Espacio preparado para inyectar cursos de verano"],
    nodeType: "certification",
  },
] as const;
