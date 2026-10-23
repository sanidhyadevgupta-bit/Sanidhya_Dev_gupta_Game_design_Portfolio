// Scroll micro-animations for every page: a reading-progress bar, a nav that tightens once you scroll,
// ransom-note headings whose tiles drop in, staggered reveals for grids and rows (replayed every time
// they scroll back into view), and a little parallax.
// Load it last, after the page has rendered its content. Nothing moves with reduced motion.
(function () {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document.documentElement;

  // ---------- what to reveal ----------
  // Single blocks that slide up as they arrive.
  const SINGLES = [
    ".section__head p", ".subhead", ".subhead-row", ".dobara", ".hero__copy > *",
    ".project__banner", ".project__head", ".block-label", ".credit",
    ".article__dek", ".creds", ".part", ".figure", ".dgm", ".table-wrap", ".callout", ".sources", ".figrow",
    ".sheet__lore", ".sheet__id", ".sheet__contact",
  ];
  // Containers whose children arrive one after another.
  const GROUPS = [
    [".shelf", "card"], ["#analysis-grid", "card"], ["#render-grid", "card"], [".gamenav", "card"],
    [".stats", "up"], [".statgrid", "up"], [".chips", "up"], [".invite__actions", "up"],
    [".dobara__powers", "up"], [".row.gdd", "card"], [".row.shots", "up"], [".row.concept", "up"],
    [".chips-row", "up"], [".article__emblems", "up"],
  ];

  const tagged = new Set();
  function tag(n, kind, delay) {
    if (tagged.has(n) || n.closest(".art-row")) return;
    tagged.add(n);
    n.classList.add("reveal", "reveal--" + kind);
    if (delay) n.style.setProperty("--rd", delay + "ms");
  }
  SINGLES.forEach((s) => document.querySelectorAll(s).forEach((n) => tag(n, "up", 0)));
  GROUPS.forEach(([s, kind]) => document.querySelectorAll(s).forEach((box) =>
    [...box.children].forEach((c, i) => tag(c, kind, Math.min(i, 8) * 70))));
  document.querySelectorAll(".reveal").forEach((n) => { if (!tagged.has(n)) tag(n, "up", 0); });

  // Ransom-note headings: each tile drops in, a beat after the one before.
  const headings = [...document.querySelectorAll(".rn")];
  headings.forEach((h) => [...h.children].forEach((s, i) => s.style.setProperty("--rd", i * 90 + "ms")));

  if (reduced || !("IntersectionObserver" in window)) {
    tagged.forEach((n) => n.classList.remove("reveal"));
    return;
  }

  // Play on the way in; reset once fully off screen (above or below), so it plays again next time.
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const cls = e.target.classList.contains("rn") ? "rn-in" : "is-in";
    if (e.isIntersecting) e.target.classList.add(cls);
    else if (!isNear(e.boundingClientRect)) e.target.classList.remove(cls);
  }), { rootMargin: "0px 0px -8% 0px" });
  // Only reset things that are really out of view, so an element sitting in the bottom 8% doesn't flicker.
  const isNear = (r) => r.bottom > 0 && r.top < innerHeight;
  tagged.forEach((n) => io.observe(n));
  headings.forEach((h) => { h.classList.add("rn-wait"); io.observe(h); });

  // ---------- progress bar, nav and parallax, all on one frame loop ----------
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  const nav = document.querySelector(".nav");

  // [element, speed]: positive drifts up as you scroll past, negative drifts down.
  const parallax = [];
  const add = (sel, speed) => document.querySelectorAll(sel).forEach((n) => parallax.push([n, speed]));
  add(".hero__logo", 0.08);
  add(".sheet__cat", -0.12);
  add(".dobara__poster", 0.06);
  add(".project__banner img", -0.1);
  add(".figure--hero img", -0.06);
  // The hero stickers fan apart a little as the page scrolls away from them.
  const stickers = [...document.querySelectorAll(".hero__stack .sticker")];

  let ticking = false;
  function frame() {
    ticking = false;
    const y = window.scrollY;
    const max = doc.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    if (nav) nav.classList.toggle("is-scrolled", y > 8);
    const mid = innerHeight / 2;
    // On big monitors the page is zoomed (site.css --z): screen distances are divided back into CSS pixels.
    const z = parseFloat(getComputedStyle(document.body).zoom) || 1;
    parallax.forEach(([n, speed]) => {
      const r = n.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      n.style.translate = `0 ${((r.top + r.height / 2 - mid) * speed / z).toFixed(1)}px`;
    });
    if (stickers.length && y < innerHeight * 1.5) {
      stickers.forEach((s, i) => {
        const dir = i % 2 ? 1 : -1;
        s.style.translate = `${(dir * y * 0.04 * (i + 1) / stickers.length).toFixed(1)}px ${(-y * 0.05 * (1 + i * 0.35)).toFixed(1)}px`;
      });
    }
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  frame();
})();
