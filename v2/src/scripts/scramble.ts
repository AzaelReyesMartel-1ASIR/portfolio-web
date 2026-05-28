const CHARSET = "!<>-_\\/[]{}=+*^?#ABCDEFabcdef0123456789$@~|&";

interface ScrambleFrame {
  from: string;
  to: string;
  start: number;
  end: number;
  char: string;
}

const randomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};

const randomChar = (): string => {
  return CHARSET[randomInt(CHARSET.length)];
};

const buildQueue = (fromText: string, toText: string): ScrambleFrame[] => {
  const maxLength = Math.max(fromText.length, toText.length);
  return Array.from({ length: maxLength }, (_, index) => {
    return {
      from: fromText[index] ?? "",
      to: toText[index] ?? "",
      start: randomInt(9),
      end: randomInt(13) + 8,
      char: "",
    };
  });
};

const createScrambleRunner = (element: HTMLElement, targetText: string): (() => void) => {
  let frame = 0;
  let rafId = 0;
  const queue = buildQueue(element.textContent ?? "", targetText);

  const update = (): void => {
    let output = "";
    let complete = 0;

    for (const item of queue) {
      if (frame >= item.end) {
        complete += 1;
        output += item.to;
      } else if (frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = randomChar();
        }
        output += `<span style="color: var(--sky)">${item.char}</span>`;
      } else {
        output += item.from;
      }
    }

    element.innerHTML = output;
    frame += 1;

    if (complete < queue.length) {
      rafId = requestAnimationFrame(update);
      return;
    }

    element.textContent = targetText;
  };

  return (): void => {
    cancelAnimationFrame(rafId);
    frame = 0;
    update();
  };
};

const bindScramble = (selector: string): void => {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    return;
  }
  const finalText = element.textContent?.trim() ?? "";
  const run = createScrambleRunner(element, finalText);
  element.addEventListener("mouseenter", run);
};

export const initScramble = (): void => {
  bindScramble("#scramble-name");
  bindScramble(".logo-dev");
};
