export type SkillAccent = "sky" | "violet" | "green" | "orange";

export interface SkillBar {
  label: string;
  value: number;
}

export interface SkillGroup {
  id: "systems-devops" | "backend-db" | "frontend-ui" | "network-security";
  title: string;
  accent: SkillAccent;
  tags: readonly string[];
  bars?: readonly SkillBar[];
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: "systems-devops",
    title: "Sistemas & DevOps",
    accent: "sky",
    tags: ["Linux", "Docker", "AWS EC2", "Nginx", "Bash", "SSH"],
    bars: [
      { label: "Linux", value: 88 },
      { label: "Docker", value: 82 },
      { label: "Nginx", value: 78 },
      { label: "AWS", value: 70 },
    ],
  },
  {
    id: "backend-db",
    title: "Backend & DB",
    accent: "violet",
    tags: ["Laravel", "PHP 8", "PostgreSQL", "MySQL", "REST APIs"],
  },
  {
    id: "frontend-ui",
    title: "Frontend & UI",
    accent: "green",
    tags: ["HTML5", "CSS3", "JavaScript", "React", "Vite"],
  },
  {
    id: "network-security",
    title: "Redes & Seguridad",
    accent: "orange",
    tags: ["TCP/IP", "SSL/TLS", "Firewalls", "VPN", "VLSM", "DNS"],
  },
] as const;
