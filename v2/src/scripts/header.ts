const SCROLL_OFFSET = 40;

function updateHeaderState(header: HTMLElement): void {
  if (window.scrollY > SCROLL_OFFSET) {
    header.classList.add("scrolled");
    return;
  }
  header.classList.remove("scrolled");
}

function updateScrollBar(progressBar: HTMLElement): void {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
}

function updateBackToTop(button: HTMLButtonElement): void {
  const isVisible = window.scrollY > 480;
  button.style.opacity = isVisible ? "1" : "0";
  button.style.transform = isVisible ? "translateY(0)" : "translateY(10px)";
  button.style.pointerEvents = isVisible ? "auto" : "none";
}

function setupMobileMenu(button: HTMLButtonElement, mobileMenu: HTMLElement): void {
  button.addEventListener("click", () => {
    const isOpen = mobileMenu.dataset.open === "true";
    const nextState = (!isOpen).toString();
    mobileMenu.dataset.open = nextState;
    button.setAttribute("aria-expanded", nextState);
    button.setAttribute("aria-label", isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación");
  });

  mobileMenu.querySelectorAll<HTMLAnchorElement>("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.dataset.open = "false";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menú de navegación");
    });
  });
}

export function initHeader(): void {
  const header = document.getElementById("site-header");
  const progressBar = document.getElementById("scroll-bar");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const backToTopButton = document.getElementById("back-to-top");

  if (!(header instanceof HTMLElement) || !(progressBar instanceof HTMLElement)) {
    return;
  }

  updateHeaderState(header);
  updateScrollBar(progressBar);
  if (backToTopButton instanceof HTMLButtonElement) {
    updateBackToTop(backToTopButton);
  }

  window.addEventListener(
    "scroll",
    () => {
      updateHeaderState(header);
      updateScrollBar(progressBar);
      if (backToTopButton instanceof HTMLButtonElement) {
        updateBackToTop(backToTopButton);
      }
    },
    { passive: true },
  );

  if (menuToggle instanceof HTMLButtonElement && mobileMenu instanceof HTMLElement) {
    setupMobileMenu(menuToggle, mobileMenu);
  }

  if (backToTopButton instanceof HTMLButtonElement) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
