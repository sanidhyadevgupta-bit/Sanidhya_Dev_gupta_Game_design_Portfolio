// Renders one game's page (games/<slug>.html) from js/data.js: banner, stats, screenshots,
// concept art, the five GDD cards and the full-GDD link, then links to the previous and next game.
(function () {
  "use strict";
  const { P, esc, el, img, skinVars, num, page, gdd, playBtn, galleries, wire } = window.CAW;
  const slug = document.body.dataset.game;
  const i = P.findIndex((p) => p.slug === slug);
  const p = P[i];
  const host = document.getElementById("game");
  if (!p || !host) { wire(); return; }

  // ---------- GDD cards (the same five for every project) ----------
  const c = p.cards;
  const cards = `
    <article class="gcard"><div class="gcard__n"><b>01</b><span>Vision</span></div>
      <h4>the pitch</h4><p>${esc(c.vision.text)}</p>
      <ul class="pillars" aria-label="Design pillars">${c.vision.pillars.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></article>
    <article class="gcard"><div class="gcard__n"><b>02</b><span>Core loop</span></div>
      <h4>the loop</h4><ol class="loop">${c.loop.steps.map((x) => `<li>${esc(x)}</li>`).join("")}</ol><p>${esc(c.loop.text)}</p></article>
    <article class="gcard"><div class="gcard__n"><b>03</b><span>Controls and feel</span></div>
      <h4>in your hands</h4><ul class="keys">${c.controls.keys.map(([k, v]) => `<li><kbd>${esc(k)}</kbd>${esc(v)}</li>`).join("")}</ul><p>${esc(c.controls.text)}</p></article>
    <article class="gcard"><div class="gcard__n"><b>04</b><span>Art direction</span></div>
      <h4>the look</h4><div class="swatches" role="img" aria-label="Palette: ${c.art.palette.join(", ")}">${c.art.palette.map((h) => `<i style="background:${h}" title="${h}"></i>`).join("")}</div>
      <img class="gcard__shot ${p.pixel ? "pixel" : ""}" src="${img(p.slug, c.art.shot)}" alt="" loading="lazy" width="1280" height="720"><p>${esc(c.art.text)}</p></article>
    <article class="gcard"><div class="gcard__n"><b>05</b><span>Process and next</span></div>
      <h4>how it got here</h4><div class="bigstat"><b>${esc(c.process.stat[0])}</b><span>${esc(c.process.stat[1])}</span></div><p>${esc(c.process.text)}</p></article>
    <a class="gcard gcard--link" href="${esc(gdd(p))}">
      <div class="gcard__n"><b>↗</b><span>The whole document</span></div>
      <span class="rn"><span>read</span> <span class="hot">the</span> <span>full</span> <span class="hot">gdd</span></span>
      <span class="arrow" aria-hidden="true">→</span></a>`;

  // ---------- screenshots and concept art ----------
  galleries[p.slug] = p.shots.map(([n, cap]) => ({ src: img(p.slug, n), cap: `${p.title} · ${cap}`, pixel: p.pixel }));
  const shots = p.shots.map(([n, cap], j) => `<button class="shot ${p.pixel ? "pixel" : ""}" data-gallery="${p.slug}" data-index="${j}">
    <img src="${img(p.slug, n)}" alt="${esc(cap)}" loading="lazy" width="1280" height="720"><span>${esc(cap)}</span></button>`).join("");
  let concept = "";
  if (p.concept) {
    const key = p.slug + "-concept";
    galleries[key] = p.concept.items.map(([n, cap]) => ({ src: img(p.slug, "concept/" + n), cap: `${cap} · concept art from TERMINUS 2D` }));
    concept = `<div class="block-label">Concept art: the 2D original <span class="count">${p.concept.items.length}</span></div>
      <p class="credit">${esc(p.concept.note)} ${esc(p.concept.credit)}</p>
      <div class="row concept">${p.concept.items.map(([n, cap], j) => `<button class="shot" data-gallery="${key}" data-index="${j}">
        <img src="${img(p.slug, "concept/" + n + "-t")}" alt="${esc(cap)}" loading="lazy"><span>${esc(cap)}</span></button>`).join("")}</div>`;
  }

  host.appendChild(el(`<article class="project" style="${skinVars(p.skin)}" aria-labelledby="game-title">
    <div class="project__banner ${p.pixel ? "pixel" : ""}"><img src="${img(p.slug, "banner")}" alt="" width="960" height="300">
      <span class="project__num">${num(i)} / ${num(P.length - 1)} · ${esc(p.kicker)}</span></div>
    <div class="project__inner">
      <div class="project__head">
        <div>
          <h1 class="project__title" id="game-title">${esc(p.title)}</h1>
          ${p.native ? `<p class="project__native" lang="hi">${esc(p.native)}</p>` : ""}
          <p class="project__hook">${esc(p.hook)}</p>
        </div>
        <div class="project__actions">${playBtn(p.slug)}<a class="btn btn--paper" href="${esc(gdd(p))}">Full GDD →</a></div>
      </div>
      <dl class="stats">${p.stats.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      ${p.credit ? `<p class="credit">${esc(p.credit)}</p>` : ""}
      <div class="block-label">Screenshots <span class="count">${p.shots.length}</span></div>
      <div class="row shots">${shots}</div>
      ${concept}
      <div class="block-label">From the GDD <span class="count">5 + 1</span></div>
      <div class="row gdd" tabindex="0" aria-label="${esc(p.title)} design document highlights">${cards}</div>
    </div>
  </article>`));

  // ---------- previous / next game ----------
  const prev = P[(i - 1 + P.length) % P.length];
  const next = P[(i + 1) % P.length];
  const link = (q, dir, label) => `<a class="gamenav__link gamenav__link--${dir}" href="${esc(page(q))}" style="${skinVars(q.skin)}">
    <img src="${img(q.slug, "cover")}" alt="" loading="lazy" width="630" height="500" ${q.pixel ? 'class="pixel"' : ""}>
    <span><span class="mono small">${label}</span><b>${esc(q.title)}</b></span></a>`;
  const nav = document.getElementById("game-nav");
  if (nav) nav.innerHTML = link(prev, "prev", "← Previous game") + link(next, "next", "Next game →");

  wire();
})();
