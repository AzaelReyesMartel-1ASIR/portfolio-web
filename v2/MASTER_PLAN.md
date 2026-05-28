# MASTER_PLAN.md
# Portfolio — Azael Reyes Martel
# Documento de Especificaciones Técnicas v1.0
# Uso exclusivo: Agente de IA local (Gemini 2.5 / Continue en VSCode)

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
- Ser migrable y escalable (de HTML/Vite actual a Astro)

### 1.3 Estética general
**"Corporate Hacker"** — la intersección entre la precisión de un SRE y el diseño de producto moderno.
No es una estética cyberpunk recargada. Es dark, precisa, tipográficamente fuerte, con detalles técnicos que un reclutador o cliente nota pero no puede describir exactamente.
Referencia mental: cómo se vería el dashboard de monitoreo de un equipo de DevOps si contrataran a un diseñador de Linear.app.

---

## 2. ARQUITECTURA BASE

### 2.1 Frontend

| Capa | Tecnología | Justificación |
|---|---|---|
| Framework | **Astro 4.x** | SSG por defecto, hidratación selectiva, 0 JS innecesario |
| Estilos | **Tailwind CSS v3** | Utility-first, purge automático, compatible con Astro |
| Fuentes | Google Fonts (self-hosted via `@fontsource`) | Sin dependencia externa en producción |
| Iconos | **Lucide Icons** (via `astro-icon`) | SVG inline, tree-shakeable |
| Animaciones JS | Vanilla JS (sin librerías de animación) | Menor bundle, mayor control |
| Tipografía 1 | `JetBrains Mono` — pesos 400, 500, 600 | Todo elemento terminal/código/mono |
| Tipografía 2 | `Syne` — pesos 700, 800 | Headings y el nombre en el logo/hero |
| Tipografía 3 | `Manrope` — pesos 400, 500, 600, 700 | Cuerpo de texto, UI general |

**Notas de hidratación Astro:**
- `client:load` → Terminal emulator, cursor trail, spotlight cards
- `client:visible` → Scroll reveal, skill bars, stat counters
- `client:only="vanilla"` → Cursor personalizado (evitar SSR de `document`)
- Todo lo demás → sin directiva (HTML estático puro)

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

**Servicios Docker Compose:**
```
portfolio-frontend   → Astro build estático servido por Nginx
portfolio-api        → API Node.js/Hono en puerto 3001
portfolio-nginx      → Proxy: HTTPS :443 → frontend + /api/* → backend
```

### 2.4 Dominio de API

Todos los endpoints bajo `/api/v1/`:

```
POST /api/v1/contact     → Formulario de contacto (sanitizado + rate limited)
GET  /api/v1/status      → Estado de disponibilidad en tiempo real
GET  /api/v1/health      → Health check del servicio (para Docker)
```

---

## 3. ESTRUCTURA DE DIRECTORIOS

```
portfolio/
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline
│
├── apps/
│   ├── web/                        # Astro frontend
│   │   ├── public/
│   │   │   ├── favicon.svg         # Logo pixel heart SVG
│   │   │   └── fonts/              # @fontsource self-hosted
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.astro
│   │   │   │   │   ├── Footer.astro
│   │   │   │   │   └── Layout.astro
│   │   │   │   ├── sections/
│   │   │   │   │   ├── Hero.astro
│   │   │   │   │   ├── About.astro
│   │   │   │   │   ├── Skills.astro
│   │   │   │   │   ├── Architecture.astro
│   │   │   │   │   ├── Projects.astro
│   │   │   │   │   ├── Timeline.astro
│   │   │   │   │   └── Contact.astro
│   │   │   │   └── ui/
│   │   │   │       ├── Logo.astro
│   │   │   │       ├── Terminal.astro
│   │   │   │       ├── PhotoBlob.astro
│   │   │   │       ├── BentoCard.astro
│   │   │   │       ├── ProjectCard.astro
│   │   │   │       ├── GitTimeline.astro
│   │   │   │       ├── Badge.astro
│   │   │   │       ├── Tag.astro
│   │   │   │       ├── Cursor.astro
│   │   │   │       ├── Marquee.astro
│   │   │   │       └── ArchDiagram.astro
│   │   │   ├── scripts/
│   │   │   │   ├── cursor.ts       # Cursor trail + magnetic
│   │   │   │   ├── terminal.ts     # Boot sequence typing
│   │   │   │   ├── scramble.ts     # Text scramble effect
│   │   │   │   ├── spotlight.ts    # Card spotlight on mousemove
│   │   │   │   ├── reveal.ts       # IntersectionObserver reveals
│   │   │   │   ├── counters.ts     # Animated stat counters
│   │   │   │   └── status.ts       # Fetch availability from API
│   │   │   ├── data/
│   │   │   │   ├── projects.ts     # Proyectos con tipos
│   │   │   │   ├── skills.ts       # Skills con colores y pesos
│   │   │   │   ├── timeline.ts     # Items del git timeline
│   │   │   │   └── services.ts     # Servicios freelance + precios
│   │   │   ├── styles/
│   │   │   │   ├── global.css      # Reset + CSS vars + keyframes
│   │   │   │   └── fonts.css       # @font-face self-hosted
│   │   │   ├── pages/
│   │   │   │   └── index.astro     # Página principal
│   │   │   └── env.d.ts
│   │   ├── astro.config.mjs
│   │   ├── tailwind.config.mjs
│   │   └── package.json
│   │
│   └── api/                        # Backend API
│       ├── src/
│       │   ├── routes/
│       │   │   ├── contact.ts
│       │   │   ├── status.ts
│       │   │   └── health.ts
│       │   ├── middleware/
│       │   │   ├── rateLimit.ts
│       │   │   ├── sanitize.ts
│       │   │   └── cors.ts
│       │   └── index.ts            # Hono app entry
│       ├── Dockerfile
│       └── package.json
│
├── infra/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── ssl/                    # Certbot volume mount
│   └── docker-compose.yml
│
├── img/
│   └── miFoto_ORLA.webp            # Foto de perfil (existente)
│
└── CV/
    └── AZAEL.pdf                   # CV descargable (existente)
```

---

## 4. SISTEMA DE DISEÑO (DESIGN TOKENS)

### 4.1 Paleta de colores

Definir en `tailwind.config.mjs` como extensión de tema Y en `global.css` como CSS custom properties:

```
--bg:      #04081a   → Fondo base (midnight navy profundo)
--surf:    #080f24   → Superficie secundaria (header, secciones alternas)
--card:    #0c1530   → Fondo de tarjetas, terminal, code windows
--border:  rgba(255,255,255,0.065) → Bordes generales
--text:    #e0eaff   → Texto principal
--muted:   #7a90bb   → Texto secundario, labels, placeholders
--sky:     #38bdf8   → Acento primario (cian eléctrico)
--violet:  #a78bfa   → Acento secundario (púrpura)
--green:   #34d399   → Estado positivo / disponibilidad / OK logs
--orange:  #fb923c   → Advertencias / proyectos alternativos
--red:     #f87171   → Errores en terminal
```

**Gradiente principal (texto animado):**
```
linear-gradient(135deg, #38bdf8 0%, #818cf8 55%, #a78bfa 100%)
background-size: 200%
animation: gradMove 4s linear infinite alternate
```

### 4.2 Tipografía

| Rol | Fuente | Pesos | Uso |
|---|---|---|---|
| Display / Headings | `Syne` | 700, 800 | H1, H2, nombre en hero, logo |
| UI / Body | `Manrope` | 400, 500, 600, 700 | Párrafos, botones, nav, labels |
| Mono / Terminal | `JetBrains Mono` | 400, 500, 600 | Terminal, código, badges técnicos, `section-label` |

**Escala tipográfica (clamp responsivo):**
```
hero-name:     clamp(2.8rem, 6vw, 4.5rem)
section-title: clamp(1.8rem, 4vw, 2.5rem)
section-label: 0.72rem — siempre JetBrains Mono, color: --sky
body:          0.94rem - 0.97rem
small/tag:     0.72rem - 0.75rem
```

### 4.3 Espaciado

Sistema base 4px. Secciones con `padding: 7rem 0`. Cards con `border-radius: 20px`. Chips/badges con `border-radius: 999px`.

### 4.4 Sombras y efectos de profundidad

```
card-default:   border: 1px solid var(--border)
card-featured:  border + box-shadow: 0 0 30px rgba(accent, 0.12)
card-hover:     translateY(-6px) + box-shadow: 0 24px 50px rgba(0,0,0,0.3)
photo-blob:     box-shadow: 0 0 60px rgba(56,189,248,0.25) — animado a 0.5
terminal:       box-shadow: 0 0 0 1px rgba(56,189,248,0.06), 0 24px 60px rgba(0,0,0,0.5)
```

### 4.5 Tailwind config (extensiones clave)

```javascript
// tailwind.config.mjs
theme: {
  extend: {
    colors: {
      bg: '#04081a', surf: '#080f24', card: '#0c1530',
      sky: '#38bdf8', violet: '#a78bfa', green: '#34d399',
      orange: '#fb923c', muted: '#7a90bb', ink: '#e0eaff',
    },
    fontFamily: {
      display: ['Syne', 'sans-serif'],
      body:    ['Manrope', 'sans-serif'],
      mono:    ['JetBrains Mono', 'monospace'],
    },
    animation: {
      'grad-move':   'gradMove 4s linear infinite alternate',
      'morph-blob':  'morphBlob 10s ease-in-out infinite',
      'float-y':     'floatY 5s ease-in-out infinite',
      'dot-pulse':   'dotPulse 2s ease-in-out infinite',
      'marquee-run': 'marqueeRun 26s linear infinite',
      'term-blink':  'termBlink 0.7s step-end infinite',
      'scanline':    'scanline 4s linear infinite',
    }
  }
}
```

---

## 5. INVENTARIO UI/UX — COMPONENTES

### 5.1 LOGO SVG — `Logo.astro`

**Concepto:** Pixel art heart al estilo Undertale. Construido exclusivamente con elementos `<rect>` SVG (sin paths). En el centro del cuerpo del corazón, texto `>_` en `font-family: monospace`, color `#04081a` (fondo del proyecto para contraste total).

**Especificación técnica del SVG:**
- `viewBox="0 0 20 16"`
- `shape-rendering="crispEdges"` (obligatorio para pixel art)
- Sin `width`/`height` fijos en el SVG interno (se controla desde el componente padre)
- Color de píxeles: `#38bdf8` (--sky)
- Distribución de rectángulos (pixel size = 2 unidades por celda):

```
Fila 0 (y=0):  x=4  w=4  — bump izquierdo
               x=12 w=4  — bump derecho
Fila 1 (y=2):  x=2  w=16 — hombros del corazón
Fila 2 (y=4):  x=0  w=20 — cuerpo lleno (también fila 3)
Fila 3 (y=6):  x=0  w=20 — cuerpo lleno
Fila 4 (y=8):  x=2  w=16 — inicio estrechez
Fila 5 (y=10): x=4  w=12
Fila 6 (y=12): x=6  w=8
Fila 7 (y=14): x=8  w=4  — punta inferior
```

- Texto `>_`: `x="10" y="7"` `font-size="3.5"` `text-anchor="middle"` `dominant-baseline="middle"`

**Usos:**
1. `public/favicon.svg` — logo de la pestaña del navegador
2. Inline en `Header.astro` — tamaño `28x22px`
3. Opcional: sección footer como marca de agua pequeña

**Comportamiento:** Al hacer hover sobre el logo en el header, aplicar el efecto Text Scramble (ver §6.3) sobre el texto `.dev` del logotipo.

---

### 5.2 HEADER — `Header.astro`

**Comportamiento:**
- Posición: `fixed`, `top: 0`, `z-index: 1000`
- Estado inicial: `background: transparent`, sin borde inferior
- Estado `.scrolled` (JS añade clase cuando `scrollY > 40`):
  - `background: rgba(4, 8, 26, 0.88)`
  - `backdrop-filter: blur(20px)`
  - `border-bottom: 1px solid var(--border)`
  - Transición suave: `0.3s ease`

**Contenido:**
- Logo (izquierda)
- Navegación central: Inicio · Sobre mí · Skills · Proyectos · Contacto
- Controles (derecha): botón tema + botón menú hamburguesa (solo mobile)

**Nav links:** underline animado al hover (`::after` pseudo-elemento, width 0→100%).

**Scroll progress bar:** `div#scroll-bar` con `position: fixed; top: 0; height: 2px; background: gradient sky→violet; z-index: 2000`. Width actualizado por JS en tiempo real.

---

### 5.3 HERO SECTION — `Hero.astro`

**Layout:** Grid de 2 columnas en desktop (`1fr 380px`), columna única en mobile.

#### 5.3.1 Columna Izquierda (hero-left)

**A) Saludo + Nombre:**
```
$ whoami                              ← JetBrains Mono, color: --muted
Azael Reyes                          ← Syne 800, clamp(2.8rem, 6vw, 4.5rem), grad-text animado
```

**B) Rol con efecto typing:**
```
> [texto que cambia]|                 ← JetBrains Mono, color: --sky
```
Roles que itera (ciclo infinito con delete):
1. `Software Engineer`
2. `Backend Developer`
3. `SysAdmin · Docker`
4. `Laravel Developer`

Cursor `|` implementado con elemento inline + animación `termBlink`.

**C) Badges de disponibilidad dual** (simultáneos, visibles a la vez):

Badge 1 — **B2B & Teams** (cian):
- Background: `rgba(56,189,248,0.10)`
- Border: `1px solid rgba(56,189,248,0.30)`
- Color texto: `var(--sky)`
- Dot: `background: var(--sky)`, `box-shadow: 0 0 8px var(--sky)`, animación `dotPulse`

Badge 2 — **Freelance Open** (verde):
- Background: `rgba(52,211,153,0.10)`
- Border: `1px solid rgba(52,211,153,0.30)`
- Color texto: `var(--green)`
- Dot: `background: var(--green)`, `box-shadow: 0 0 8px var(--green)`, animación `dotPulse` con `animation-delay: 0.5s`

Los dots parpadean de forma desincronizada. Ambos badges son **siempre visibles simultáneamente**, en fila horizontal con `gap: 0.65rem`.

**D) Terminal Emulator (`Terminal.astro` / `terminal.ts`):**

Componente visualmente idéntico a una ventana de terminal macOS:
- Chrome bar: dots rojo `#ff5f57`, amarillo `#febc2e`, verde `#28c840` + título `azael@canarias:~$`
- Body: `background: #050b1a`, fuente `JetBrains Mono 0.73rem`, `line-height: 1.9`
- Efecto scanline: pseudo-elemento `::after` con animación `scanline` (franja translúcida que sube)
- Altura mínima: `182px`

**Secuencia de boot (typing carácter a carácter):**
```
Línea 1 (delay: 0ms):      $ ./boot_profile.sh --verbose          color: --sky
Línea 2 (delay: 350ms):    [....] Initializing kernel...          color: --muted
Línea 3 (delay: 800ms):    [OK]   Docker daemon started           color: --green
Línea 4 (delay: 1250ms):   [OK]   PostgreSQL :: connected         color: --green
Línea 5 (delay: 1700ms):   [OK]   Laravel API :: port 8000        color: --green
Línea 6 (delay: 2150ms):   [OK]   Nginx :: proxy_pass ready       color: --green
Línea 7 (delay: 2550ms):   [OK]   SSL/TLS :: cert valid 365d      color: --green
Línea 8 (delay: 2950ms):   [WARN] Frontend: vanilla mode          color: --orange
Línea 9 (delay: 3400ms):   > Stack ready. Loading engineer_       color: --violet
```

Velocidad de tipado: 28ms por carácter + ruido aleatorio de ±15ms para efecto orgánico. El guión bajo al final de la última línea actúa como cursor de terminal que parpadea indefinidamente tras completar la secuencia.

**E) CTAs:**
- Botón primario: `gradient(135deg, #0ea5e9, #818cf8)`, texto `#fff`, clase `magnetic`
- Botón outline: `border: 1.5px solid rgba(56,189,248,0.38)`, texto `var(--sky)`, clase `magnetic`

**F) Tech pills:**
Chips no interactivos. Colores por categoría:
- sky (cian): Docker, Linux, AWS, Nginx
- violet: Laravel, PHP
- green: PostgreSQL

#### 5.3.2 Columna Derecha — `PhotoBlob.astro`

**Elemento central:** Imagen `img/miFoto_ORLA.webp` contenida en un blob que cambia de forma.

**Especificación precisa:**
```
Contenedor exterior (anillo):
  width/height: 300px
  animation: morphBlob 10s ease-in-out infinite
  border-radius inicial: "60% 40% 30% 70% / 60% 30% 70% 40%"
  background: linear-gradient(135deg, --sky, --violet, --violet)
  padding: 3px  ← esto crea el "anillo" de gradiente
  box-shadow: 0 0 60px rgba(56,189,248,0.25)
  transition en hover: box-shadow → 0 0 80px rgba(56,189,248,0.5), 0 0 120px rgba(167,139,250,0.3)
  animation: glowPulse 4s ease-in-out infinite (alterna entre los dos box-shadows)

Contenedor interior:
  width/height: 100%
  border-radius: inherit
  overflow: hidden

Imagen:
  width/height: 100%
  object-fit: cover
  object-position: center top  ← importante para fotos de perfil
  filter: grayscale(75%) contrast(1.1)  ← estado por defecto
  transition: filter 0.6s ease
  
  :hover → filter: grayscale(0%) contrast(1)  ← reveal de color al hover
```

**Keyframe `morphBlob`:**
```
0%,100% → border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%
25%     → border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%
50%     → border-radius: 50% 60% 30% 40% / 30% 40% 50% 60%
75%     → border-radius: 40% 50% 60% 30% / 40% 60% 40% 50%
```

**Fallback:** Si la imagen falla al cargar (`onerror`), mostrar un `div` con las iniciales `AR` en `grad-text`. Este div debe estar en el DOM desde el inicio con `display: none`, revelado vía JS.

**Floating chips sobre el blob:**
- Chip superior izquierdo: texto `"Open to work"` — color `--green`, con dot pulsante
- Chip inferior derecho: texto `"ASIR · DAW"` — color `--sky`
- Ambos tienen `backdrop-filter: blur(8px)` y `background: rgba(8,15,36,0.9)`

**Animación del conjunto:** El `photo-wrapper` completo (anillo + chips) tiene `animation: floatY 5s ease-in-out infinite`.

**Parallax sutil:** En el hero completo, los dos blobs de gradiente de fondo (`hero-glow-a` y `hero-glow-b`) se mueven ligeramente siguiendo el cursor (max ±25px y ±18px respectivamente), actualizado en `mousemove` con `transition: transform 0.5s ease`. Ver §6.5 para implementación.

---

### 5.4 MARQUEE — `Marquee.astro`

Franja horizontal entre Hero y About. Sin interacción. `overflow: hidden`, `border-top/bottom: 1px solid var(--border)`, `background: rgba(255,255,255,0.015)`.

Items: `Docker · Linux · Laravel · PHP 8 · PostgreSQL · MySQL · AWS EC2 · Nginx · Git · React · Vite · SSL/TLS · Selenium · Bash`

Implementación: contenido duplicado en el DOM para loop seamless. Animación `marqueeRun 26s linear infinite`. Cada item precedido por `◆` (carácter, no emoji) en `--sky` con opacity 0.4.

---

### 5.5 ABOUT — `About.astro`

**Layout:** Grid 2 columnas (`1fr 260px`), se apila en mobile.

**Columna izquierda (bio):**
- `section-label`: `// sobre-mi.ts` — JetBrains Mono, --sky
- H2: "Donde la infraestructura se encuentra con el código" — "se encuentra con el código" en `grad-text`
- 3 párrafos de bio con `reveal` + delays escalonados

**Columna derecha (stats):**
Grid 2x2 de stat-cards con:
```
3+   → "Proyectos reales"    (contador animado, target: 3)
2    → "Titulaciones FP"     (contador animado, target: 2)
100% → "Commitment"          (contador animado, target: 100, suffix: %)
∞    → "Café consumido"      (valor estático, no contador)
```

Los contadores se activan con `IntersectionObserver` cuando el stats-grid entra en viewport. Animación: valor sube de 0 al objetivo en ~60 frames de 28ms.

---

### 5.6 SKILLS — `Skills.astro` + `BentoCard.astro`

**Layout Bento Grid asimétrico:**

```
Grid: grid-template-columns: 1.7fr 1fr 1fr
      grid-template-rows: auto auto
      gap: 1rem
```

| Celda | Contenido | Grid área |
|---|---|---|
| A (grande) | Sistemas & DevOps | `grid-row: 1 / 3` (span 2 filas) |
| B | Backend & DB | `column 2, row 1` |
| C | Frontend & UI | `column 3, row 1` |
| D (ancha) | Redes & Seguridad | `grid-column: 2 / 4, row 2` (span 2 cols) |

**Tarjeta A — Sistemas & DevOps (card grande):**
- Acento: `--sky`
- Tags: Linux, Docker, AWS EC2, Nginx, Bash, SSH
- **Skill bars animadas** (exclusivas de esta card grande):
  - Linux: 88%
  - Docker: 82%
  - Nginx: 78%
  - AWS: 70%
  - Track: `height: 4px`, `background: rgba(255,255,255,0.08)`, `border-radius: 2px`
  - Fill: animado de 0% al valor objetivo cuando la card entra en viewport

**Tarjeta B — Backend & DB:**
- Acento: `--violet`
- Tags: Laravel, PHP 8, PostgreSQL, MySQL, REST APIs

**Tarjeta C — Frontend & UI:**
- Acento: `--green`
- Tags: HTML5, CSS3, JavaScript, React, Vite

**Tarjeta D — Redes & Seguridad (card ancha):**
- Acento: `--orange`
- Tags: TCP/IP, SSL/TLS, Firewalls, VPN, VLSM, DNS

**Todas las cards tienen:**
- Efecto Spotlight (§6.4): borde brillante que sigue al ratón
- Hover: `translateY(-5px)` + `box-shadow` elevado
- `border-top: 2px solid rgba(accent_color, 0.22)` como detalle sutil

---

### 5.7 ARCHITECTURE — `Architecture.astro` + `ArchDiagram.astro`

Bloque visual que representa el stack real del proyecto Lotusblack y cómo el desarrollador construye sistemas.

**Estructura visual:**

**Bloque 1 — CI/CD Pipeline (fila horizontal):**
```
[Git Push / GitHub] → [Actions CI / Tests + Build] → [Docker Build / Image→Registry] → [AWS EC2 / docker-compose up] → [✓ Live / HTTPS · SSL]
```
Nodos conectados con `→`. El último nodo tiene color `--green`.

**Bloque 2 — N-Tier Architecture (grid 4 columnas):**
```
[Presentation / React SPA / Vite·CSS Modules]
[Proxy·SSL / Nginx / reverse_proxy·TLS]
[Business Logic / Laravel API / REST·Sanctum·Queue]
[Data Layer / PostgreSQL / Eloquent·Migrations]
```

**Decoración:** El contenedor principal tiene `border-top: 2px solid linear-gradient(sky→violet→transparent)` como detalle de acento.

---

### 5.8 PROJECTS — `Projects.astro` + `ProjectCard.astro`

Grid 3 columnas en desktop, 1 en mobile.

**Proyecto 1 — Portfolio Profesional:**
- Acento: `--sky`
- Stack: HTML5, CSS3, JS Vanilla, Vite
- Link: GitHub `AzaelReyesMartel-1ASIR/portfolio-web`

**Proyecto 2 — Lotusblack E-commerce (FEATURED):**
- Acento: `--violet`
- Border: `rgba(167,139,250,0.30)` + `box-shadow: 0 0 30px rgba(167,139,250,0.10)`
- Badge `Featured` visible
- Stack: Laravel, React, Docker, AWS EC2, PostgreSQL, Nginx
- Link: GitHub `ItsBreo/tienda-magic`

**Proyecto 3 — Carrito & E2E Testing:**
- Acento: `--green`
- Stack: JS Vanilla, Selenium, QA, Testing
- Link: GitHub `AzaelReyesMartel-1ASIR/shopping-cart-js`

**Todas las project cards tienen Spotlight effect** (§6.4).

---

### 5.9 GIT TIMELINE — `Timeline.astro` + `GitTimeline.astro`

Columna central máx. 680px, `margin: 0 auto`.

**Línea vertical:** Pseudo-elemento `::before` en el contenedor, `left: 17px`, `width: 1.5px`, `background: linear-gradient(180deg, --sky 0%, --violet 60%, transparent 100%)`.

**Items (Trayectoria Real):**

```text
[2026]      ◉ Bitbox SL — Full Stack Developer & QA (Ene–Abr)
               PHP/Laravel · Vue.js · N-Tier Arch · Docker · AWS

[2024–2026] ● Desarrollo de Aplicaciones Web (DAW)
               Técnico Superior (CIFP Villa de Agüimes)

[2025]      ◉ Empire Systems — Desarrollador Web (May–Jun)
               SEO On-Page · Accesibilidad UX · Refactorización

[2024]      ◉ Cloud Canary Services — SysAdmin & Soporte IT (Mar–May)
               Auditorías preventivas HW · Troubleshooting · BIOS

[2022–2024] ● Administración de Sistemas en Red (ASIR)
               Técnico Superior (CIFP Villa de Agüimes)

[ACTIVO]    ◈ Certificaciones y Formación Continua
               (Espacio preparado en el JSON para inyectar cursos de verano)

Tipos de nodo visuales:

● (Educación): background: linear-gradient(135deg, var(--sky), var(--violet)), checkmark ✓ blanco.

◉ (Experiencia Laboral): background: rgba(251,146,60,0.15), border: 1px solid rgba(251,146,60,0.40), icono de maletín o terminal en --orange.

◈ (Certificaciones): background: rgba(52,211,153,0.15), border: 1px solid rgba(52,211,153,0.40), icono de escudo/medalla en --green.

Implementación de Datos:
Todo esto debe leerse desde src/data/timeline.ts usando una interfaz TypeScript estricta para que, cuando hagas cursos en verano, solo tengas que añadir un objeto al array y el diseño se genere solo.

Hash de git: Sobre cada item, un texto pequeño en JetBrains Mono que simula un hash de commit aleatorio (ej. commit 7a9b2f4) y la fecha, color --muted.

---

### 5.10 CONTACT — `Contact.astro`

Centrado, `max-width: 560px`, `margin: 0 auto`.

**Elementos:**
- `section-label`: `// contact()`
- H2: `¿Empezamos?`
- Párrafo descriptivo
- Botón GitHub: `background: var(--card)`, `border: 1px solid var(--border)`, clase `magnetic`
- Botón LinkedIn: `background: linear-gradient(135deg, #0077b5, #0a66c2)`, clase `magnetic`
- Email texto: JetBrains Mono, link en `--sky`

**Integración con API (§7.2):**
- Badge de disponibilidad en tiempo real — cargado desde `GET /api/v1/status`
- Si `available: true` → badge verde "Disponible ahora"
- Si `available: false` → badge naranja "Pronto disponible"
- Fetch no-blocking: el badge aparece con `IntersectionObserver` + `client:visible`

---

### 5.11 FOOTER — `Footer.astro`

- `border-top: 1px solid var(--border)`
- Izquierda: `built with <determination /> by Azael Reyes © 2026` en JetBrains Mono
- Centro: Logo SVG pequeño
- Derecha: Links de navegación rápida

---

## 6. ANIMACIONES Y MICROINTERACCIONES

### 6.1 CUSTOM CURSOR TRAIL — `cursor.ts`

**Cursor principal (`#cursor-dot`):**
- `width: 14px`, `height: 14px`, `background: #ffffff`
- `mix-blend-mode: difference` — clave para el efecto de inversión de color
- `position: fixed`, `pointer-events: none`, `z-index: 99999`
- `transform: translate(-50%, -50%)`

**Transiciones de estado:**
- Estado normal: 14×14px
- Hover sobre `a, button, .magnetic`: expandir a 44×44px (transición 0.2s)
- Clase `.big` añadida/removida por JS en `mouseover`/`mouseout`

**Trail de partículas (7 puntos):**
- 7 divs `.c-trail`, creados dinámicamente en JS
- Tamaños decrecientes: `6px → 2.1px` (6 - i * 0.65)
- Opacidades decrecientes: `0.65 → 0.10`
- Color: `var(--sky)` (cian)
- Posición: lag exponencial. Cada punto sigue al anterior con factor `0.38`:
  ```
  punto[i].x += (punto[i-1].x - punto[i].x) * 0.38
  ```
- Loop con `requestAnimationFrame`

**Nota de implementación:** El cursor personalizado se oculta en dispositivos táctiles (`@media (hover: none) { #cursor-dot, .c-trail { display: none; } }`) y se restaura el cursor nativo con `body { cursor: auto; }`.

---

### 6.2 SCROLL REVEALS — `reveal.ts`

**Implementación:** `IntersectionObserver` con `threshold: 0.12`.

**Clases de animación:**
```css
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.reveal.vis {
  opacity: 1;
  transform: none;
}
.rd1 { transition-delay: 0.1s; }
.rd2 { transition-delay: 0.2s; }
.rd3 { transition-delay: 0.3s; }
.rd4 { transition-delay: 0.4s; }
```

**Regla:** Una vez revelado, el elemento no se oculta al salir del viewport (`unobserve()` tras revelar).

---

### 6.3 TEXT SCRAMBLE — `scramble.ts`

**Trigger:** `mouseenter` en el nombre del hero (`#scramble-name`) y en el `.dev` del logo.

**Algoritmo:**
1. Para cada carácter del texto objetivo, definir `frame_start` (random 0-8) y `frame_end` (start + random 0-12)
2. En cada frame del RAF:
   - Si `frame < frame_start`: mostrar carácter original
   - Si `frame_start ≤ frame < frame_end`: mostrar carácter aleatorio de la pool, cambiar con probabilidad 0.28
   - Si `frame ≥ frame_end`: mostrar carácter final
3. El carácter aleatorio se muestra con `color: var(--sky)` — efecto de "descifrado cian"

**Pool de caracteres:** `!<>-_\/[]{}=+*^?#ABCDEFabcdef0123456789`

**Pool específica para el logo:** Añadir caracteres de símbolos de terminal: `$@~|&`

---

### 6.4 SPOTLIGHT CARDS — `spotlight.ts`

**Principio:** Cada card `.spt` tiene CSS custom properties `--mx` y `--my` que representan la posición del ratón relativa a la card. Un pseudo-elemento `::before` usa estas variables para un `radial-gradient` que simula una fuente de luz.

**CSS en las cards:**
```css
.spt {
  --mx: 50%;
  --my: 50%;
  position: relative;
  overflow: hidden;
}
.spt::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: radial-gradient(
    400px circle at var(--mx) var(--my),
    rgba(56,189,248,0.12),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  z-index: 0;
}
.spt:hover::before { opacity: 1; }
```

**JS en `spotlight.ts`:**
```typescript
document.querySelectorAll<HTMLElement>('.spt').forEach(card => {
  card.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--my', (e.clientY - rect.top)  + 'px');
  });
});
```

**Aplicar a:** BentoCards, ProjectCards.

---

### 6.5 MAGNETIC BUTTONS — `cursor.ts` (extensión)

**Principio:** Los elementos `.magnetic` se desplazan ligeramente hacia el cursor cuando este está dentro.

```typescript
document.querySelectorAll<HTMLElement>('.magnetic').forEach(el => {
  let raf: number;
  el.addEventListener('mousemove', (e: MouseEvent) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width  / 2);
      const dy = e.clientY - (rect.top  + rect.height / 2);
      el.style.transition = 'transform 0.1s';
      el.style.transform  = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
    });
  });
  el.addEventListener('mouseleave', () => {
    cancelAnimationFrame(raf);
    el.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    el.style.transform  = '';
  });
});
```

**Factor de movimiento:** `0.28` — suficiente para ser perceptible, sin ser disruptivo.

**Aplicar a:** CTAs del hero, botones de contacto, back-to-top.

---

### 6.6 PARALLAX EN HERO — (dentro de `cursor.ts`)

Los blobs de fondo del hero se mueven con el cursor para crear profundidad:
```typescript
document.addEventListener('mousemove', (e: MouseEvent) => {
  const rx = e.clientX / window.innerWidth  - 0.5;  // -0.5 a 0.5
  const ry = e.clientY / window.innerHeight - 0.5;
  glowA.style.transform = `translate(${rx * 25}px, ${ry * 25}px)`;
  glowB.style.transform = `translate(${-rx * 18}px, ${-ry * 18}px)`;
  // transition: 'transform 0.5s ease' en CSS
});
```

---

### 6.7 KEYFRAMES GLOBALES

Definir en `src/styles/global.css`:

```css
@keyframes gradMove {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@keyframes morphBlob {
  0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25%     { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50%     { border-radius: 50% 60% 30% 40% / 30% 40% 50% 60%; }
  75%     { border-radius: 40% 50% 60% 30% / 40% 60% 40% 50%; }
}
@keyframes floatY {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-12px); }
}
@keyframes dotPulse {
  0%,100% { opacity: .4; transform: scale(.9); }
  50%     { opacity:  1; transform: scale(1.3); }
}
@keyframes marqueeRun {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes termBlink {
  0%,100% { opacity: 1; }
  50%     { opacity: 0; }
}
@keyframes scanline {
  0%   { top: -2px; }
  100% { top: 102%; }
}
@keyframes glowPulse {
  0%,100% { box-shadow: 0 0 20px rgba(56,189,248,.2); }
  50%     { box-shadow: 0 0 55px rgba(56,189,248,.5), 0 0 90px rgba(167,139,250,.2); }
}
```

---

## 7. INTEGRACIÓN DEVOPS Y BACKEND API

### 7.1 Filosofía de integración

El portfolio no es solo un sitio estático. Demuestra capacidades DevOps reales:
- La API existe para sanitizar contacto (evitar spam y scripting)
- El estado de disponibilidad es dinámico (puede actualizarse sin redeploy del frontend)
- Todo el stack corre en contenedores, igual que los proyectos del desarrollador

### 7.2 API Endpoints

**`POST /api/v1/contact`**
```typescript
// Request body (validado con Zod):
{
  name:    string (min 2, max 80, trim)
  email:   string (email válido, max 254)
  subject: string (min 5, max 120, trim)
  message: string (min 20, max 1000, trim, strip HTML)
}

// Rate limit: 3 requests / 15 minutos por IP

// Success response 200:
{ success: true, message: "Mensaje recibido" }

// Error response 422:
{ success: false, errors: { field: "mensaje de error" } }

// Error response 429:
{ success: false, message: "Demasiadas solicitudes. Espera 15 minutos." }

// Acción del servidor: enviar email via SMTP (Resend.com o Nodemailer)
// Headers anti-spam: verificar SPF, no incluir links en respuesta automática
```

**`GET /api/v1/status`**
```typescript
// Response 200:
{
  available: boolean,           // true = disponible para proyectos
  mode: "freelance" | "employed" | "both" | "unavailable",
  message: string,              // "Disponible para nuevos proyectos"
  updatedAt: string             // ISO 8601
}

// Este endpoint puede tener su valor en una variable de entorno o en un archivo JSON
// No requiere base de datos para MVP
```

**`GET /api/v1/health`**
```typescript
// Response 200:
{ status: "ok", uptime: number, timestamp: string }
// Usado por Docker healthcheck y monitoring
```

### 7.3 Docker Compose (`infra/docker-compose.yml`)

```yaml
# Servicios:

portfolio-nginx:
  build: ./infra/nginx
  ports: ["80:80", "443:443"]
  volumes: [certbot_certs, certbot_www]
  depends_on: [portfolio-frontend, portfolio-api]

portfolio-frontend:
  image: nginx:alpine
  volumes: [./apps/web/dist:/usr/share/nginx/html:ro]
  # Astro build output servido por Nginx interno

portfolio-api:
  build: ./apps/api
  environment:
    - NODE_ENV=production
    - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
    - CONTACT_RECIPIENT (email destino)
    - ALLOWED_ORIGIN (dominio del frontend)
  expose: ["3001"]  # No expuesto externamente

certbot:
  image: certbot/certbot
  volumes: [certbot_certs, certbot_www]
```

**Nginx routing (`nginx.conf`):**
```
server {
  listen 443 ssl;
  server_name azaelreyes.dev;

  location /api/ {
    proxy_pass http://portfolio-api:3001;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location / {
    root /usr/share/nginx/html;  # Astro static output
    try_files $uri $uri/ /index.html;
  }
}
```

### 7.4 GitHub Actions CI/CD (`.github/workflows/deploy.yml`)

**Triggers:** Push a `main`

**Steps:**
1. `npm run build` en `apps/web` → genera `dist/`
2. `docker build` de `apps/api`
3. `docker push` a GHCR
4. SSH a servidor → `docker-compose pull && docker-compose up -d`

**Secretos necesarios en GitHub:** `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `GHCR_TOKEN`

---

## 8. FASES DE ENTREGA

### FASE 0 — Scaffolding y configuración (Prerequisito)
**Duración estimada:** 1 sesión

- [ ] Inicializar monorepo (`apps/web`, `apps/api`, `infra/`)
- [ ] Configurar Astro 4 + Tailwind CSS en `apps/web`
- [ ] Configurar `tailwind.config.mjs` con todos los tokens del §4
- [ ] Crear `src/styles/global.css` con reset, CSS vars y todos los `@keyframes` del §6.7
- [ ] Configurar `@fontsource` para las 3 fuentes (JetBrains Mono, Syne, Manrope)
- [ ] Crear `public/favicon.svg` con el logo pixel heart del §5.1
- [ ] Crear estructura de directorios completa del §3
- [ ] Crear archivos `data/projects.ts`, `data/skills.ts`, `data/timeline.ts` con los datos del §5

**Criterio:** `npm run dev` levanta el proyecto sin errores, favicon visible en la pestaña.

---

### FASE 1 — Layout y Header
**Duración estimada:** 1 sesión

- [ ] `Layout.astro`: HTML base, import de fuentes, import de `global.css`, slot para contenido
- [ ] `Header.astro`: logo, nav, controles, comportamiento sticky/glassmorphism
- [ ] `Footer.astro`: estructura básica
- [ ] `Cursor.astro` + `cursor.ts`: cursor trail + `mix-blend-mode: difference` + magnetic
- [ ] Scroll progress bar
- [ ] Back-to-top button
- [ ] `Logo.astro`: SVG pixel heart (§5.1) reutilizable
- [ ] Responsive: mobile menu (hamburguesa funcional)

**Criterio:** Header visible, cursor trail activo, logo pixel heart correcto en favicon y header.

---

### FASE 2 — Hero Section
**Duración estimada:** 1-2 sesiones

- [ ] `Hero.astro`: layout grid 2 columnas
- [ ] `terminal.ts`: boot sequence con typing carácter a carácter (§5.3.1.D)
- [ ] `Terminal.astro`: ventana terminal con chrome bar y scanline
- [ ] Badges dual de disponibilidad (§5.3.1.C)
- [ ] Typing role effect (§5.3.1.B)
- [ ] `PhotoBlob.astro`: blob morphing + filtro grayscale + floating chips (§5.3.2)
- [ ] `scramble.ts`: efecto text scramble en nombre hero
- [ ] Parallax sutil de blobs de fondo (§6.6)
- [ ] Marquee strip (§5.4)

**Criterio:** Hero completo y animado, foto con efecto grayscale→color en hover, terminal muestra boot sequence.

---

### FASE 3 — Secciones de contenido
**Duración estimada:** 2 sesiones

- [ ] `About.astro`: bio + stats con contadores animados
- [ ] `Skills.astro` + `BentoCard.astro`: bento grid asimétrico + spotlight + skill bars
- [ ] `Architecture.astro` + `ArchDiagram.astro`: diagrama CI/CD + N-Tier
- [ ] `Projects.astro` + `ProjectCard.astro`: 3 tarjetas + spotlight
- [ ] `Timeline.astro` + `GitTimeline.astro`: diagrama git con nodos diferenciados
- [ ] `reveal.ts`: IntersectionObserver para todas las secciones
- [ ] `spotlight.ts`: efecto en bento cards y project cards
- [ ] `counters.ts`: stat counters animados

**Criterio:** Todas las secciones visibles, animaciones de reveal funcionando, spotlight activo.

---

### FASE 4 — Contacto y API
**Duración estimada:** 1-2 sesiones

- [ ] `Contact.astro`: formulario (si se implementa) o links de contacto
- [ ] `apps/api/`: setup Hono.js, routes, middleware
- [ ] Endpoint `POST /api/v1/contact` con validación Zod + rate limiting
- [ ] Endpoint `GET /api/v1/status` con datos de disponibilidad
- [ ] `status.ts` en frontend: fetch + badge dinámico
- [ ] Variables de entorno configuradas

**Criterio:** Badge de disponibilidad carga desde la API, formulario (si existe) valida y envía.

---

### FASE 5 — DevOps e infraestructura
**Duración estimada:** 1 sesión

- [ ] `apps/api/Dockerfile`
- [ ] `infra/docker-compose.yml` completo
- [ ] `infra/nginx/nginx.conf` con routing correcto
- [ ] `.github/workflows/deploy.yml` CI/CD pipeline
- [ ] Testing local con `docker-compose up`
- [ ] Configuración SSL (Certbot)

**Criterio:** `docker-compose up -d` levanta todo el stack. Frontend accesible en `:443`, API en `/api/`.

---

### FASE 6 — Polish y optimización
**Duración estimada:** 1 sesión

- [ ] Lighthouse score ≥ 95 en Performance, Accessibility, Best Practices
- [ ] Imágenes optimizadas (`<Image>` de Astro para WebP)
- [ ] Meta tags SEO completos + Open Graph
- [ ] `robots.txt` y `sitemap.xml`
- [ ] Revisión completa en mobile (320px, 375px, 768px)
- [ ] Accesibilidad: `aria-label` en todos los elementos interactivos, skip link
- [ ] Validación HTML W3C sin errores
- [ ] Cross-browser: Chrome, Firefox, Safari

**Criterio:** Lighthouse ≥ 95. Sin errores de consola en producción.

---

## 9. PROMPT MAESTRO PARA EL IDE

> **INSTRUCCIONES DE USO:**
> Copia el siguiente bloque completo y úsalo como system prompt en Continue (Gemini 2.5) o pégalo al inicio de cada sesión de trabajo. Guárdalo también en un archivo `.ai-context.md` en la raíz del proyecto para referencia rápida.

---

```
SYSTEM PROMPT — AGENTE DE DESARROLLO: PORTFOLIO AZAEL REYES

═══════════════════════════════════════════════════════════════
ROL Y MISIÓN
═══════════════════════════════════════════════════════════════

Eres un arquitecto fullstack senior especializado en Astro, Tailwind CSS, 
TypeScript y DevOps. Tu misión exclusiva es construir el portfolio profesional 
de Azael Reyes Martel siguiendo el documento MASTER_PLAN.md como 
fuente de verdad absoluta.

Antes de escribir cualquier línea de código en esta sesión:
1. Lee el MASTER_PLAN.md completo
2. Identifica en qué FASE estamos
3. Confirma los archivos que vas a crear/modificar
4. Espera confirmación si hay ambigüedad

═══════════════════════════════════════════════════════════════
RESTRICCIONES DURAS (nunca violar)
═══════════════════════════════════════════════════════════════

1. NO uses librerías de animación externas (GSAP, Framer Motion, AOS).
   Todas las animaciones son CSS puro + Vanilla TypeScript.

2. NO cambies la paleta de colores bajo ninguna circunstancia.
   Los tokens exactos están en el §4 del MASTER_PLAN.

3. NO uses frameworks de componentes (React, Vue, Svelte) excepto donde
   el MASTER_PLAN lo especifique explícitamente con directiva client:.

4. NO agregues dependencias npm sin consultarlo primero.
   Cada dependencia debe justificarse en base al MASTER_PLAN.

5. NO improvises diseño. Si el MASTER_PLAN describe un componente,
   impleméntalo exactamente como se describe. Si hay algo no especificado,
   pregunta antes de decidir.

6. NO mezcles estilos inline con Tailwind arbitrariamente.
   Usa Tailwind utilities primero. CSS custom solo para lo que Tailwind
   no puede expresar (keyframes complejos, CSS custom properties dinámicas).

7. La foto de perfil es SIEMPRE `img/YO-FORMAL.png`.
   Nunca uses placeholders en producción. El fallback visual (iniciales AR)
   solo aparece si la imagen falla al cargar (onerror).

═══════════════════════════════════════════════════════════════
ESTILO DE CÓDIGO
═══════════════════════════════════════════════════════════════

- TypeScript estricto (`strict: true` en tsconfig)
- Sin `any`. Tipar todo explícitamente.
- Comentarios en inglés dentro del código fuente
- Comentarios de migración Astro en el HTML: `<!-- [ASTRO: Component.astro] -->`
- Cada componente .astro: frontmatter limpio, props tipadas con interface
- Funciones JS/TS: máximo 40 líneas. Extraer a funciones auxiliares si es necesario
- Nombres de variables: camelCase. Constantes: SCREAMING_SNAKE_CASE.
- Event listeners: siempre con `{ passive: true }` donde aplique (scroll, touch)
- requestAnimationFrame loops: siempre con ID para poder cancelarlos

═══════════════════════════════════════════════════════════════
SISTEMA DE TRABAJO POR FASE
═══════════════════════════════════════════════════════════════

Trabajamos una fase a la vez, en orden del §8 del MASTER_PLAN.
Para cada archivo que crees:

1. Anuncia: "Voy a crear [archivo] — propósito: [descripción]"
2. Escribe el código completo (sin truncar)
3. Lista los cambios necesarios en otros archivos existentes
4. Indica el próximo archivo a crear dentro de la misma fase
5. Al terminar una fase, muestra el checklist del §8 marcado

No continúes a la siguiente fase sin confirmación explícita del desarrollador.

═══════════════════════════════════════════════════════════════
DISEÑO DE COMPONENTES ASTRO
═══════════════════════════════════════════════════════════════

Estructura estándar de un componente .astro:

```astro
---
// Imports
import type { ComponentProps } from '../types';

// Props interface
interface Props {
  propName: string;
  optionalProp?: boolean;
}

const { propName, optionalProp = false } = Astro.props;

// Lógica de datos (si necesaria)
---

<!-- HTML semántico -->
<section id="section-id" aria-label="Descripción accesible">
  <!-- Contenido -->
</section>

<!-- Script (solo si necesita client-side JS) -->
<script>
  // Importar desde src/scripts/
  import { initFeature } from '../scripts/feature.ts';
  initFeature();
</script>

<!-- Estilos (scoped, solo si no pueden expresarse con Tailwind) -->
<style>
  /* CSS muy específico aquí */
</style>
```

═══════════════════════════════════════════════════════════════
DATOS DEL PORTFOLIO (referencia rápida)
═══════════════════════════════════════════════════════════════

Desarrollador: Azael Reyes Martel
Rol: Software Engineer — Backend · SysAdmin · Docker · Laravel
Formación: ASIR + DAW (Técnico Superior)
Ubicación: Islas Canarias, España
GitHub: https://github.com/AzaelReyesMartel-1ASIR
LinkedIn: https://www.linkedin.com/in/azael-reyes-a18996329/

Proyectos:
- Portfolio Profesional (HTML5/CSS3/Vite) — github.com/AzaelReyesMartel-1ASIR/portfolio-web
- Lotusblack E-commerce [FEATURED] (Laravel/React/Docker/AWS) — github.com/ItsBreo/tienda-magic
- Carrito & E2E Testing (JS/Selenium/QA) — github.com/AzaelReyesMartel-1ASIR/shopping-cart-js

Disponibilidad: DUAL — B2B & Teams (cian) + Freelance Open (verde)

═══════════════════════════════════════════════════════════════
COMANDOS DE SESIÓN
═══════════════════════════════════════════════════════════════

Cuando el desarrollador escriba:
- "fase N" → Muestra checklist de la Fase N y empieza con el primer archivo
- "siguiente" → Crea el próximo archivo de la fase actual
- "estado" → Muestra qué archivos se han creado y qué falta en la fase actual
- "revisa [archivo]" → Lee el archivo y verifica que cumple el MASTER_PLAN
- "api" → Trabaja exclusivamente en apps/api/ (Fase 4)
- "docker" → Trabaja exclusivamente en infra/ (Fase 5)
- "tokens css" → Muestra todos los design tokens del §4 para copiar/pegar

═══════════════════════════════════════════════════════════════
VERIFICACIÓN PRE-COMMIT
═══════════════════════════════════════════════════════════════

Antes de declarar un archivo como "terminado", verifica:
□ ¿Los colores usados corresponden a los tokens del MASTER_PLAN?
□ ¿Las fuentes usadas son Syne, Manrope o JetBrains Mono?
□ ¿Los efectos JS están en src/scripts/ (no inline en el .astro)?
□ ¿El componente tiene aria-label donde es necesario?
□ ¿Las animaciones usan transform/opacity (no top/left/width para performance)?
□ ¿El cursor custom está deshabilitado en @media (hover: none)?
□ ¿Las imágenes usan el componente <Image> de Astro?
□ ¿Los event listeners de scroll usan { passive: true }?

═══════════════════════════════════════════════════════════════
FIN DEL SYSTEM PROMPT
═══════════════════════════════════════════════════════════════
```

---

## 10. CRITERIOS DE ACEPTACIÓN GLOBALES

El portfolio está terminado cuando cumple **todos** los siguientes criterios:

### 10.1 Funcionales
- [ ] Terminal boot sequence completa y funcional
- [ ] Typing effect en roles del hero itera correctamente
- [ ] Photo blob cambia de forma continuamente y revela color en hover
- [ ] Ambos badges de disponibilidad visibles simultáneamente
- [ ] Cursor trail visible y fluido (60fps en hardware moderno)
- [ ] Spotlight effect activo en skills y project cards
- [ ] Efecto Text Scramble en nombre del hero al hover
- [ ] Scroll reveals funcionan en todos los componentes
- [ ] Skill bars se animan al entrar en viewport
- [ ] Stat counters se animan al entrar en viewport
- [ ] Marquee corre sin interrupciones (loop seamless)
- [ ] Git timeline muestra los 4 items con tipos de nodo correctos
- [ ] Arquitectura CI/CD + N-Tier visualmente clara
- [ ] Badge de disponibilidad en contacto carga desde API
- [ ] Formulario de contacto (si existe) valida y envía correctamente
- [ ] Back-to-top visible al hacer scroll, funcional

### 10.2 Visuales
- [ ] Logo pixel heart correcto en favicon y header
- [ ] Paleta de colores 100% consistente con §4
- [ ] Tipografías correctas en cada contexto (mono/body/display)
- [ ] Grid bento asimétrico (3 columnas, card grande span 2 filas)
- [ ] Featured card en proyectos visualmente destacada
- [ ] Sin elementos visualmente desequilibrados en mobile

### 10.3 Técnicos
- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Sin errores en consola del navegador
- [ ] Sin warnings de TypeScript (`strict: true`)
- [ ] Imágenes en formato WebP, lazy loading donde aplique
- [ ] Cursor custom deshabilitado en touch devices
- [ ] `docker-compose up -d` levanta el stack completo sin errores
- [ ] SSL activo en dominio de producción
- [ ] API responde con headers CORS correctos
- [ ] Rate limiting activo en endpoint de contacto

### 10.4 De contenido
- [ ] GitHub links correctos para los 3 proyectos
- [ ] LinkedIn link correcto
- [ ] CV descargable (`CV/AZAEL.pdf`)
- [ ] Bio describe correctamente el perfil Backend/SysAdmin/Docker/Laravel
- [ ] Disponibilidad dual reflejada en badges y texto de contacto

---

*MASTER_PLAN.md — v1.0 — Generado para Azael Reyes Martel*
*Siguiente paso: Pasar el §9 (PROMPT MAESTRO) al agente Gemini 2.5 en VSCode.*
*Comenzar por: `fase 0` en la sesión del IDE.*
