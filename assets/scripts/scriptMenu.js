
    (function () {
    const header = document.querySelector(".site-header");
    const toggle = document.getElementById("nav-toggle");
    const collapse = document.getElementById("nav-collapse");

    if (!header || !toggle || !collapse) return;

    function closeMenu() {
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
}

    function toggleMenu() {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
}

    toggle.addEventListener("click", toggleMenu);

    // Cierra el menú al hacer click en un enlace (útil para anchors en la misma página)
    collapse.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

    // Si la ventana crece de nuevo a escritorio, se asegura de resetear el estado
    window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
    closeMenu();
}
});
})();
