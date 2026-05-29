const SPOTLIGHT_SELECTOR = ".spt";

function updateSpotlightPosition(
  event: PointerEvent,
  element: HTMLElement,
): void {
  const bounds: DOMRect = element.getBoundingClientRect();
  const x: number = event.clientX - bounds.left;
  const y: number = event.clientY - bounds.top;

  element.style.setProperty("--spot-x", `${x}px`);
  element.style.setProperty("--spot-y", `${y}px`);
}

function attachSpotlightListeners(element: HTMLElement): void {
  element.addEventListener("pointermove", (event: PointerEvent) => {
    updateSpotlightPosition(event, element);
  });
}

export function initSpotlight(): void {
  const spotlightElements: NodeListOf<HTMLElement> =
    document.querySelectorAll(SPOTLIGHT_SELECTOR);
  if (spotlightElements.length === 0) {
    return;
  }

  spotlightElements.forEach((element) => {
    attachSpotlightListeners(element);
  });
}
