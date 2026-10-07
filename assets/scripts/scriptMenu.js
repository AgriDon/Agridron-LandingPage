(function () {
  const translations = window.AgridronTranslations;
  const languageButtons = document.querySelectorAll("[data-language]");
  const faqList = document.getElementById("faq-list");
  const contactForm = document.getElementById("contact-form");
  const planSelect = document.getElementById("contact-plan");
  const formNote = document.getElementById("form-note");
  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("nav-toggle");
  const collapse = document.getElementById("nav-collapse");
  let activeFaqIndex = -1;

  function getTranslation(language, key) {
    return key.split(".").reduce((value, part) => value && value[part], translations[language]);
  }

  function renderFaq(language) {
    if (!faqList) return;

    const questions = translations[language].faq.questions;
    faqList.replaceChildren(
      ...questions.map((item, index) => {
        const article = document.createElement("article");
        const button = document.createElement("button");
        const answer = document.createElement("div");
        const answerText = document.createElement("p");
        const isOpen = index === activeFaqIndex;

        article.className = "faq-item";
        article.classList.toggle("is-open", isOpen);
        button.className = "faq-question";
        button.type = "button";
        button.setAttribute("aria-expanded", String(isOpen));
        button.setAttribute("aria-controls", `faq-answer-${index}`);
        button.dataset.faqIndex = String(index);

        const questionText = document.createElement("span");
        questionText.textContent = item.question;
        const icon = document.createElement("span");
        icon.className = "faq-toggle-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = isOpen ? "−" : "+";
        button.append(questionText, icon);

        answer.className = "faq-answer";
        answer.id = `faq-answer-${index}`;
        answer.hidden = !isOpen;
        answerText.textContent = item.answer;
        answer.append(answerText);
        article.append(button, answer);

        return article;
      })
    );
  }

  function setLanguage(language) {
    const selectedLanguage = translations[language] ? language : "es";
    const dictionary = translations[selectedLanguage];

    document.documentElement.lang = selectedLanguage;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = getTranslation(selectedLanguage, element.dataset.i18n);
      if (typeof value === "string") element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const value = getTranslation(selectedLanguage, element.dataset.i18nPlaceholder);
      if (typeof value === "string") element.setAttribute("placeholder", value);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      const value = getTranslation(selectedLanguage, element.dataset.i18nAlt);
      if (typeof value === "string") element.setAttribute("alt", value);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      const value = getTranslation(selectedLanguage, element.dataset.i18nAriaLabel);
      if (typeof value === "string") element.setAttribute("aria-label", value);
    });

    languageButtons.forEach((button) => {
      const selected = button.dataset.language === selectedLanguage;
      button.setAttribute("aria-pressed", String(selected));
    });

    if (toggle) {
      const label = toggle.getAttribute("aria-expanded") === "true"
        ? dictionary.nav.closeMenu
        : dictionary.nav.openMenu;
      toggle.setAttribute("aria-label", label);
    }

    renderFaq(selectedLanguage);
    localStorage.setItem("agridron-language", selectedLanguage);
  }

  let currentLanguage = localStorage.getItem("agridron-language") || "es";
  if (!translations[currentLanguage]) currentLanguage = "es";
  setLanguage(currentLanguage);

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  if (faqList) {
    faqList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-faq-index]");
      if (!button) return;

      const index = Number(button.dataset.faqIndex);
      activeFaqIndex = activeFaqIndex === index ? -1 : index;
      renderFaq(document.documentElement.lang);
    });
  }

  if (header && toggle && collapse) {
    function closeMenu() {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", translations[document.documentElement.lang].nav.openMenu);
    }

    function toggleMenu() {
      const isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen
          ? translations[document.documentElement.lang].nav.closeMenu
          : translations[document.documentElement.lang].nav.openMenu
      );
    }

    toggle.addEventListener("click", toggleMenu);
    collapse.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) closeMenu();
    });
  }

  document.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      if (planSelect) planSelect.value = link.getAttribute("data-plan");
    });
  });

  if (contactForm && formNote) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const language = document.documentElement.lang;
      const dictionary = translations[language].contact;
      const name = String(formData.get("name") || "");
      const email = String(formData.get("email") || "");
      const plan =
        planSelect?.selectedOptions[0]?.textContent || String(formData.get("plan") || "");
      const message = String(formData.get("message") || "");
      const subject = encodeURIComponent(`${dictionary.emailSubject} - ${name}`);
      const body = encodeURIComponent(
        `${dictionary.emailName}: ${name}\n${dictionary.emailAddress}: ${email}\n${dictionary.emailPlan}: ${plan}\n\n${dictionary.emailMessage}:\n${message}`
      );

      formNote.textContent = dictionary.sendingNote;
      window.location.href = `mailto:info@agridron.com?subject=${subject}&body=${body}`;
    });
  }
})();
