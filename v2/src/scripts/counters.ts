const COUNTER_SELECTOR = ".js-counter";
const FRAME_COUNT = 60;
const FRAME_DURATION_MS = 28;
const TOTAL_DURATION_MS = FRAME_COUNT * FRAME_DURATION_MS;

interface CounterConfig {
  element: HTMLElement;
  target: number;
  prefix: string;
  suffix: string;
}

function parseCounterConfig(element: HTMLElement): CounterConfig | null {
  const targetValue = Number(element.dataset.target ?? "");
  if (!Number.isFinite(targetValue)) {
    return null;
  }

  return {
    element,
    target: targetValue,
    prefix: element.dataset.prefix ?? "",
    suffix: element.dataset.suffix ?? "",
  };
}

function updateCounterValue(config: CounterConfig, progress: number): void {
  const nextValue = Math.round(config.target * progress);
  config.element.textContent = `${config.prefix}${nextValue}${config.suffix}`;
}

function animateCounter(config: CounterConfig): void {
  let animationId = 0;
  let startedAt = 0;

  const step = (timestamp: number): void => {
    if (startedAt === 0) {
      startedAt = timestamp;
    }

    const elapsed = timestamp - startedAt;
    const progress = Math.min(elapsed / TOTAL_DURATION_MS, 1);
    updateCounterValue(config, progress);

    if (progress < 1) {
      animationId = requestAnimationFrame(step);
      return;
    }

    cancelAnimationFrame(animationId);
  };

  animationId = requestAnimationFrame(step);
}

export function initCounters(): void {
  const counterElements: NodeListOf<HTMLElement> = document.querySelectorAll(COUNTER_SELECTOR);
  if (counterElements.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const counterElement = entry.target as HTMLElement;
        const config = parseCounterConfig(counterElement);
        if (config !== null) {
          animateCounter(config);
        }

        currentObserver.unobserve(counterElement);
      });
    },
    {
      threshold: 0.35,
    },
  );

  counterElements.forEach((element) => {
    observer.observe(element);
  });
}
