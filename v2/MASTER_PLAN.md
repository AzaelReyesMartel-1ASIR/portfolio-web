# MASTER_PLAN.md
# Portfolio — Azael Reyes Martel
# Documento de Especificaciones Técnicas v2.0
# Uso exclusivo: Agente de IA local (Gemini 2.5 / Continue en VSCode / Cursor)

---

> **PROTOCOLO DE USO:**
> Este documento es la fuente de verdad absoluta del proyecto.
> El agente DEBE leerlo completo antes de escribir cualquier línea de código.
> Ante cualquier duda de implementación, este documento prevalece sobre el criterio propio del agente.
> Trabajar fase por fase. No avanzar a la siguiente fase sin confirmación explícita del desarrollador.

---

## ÍNDICE

1. [Contexto del Proyecto](#1-contexto-del-proyecto)
2. [Arquitectura Base](#2-arquitectura-base)
3. [Estructura de Directorios](#3-estructura-de-directorios)
4. [Sistema de Diseño (Design Tokens)](#4-sistema-de-diseño-design-tokens)
5. [Inventario UI/UX — Componentes](#5-inventario-uiux--componentes)
6. [Animaciones y Microinteracciones](#6-animaciones-y-microinteracciones)
7. [Integración DevOps y Backend API](#7-integración-devops-y-backend-api)
8. [Fases de Entrega](#8-fases-de-entrega)
9. [PROMPT MAESTRO PARA EL IDE](#9-prompt-maestro-para-el-ide)
10. [Criterios de Aceptación Globales](#10-criterios-de-aceptación-globales)

---

## 1. CONTEXTO DEL PROYECTO

### 1.1 Identidad del propietario
- **Nombre:** Azael Reyes Martel
- **Perfil:** Software Engineer — Backend · SysAdmin · Docker · Laravel
- **Formación:** Técnico Superior ASIR + Técnico Superior DAW
- **Ubicación:** Islas Canarias, España
- **Disponibilidad dual:**
  - Proyectos freelance (B2B con pequeños negocios locales)
  - Posiciones en equipos técnicos (contratos y full-time)
- **GitHub:** `https://github.com/AzaelReyesMartel-1ASIR`
- **LinkedIn:** `https://www.linkedin.com/in/azael-reyes-a18996329/`

### 1.2 Objetivo del portfolio
Herramienta de conversión activa, no un portfolio estático. Debe:
- Transmitir competencia técnica real desde el primer scroll
- Diferenciar al desarrollador por estética y profundidad técnica
- Funcionar como punto de contacto con validación backend propia
- Ser migrable y escalable (Astro latest)
- **[NUEVO]** Apuntar a mercado remoto internacional (Soporte i18n nativo)

### 1.3 Estética general
**"Corporate Hacker"** — la intersección entre la precisión de un SRE y el diseño de producto moderno.
No es una estética cyberpunk recargada. Es dark, precisa, tipográficamente fuerte, con detalles técnicos que un reclutador o cliente nota pero no puede describir exactamente.
Referencia mental: cómo se vería el dashboard de monitoreo de un equipo de DevOps si contrataran a un diseñador de Linear.app.

---

## 2. ARQUITECTURA BASE (Actualizada)

### 2.1 Frontend

| Capa | Tecnología | Justificación |
|---|---|---|
| Framework | **Astro (v5/v6 latest)** | SSG por defecto, hidratación selectiva, 0 JS innecesario |
| Estilos | **Tailwind CSS v4** | Utility-first, purge automático, tokens vía `@theme` en CSS |
| Fuentes | Google Fonts (self-hosted via script) | Sin dependencia externa en producción |
| Iconos | **Lucide Icons** (via `astro-icon`) | SVG inline, tree-shakeable |
| Animaciones JS | Vanilla TS (sin librerías) | Menor bundle, mayor control (requestAnimationFrame) |
| Tipografía 1 | `JetBrains Mono` — pesos 400, 500, 600 | Todo elemento terminal/código/mono |
| Tipografía 2 | `Syne` — pesos 700, 800 | Headings y el nombre en el logo/hero |
| Tipografía 3 | `Manrope` — pesos 400, 500, 600, 700 | Cuerpo de texto, UI general |

**Decisión Arquitectónica (Pivote v2.0):** Se ha descartado el monorepo estricto (`apps/web`, `apps/api`). Todo el ecosistema Astro cuelga directamente de la raíz `v2/` por eficiencia operativa. Las subcarpetas de backend/infra colgarán de este mismo nivel cuando se requieran.

### 2.2 Backend API

| Capa | Tecnología | Justificación |
|---|---|---|
| Runtime | **Node.js 20 LTS** con **Hono.js** | Ligero, tipado, edge-ready |
| Alternativa | **Laravel 11** (si se prefiere PHP) | Ya en el stack del dev, familiar |
| Validación | Zod (Node) o Laravel Form Requests | Sanitización estricta de inputs |
| Rate limiting | `@hono/rate-limiter` o Laravel Throttle | Protección anti-spam en formulario |
| CORS | Configurado para el dominio de producción únicamente | Seguridad |
| Puerto | `3001` (interno Docker) | No expuesto directamente |

### 2.3 Infraestructura

| Componente | Tecnología | Configuración |
|---|---|---|
| Contenedorización | **Docker** + **Docker Compose** | Un servicio por responsabilidad |
| Proxy inverso | **Nginx** | SSL termination + routing |
| SSL | Certbot / Let's Encrypt | Auto-renovación |
| Hosting | **AWS EC2** (t3.micro) o equivalente VPS | Mismo stack que Lotusblack |
| CI/CD | **GitHub Actions** | Build → Push → Deploy en cada `main` push |
| Registry | GitHub Container Registry (GHCR) | Gratuito para proyectos personales |

### 2.4 Dominio de API

Todos los endpoints bajo `/api/v1/`:

POST /api/v1/contact     → Formulario de contacto (sanitizado + rate limited)
GET  /api/v1/status      → Estado de disponibilidad en tiempo real
GET  /api/v1/health      → Health check del servicio (para Docker)


---

## 3. ESTRUCTURA DE DIRECTORIOS (Raíz `v2/`)

v2/
├── public/
│   ├── favicon.svg         # Logo pixel heart SVG
│   ├── img/
│   │   └── YO-FORMAL.png   # Foto estricta de perfil
│   └── fonts/              # @fontsource self-hosted
├── src/
│   ├── components/
│   │   ├── layout/         # Header, Footer, Layout
│   │   ├── sections/       # Hero, About, Skills, Projects, etc.
│   │   └── ui/             # Logo, Terminal, Cursor, Cards, etc.
│   ├── scripts/            # Vanilla TS animaciones y listeners
│   ├── data/               # Estructura de datos strict typed
│   ├── styles/
│   │   ├── global.css      # Reset + @theme Tailwind v4 + keyframes
│   │   └── fonts.css       # @font-face
│   └── pages/
│       └── index.astro     # Página principal
├── api/                    # Backend API (Fase 4/5)
├── infra/                  # Nginx, Docker (Fase 5)
├── astro.config.mjs
├── package.json
└── tsconfig.json


---

## 4. SISTEMA DE DISEÑO (DESIGN TOKENS Tailwind v4)

En la versión actual **NO existe** `tailwind.config.mjs`. Todos los tokens se declaran mediante directivas `@theme` en `src/styles/global.css`.

### 4.1 Inyección en `global.css`

```css
@import "tailwindcss";
@import "./fonts.css";

@theme {
  --color-bg: #04081a;
  --color-surf: #080f24;
  --color-card: #0c1530;
  --color-sky: #38bdf8;
  --color-violet: #a78bfa;
  --color-green: #34d399;
  --color-orange: #fb923c;
  --color-red: #f87171;
  --color-muted: #7a90bb;
  --color-ink: #e0eaff;
  
  --font-display: "Syne", sans-serif;
  --font-body: "Manrope", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  --animate-grad-move: gradMove 4s linear infinite alternate;
  --animate-morph-blob: morphBlob 10s ease-in-out infinite;
  --animate-float-y: floatY 5s ease-in-out infinite;
  --animate-dot-pulse: dotPulse 2s ease-in-out infinite;
  --animate-marquee-run: marqueeRun 26s linear infinite;
  --animate-term-blink: termBlink 0.7s step-end infinite;
  --animate-scanline: scanline 4s linear infinite;
  --animate-glow-pulse: glowPulse 4s ease-in-out infinite;
}

:root {
  --border: rgba(255, 255, 255, 0.065);
}
5. INVENTARIO UI/UX — COMPONENTES
5.1 Logo: Pixel heart en SVG con scramble effect en hover.

5.2 Header: Glassmorphism en .scrolled, progress bar.

5.3 Hero: Terminal interactiva (terminal.ts) y PhotoBlob con máscara animada. (Foto obligatoria: /img/YO-FORMAL.png).

5.4 Marquee: Franja con listado del Stack Técnico.

5.5 About (Bento Grid): Layout asimétrico con métricas animadas por intersection observer.

5.6 Skills: Cards con Spotlight effect. SysAdmin grande con barras de progreso.

5.7 Architecture: Diagrama de despliegue CI/CD y N-Tier.

5.8 Projects: Integración de los datos estáticos desde src/data/projects.ts.

5.9 Git Timeline: Trayectoria leída desde src/data/timeline.ts con tipado de nodos.

5.10 Contacto: Enlaces magnéticos y badge de API status.

5.11 Footer: Firma técnica y quick links.

6. ANIMACIONES Y MICROINTERACCIONES
(Algoritmos en Vanilla JS/TS puro en src/scripts/)

Custom Cursor Trail (cursor.ts) con mix-blend-mode: difference.

Scroll Reveals (reveal.ts) mediante IntersectionObserver.

Text Scramble (scramble.ts) usando requestAnimationFrame.

Spotlight Cards (spotlight.ts) con coordenadas del ratón actualizando CSS vars.

Contadores (counters.ts) animados al hacer scroll.

7. INTEGRACIÓN DEVOPS Y BACKEND API
(Pendiente para Fases 5)

8. FASES DE ENTREGA (Estado Actualizado)
FASE 0 — Scaffolding y configuración [COMPLETADA]
Astro v5+, Tailwind v4, @theme, fuentes self-hosted, reset global y archivos de datos strict-typed (projects.ts, skills.ts, timeline.ts). Estructura en raíz de v2/.

FASE 1 — Layout y Header [COMPLETADA]
Layout.astro, Header.astro, Footer.astro, Logo.astro y cursor interactivo (cursor.ts).

FASE 2 — Hero Section [COMPLETADA]
Hero.astro con terminal animada (terminal.ts), máscara morphing blob de la imagen (YO-FORMAL.png) y efecto encriptado (scramble.ts).

FASE 3 — Secciones de contenido: Sobre Mí & Trayectoria [COMPLETADA]
Bento Grid (About.astro) consumiendo timeline.ts y métricas. Optimización con reveal.ts y counters.ts.

FASE 4 — Sección de Proyectos [ACTIVA]
Duración estimada: 1 sesión

[ ] Crear ProjectCard.astro consumiendo ProjectItem.

[ ] Crear Projects.astro iterando el dataset.

[ ] Inyectar Spotlight y Reveal observer a las tarjetas.

FASE 5 — Sección de Habilidades, DevOps y API
Duración estimada: 1-2 sesiones

[ ] Crear Skills.astro y BentoCards secundarias.

[ ] Crear Architecture.astro para diagrama CI/CD.

[ ] Crear Contact.astro con status fetching.

[ ] Dockerfiles y docker-compose.yml base.

FASE 6 — Internacionalización y Escalabilidad (i18n) [NUEVO]
Duración estimada: 1-2 sesiones

[ ] Configurar i18n nativo de Astro (astro.config.mjs con locales es y en).

[ ] Crear diccionarios de traducción en src/i18n/ (es.ts, en.ts).

[ ] Refactorizar src/data/ (projects, skills, timeline) a formatos traducibles.

[ ] Implementar middleware de enrutamiento para prefijos de idioma (/es/, /en/).

[ ] Añadir selector de idioma (Toggle ES/EN) en el Header.astro.

FASE 7 — Polish y Optimización
[ ] Lighthouse score ≥ 95.

[ ] Revisión responsive profunda y accesibilidad.

9. PROMPT MAESTRO PARA EL IDE
INSTRUCCIONES DE USO:
Carga el contexto llamando a @MASTER_PLAN.md y pega este bloque en una nueva sesión para mantener a la IA en su rol.

Plaintext
SYSTEM PROMPT — AGENTE DE DESARROLLO: PORTFOLIO AZAEL REYES

═══════════════════════════════════════════════════════════════
ROL Y MISIÓN
═══════════════════════════════════════════════════════════════
Eres un arquitecto fullstack senior especializado en Astro, Tailwind CSS, TypeScript y DevOps. Tu misión es construir el portfolio de Azael Reyes Martel leyendo estrictamente el MASTER_PLAN.md.

ESTADO ACTUAL: Las Fases 0, 1, 2 y 3 están 100% COMPLETADAS.
ARQUITECTURA ACTUAL: Raíz en `v2/`, usamos Astro v5+ y Tailwind v4 puro.

═══════════════════════════════════════════════════════════════
RESTRICCIONES DURAS (nunca violar)
═══════════════════════════════════════════════════════════════
1. NO librerías de animación. Todo es CSS + Vanilla JS (RAF, IntersectionObserver).
2. Tailwind v4 puro. Los tokens están en `global.css` vía `@theme`. No existe tailwind.config.mjs.
3. Foto de perfil: SIEMPRE `/img/YO-FORMAL.png`.
4. Tipado estricto en TS. Sin `any`.
5. Estilos acotados dentro del `<style>` de los componentes `.astro` cuando Tailwind no alcance.

═══════════════════════════════════════════════════════════════
FLUJO DE TRABAJO
═══════════════════════════════════════════════════════════════
1. Anuncia el archivo a crear y su propósito.
2. Escribe su código COMPLETO, sin truncar.
3. Menciona dónde debe importarse.
4. Espera el comando "siguiente" para continuar.
10. CRITERIOS DE ACEPTACIÓN GLOBALES
10.1 Funcionales
[ ] Terminal boot sequence completa y funcional

[ ] Efecto Text Scramble en nombre del hero al hover

[ ] Scroll reveals funcionan en todos los componentes

[ ] Cursor custom deshabilitado en touch devices

[ ] Soporte i18n estructurado (ES/EN)

10.2 Visuales
[ ] Paleta de colores 100% consistente con §4

[ ] Grid bento asimétrico (3 columnas, card grande span 2 filas)

[ ] Sin elementos visualmente desequilibrados en mobile

10.3 Técnicos
[ ] Lighthouse Performance ≥ 95

[ ] Sin warnings de TypeScript (strict: true)

[ ] docker-compose up -d levanta el stack completo sin errores

MASTER_PLAN.md — v2.0 — Revisión Arquitectónica y Fase i18n añadida