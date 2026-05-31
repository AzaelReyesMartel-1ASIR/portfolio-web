export function initContactForm() {
  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  const statusEl = document.getElementById("form-status") as HTMLParagraphElement | null;
  const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement | null;
  const btnText = document.getElementById("btn-text") as HTMLSpanElement | null;

  if (!form || !statusEl || !submitBtn || !btnText) return;

  if (form.dataset.initialized) return;
  form.dataset.initialized = "true";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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

      statusEl.classList.add("hidden");
      statusEl.className = "text-sm font-medium mt-2";

      const API_URL = "https://api-gateway.azael-backend.workers.dev/api/v1/portfolio/contact";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        statusEl.innerText = "Message sent successfully!";
        statusEl.classList.add("text-green");
        statusEl.classList.remove("hidden");
        form.reset();
      } else {
        statusEl.innerText = "Failed to send message. Please try again.";
        statusEl.classList.add("text-red-500");
        statusEl.classList.remove("hidden");
      }

      btnText.innerText = originalText;
      submitBtn.disabled = false;
    } catch (error) {
      console.error("Error sending form:", error);
      statusEl.innerText = "An error occurred. Please try again later.";
      statusEl.classList.add("text-red-500");
      statusEl.classList.remove("hidden");

      btnText.innerText = "Send Message";
      submitBtn.disabled = false;
    }
  });
}
