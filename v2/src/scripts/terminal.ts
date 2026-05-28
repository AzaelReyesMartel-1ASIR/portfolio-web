interface TerminalLine {
  text: string;
  className: string;
}

const TERMINAL_LINES: TerminalLine[] = [
  { text: "$ ./boot_profile.sh --verbose", className: "text-sky" },
  { text: "[....] Initializing kernel...", className: "text-muted" },
  { text: "[OK]   Docker daemon started", className: "text-green" },
  { text: "[OK]   PostgreSQL :: connected", className: "text-green" },
  { text: "[OK]   Laravel API :: port 8000", className: "text-green" },
  { text: "[OK]   Nginx :: proxy_pass ready", className: "text-green" },
  { text: "[OK]   SSL/TLS :: cert valid 365d", className: "text-green" },
  { text: "[WARN] Frontend: vanilla mode", className: "text-orange" },
  { text: "> Stack ready. Loading engineer_", className: "text-violet" },
];

const BASE_CHAR_DELAY = 28;
const JITTER = 15;

const getTypingDelay = (): number => {
  return BASE_CHAR_DELAY + Math.floor(Math.random() * (JITTER * 2 + 1)) - JITTER;
};

const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
};

const createLine = (className: string): HTMLParagraphElement => {
  const lineElement = document.createElement("p");
  lineElement.className = className;
  return lineElement;
};

const typeLine = async (element: HTMLElement, text: string): Promise<void> => {
  for (const character of text) {
    element.textContent = `${element.textContent ?? ""}${character}`;
    await wait(Math.max(8, getTypingDelay()));
  }
};

const appendBlinkCursor = (element: HTMLElement): void => {
  const cursor = document.createElement("span");
  cursor.className = "animate-term-blink";
  cursor.textContent = "|";
  element.append(cursor);
};

export const initTerminal = (): void => {
  const terminalContainer = document.querySelector<HTMLElement>("#terminal-lines");
  if (!terminalContainer) {
    return;
  }

  terminalContainer.innerHTML = "";

  void (async () => {
    for (let index = 0; index < TERMINAL_LINES.length; index += 1) {
      const line = TERMINAL_LINES[index];
      const lineElement = createLine(line.className);
      terminalContainer.append(lineElement);
      await typeLine(lineElement, line.text);
      if (index === TERMINAL_LINES.length - 1) {
        appendBlinkCursor(lineElement);
      }
      await wait(index === 0 ? 320 : 150);
    }
  })();
};
