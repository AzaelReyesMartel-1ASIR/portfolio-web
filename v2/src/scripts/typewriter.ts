/* ──────────────────────────────────────────────
   typewriter.ts — Animated role cycling for Hero
   ────────────────────────────────────────────── */

const ROLES: string[] = [
  "Software Engineer",
  "SysAdmin",
  "DevOps Engineer",
  "Cloud Architect",
  "Site Reliability Engineer",
  "Infrastructure Engineer",
  "Full Stack Developer",
  "Backend Developer",
  "Linux Administrator",
  "Platform Engineer",
];

const TYPE_SPEED  = 72;   // ms per character while typing
const ERASE_SPEED = 38;   // ms per character while erasing
const PAUSE_AFTER = 1800; // ms pause when fully typed
const PAUSE_EMPTY = 420;  // ms pause when fully erased

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export function initTypewriter(): void {
  const target = document.getElementById("hero-role-text");
  if (!(target instanceof HTMLElement)) return;

  // Idempotency guard: prevent duplicate infinite loops on the same DOM element
  if (target.dataset.initialized) return;
  target.dataset.initialized = "true";

  let roleIndex = 0;

  const run = async (): Promise<void> => {
    while (true) {
      if (!target.isConnected) return; // Exit loop if element is unmounted

      const role = ROLES[roleIndex % ROLES.length];

      // Type
      for (let i = 0; i <= role.length; i++) {
        if (!target.isConnected) return;
        target.textContent = role.slice(0, i);
        await wait(TYPE_SPEED + Math.round((Math.random() - 0.5) * 24));
      }

      if (!target.isConnected) return;
      await wait(PAUSE_AFTER);

      // Erase
      for (let i = role.length; i >= 0; i--) {
        if (!target.isConnected) return;
        target.textContent = role.slice(0, i);
        await wait(ERASE_SPEED);
      }

      if (!target.isConnected) return;
      await wait(PAUSE_EMPTY);
      roleIndex++;
    }
  };

  void run();
}
