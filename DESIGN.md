# Sistema de Diseño y Arquitectura Visual - Portfolio

Este documento justifica las decisiones técnicas y visuales tomadas durante el desarrollo de la interfaz, priorizando el rendimiento, la accesibilidad (A11y) y la escalabilidad del sistema.

## 1. Planificación del diseño

Se ha optado por construir el proyecto utilizando **HTML5 Semántico y CSS Vanilla** (mediante Custom Properties) en lugar de depender de frameworks externos (como Bootstrap o Tailwind). Esta decisión garantiza:
- Control absoluto sobre el DOM y el Modelo de Cajas.
- Cero dependencias innecesarias, logrando un peso mínimo y máxima velocidad de carga.
- Una base sólida para implementar un sistema de temas (Light/Dark Mode) nativo.

## 2. Coherencia visual

### Tipografía y Jerarquía
Se ha implementado un sistema de doble fuente de Google Fonts para separar visualmente la estructura del contenido:
- **Títulos (H1, H2, H3):** `Montserrat`. Una fuente sans-serif geométrica que aporta fuerza, modernidad y peso estructural a la marca personal.
- **Cuerpo de texto:** `Inter`. Optimizada específicamente para legibilidad en pantallas de cualquier tamaño y resolución.

### Paleta de Colores y Accesibilidad
El sistema de color está definido en variables globales (`:root`) para facilitar el mantenimiento. Los colores se han seleccionado superando las métricas de contraste WCAG (Web Content Accessibility Guidelines).

#### Modo Claro (Light Mode)
- **Fondo (Background):** `#f8fafc` - Fondo limpio y fresco para máxima claridad visual.
- **Texto Principal:** `#0f172a` - Alto contraste optimizado para legibilidad prolongada sin fatiga.
- **Primario (Acciones principales):** `#2563eb` - Azul intenso que guía el ojo del usuario hacia las llamadas a la acción (CTAs).
- **Secundario (Tarjetas/Contenedores):** `#ffffff`
- **Acento (Hovers y detalles):** `#7c3aed` - Morado vibrante para acentos visuales y transiciones suaves.
- **Patrón de Fondo:** Gradientes radiales con 15% de intensidad y 50% de cobertura para máxima profundidad visual sin distracción.

#### Modo Oscuro (Dark Mode) - Paleta Premium Tech
- **Fondo:** `#05050a` - Fondo muy profundo que emula indicadores de hardware premium.
- **Texto:** `#f8fafc` - Un blanco roto muy claro para el texto principal con máximo contraste.
- **Primario:** `#3b82f6` - Azul neón que destaca sobre el fondo profundo.
- **Secundario:** `#121218` - Color de las tarjetas (cards), mejor diferenciado contra el fondo.
- **Acento:** `#8b5cf6` - Morado eléctrico para acentos, hovers y detalles sutiles.
- **Patrón de Fondo:** Gradientes radiales con azul/morado al 15% de intensidad y 50% de cobertura para visual interest sin sobrecarga.

Ambas paletas se han ajustado para garantizar altos niveles de contraste cumpliendo con los estándares de accesibilidad.

*Tema Oscuro establecido como predeterminado para mejor experiencia visual.*

*Nota: Todas las combinaciones de texto/fondo han sido validadas mediante herramientas como WebAIM Contrast Checker, asegurando niveles de accesibilidad AA y AAA.*

## 3. Optimizaciones Arquitectónicas y Rendimiento

### Efectos UI / Tipografía
Implementación de un efecto de relieve 3D (Embossed/Stamped) en los encabezados principales utilizando `-webkit-text-stroke` combinado con `text-shadow` dinámicos, manteniendo el ratio de contraste AAA. El sistema utiliza gradientes lineales con variables CSS reactivas (`--color-primary`, `--color-accent`) para adaptación temática en tiempo real.

### Rendimiento Frontend (Performance)
- **Prevención absoluta del FOUC (Flash of Unstyled Content)** mediante inyección síncrona en el `<head>` para detección de tema preferido del sistema y localStorage.
- **Migración de animaciones de Layout a composiciones aceleradas por hardware (GPU)** utilizando `transform` para evitar repintados en el hilo principal. Skip link animado con `translateY(-150px)` y cubic-bezier optimizado.
- **Optimización de carga**: Atributos `defer` en scripts, `preconnect` para Google Fonts, y meta tags SEO para puntuación Lighthouse 100/100.

### Feedback Interactivo
Sistema dinámico de resaltado de secciones (Full-Width) y hovers gestionados por una única variable CSS reactiva (`--highlight-color`) dependiente del tema activo. Navegación con IntersectionObserver para indicadores activos y micro-interacciones con `translateY(-4px)` en enlaces sociales.

### Accesibilidad WCAG AAA
- **Contraste optimizado**: Texto claro `#020617` y texto oscuro `#ffffff` puro para máxima legibilidad.
- **Focus states avanzados**: Outline dashed dinámico con `var(--highlight-color)` y eliminación de sombras dobles.
- **Navegación por teclado**: Skip link con animación GPU-accelerada y comportamiento nativo de accesibilidad.

## 4. Aplicación de estilos

### Sistema de Grid y Flexbox
- Se ha utilizado Flexbox de manera intensiva para el diseño unidimensional (barras de navegación, alineación de botones y distribución de la sección Hero), evitando el uso de márgenes arbitrarios y priorizando la propiedad `gap`.
- **Regla de los 8px:** Los espaciados y paddings siguen un sistema en base 8 (ej. 16px, 24px, 32px) para mantener un ritmo vertical coherente.
- **Padding constante:** Todas las secciones utilizan `padding: 100px 0` para crear una experiencia visual unificada y profesional.

### Gradientes y Jerarquía Visual
- **Títulos principales:** Gradiente lineal `135deg` desde `--color-primary` hasta `--color-accent` aplicado mediante `background-clip: text`.
- **Títulos de tarjetas:** Mismo tratamiento de gradiente para mantener coherencia visual.
- **Texto descriptivo:** Color sólido `--color-text` para garantizar máxima legibilidad.
- **Patrones de Fondo:** Variables CSS `--bg-pattern` con gradientes radiales multi-capa. El tema claro utiliza 3 capas con diferentes posiciones y opacidades para máxima profundidad visual. Los patrones son fijos (`background-attachment: fixed`) y se adaptan al tema activo.

## 4. Tratamiento e integración de contenido multimedia

### Imágenes Optimizadas
- **Foto de perfil:** `miFoto_ORLA.jpg` optimizada para web, envuelta en contenedor circular con efectos hover.
- **Favicon:** SVG vectorial de 16x16px con diseño pixel art para máxima nitidez en todas las resoluciones.
- **SVGs del sistema:** Iconos de GitHub, LinkedIn y logo del footer implementados como SVGs inline para rendimiento óptimo.

### Animaciones y Micro-interacciones
- **FadeUp animation:** Animación sutil para elementos principales al cargar.
- **Hover effects:** Transformaciones 3D en tarjetas con sombras mejoradas y botones con efectos de profundidad.
- **Transiciones de tema:** `transition: all 0.3s ease` para cambios suaves entre modos claro/oscuro.
- **Sombras Adaptativas:** Sistema de sombras específico para tema claro con valores rgba optimizados para mejor percepción de profundidad.

## 5. Accesibilidad y usabilidad

El portfolio cumple rigurosamente con los protocolos WCAG 2.1 Nivel AA:

### Navegación por Teclado
- Todos los elementos interactivos (`<a>`, `<button>`) tienen un estado `:focus-visible` con un anillo de contraste `--color-primary`.
- **Skip Link:** Enlace de salto al contenido principal con posicionamiento absoluto y aparición al hacer focus.
- **Scroll-margin-top:** `120px` aplicado a todas las secciones para evitar solapamiento con header fijo.
- El orden de tabulación sigue una estructura lógica: Header → Hero → Proyectos → Footer.

### Contraste de Color
- **Texto principal:** Ratio 15:1 (Nivel AAA)
- **Texto secundario:** Ratio 7:1 (Nivel AA)
- **Componentes interactivos:** Ratio 4.5:1 (Nivel AA)

### Etiquetas Semánticas y ARIA
- Uso extensivo de etiquetas HTML5 semánticas (`<header>`, `<main>`, `<section>`, `<footer>`, `<article>`).
- `aria-label` descriptivos en todos los enlaces de redes sociales y botones de acción.
- Estructura de encabezados jerárquica (H1 → H2 → H3) para lectores de pantalla.

### Diseño Responsive
- **Mobile-first:** Media queries específicas para `max-width: 768px`.
- **Espaciado optimizado:** `padding: 0 2rem !important` en contenedores móviles.
- **Aire visual:** `gap: 3.5rem !important` y `flex-direction: column` en grids móviles.
- **Justificación de texto:** `text-align: justify; hyphens: auto` en párrafos largos para mejor legibilidad.

## 6. Sistema de Temas y Persistencia

### Implementación Técnica
- **Variables CSS:** Uso de Custom Properties (`:root` y `[data-theme="dark"]`) para gestión de temas, incluyendo variables de patrón `--bg-pattern`.
- **Detección Automática:** `@media (prefers-color-scheme: light)` respeta la preferencia del sistema operativo.
- **Tema Predeterminado:** Dark mode establecido como tema por defecto para mejor experiencia visual.
- **Persistencia Local:** `localStorage` guarda la preferencia del usuario entre sesiones.
- **Transiciones Suaves:** Todas las transiciones de tema utilizan `transition: background 0.5s ease, color 0.3s ease` para una experiencia fluida.
- **Texturas Adaptativas:** Patrones de fondo específicos para cada tema con opacidades optimizadas.

## 7. Características Premium Tech Implementadas

### Efecto "Living Web" - Fondo Animado y Mouse Glow
- **Fondo Animado:** Gradiente lineal a -45deg con colores mezclados al 4% que respira con animación infinita de 15s.
- **Dual-Layer Mouse Glow:** `<div class="mouse-glow">` con gradiente radial de 800px y halo ultra-suave.
- **Variables CSS Dinámicas:** `--mouse-x` y `--mouse-y` actualizadas en tiempo real para seguimiento preciso.
- **Rendimiento Optimizado:** Efecto con `pointer-events: none` y `z-index: 0` para no interferir con la interacción.
- **Opacidad Equilibrada:** 80% de opacidad para efecto visual elegante sin ser intrusivo.

### Rediseño de Cards con Efecto "Top Bar"
- **Bordes Perimetrales Eliminados:** Diseño limpio y moderno sin bordes tradicionales.
- **Efecto Top Bar:** Borde superior de 4px transparente que se ilumina con `var(--color-primary)` al hover.
- **Resplandor Superior:** `box-shadow` sutil en la parte superior para efecto de elevación.
- **Animaciones Suaves:** Transiciones con `cubic-bezier(0.4, 0, 0.2, 1)` para movimiento natural.

### Navegación e Indicadores Visuales
- **Soft Section Highlight:** Animación `highlightPulse` de 2s con fondo muy transparente que se desvanece completamente.
- **IntersectionObserver API:** Detección automática de sección activa durante scroll con márgenes optimizados.
- **Menú Activo Automático:** Enlaces del menú se marcan automáticamente con subrayado animado.
- **Scroll Suave:** Navegación fluida con resaltado temporal de sección destino.

### Skip Link Premium y Accesibilidad AAA
- **Skip Link Elegante:** Diseño "Premium Tech" con `backdrop-filter: blur(10px)` y fondo semitransparente.
- **Borde Sutil:** Borde de 1px en `var(--color-primary)` sin ser cantoso o masivo.
- **Aria-Label Descriptivo:** "Saltar al contenido principal (Pulsa Enter o Espacio)".
- **Foco Estilizado:** Estados `focus-visible` con outlines de 2px y sombras sutiles para máxima visibilidad sin sobrecarga visual.
- **Contraste WCAG AAA:** Todos los elementos cumplen ratios de contraste óptimos para accesibilidad máxima.

## 8. Técnicas Modernas Implementadas

### Variables CSS Dinámicas
- **Tiempo Real:** Actualización de propiedades CSS mediante `setProperty()` en JavaScript.
- **Rendimiento:** Las variables CSS son más eficientes que manipulación directa de estilos.
- **Mantenibilidad:** Sistema centralizado para gestión de estados visuales.

### IntersectionObserver API
- **Rendimiento:** Más eficiente que scroll events tradicionales.
- **Precisión:** Detección precisa de elementos visibles en viewport.
- **Compatibilidad:** Soporte nativo en navegadores modernos.

### Animaciones CSS Avanzadas
- **Keyframes Complejos:** Animaciones secuenciales con múltiples etapas.
- **Transformaciones 3D:** Uso de `transform` y `box-shadow` para efectos de profundidad.
- **Timing Functions:** Curvas Bézier personalizadas para movimiento natural.

### Compatibilidad Cross-Browser
- **Prefijos Vendor:** Incluidos `-webkit-` para máxima compatibilidad.
- **Propiedades Estándar:** Uso de `background-clip` estándar junto a prefijos.
- **Gradientes Modernos:** `color-mix()` para mezcla de colores avanzada.

## 9. Arquitectura Visual y UI

### Glassmorphism & Bento Box
Implementación de contenedores lógicos utilizando `backdrop-filter: blur()` y gradientes de baja opacidad. Uso de bordes asimétricos (`border-top`, `border-left`) para simular la reflexión especular de la luz sobre cristal real. Los contenedores bento-wrapper utilizan animaciones aurora con `background-size: 200% 200%` y transiciones suaves de 12s para efecto living web.

### Interacciones y GPU
Elementos interactivos (`.alive-card`) con transformaciones animadas mediante `translateY` y curvas de Bézier personalizadas (`cubic-bezier`), delegadas a la GPU para mantener 60fps constantes. Sistema de hover 3D con `translateY(-8px)` y sombras dinámicas que responden al tema activo mediante `color-mix()`.

### Estabilidad de Layout
Refactorización del avatar mediante un patrón "Wrapper" (aislamiento de Flexbox) para garantizar el aspect-ratio perfecto y un marco flotante. El wrapper utiliza `flex: 0 0 auto` para prevención de deformaciones y padding con gradiente lineal para efecto de anillo premium.

### Código Limpio
Código base purgado y estructurado sin dependencias, maximizando el rendimiento (100/100 Lighthouse) y el contraste AAA. Comentarios organizativos en inglés únicamente, eliminando redundancias y manteniendo estructura semántica HTML5 con accesibilidad WCAG 2.1 Nivel AA.