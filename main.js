(function () {
  "use strict";

  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  function initNavToggle() {
    const toggle = $(".nav-toggle");
    const nav = $("#nav-menu");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function initReveals() {
    const items = $$(".sheet");
    if (!items.length) return;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    items.forEach(el => io.observe(el));
    // Safety net: reveal everything after a timeout even if observer misfires
    setTimeout(() => items.forEach(el => el.classList.add("is-visible")), 1200);
  }

  function initFilters() {
    const buttons = $$(".filter-btn");
    const sheets = $$(".sheet");
    if (!buttons.length || !sheets.length) return;
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const filter = btn.dataset.filter;
        sheets.forEach(sheet => {
          const match = filter === "todos" || sheet.dataset.category === filter;
          sheet.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  function initFooterYear() {
    const el = $("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function boot() {
    safe(initNavToggle, "initNavToggle");
    safe(initReveals, "initReveals");
    safe(initFilters, "initFilters");
    safe(initFooterYear, "initFooterYear");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
