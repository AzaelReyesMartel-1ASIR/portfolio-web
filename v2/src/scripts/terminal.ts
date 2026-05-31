/* ──────────────────────────────────────────────
   terminal.ts — Hero boot-sequence animator
   Strategy: Ghost-pre-render → zero CLS

   1. All lines are rendered invisible (opacity:0) in frame 0
      so the container claims its EXACT final height immediately.
   2. The typewriter loop makes each line visible + types chars.
   3. Layout never shifts after first paint → CLS = 0.

   Idempotent: safe to call multiple times.
   ────────────────────────────────────────────── */

interface TerminalLine {
  text: string;
  className: string;
}

const TERMINAL_LINES: TerminalLine[] = [
  { text: "$ ./boot_profile.sh --verbose",          className: "text-sky"    },
  { text: "[....] Initializing kernel...",           className: "text-muted"  },
  { text: "[OK]   Docker daemon started",            className: "text-green"  },
  { text: "[OK]   PostgreSQL :: connected",          className: "text-green"  },
  { text: "[OK]   Laravel API :: port 8000",         className: "text-green"  },
  { text: "[OK]   Nginx :: proxy_pass ready",        className: "text-green"  },
  { text: "[OK]   SSL/TLS :: cert valid 365d",       className: "text-green"  },
  { text: "[OK]   Frontend :: Astro SSG complete",   className: "text-green"  },
  { text: "[PROC] REST API   :: /v1 scaffolding",    className: "text-sky"    },
  { text: "[PROC] i18n       :: es/en pending",      className: "text-violet" },
  { text: "[PROC] Analytics  :: plausible.io",       className: "text-muted"  },
  { text: "> Stack ready. Loading engineer_",        className: "text-violet" },
];

const BASE_CHAR_DELAY = 26;
const JITTER = 12;

// Auto-incrementing run counter to cancel old loops on navigation
let _currentRunId = 0;

const getTypingDelay = (): number =>
  BASE_CHAR_DELAY + Math.floor(Math.random() * (JITTER * 2 + 1)) - JITTER;

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const appendBlinkCursor = (element: HTMLElement): void => {
  const cursor = document.createElement("span");
  cursor.className = "animate-term-blink";
  cursor.textContent = "|";
  element.append(cursor);
};

export const initTerminal = (): void => {
  const container = document.querySelector<HTMLElement>("#terminal-lines");
  if (!container) return;

  // Idempotency guard: prevent duplicate runs on the same DOM element
  if (container.dataset.initialized) return;
  container.dataset.initialized = "true";

  _currentRunId += 1;
  const myRunId = _currentRunId;

  // ── Step 1: Ghost pre-render ──────────────────────────────────────────
  // Render all lines at full length but invisible (opacity: 0).
  // This gives the container its final height on the FIRST paint → CLS = 0.
  container.innerHTML = "";
  const ghostLines: HTMLParagraphElement[] = TERMINAL_LINES.map(({ text, className }) => {
    const el = document.createElement("p");
    el.className = className;
    el.textContent = text;          // full text → correct height
    el.style.opacity = "0";         // invisible → space reserved, not visible
    el.style.visibility = "hidden"; // double-guard: doesn't contribute to ARIA
    container.append(el);
    return el;
  });

  // ── Step 2: Typewriter animation ──────────────────────────────────────
  // Make each ghost line visible and type its characters one by one.
  // Container height stays constant → zero layout shift after step 1.
  void (async () => {
    for (let i = 0; i < TERMINAL_LINES.length; i++) {
      if (myRunId !== _currentRunId || !container.isConnected) return;

      const { text } = TERMINAL_LINES[i];
      const line = ghostLines[i];

      // Make the line visible but start empty
      line.style.opacity = "";
      line.style.visibility = "";
      line.textContent = "";

      // Type characters
      for (const char of text) {
        if (myRunId !== _currentRunId || !container.isConnected) return;
        line.textContent = `${line.textContent ?? ""}${char}`;
        await wait(Math.max(8, getTypingDelay()));
      }

      // Add blinking cursor to last line
      if (i === TERMINAL_LINES.length - 1) {
        if (myRunId !== _currentRunId || !container.isConnected) return;
        appendBlinkCursor(line);
      }

      if (myRunId !== _currentRunId || !container.isConnected) return;
      await wait(i === 0 ? 300 : 120);
    }
  })();
};
