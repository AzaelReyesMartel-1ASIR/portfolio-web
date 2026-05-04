# Sistema de Diseño y Arquitectura Visual - Portfolio

Este documento justifica las decisiones técnicas y visuales tomadas durante el desarrollo de la interfaz, priorizando el rendimiento, la accesibilidad (A11y) y la escalabilidad del sistema.

## 1. Decisiones Arquitectónicas
Se ha optado por construir el proyecto utilizando **HTML5 Semántico y CSS Vanilla** (mediante Custom Properties) en lugar de depender de frameworks externos (como Bootstrap o Tailwind). Esta decisión garantiza:
- Control absoluto sobre el DOM y el Modelo de Cajas.
- Cero dependencias innecesarias, logrando un peso mínimo y máxima velocidad de carga.
- Una base sólida para implementar un sistema de temas (Light/Dark Mode) nativo.

## 2. Tipografía y Jerarquía
Se ha implementado un sistema de doble fuente de Google Fonts para separar visualmente la estructura del contenido:
- **Títulos (H1, H2, H3):** `Montserrat`. Una fuente sans-serif geométrica que aporta fuerza, modernidad y peso estructural a la marca personal.
- **Cuerpo de texto:** `Inter`. Optimizada específicamente para legibilidad en pantallas de cualquier tamaño y resolución.

## 3. Paleta de Colores y Accesibilidad
El sistema de color está definido en variables globales (`:root`) para facilitar el mantenimiento. Los colores se han seleccionado superando las métricas de contraste WCAG (Web Content Accessibility Guidelines).

### Modo Claro (Light Mode)
- **Fondo (Background):** `#E2E8F0` - Un tono gris azulado muy suave para evitar la fatiga visual del blanco puro.
- **Texto Principal:** `#0f1729` - Alto contraste para máxima legibilidad.
- **Primario (Acciones principales):** `#5048e5` - Color índigo que guía el ojo del usuario hacia las llamadas a la acción (CTAs).
- **Secundario (Tarjetas/Contenedores):** `#FFFFFF`
- **Acento (Hovers y detalles):** `#0d968b`

### Modo Oscuro (Dark Mode) - Paleta Vibrant Tech
- **Fondo:** `#0b1120` - Un fondo slate más profundo, rico y oscuro para máximo contraste.
- **Texto:** `#f8fafc` - Un blanco roto muy claro para el texto principal.
- **Primario:** `#818cf8` - Índigo Vibrante (Índigo-400). Este morado pop'ea' brutalmente en oscuro.
- **Secundario:** `#162031` - Color de las tarjetas (cards), más definido y nítido contra el fondo.
- **Acento:** `#2dd4bf` - Teal/Cyan vibrante para acentos, hovers y detalles sutiles.

*Nota: Todas las combinaciones de texto/fondo han sido validadas mediante herramientas como WebAIM Contrast Checker, asegurando niveles de accesibilidad AA y AAA.*

## 5. Cumplimiento de Accesibilidad

El portfolio cumple rigurosamente con los protocolos WCAG 2.1 Nivel AA:

### Navegación por Teclado
- Todos los elementos interactivos (`<a>`, `<button>`) tienen un estado `:focus-visible` con un anillo de contraste `--color-primary`.
- El orden de tabulación sigue una estructura lógica: Header → Hero → Proyectos → Footer.

### Contraste de Color
- **Texto principal:** Ratio 15:1 (Nivel AAA)
- **Texto secundario:** Ratio 7:1 (Nivel AA)
- **Componentes interactivos:** Ratio 4.5:1 (Nivel AA)

### Etiquetas Semánticas y ARIA
- Uso extensivo de etiquetas HTML5 semánticas (`<header>`, `<main>`, `<section>`, `<footer>`, `<article>`).
- `aria-label` descriptivos en todos los enlaces de redes sociales y botones de acción.
- Estructura de encabezados jerárquica (H1 → H2 → H3) para lectores de pantalla.

## 6. Guía de Espaciado y Composición
- Se ha utilizado Flexbox de manera intensiva para el diseño unidimensional (barras de navegación, alineación de botones y distribución de la sección Hero), evitando el uso de márgenes arbitrarios y priorizando la propiedad `gap`.
- **Regla de los 8px:** Los espaciados y paddings siguen un sistema en base 8 (ej. 16px, 24px, 32px) para mantener un ritmo vertical coherente.
- **Padding constante:** Todas las secciones utilizan `padding: 100px 0` para crear una experiencia visual unificada y profesional.

## 7. Sistema de Temas y Persistencia

### Implementación Técnica
- **Variables CSS:** Uso de Custom Properties (`:root` y `[data-theme="dark"]`) para gestión de temas.
- **Detección Automática:** `@media (prefers-color-scheme: dark)` respeta la preferencia del sistema operativo.
- **Persistencia Local:** `localStorage` guarda la preferencia del usuario entre sesiones.
- **Transiciones Suaves:** Todas las transiciones de tema utilizan `transition: all 0.3s ease` para una experiencia fluida.