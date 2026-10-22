"""Writes one page per featured game, site/games/<slug>.html, from the projects in js/data.js.

The pages are thin: a title and description for search and sharing, the shared nav and footer,
and js/game.js, which renders the game's block from data.js. Re-run after adding or renaming a game.
Run:  python site/tools/make_game_pages.py
"""
import html, re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
data = (SITE / 'js' / 'data.js').read_text(encoding='utf-8')
projects = data.split('window.EXTRAS')[0]
games = re.findall(r'slug: "([^"]+)",\s*title: "([^"]+)",.*?hook: "([^"]+)"', projects, re.S)

PAGE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} · catsarewhat</title>
  <meta name="description" content="{hook}">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#121010">
  <link rel="icon" href="../img/brand/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="../img/brand/apple-touch-icon.png">
  <meta property="og:title" content="{title} · catsarewhat">
  <meta property="og:description" content="{hook}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Rubik+Dirt&family=Space+Mono:wght@400;700&family=Work+Sans:wght@400;500;600&family=Rozha+One&display=swap">
  <link rel="stylesheet" href="../css/site.css">
</head>
<body id="top" data-root="../" data-game="{slug}">
  <a class="skip" href="#main">Skip to content</a>

  <header class="nav">
    <a class="nav__brand" href="../index.html" aria-label="catsarewhat home">
      <img src="../img/brand/logo-small.webp" alt="catsarewhat" width="168" height="84">
    </a>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
    <nav class="nav__links" id="nav-links" aria-label="Sections">
      <a href="../index.html#shelf">Games</a>
      <a href="../index.html#building">Now building</a>
      <a href="../index.html#extras">Side quests</a>
      <a href="../index.html#about">About</a>
    </nav>
    <a class="btn btn--stamp nav__itch" data-link="itch" href="#" target="_blank" rel="noopener">itch.io ↗</a>
  </header>

  <main id="main" class="gamepage">
    <a class="article__back" href="../index.html#shelf">← All games</a>
    <div id="game"></div>
    <nav class="gamenav" id="game-nav" aria-label="More games"></nav>
  </main>

  <footer class="foot mono">
    <img src="../img/brand/logo-small.webp" alt="catsarewhat" width="168" height="84" loading="lazy">
    <p>© Sanidhya Dev Gupta · catsarewhat · Games for gamers, made by a gamer.</p>
    <a href="#top">Back to top ↑</a>
  </footer>

  <dialog class="lightbox" id="lightbox" aria-label="Image viewer">
    <button class="iconbtn lightbox__close" data-close aria-label="Close">✕</button>
    <button class="iconbtn lightbox__nav" data-step="-1" aria-label="Previous image">←</button>
    <figure><img alt=""><figcaption class="mono"></figcaption></figure>
    <button class="iconbtn lightbox__nav" data-step="1" aria-label="Next image">→</button>
  </dialog>

  <noscript><p class="noscript">This page builds the game's details with JavaScript. Turn it on to see them.</p></noscript>

  <script src="../js/config.js"></script>
  <script src="../js/data.js"></script>
  <script src="../js/common.js"></script>
  <script src="../js/game.js"></script>
  <script src="../js/motion.js"></script>
</body>
</html>
"""

out = SITE / 'games'
out.mkdir(exist_ok=True)
for slug, title, hook in games:
    (out / f'{slug}.html').write_text(PAGE.format(slug=slug, title=html.escape(title), hook=html.escape(hook)), encoding='utf-8')
    print(f'games/{slug}.html  {title}')
