const REVEAL_SELECTOR = ".reveal";
const VISIBLE_CLASS = "vis";
const REVEAL_THRESHOLD = 0.12;

function markAsVisible(entry: IntersectionObserverEntry, observer: IntersectionObserver): void {
  if (!entry.isIntersecting) {
    return;
  }

  entry.target.classList.add(VISIBLE_CLASS);
  observer.unobserve(entry.target);
}

export function initReveal(): void {
  const revealElements: NodeListOf<HTMLElement> = document.querySelectorAll(REVEAL_SELECTOR);
  if (revealElements.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        markAsVisible(entry, currentObserver);
      });
    },
    {
      threshold: REVEAL_THRESHOLD,
    },
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}
