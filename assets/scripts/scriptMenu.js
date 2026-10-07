(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("nav-toggle");
  const collapse = document.getElementById("nav-collapse");

  if (header && toggle && collapse) {
    function closeMenu() {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú de navegación");
    }

    function toggleMenu() {
      const isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
      );
    }

    toggle.addEventListener("click", toggleMenu);
    collapse.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) closeMenu();
    });
  }

  const contactForm = document.getElementById("contact-form");
  const planSelect = document.getElementById("contact-plan");
  const formNote = document.getElementById("form-note");

  document.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      if (planSelect) planSelect.value = link.getAttribute("data-plan");
    });
  });

  if (contactForm && formNote) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "");
      const email = String(formData.get("email") || "");
      const plan = String(formData.get("plan") || "");
      const message = String(formData.get("message") || "");
      const subject = encodeURIComponent(`Consulta AgriDron - ${name}`);
      const body = encodeURIComponent(
        `Nombre: ${name}\nCorreo: ${email}\nPlan de interés: ${plan}\n\nMensaje:\n${message}`
      );

      formNote.textContent = "Abriendo tu aplicación de correo para completar el envío.";
      window.location.href = `mailto:info@agridron.com?subject=${subject}&body=${body}`;
    });
  }
})();
