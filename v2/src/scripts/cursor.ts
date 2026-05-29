interface Point {
  x: number;
  y: number;
  node: HTMLDivElement;
}

const TRAIL_COUNT    = 7;
const FOLLOW_FACTOR  = 0.38;
const OUTLINE_LAG    = 0.12;   // outline follows slower than the dot
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
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const animateMagnetic = (): void => {
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;
      element.style.transform = `translate(${currentX}px, ${currentY}px)`;
      const hasMovement = Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1;
      if (hasMovement) {
        magneticRaf = requestAnimationFrame(animateMagnetic);
      } else {
        magneticRaf = 0;
      }
    };

    element.addEventListener("mousemove", (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = offsetX - centerX;
      const deltaY = offsetY - centerY;
      targetX = deltaX * MAGNETIC_FACTOR;
      targetY = deltaY * MAGNETIC_FACTOR;
      element.style.transition = "none";
      cancelAnimationFrame(magneticRaf);
      magneticRaf = requestAnimationFrame(animateMagnetic);
    });

    element.addEventListener("mouseleave", () => {
      cancelAnimationFrame(magneticRaf);
      magneticRaf = 0;
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
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

  const cursorDot     = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  if (!(cursorDot instanceof HTMLElement)) {
    return;
  }

  const trailPoints = createTrailNodes();
  const pointer  = { x: window.innerWidth / 2,  y: window.innerHeight / 2 };
  const outlined = { x: window.innerWidth / 2,  y: window.innerHeight / 2 };
  let trailRaf = 0;

  document.addEventListener('mousemove', (event: MouseEvent) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  const animateTrail = (): void => {
    // Trail nodes
    trailPoints.forEach((point, index) => {
      const leader = index === 0 ? pointer : trailPoints[index - 1];
      point.x += (leader.x - point.x) * FOLLOW_FACTOR;
      point.y += (leader.y - point.y) * FOLLOW_FACTOR;
      point.node.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
    });

    // Dot — snaps instantly to pointer
    cursorDot.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`;

    // Outline — follows with OUTLINE_LAG for a trailing ring effect
    if (cursorOutline instanceof HTMLElement) {
      outlined.x += (pointer.x - outlined.x) * OUTLINE_LAG;
      outlined.y += (pointer.y - outlined.y) * OUTLINE_LAG;
      cursorOutline.style.transform = `translate(${outlined.x}px, ${outlined.y}px) translate(-50%, -50%)`;
    }

    trailRaf = requestAnimationFrame(animateTrail);
  };

  // Cursor-hover feedback: ring grows + changes color on interactive elements
  function setupOutlineHover(): void {
    if (!(cursorOutline instanceof HTMLElement)) return;
    const interactives = document.querySelectorAll<HTMLElement>('a, button, [role="button"]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
    });
  }

  setupCursorScale(cursorDot);
  setupMagneticElements();
  setupHeroParallax();
  setupOutlineHover();
  trailRaf = requestAnimationFrame(animateTrail);

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(trailRaf);
  });
}
