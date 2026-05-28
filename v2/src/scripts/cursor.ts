interface Point {
  x: number;
  y: number;
  node: HTMLDivElement;
}

const TRAIL_COUNT = 7;
const FOLLOW_FACTOR = 0.38;
const MAGNETIC_FACTOR = 0.28;

function isTouchDevice(): boolean {
  return window.matchMedia("(hover: none)").matches;
}

function createTrailNodes(): Point[] {
  const points: Point[] = [];
  for (let index = 0; index < TRAIL_COUNT; index += 1) {
    const point = document.createElement("div");
    const size = 6 - index * 0.65;
    const opacity = Math.max(0.1, 0.65 - index * 0.09);
    point.className = "c-trail";
    point.style.width = `${size}px`;
    point.style.height = `${size}px`;
    point.style.opacity = opacity.toString();
    document.body.appendChild(point);
    points.push({ x: 0, y: 0, node: point });
  }
  return points;
}

function setupCursorScale(cursorDot: HTMLElement): void {
  const targets = document.querySelectorAll<HTMLElement>("a, button, .magnetic");
  targets.forEach((target) => {
    target.addEventListener("mouseover", () => cursorDot.classList.add("big"));
    target.addEventListener("mouseout", () => cursorDot.classList.remove("big"));
  });
}

function setupMagneticElements(): void {
  document.querySelectorAll<HTMLElement>(".magnetic").forEach((element) => {
    let magneticRaf = 0;
    element.addEventListener("mousemove", (event: MouseEvent) => {
      cancelAnimationFrame(magneticRaf);
      magneticRaf = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const deltaX = event.clientX - (rect.left + rect.width / 2);
        const deltaY = event.clientY - (rect.top + rect.height / 2);
        element.style.transition = "transform 0.1s";
        element.style.transform = `translate(${deltaX * MAGNETIC_FACTOR}px, ${deltaY * MAGNETIC_FACTOR}px)`;
      });
    });
    element.addEventListener("mouseleave", () => {
      cancelAnimationFrame(magneticRaf);
      element.style.transition = "transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      element.style.transform = "";
    });
  });
}

function setupHeroParallax(): void {
  const glowA = document.getElementById("hero-glow-a");
  const glowB = document.getElementById("hero-glow-b");
  if (!(glowA instanceof HTMLElement) || !(glowB instanceof HTMLElement)) {
    return;
  }

  document.addEventListener("mousemove", (event: MouseEvent) => {
    const ratioX = event.clientX / window.innerWidth - 0.5;
    const ratioY = event.clientY / window.innerHeight - 0.5;
    glowA.style.transform = `translate(${ratioX * 25}px, ${ratioY * 25}px)`;
    glowB.style.transform = `translate(${-ratioX * 18}px, ${-ratioY * 18}px)`;
  });
}

export function initCursor(): void {
  if (isTouchDevice()) {
    return;
  }

  const cursorDot = document.getElementById("cursor-dot");
  if (!(cursorDot instanceof HTMLElement)) {
    return;
  }

  const trailPoints = createTrailNodes();
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let trailRaf = 0;

  document.addEventListener("mousemove", (event: MouseEvent) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  const animateTrail = (): void => {
    trailPoints.forEach((point, index) => {
      const leader = index === 0 ? pointer : trailPoints[index - 1];
      point.x += (leader.x - point.x) * FOLLOW_FACTOR;
      point.y += (leader.y - point.y) * FOLLOW_FACTOR;
      point.node.style.transform = `translate(${point.x}px, ${point.y}px)`;
    });

    cursorDot.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`;
    trailRaf = requestAnimationFrame(animateTrail);
  };

  setupCursorScale(cursorDot);
  setupMagneticElements();
  setupHeroParallax();
  trailRaf = requestAnimationFrame(animateTrail);

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(trailRaf);
  });
}
