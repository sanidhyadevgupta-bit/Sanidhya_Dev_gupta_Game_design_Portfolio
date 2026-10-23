"""Build the web assets for the portfolio site.

Reads originals from the portfolio folder and writes web-size copies into site/.
Originals are never modified. Re-run any time: outputs are overwritten.

    python site/tools/build_assets.py
"""
import json, shutil, sys
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]      # portfolio/
SITE = ROOT / 'site'
IMG = SITE / 'img'
KITS = ROOT / 'Games GDDs'

report = {}


def save(im, dest, max_side=None, pixel=False, quality=82):
    """Resize (never upscale) and write a webp."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    if max_side and max(im.size) > max_side:
        k = max_side / max(im.size)
        size = (max(1, round(im.width * k)), max(1, round(im.height * k)))
        im = im.resize(size, Image.NEAREST if pixel else Image.LANCZOS)
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
    im.save(dest, 'WEBP', quality=quality, method=6, lossless=pixel)
    report[str(dest.relative_to(SITE))] = [im.width, im.height, round(dest.stat().st_size / 1024)]
    return im


def pair(src, folder, name, full=1600, thumb=640, pixel=False):
    im = Image.open(src)
    save(im, IMG / folder / f'{name}.webp', full, pixel)
    save(im, IMG / folder / f'{name}-t.webp', thumb, pixel)


# ---- games: cover, banner, screenshots --------------------------------------
GAMES = {
    'terminus': (KITS / 'Terminus3D' / 'page-kit', False),
    'bombay':   (KITS / 'Bombay Calling' / 'bombay-calling-page-kit', False),
    'kancha':   (KITS / 'KanchaTodh' / 'page-kit', False),
    'beat':     (KITS / 'Beat Runner' / 'beat-runner-page-kit', False),
    'ratrace':  (KITS / 'RatRace' / 'page-kit', True),      # pixel art: nearest-neighbour only
}
shots = {}
for slug, (kit, pixel) in GAMES.items():
    save(Image.open(kit / 'cover-630x500.png'), IMG / slug / 'cover.webp', pixel=pixel)
    save(Image.open(kit / 'banner-960x300.png'), IMG / slug / 'banner.webp', pixel=pixel)
    names = []
    for i, f in enumerate(sorted((kit / 'screenshots').glob('*.png')), 1):
        save(Image.open(f), IMG / slug / f'shot-{i}.webp', 1280, pixel)
        names.append(f.stem)
    shots[slug] = names

# ---- hover previews: the shelf cards play these gameplay intros (portfolio/gifs/) ----
# The source GIFs run 11-21 s at 25 fps and weigh 18-73 MB each, far too heavy for a hover.
# Each becomes a small animated WebP: the first PREVIEW_SECONDS, every other frame (12.5 fps),
# scaled to fit the card. Skipped when the WebP is newer than its GIF, since this step is slow.
PREVIEWS = {'terminus': 'terminus.gif', 'bombay': 'bombay calling.gif', 'kancha': 'kancha todh.gif',
            'beat': 'beat runner.gif', 'ratrace': 'ratrace.gif'}
PREVIEW_SECONDS, PREVIEW_STEP, PREVIEW_BOX = 8, 2, (560, 444)   # box = the card's 630:500 shape


def gif_preview(src, dest, pixel):
    if dest.exists() and dest.stat().st_mtime > src.stat().st_mtime:
        return
    gif = Image.open(src)
    k = min(PREVIEW_BOX[0] / gif.width, PREVIEW_BOX[1] / gif.height, 1)
    size = (round(gif.width * k), round(gif.height * k))
    frames, durations, elapsed = [], [], 0
    for i in range(getattr(gif, 'n_frames', 1)):
        gif.seek(i)
        d = gif.info.get('duration', 40) or 40
        if elapsed >= PREVIEW_SECONDS * 1000:
            break
        if i % PREVIEW_STEP == 0:
            frames.append(gif.convert('RGB').resize(size, Image.NEAREST if pixel else Image.LANCZOS))
            durations.append(0)
        durations[-1] += d                 # a kept frame lasts as long as the frames it stands in for
        elapsed += d
    dest.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(dest, 'WEBP', save_all=True, append_images=frames[1:], duration=durations,
                   loop=0, quality=58, method=4)


for slug, name in PREVIEWS.items():
    src = ROOT / 'gifs' / name
    if src.exists():
        dest = IMG / slug / 'preview.webp'
        gif_preview(src, dest, GAMES[slug][1])
        report[f'{slug}/preview.webp'] = round(dest.stat().st_size / 1024)

# ---- Terminus 2D art, shown as concept art for Terminus 3D -------------------
ART = ROOT / 'Terminus' / 'art'
CONCEPT = [
    ('unit-01',    ART / 'mani char/unit-1/unit01.png'),
    ('sentinel',   ART / 'mani char/sentinel/0a4dd7cd-ea80-461f-8eb5-481012e0d040.png'),
    ('berserker',  ART / 'mani char/berserker/cdd68bd2-0fd6-4dcd-88f1-c1a425d31cc0.png'),  # the other file is a raw sheet on magenta
    ('sniper',     ART / 'mani char/sniper/ca988e2f-a95a-4af4-b816-9c78b1c29228.png'),
    ('breacher',   ART / 'mani char/breacher/df7140af-f599-4d24-8917-1adf5d17efe9.png'),
    ('operator',   ART / 'mani char/operator/9970fdc1-5213-42ee-a49b-218448ead41b.png'),
    ('apex-1',     ART / 'enemies/zone1/Apex_predator.png'),
    ('bastion-2',  ART / 'enemies/zone2/bastion-02.png'),
    ('nexus-3',    ART / 'enemies/zone3/Nexus-3_colony.png'),
    ('colossus-4', ART / 'enemies/zone4/COLOSSUS-4.png'),
    ('phantom-5',  ART / 'enemies/zone5/phantom(boss).png'),
    ('core',       ART / 'enemies/finalboss/d36cbea1-8ab7-4e8c-9201-9a1b0c69768a.png'),
    ('zone-2',     ART / 'zonees/zone2/banner.png'),
    ('zone-3',     ART / 'zonees/zone 3/banner.png'),
    ('zone-4',     ART / 'zonees/zone4/banner.png'),
    ('zone-5',     ART / 'zonees/zone5/banner.png'),
    ('zone-6',     ART / 'zonees/finalboss/banner.png'),
    ('ui-title',   ART / 'UI/titleMonitor.png'),
    ('ui-levelup', ART / 'UI/level up card.png'),
]
from PIL import ImageChops, ImageFilter


def key_magenta(im, bg=(8, 8, 8)):
    """The sheets were generated on flat magenta for cutting; swap that ground for near-black.
    A pixel counts as ground when red and blue both beat green by a wide margin and match each
    other, so purple armour (green well above zero) survives."""
    im = im.convert('RGB')
    r, g, b = im.split()
    lo = ImageChops.darker(r, b)                                  # min(r, b)
    dom = ImageChops.subtract(lo, g).point(lambda v: 255 if v > 110 else 0)
    bal = ImageChops.difference(r, b).point(lambda v: 255 if v < 70 else 0)
    mask = ImageChops.multiply(dom, bal).filter(ImageFilter.MaxFilter(3))
    if not mask.getbbox():
        return im
    out = im.copy()
    out.paste(bg, mask=mask)
    return out


for name, src in CONCEPT:
    im = key_magenta(Image.open(src))
    save(im, IMG / 'terminus/concept' / f'{name}.webp', 1600)
    save(im, IMG / 'terminus/concept' / f'{name}-t.webp', 640)

# ---- artwork (portfolio/artwork/, named by slug; order and titles live in js/data.js) ----
art = []
for f in sorted((ROOT / 'artwork').iterdir()):
    if f.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp', '.avif'):
        slug = f.stem.lower().replace(' ', '-')
        pair(f, 'art', slug, full=2000, thumb=700)
        art.append({'slug': slug, 'title': f.stem.title()})

# ---- analysis images (from analysis/<game>/, e.g. analysis/destiny 2/raid bosses.avif) ----
ANALYSIS_DIRS = {'destiny 2': 'destiny', 'poe 2': 'poe', 'archero': 'archero'}
slug = lambda s: '-'.join(s.lower().replace("'", '').split())
for name, out in ANALYSIS_DIRS.items():
    folder = ROOT / 'analysis' / name
    if not folder.exists():
        continue
    for f in sorted(folder.iterdir()):
        if f.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp', '.avif'):
            # the loot table is text-heavy, so keep it sharper and larger
            big = 2000 if 'loot' in f.stem else 1600
            save(Image.open(f), IMG / 'analyses' / out / f'{slug(f.stem)}.webp', big, quality=86 if 'loot' in f.stem else 82)

# ---- Dobara teaser -------------------------------------------------------------
poster = ROOT / 'dobara' / 'imgs' / 'dobara_poster.webp'
if poster.exists():
    pair(poster, 'dobara', 'poster', full=1536, thumb=720)

# ---- logo: knock the white page background out to transparency ---------------
logo = Image.open(ROOT / '_brand' / 'catsarewhat_logo_punk.webp').convert('RGBA')
w, h = logo.size
if logo.getpixel((2, 2))[3] == 255 and min(logo.getpixel((2, 2))[:3]) > 235:
    # flood from every edge pixel that is near-white; the cream labels are enclosed by ink so they survive
    mask = Image.new('L', logo.size, 0)
    px = logo.load()
    seen = bytearray(w * h)
    stack = [(x, y) for x in range(0, w, 4) for y in (0, h - 1)] + [(x, y) for y in range(0, h, 4) for x in (0, w - 1)]
    mpx = mask.load()
    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or seen[y * w + x]:
            continue
        seen[y * w + x] = 1
        r, g, b, a = px[x, y]
        if min(r, g, b) < 225:
            continue
        mpx[x, y] = 255
        stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    alpha = logo.getchannel('A').point(lambda v: v)
    alpha.paste(0, mask=mask)
    logo.putalpha(alpha)
save(logo, IMG / 'brand' / 'logo.webp', 1100, quality=90)
save(logo, IMG / 'brand' / 'logo-small.webp', 420, quality=90)
portrait = Image.open(ROOT / '_brand' / 'sanidhya_portrait.webp')
save(portrait, IMG / 'brand' / 'portrait.webp', 1000, quality=86)
save(portrait, IMG / 'brand' / 'portrait-t.webp', 480, quality=86)
# square favicon: the cat's head and paws, cut from the full-size logo
src_logo = Image.open(ROOT / '_brand' / 'catsarewhat_logo_punk.webp').convert('RGBA')
lw, lh = src_logo.size
side = int(lh * 0.66); cx = int(lw * 0.355); top = int(lh * 0.02)
icon = src_logo.crop((cx - side // 2, top, cx + side // 2, top + side))
(IMG / 'brand').mkdir(parents=True, exist_ok=True)
for px, name in ((32, 'favicon-32.png'), (180, 'apple-touch-icon.png')):
    out = icon.resize((px, px), Image.LANCZOS)
    if name == 'apple-touch-icon.png':          # iOS ignores transparency, so give it the site's ink
        bg = Image.new('RGBA', out.size, (18, 16, 16, 255)); bg.alpha_composite(out); out = bg
    out.save(IMG / 'brand' / name)
    report['img/brand/' + name] = [px, px, round((IMG / 'brand' / name).stat().st_size / 1024)]
# wide cat crop used as decoration on the character sheet (upper-centre of the logo)
head = logo.crop((int(w * 0.18), 0, int(w * 0.62), int(h * 0.55)))
save(head, IMG / 'brand' / 'cat.webp', 512, quality=90)

# ---- copies: GDDs and the Archero prototypes ----------------------------------
# Each copy gets a fixed back button, since these pages have no way back to the portfolio of their own.
BACK = ('<a id="caw-back" href="{href}" style="position:fixed;right:16px;bottom:16px;z-index:2147483647;'
        'display:inline-flex;align-items:center;gap:8px;padding:12px 16px;background:#e2402a;color:#121010;'
        'font:700 13px/1 \'Space Mono\',ui-monospace,Consolas,monospace;text-transform:uppercase;letter-spacing:.06em;'
        'text-decoration:none;border:2px solid #121010;box-shadow:4px 4px 0 #f2e6d3">{label}</a>')


def copy_with_back(src, dest, href, label):
    html = src.read_text(encoding='utf-8')
    button = BACK.format(href=href, label=label)
    i = html.lower().rfind('</body>')
    html = html[:i] + button + '\n' + html[i:] if i >= 0 else html + button
    dest.write_text(html, encoding='utf-8')


GDDS = {
    'terminus-3d.html':    (KITS / 'Terminus3D' / 'terminus-3d-gdd.html', 'terminus'),
    'bombay-calling.html': (KITS / 'Bombay Calling' / 'bombay-calling-gdd.html', 'bombay'),
    'kancha-todh.html':    (KITS / 'KanchaTodh' / 'kancha-todh-gdd.html', 'kancha'),
    'beat-runner.html':    (KITS / 'Beat Runner' / 'beat-runner-gdd.html', 'beat'),
    'rat-race.html':       (KITS / 'RatRace' / 'rat-race-gdd.html', 'ratrace'),
}
(SITE / 'gdd').mkdir(parents=True, exist_ok=True)
for name, (src, slug) in GDDS.items():
    copy_with_back(src, SITE / 'gdd' / name, f'../games/{slug}.html', '&larr; Back to the game')
    report['gdd/' + name] = round(src.stat().st_size / 1024)

# Dobara isn't on the shelf yet, so its GDD goes back to the "Now building" card.
# The GDD is built separately by dobara/GDD/_build/build_gdd.py; run that first after changing it.
dob_gdd = ROOT / 'dobara' / 'GDD' / 'dobara-gdd.html'
if dob_gdd.exists():
    copy_with_back(dob_gdd, SITE / 'gdd' / 'dobara.html', '../index.html#building', '&larr; Back to portfolio')
    report['gdd/dobara.html'] = round(dob_gdd.stat().st_size / 1024)

DM2 = ROOT / 'NID sem 3' / 'design management 2'
(SITE / 'analyses' / 'archero').mkdir(parents=True, exist_ok=True)
for name, src in {'carnival-prototype.html': DM2 / 'Archero_Carnival_Prototype.html',
                  'reliquary-prototype.html': DM2 / 'Archero_Reliquary_Prototype.html'}.items():
    copy_with_back(src, SITE / 'analyses' / 'archero' / name, '../archero.html', '&larr; Back to the analysis')

(SITE / 'tools' / 'asset_report.json').write_text(json.dumps({'shots': shots, 'art': art, 'files': report}, indent=1))
total = sum((p.stat().st_size for p in SITE.rglob('*') if p.is_file() and '.git' not in p.parts), 0)   # .git is the repo's history, not the site
print(f'{len(report)} outputs, site folder now {total / 1024 / 1024:.1f} MB')
