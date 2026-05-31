export function initContactForm() {
  const emailBtn = document.getElementById("email-btn") as HTMLAnchorElement | null;
  const emailBtnText = document.getElementById("email-btn-text") as HTMLSpanElement | null;
  const emailDropdown = document.getElementById("email-dropdown") as HTMLDivElement | null;
  const optCopy = document.getElementById("opt-copy") as HTMLButtonElement | null;
  const optCopyText = document.getElementById("opt-copy-text") as HTMLSpanElement | null;

  if (emailBtn && emailBtnText && emailDropdown && optCopy && optCopyText && !emailBtn.dataset.initialized) {
    emailBtn.dataset.initialized = "true";

    const showDropdown = () => {
      emailDropdown.classList.remove("hidden");
      // Force reflow
      emailDropdown.offsetHeight;
      emailDropdown.classList.remove("scale-95", "opacity-0");
      emailDropdown.classList.add("scale-100", "opacity-100");
      emailBtn.setAttribute("aria-expanded", "true");
    };

    const hideDropdown = () => {
      emailDropdown.classList.remove("scale-100", "opacity-100");
      emailDropdown.classList.add("scale-95", "opacity-0");
      emailBtn.setAttribute("aria-expanded", "false");
      
      const onTransitionEnd = () => {
        emailDropdown.classList.add("hidden");
        emailDropdown.removeEventListener("transitionend", onTransitionEnd);
      };
      emailDropdown.addEventListener("transitionend", onTransitionEnd);
    };

    emailBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = emailBtn.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        hideDropdown();
      } else {
        showDropdown();
      }
    });

    optCopy.addEventListener("click", async (e) => {
      e.stopPropagation();
      const email = "azadaw2004@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        const originalText = optCopyText.innerText;
        const copiedText = emailBtn.getAttribute("data-copied-text") || "¡Copiado!";
        
        optCopyText.innerText = copiedText;
        optCopy.classList.remove("text-muted");
        optCopy.classList.add("text-green");
        
        setTimeout(() => {
          optCopyText.innerText = originalText;
          optCopy.classList.remove("text-green");
          optCopy.classList.add("text-muted");
          hideDropdown();
        }, 1500);
      } catch (err) {
        console.error("Failed to copy email to clipboard:", err);
      }
    });

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!emailBtn.contains(target) && !emailDropdown.contains(target)) {
        const isExpanded = emailBtn.getAttribute("aria-expanded") === "true";
        if (isExpanded) {
          hideDropdown();
        }
      }
    });
  }

  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  const feedbackEl = document.getElementById("form-feedback") as HTMLParagraphElement | null;
  const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement | null;
  const btnText = document.getElementById("btn-text") as HTMLSpanElement | null;

  if (!form || !feedbackEl || !submitBtn || !btnText) return;

  if (form.dataset.initialized) return;
  form.dataset.initialized = "true";

  const showFeedback = (msg: string, isError: boolean) => {
    feedbackEl.innerText = msg;
    feedbackEl.className = `text-sm font-medium mt-3 ${isError ? "text-red-500" : "text-green"}`;
    feedbackEl.classList.remove("hidden");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedbackEl.classList.add("hidden");

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const honeypot = formData.get("honeypot") as string;

    if (honeypot) {
      console.warn("Spam detectado");
      return;
    }

    // Pre-validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback("Please enter a valid email address.", true);
      return;
    }

    if (message.trim().length < 10) {
      showFeedback("The message must be at least 10 characters long.", true);
      return;
    }

    const payload = {
      name,
      email,
      subject,
      message,
      honeypot: honeypot || "",
    };

    try {
      submitBtn.disabled = true;
      const originalText = btnText.innerText;
      btnText.innerText = "Sending...";

      const API_URL = "https://api-gateway.azael-backend.workers.dev/api/v1/portfolio/contact";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = "Failed to send message. Please try again.";
        try {
          const errorData = await response.json();
          // El JSON de error de Zod viene stringificado dentro de error.message
          const zodString = errorData?.error?.message || errorData?.message;
          if (zodString) {
            const parsedZod = JSON.parse(zodString);
            if (Array.isArray(parsedZod) && parsedZod.length > 0 && parsedZod[0].message) {
              errorMsg = parsedZod[0].message; // Extrae el mensaje específico (ej. "Too small...")
            }
          }
        } catch (_) {
          // Ignorar si no se puede parsear
        }

        showFeedback(errorMsg, true);
        btnText.innerText = originalText;
        submitBtn.disabled = false;
        return;
      }

      showFeedback("Message sent successfully!", false);
      form.reset();

      btnText.innerText = originalText;
      submitBtn.disabled = false;
    } catch (error) {
      console.error("Error sending form:", error);
      showFeedback("An error occurred. Please try again later.", true);

      btnText.innerText = "Send Message";
      submitBtn.disabled = false;
    }
  });
}
