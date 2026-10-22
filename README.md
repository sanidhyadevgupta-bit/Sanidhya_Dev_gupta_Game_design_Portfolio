# catsarewhat portfolio site

A static site. There's no build step: open `index.html`, or upload this whole folder to any static host (GitHub Pages, Netlify, Cloudflare Pages, or itch.io as an HTML project).

## Links
Every link lives in `js/config.js`: itch.io pages, email, LinkedIn, and the YouTube video for the 3D renders. An empty value shows as "Soon" or "coming soon". (There's no CV button on the site; `cv` in the config is unused.)

## Change content
- **Projects:** all five games (stats, screenshots, the five GDD cards, colours) are in `js/data.js`. Edit the text there; the pages render from it. The home page shows them as a grid (`js/site.js`); each card opens the game's own page, `games/<slug>.html`, rendered by `js/game.js`. Code both pages share is in `js/common.js`.
- **Game pages:** after adding or renaming a game in `js/data.js`, regenerate the page files:

  ```
  python site/tools/make_game_pages.py
  ```
- **Artwork:** the originals are in `portfolio\artwork\`. The order and titles are the `art` and `artTitles` lists in `js/data.js`.
- **Analyses:** the pages are `analyses/*.html`. Their images come from `portfolio\analysis\<game>\`.
- **Images:** they're web-size copies made by `tools/build_assets.py` from the originals in the portfolio folder:
  - the page kits in `Games GDDs`
  - `Terminus\art`
  - `artwork`
  - `analysis`
  - `dobara\imgs`
  - `_brand`

  After changing an original, rebuild with:
  ```
  python site/tools/build_assets.py
  ```
  The script also copies the five GDDs into `gdd/`, plus the Archero prototypes, and adds a fixed back button to each copy (a GDD goes back to its game's page).
  It also copies the Dobara GDD (`portfolio\dobara\GDD\dobara-gdd.html`) to `gdd/dobara.html`, which goes back to the "Now building" card. Rebuild that GDD first with `python dobara/GDD/_build/build_gdd.py`, then bump the `?v=` on the card's "Read the GDD" link in `index.html`.
  After rebuilding, bump `GDD_VERSION` in `js/common.js` so browsers fetch the new copies instead of cached ones.

## Before publishing
- Set `og:image` in `index.html` to a full URL (`https://your-domain/img/brand/logo.webp`) so link previews show the logo.
- Fix the YouTube video's title ("mders") in YouTube Studio.

## Size
About 33 MB, mostly the five GDD files (Bombay Calling 7 MB, TERMINUS 3D 6 MB). Every file is under 10 MB, so GitHub Pages and the other free hosts accept it.

## Local preview
```
python -m http.server 8790 --directory site
```
Then open http://localhost:8790.
