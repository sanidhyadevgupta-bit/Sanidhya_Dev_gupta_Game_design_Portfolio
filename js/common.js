// Shared by the home page (site.js) and the game pages (game.js): helpers, the play button,
// links from js/config.js, copy-email, back to top, the phone menu and the lightbox.
// Pages below the site root set <body data-root="../"> so every path still resolves.
window.CAW = (function () {
  "use strict";
  const C = window.SITE_CONFIG || {};
  const P = window.PROJECTS || [];
  const root = document.body.dataset.root || "";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const img = (slug, name) => `${root}img/${slug}/${name}.webp`;
  const skinVars = (s) => `--g-bg:${s.bg};--g-panel:${s.panel};--g-accent:${s.accent};--g-ink:${s.ink};--g-soft:${s.soft};--g-label:${s.label || s.accent}`;
  const num = (i) => String(i + 1).padStart(2, "0");
  const page = (p) => `${root}games/${p.slug}.html`;
  // Bump when the GDD copies are rebuilt, so browsers don't serve an old cached copy.
  const GDD_VERSION = "3";
  const gdd = (p) => `${root}${p.gdd}?v=${GDD_VERSION}`;

  // A play button that degrades to "coming soon" until its itch link is filled in.
  function playBtn(slug, cls) {
    const url = (C.play || {})[slug];
    return url
      ? `<a class="btn btn--stamp ${cls || ""}" href="${esc(url)}" target="_blank" rel="noopener">▶ Play</a>`
      : `<span class="btn btn--stamp is-soon ${cls || ""}" title="itch.io link coming soon">▶ Soon</span>`;
  }

  // Lightbox galleries: pages add { key: [{ src, cap, pixel }] } before calling wire().
  const galleries = {};

  function copyText(text) {
    // The clipboard API needs a secure page (https or localhost), so fall back to a hidden textarea.
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const t = document.createElement("textarea");
      t.value = text; t.setAttribute("readonly", ""); t.style.position = "absolute"; t.style.left = "-9999px";
      document.body.appendChild(t); t.select();
      const ok = document.execCommand("copy"); t.remove();
      ok ? resolve() : reject(new Error("copy failed"));
    });
  }

  // The nav's real height, for full-screen sections and anchor offsets (CSS --nav-h).
  const navEl = document.querySelector(".nav");
  const setNavH = () => { if (navEl) document.documentElement.style.setProperty("--nav-h", navEl.offsetHeight + "px"); };
  setNavH();
  window.addEventListener("resize", setNavH, { passive: true });

  // Call once the page has rendered its content.
  function wire() {
    // links from config
    document.querySelectorAll("[data-link]").forEach((a) => {
      const kind = a.dataset.link;
      const url = kind === "itch" ? C.itchProfile : kind === "cv" ? C.cv : kind === "linkedin" ? C.linkedin : "";
      if (url) a.href = url;
      else { a.classList.add("is-soon"); a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.title = "Coming soon"; }
    });

    document.querySelectorAll("[data-email]").forEach((n) => { n.textContent = C.email || ""; });
    document.querySelectorAll("[data-copy-email]").forEach((b) => {
      if (!C.email) { b.classList.add("is-soon"); return; }
      const label = b.textContent;
      b.addEventListener("click", () => {
        copyText(C.email)
          .then(() => { b.textContent = "Copied ✓"; })
          .catch(() => { b.textContent = "Select it below"; })
          .finally(() => { clearTimeout(b._t); b._t = setTimeout(() => { b.textContent = label; }, 2000); });
      });
    });

    // back to top: scroll there directly so it always reaches 0 and doesn't leave "#top" in the address bar
    document.querySelectorAll('a[href="#top"]').forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    }));

    // phone menu
    const navToggle = document.querySelector(".nav__toggle");
    const navLinks = document.getElementById("nav-links");
    if (navToggle && navLinks) {
      const setOpen = (open) => { navLinks.classList.toggle("is-open", open); navToggle.setAttribute("aria-expanded", String(open)); navToggle.textContent = open ? "Close" : "Menu"; };
      navToggle.addEventListener("click", () => setOpen(!navLinks.classList.contains("is-open")));
      navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    }

    // lightbox
    const lb = document.getElementById("lightbox");
    if (lb) {
      const lbImg = lb.querySelector("img");
      const lbCap = lb.querySelector("figcaption");
      let cur = { g: null, i: 0 };
      const show = (g, i) => {
        const items = galleries[g]; if (!items || !items.length) return;
        cur = { g, i: (i + items.length) % items.length };
        const it = items[cur.i];
        lbImg.src = it.src; lbImg.alt = it.cap; lbCap.textContent = `${it.cap} · ${cur.i + 1}/${items.length}`;
        lbImg.style.imageRendering = it.pixel ? "pixelated" : "";
        if (!lb.open) lb.showModal();
      };
      document.addEventListener("click", (e) => {
        const b = e.target.closest("[data-gallery]");
        if (b) show(b.dataset.gallery, Number(b.dataset.index));
      });
      lb.addEventListener("click", (e) => {
        if (e.target.closest("[data-close]") || e.target === lb) lb.close();
        const s = e.target.closest("[data-step]"); if (s) show(cur.g, cur.i + Number(s.dataset.step));
      });
      lb.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") show(cur.g, cur.i + 1);
        if (e.key === "ArrowLeft") show(cur.g, cur.i - 1);
      });
    }
    // Scroll reveals, the progress bar and parallax live in js/motion.js, loaded after this page's script.
  }

  return { C, P, root, reduced, esc, el, img, skinVars, num, page, gdd, playBtn, galleries, wire };
})();
