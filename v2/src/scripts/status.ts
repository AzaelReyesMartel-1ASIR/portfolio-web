function buildStatusMarkup(label: string): string {
  return `
    <div class="flex items-center gap-3 rounded-lg border border-green/25 bg-green/10 px-3 py-2">
      <span class="inline-block size-2 rounded-full bg-green animate-dot-pulse" aria-hidden="true"></span>
      <span class="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-green">${label}</span>
    </div>
  `;
}

async function fetchMockStatus(): Promise<string> {
  await new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), 220);
  });
  return "Sistemas Operativos";
}

export async function initStatus(): Promise<void> {
  const badge = document.getElementById("status-badge");
  if (!(badge instanceof HTMLElement)) {
    return;
  }

  const statusText = await fetchMockStatus();
  badge.innerHTML = buildStatusMarkup(statusText);
}
