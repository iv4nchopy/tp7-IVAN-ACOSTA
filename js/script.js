/* script.js - Manejo de menú, submenús y likes persistentes, versión optimizada y profesional */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------
   *  FOOTER YEAR
   * ------------------------------------------- */
  document.querySelectorAll('[id^="year"]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });


  /* -------------------------------------------
   *  NAV RESPONSIVE (HAMBURGER)
   *  Permite múltiples menús si existieran.
   * ------------------------------------------- */
  function setupNav(toggleId, navId) {
    const btn = document.getElementById(toggleId);
    const nav = document.getElementById(navId);
    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
      nav.classList.toggle("open");
      btn.classList.toggle("active");
    });
  }

  setupNav("navToggle", "mainNav");
  setupNav("navToggle2", "mainNav2");
  setupNav("navToggle3", "mainNav3");
  setupNav("navToggle4", "mainNav4");


  /* -------------------------------------------
   *  SUBMENÚS (DESKTOP / MOBILE)
   * ------------------------------------------- */
  document.querySelectorAll(".has-sub > .sub-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      const expanded = btn.getAttribute("aria-expanded") === "true";

      // toggle
      btn.setAttribute("aria-expanded", String(!expanded));
      parent.classList.toggle("open", !expanded);
    });
  });

  // Cierra submenú si clic fuera
  document.addEventListener("click", e => {
    document.querySelectorAll(".has-sub.open").forEach(el => {
      if (!el.contains(e.target)) {
        el.classList.remove("open");
        const btn = el.querySelector(".sub-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  });


  /* -------------------------------------------
   *  LIKE SYSTEM (con persistencia localStorage)
   * ------------------------------------------- */

  const LS_KEY = "tpm_relikes_v1_"; // prefix único para evitar conflictos

  document.querySelectorAll(".like-btn").forEach(btn => {
    const wrapper = btn.closest("[data-id]");
    const id = wrapper ? wrapper.getAttribute("data-id") : null;
    const countSpan = btn.querySelector(".like-count");

    let count = 0;
    let active = false;

    // Si el botón tiene ID válido, carga datos
    if (id) {
      try {
        const saved = JSON.parse(localStorage.getItem(LS_KEY + id));
        if (saved && typeof saved.count === "number") {
          count = saved.count;
          active = !!saved.active;
        }
      } catch (e) {
        console.warn("Error al leer likes:", e);
      }

      // Aplicar estado inicial
      countSpan.textContent = count;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));

      // Manejar clic
      btn.addEventListener("click", () => {
        active = !active;
        count = active ? count + 1 : Math.max(0, count - 1);

        countSpan.textContent = count;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", String(active));

        // Guardar
        localStorage.setItem(LS_KEY + id, JSON.stringify({ count, active }));
      });
    }

    // Si NO tiene ID → fallback visual local
    else {
      btn.addEventListener("click", () => {
        const span = btn.querySelector(".like-count");
        let n = Number(span.textContent || 0);

        const activeLocal = btn.classList.toggle("active");
        n = activeLocal ? n + 1 : Math.max(0, n - 1);

        span.textContent = n;
        btn.setAttribute("aria-pressed", String(activeLocal));
      });
    }
  });

});
