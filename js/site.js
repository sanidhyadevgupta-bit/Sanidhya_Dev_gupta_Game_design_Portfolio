// Home page: renders the shelf and the extras from js/data.js, and runs the
// artwork auto-scroll and scroll buttons. Each game's own page is rendered by js/game.js.
(function () {
  "use strict";
  const { C, P, reduced, esc, el, img, skinVars, num, page, playBtn, galleries, wire, zoom } = window.CAW;
  const X = window.EXTRAS || { art: [], renders: [], analyses: [] };

  // Old links to a game's block on this page (#terminus) now go to its own page.
  const old = location.hash && P.find((p) => p.slug === location.hash.slice(1));
  if (old) { location.replace(page(old)); return; }

  // ---------- hero collage: the game covers in a strip behind the logo ----------
  // Positions and tilts are in site.css (.hero__cover:nth-child); remove data-collage from the
  // badge in index.html to turn it off.
  const badge = document.querySelector(".hero__badge[data-collage]");
  if (badge) {
    const strip = el(`<div class="hero__arc" aria-hidden="true"></div>`);
    P.forEach((p) => strip.appendChild(el(`<img class="hero__cover ${p.pixel ? "pixel" : ""}" src="${img(p.slug, "cover")}" alt="" width="630" height="500">`)));
    badge.prepend(strip);
  }
  // The hero's intro (covers, then logo, then text; site.css) plays once on load; after that, drop its delays.
  setTimeout(() => document.body.classList.add("intro-done"), 2200);

  // ---------- shelf (a grid; each card opens the game's own page) ----------
  const shelf = document.getElementById("shelf-grid");
  P.forEach((p, i) => {
    const alt = p.shots[0] ? p.shots[0][0] : "cover";
    shelf.appendChild(el(`<article class="game-card ${p.pixel ? "pixel" : ""}" style="${skinVars(p.skin)}">
      <a class="game-card__art" href="${esc(page(p))}" tabindex="-1" aria-hidden="true">
        <img src="${img(p.slug, "cover")}" alt="" width="630" height="500" loading="lazy">
        <img class="alt" src="${img(p.slug, alt)}" alt="" loading="lazy">
        <img class="preview" data-src="${img(p.slug, "preview")}" alt="">
      </a>
      <div class="game-card__body">
        <span class="game-card__num">${num(i)} / ${num(P.length - 1)}</span>
        <h3 class="game-card__title"><a class="game-card__link" href="${esc(page(p))}">${esc(p.title)}</a></h3>
        ${p.native ? `<span class="game-card__native" lang="hi">${esc(p.native)}</span>` : ""}
        <p class="game-card__line">${esc(p.hook)}</p>
        <div class="game-card__actions">${playBtn(p.slug)}<a class="btn btn--paper" href="${esc(page(p))}">Under the hood →</a></div>
      </div>
    </article>`));
  });
  // Hovering a card plays its gameplay intro (img/<slug>/preview.webp, made from portfolio/gifs by
  // build_assets.py). A preview is only downloaded on the first hover, and it restarts from its first
  // frame every time: each hover gets a fresh object URL, which the browser treats as a new animation.
  // Not on touch screens (no hover) or with reduced motion; those keep the still screenshot.
  if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    shelf.querySelectorAll(".game-card").forEach((card) => {
      const pv = card.querySelector(".preview");
      let blob = null, loading = null, url = null, active = false;
      const start = async () => {
        if (active) return;
        active = true;
        card.classList.add("is-previewing");
        loading = loading || fetch(pv.dataset.src).then((r) => (r.ok ? r.blob() : null)).catch(() => null);
        blob = blob || await loading;
        if (!blob || !active) return;
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(blob);
        pv.onload = () => { pv.classList.toggle("is-tall", pv.naturalHeight > pv.naturalWidth); pv.classList.add("is-ready"); };
        pv.src = url;
      };
      const stop = () => {
        active = false;
        card.classList.remove("is-previewing");
        pv.classList.remove("is-ready");
        // once it has faded out, drop the image so it stops animating in the background
        setTimeout(() => { if (!active) { pv.removeAttribute("src"); if (url) { URL.revokeObjectURL(url); url = null; } } }, 350);
      };
      card.addEventListener("mouseenter", start);
      card.addEventListener("mouseleave", stop);
      card.addEventListener("focusin", start);
      card.addEventListener("focusout", (e) => { if (!card.contains(e.relatedTarget)) stop(); });
    });
  }

  shelf.appendChild(el(`<a class="more-card" data-link="itch" href="#" target="_blank" rel="noopener">
    <span class="star" aria-hidden="true">★</span><span class="big">More games<br>on itch.io</span><span class="mono small">Pocket Raja, Akhbaar Wala and more ↗</span></a>`));

  // ---------- extras ----------
  const artGrid = document.getElementById("art-grid");
  galleries.portrait = [{ src: "img/brand/portrait.webp", cap: "Sanidhya Dev Gupta" }];
  galleries.dobara = [{ src: "img/dobara/poster.webp", cap: "DOBARA · poster" }];
  galleries.art = X.art.map((s) => ({ src: `img/art/${s}.webp`, cap: (X.artTitles || {})[s] || s }));
  X.art.forEach((s, j) => {
    const t = (X.artTitles || {})[s] || s;
    artGrid.appendChild(el(`<button class="art" data-gallery="art" data-index="${j}"><img src="img/art/${s}-t.webp" alt="${esc(t)}" decoding="async"><span>${esc(t)}</span></button>`));
  });
  autoScroll(artGrid, 28);

  // Slow, endless drift for a horizontal row. The items are cloned once so the loop has no visible seam.
  // Pauses on hover, focus or touch, after any manual scroll, when off screen, and never runs with reduced motion.
  function autoScroll(row, speed) {
    if (reduced || !row.children.length) return;
    const originals = [...row.children];
    originals.forEach((n) => {
      const c = n.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      c.tabIndex = -1;
      row.appendChild(c);
    });
    row.classList.add("is-auto");
    row._pauseAuto = (ms) => pauseFor(ms);   // the ← → buttons call this so their smooth scroll isn't cut short
    const loop = () => row.children[originals.length].offsetLeft - row.children[0].offsetLeft;
    let pos = row.scrollLeft, last = 0, hold = 0, hover = false, visible = false;
    const pauseFor = (ms) => { hold = performance.now() + ms; };
    row.addEventListener("mouseenter", () => { hover = true; });
    row.addEventListener("mouseleave", () => { hover = false; pos = row.scrollLeft; });
    row.addEventListener("focusin", () => { hover = true; });
    row.addEventListener("focusout", () => { hover = false; pos = row.scrollLeft; });
    row.addEventListener("pointerdown", () => pauseFor(4000), { passive: true });
    row.addEventListener("wheel", () => pauseFor(4000), { passive: true });
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(row);
    function tick(t) {
      const dt = last ? Math.min(t - last, 100) / 1000 : 0;
      last = t;
      if (Math.abs(row.scrollLeft - pos) > 2) pos = row.scrollLeft;   // someone scrolled it: follow, don't fight
      if (visible && !hover && t > hold && !document.hidden) {
        pos += speed * dt;
        const w = loop();
        if (w > 0 && pos >= w) pos -= w;
        row.scrollLeft = pos;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const renders = document.getElementById("render-grid");
  X.renders.forEach((r) => {
    const id = (C.youtube || {})[r.key];
    const frame = id
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}" title="${esc(r.title)}" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : `<span>Video coming soon</span>`;
    renders.appendChild(el(`<article class="render reveal"><div class="render__frame">${frame}</div><div class="render__body"><h4>${esc(r.title)}</h4><p>${esc(r.note)}</p></div></article>`));
  });
  const an = document.getElementById("analysis-grid");
  X.analyses.forEach((a) => {
    an.appendChild(el(`<a class="analysis paper reveal" href="${esc(a.href)}">
      ${a.img ? `<img class="analysis__img" src="${esc(a.img)}" alt="" loading="lazy"${a.imgPos ? ` style="object-position:${esc(a.imgPos)}"` : ""}>` : ""}
      ${a.logo ? `<img class="analysis__logo" src="${esc(a.logo)}" alt="${esc(a.game)} logo" loading="lazy">` : ""}
      <span class="analysis__game">${esc(a.game)}</span><h4>${esc(a.title)}</h4><p>${esc(a.line)}</p><span class="go">Read the breakdown →</span></a>`));
  });

  // ---------- scroll buttons ----------
  document.querySelectorAll(".scroller-btns").forEach((g) => {
    const row = document.getElementById(g.dataset.for);
    g.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
      const card = row.firstElementChild;
      const step = card ? card.getBoundingClientRect().width / zoom() + 22 : 300;
      if (row._pauseAuto) row._pauseAuto(4000);
      row.scrollBy({ left: step * Number(b.dataset.dir), behavior: reduced ? "auto" : "smooth" });
    }));
  });

  wire();

  // ---------- land on #section links ----------
  // The shelf and extras are built by this script, so the browser's own jump to a hash
  // (e.g. from an analysis page's nav) happens before they exist. Jump again now, and once images above have loaded.
  function toHash() {
    const t = location.hash && document.getElementById(location.hash.slice(1));
    if (t) t.scrollIntoView({ behavior: "instant", block: "start" });   // "auto" would inherit the page's smooth scrolling
  }
  if (location.hash) {
    toHash();
    window.addEventListener("load", toHash, { once: true });
  }
})();
