// [ASTRO: dynamic-bg.ts] — Dynamic background motor with smooth inertia
// Uses requestAnimationFrame and Linear Interpolation (Lerp) for fluid mouse tracking

// Configuration
const FRICTION = 0.05; // Lerp factor - lower = more inertia/slower
const SCROLL_FACTOR = 0.02; // How much scroll affects the background

// State
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let scrollY = 0;
let targetScrollY = 0;

// Linear interpolation function
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

// Normalize mouse position to 0-1 range
function normalizeMouse(x: number, y: number): { x: number; y: number } {
  return {
    x: x / window.innerWidth,
    y: y / window.innerHeight,
  };
}

// Mouse move handler
function handleMouseMove(e: MouseEvent): void {
  const normalized = normalizeMouse(e.clientX, e.clientY);
  targetX = normalized.x;
  targetY = normalized.y;
}

// Scroll handler
function handleScroll(): void {
  targetScrollY = window.scrollY;
}

// Animation loop with requestAnimationFrame
function animate(): void {
  // Apply Lerp for smooth inertia
  mouseX = lerp(mouseX, targetX, FRICTION);
  mouseY = lerp(mouseY, targetY, FRICTION);
  scrollY = lerp(scrollY, targetScrollY, SCROLL_FACTOR);

  // Update CSS variables on documentElement
  document.documentElement.style.setProperty('--mouse-x', mouseX.toString());
  document.documentElement.style.setProperty('--mouse-y', mouseY.toString());
  document.documentElement.style.setProperty('--scroll-y', scrollY.toString());

  // Continue animation loop
  requestAnimationFrame(animate);
}

// Initialize
export function initDynamicBg(): void {
  // Set initial values
  const initialMouse = normalizeMouse(window.innerWidth / 2, window.innerHeight / 2);
  mouseX = initialMouse.x;
  mouseY = initialMouse.y;
  targetX = initialMouse.x;
  targetY = initialMouse.y;
  scrollY = 0;
  targetScrollY = 0;

  // Add event listeners
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Start animation loop
  requestAnimationFrame(animate);
}

// Auto-initialize on import
if (typeof window !== 'undefined') {
  initDynamicBg();
}
