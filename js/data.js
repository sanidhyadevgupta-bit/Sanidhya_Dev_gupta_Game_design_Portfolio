// Every project block on the page is rendered from this file.
// Facts and numbers come from each game's GDD in Games GDDs\ (October 2026).
// Each project has the same five GDD cards: vision, loop, controls, art, process.

window.PROJECTS = [
  {
    slug: "terminus",
    title: "TERMINUS 3D",
    native: null,
    kicker: "Voxel edition",
    hook: "Survive the subroutine. A survivor game where the only input is movement.",
    skin: { bg: "#0f0f0f", panel: "#1c1c1c", accent: "#c0392b", ink: "#f0d080", soft: "#e05a1a", label: "#ff6b5a" },   // label: brighter red so small text passes contrast
    stats: [
      ["Genre", "Survivor / roguelite"],
      ["Engine", "three.js + Vite"],
      ["Platform", "Browser, keyboard"],
      ["Made in", "4 weeks (2D) + 2 days (3D)"],
      ["Role", "Solo: design, code, direction"],
      ["Status", "Prototype, build 0.5"],
    ],
    gdd: "gdd/terminus-3d.html",
    shots: [
      ["shot-1", "The title console"],
      ["shot-3", "Unit select: six ways to stand"],
      ["shot-4", "Kill streak and crit feedback"],
      ["shot-5", "PHANTOM-5, the zone 5 boss"],
      ["shot-6", "Ring of Fire set piece"],
    ],
    concept: {
      note: "The 2D TERMINUS sheets were the reference the voxel models were built from.",
      credit: "Concept art generated from my briefs and art-directed for TERMINUS.",
      items: [
        ["unit-01", "UNIT-01"], ["sentinel", "Sentinel"], ["berserker", "Berserker"], ["sniper", "Sniper"],
        ["breacher", "Breacher"], ["operator", "Operator"], ["apex-1", "APEX-1"], ["bastion-2", "BASTION-2"],
        ["nexus-3", "NEXUS-3"], ["colossus-4", "COLOSSUS-4"], ["phantom-5", "PHANTOM-5"], ["core", "CORE"],
        ["zone-2", "Zone 2: The Barricade"], ["zone-3", "Zone 3: The Hive"], ["zone-4", "Zone 4: The Foundry"],
        ["zone-5", "Zone 5: Signal Tower"], ["zone-6", "Zone 6: Central Node"],
        ["ui-title", "Console UI: title monitor"], ["ui-levelup", "Console UI: level-up card"],
      ],
    },
    cards: {
      vision: {
        text: "You are the last Unit, fighting through six zones of a machine that decided people were the problem. There's no attack button, no aim and no dash: weapons pick their own targets, so the whole skill is where you stand and what you build.",
        pillars: ["Position, not input", "Warmth inside the cold", "Readable chaos", "Every run pays", "Data over code"],
      },
      loop: {
        steps: ["Move", "Weapons auto-fire", "Collect XP and scrap", "Pick 1 of 3 modules", "Boss at 15:00", "Spend scrap"],
        text: "Every run pays: a win keeps 100% of the scrap, a death 75%, quitting 35%. A bad run still moves the permanent shop.",
      },
      controls: {
        keys: [["WASD", "move"], ["Enter", "pick a card"], ["R", "reroll"], ["Tab", "loadout"], ["Esc", "pause"]],
        text: "A level-up melts into 0.9 s of slow motion so you see the build come together. Hit-stop is capped at 0.14 s, so a crowd of 100 enemies stays readable.",
      },
      art: {
        palette: ["#0f0f0f", "#1c1c1c", "#c0392b", "#e05a1a", "#d9a21b", "#f0d080"],
        shot: "shot-5",
        text: "A maintenance terminal: riveted steel, CRT monitors, amber phosphor and one machine red. The 3D build changes the medium, not the identity.",
      },
      process: {
        stat: ["71%", "of deaths came in the first four minutes"],
        text: "Telemetry in every playtest build turned that finding into eased zone openings. I built the 2D Unity original in four weeks, then rebuilt it in voxels in two days. Next: playtest zones 2–6, then a balance pass.",
      },
    },
  },

  {
    slug: "bombay",
    title: "BOMBAY CALLING",
    native: "बॉम्बे कॉलिंग",
    kicker: "Bombay, 1994",
    hook: "Pick up the phone. Put on the mask. Nobody leaves.",
    skin: { bg: "#0c0103", panel: "#1d0610", accent: "#ff2e88", ink: "#eee5d6", soft: "#2ee6d6" },
    stats: [
      ["Genre", "Top-down action, one-hit kills"],
      ["Engine", "three.js"],
      ["Platform", "Browser, gamepad, touch"],
      ["Length", "11 missions, about 1 hour"],
      ["Role", "Solo: design and direction"],
      ["Status", "Released"],
    ],
    gdd: "gdd/bombay-calling.html",
    shots: [
      ["shot-1", "The PCO booth, night and rain"],
      ["shot-2", "Mission select"],
      ["shot-3", "Chawls in Girgaon"],
      ["shot-5", "Mazagaon docks in the monsoon"],
      ["shot-6", "The Tardeo dance bar"],
    ],
    credit: "Painted 2D art made from prompts in my art bible; voxel models are generated in code.",
    cards: {
      vision: {
        text: "Hotline Miami's shape (a phone call, a ride, a mask, a door, a room of men who die in one hit) moved to Bombay in 1994. The mills had gone silent after a strike that never ended, and the land under them had become the most valuable in the country.",
        pillars: ["One hit, both ways", "The ritual", "A city with two names", "Text is the interface", "Built to ship solo"],
      },
      loop: {
        steps: ["The phone rings", "Ride the local", "Stand at the door", "Choose a mask", "Clear the floor", "Grade"],
        text: "The quiet commute is the point. It stretches Hotline Miami's calm-before-violence contrast, so the first kill feels like a decision rather than a menu option.",
      },
      controls: {
        keys: [["WASD", "move"], ["Mouse", "aim"], ["Click", "attack"], ["E", "pick up / throw"], ["R", "restart"]],
        text: "Every kill freezes for 55 ms (300 ms on a boss). A click up to 150 ms early still swings, so fast players are never ignored. Gamepad and touch use the same verbs.",
      },
      art: {
        palette: ["#0c0103", "#ff2e88", "#ff2ee0", "#2ee6d6", "#ffae2b", "#eee5d6"],
        shot: "shot-3",
        text: "Three layers on one palette: voxels for anything that moves, pixel textures for floors and walls, and painted 2D where the eye rests. Voxels because one person can't draw eight facings of every outfit.",
      },
      process: {
        stat: ["11", "missions, 3 bosses, 10 masks, 2 endings"],
        text: "The brief was “Hotline Miami, but in India”. A reskin would have made a costume, not a game, so I looked for a real Indian story with the same shape: the mill strike. Next: make the voxel masks match the painted ones.",
      },
    },
  },

  {
    slug: "kancha",
    title: "KANCHA TODH",
    native: "कंचा तोड़",
    kicker: "Flick. Bounce. Shatter.",
    hook: "Flick one marble, shatter the rest. The street game of kancha as a one-thumb arcade game.",
    skin: { bg: "#241544", panel: "#120A26", accent: "#FFB000", ink: "#FFF3D6", soft: "#E6007E" },
    stats: [
      ["Genre", "Hyper-casual physics arcade"],
      ["Engine", "Unity 6, URP 2D"],
      ["Platform", "Browser, touch or mouse"],
      ["Made in", "NID Design Project 01, v1.0 Oct 2026"],
      ["Role", "Solo: research, design, code"],
      ["Status", "Version 1.0"],
    ],
    gdd: "gdd/kancha-todh.html",
    shots: [
      ["shot-1", "Main menu"],
      ["shot-2", "Aim and flick"],
      ["shot-3", "A boss stage"],
      ["shot-4", "Pick a boon"],
      ["shot-5", "The in-game guide"],
    ],
    cards: {
      vision: {
        text: "Every Indian childhood has a chalk circle in the dust and a pocket full of kanche. Ten interviews across four cities said casual play lives in 1–3 minute bursts, frustration ends a session at once, and people pick what they recognise. Kancha is all three.",
        pillars: ["Readable, honest flicks", "One new thing at a time", "Loud art, quiet rules", "Short runs, long tail"],
      },
      loop: {
        steps: ["Press to aim", "Hold to charge", "Release", "Bounce and break", "Clear the stage", "Boon or upgrade"],
        text: "A failed run still keeps 30% of its shards. Short sessions only work if no session feels wasted. Every tenth stage is a boss.",
      },
      controls: {
        keys: [["Press", "aim"], ["Hold", "charge"], ["Lift", "flick"], ["Slide back", "cancel"]],
        text: "Power sweeps from empty to full in 0.9 s. The aim preview shows exactly two bounces, with a ghost ring at each impact. It's the one piece of UI you read on every move, so it got the most design time.",
      },
      art: {
        palette: ["#241544", "#FFF3D6", "#FFB000", "#E6007E", "#00897B", "#E8401C"],
        shot: "shot-2",
        text: "80s and 90s India: truck art, cinema hoardings, marigolds, rangoli. Marbles roll through a shader that scrolls the texture under them, because a rotating sprite reads as spinning, not rolling.",
      },
      process: {
        stat: ["10", "player interviews before a line of code"],
        text: "Research, then three concepts (Jhalar City, Maachiss, Kancha Todh), then six playable prototypes, playtests and the 1.0 clarity pass. Still open: Hindi. The research said regional language matters, and I shipped English.",
      },
    },
  },

  {
    slug: "beat",
    title: "BEAT RUNNER",
    native: null,
    kicker: "Turn the tunnel. Hit the beat.",
    hook: "A rhythm runner where you rotate the whole world to music the game writes live.",
    skin: { bg: "#0a0716", panel: "#151033", accent: "#38d4ff", ink: "#f4f1ff", soft: "#ff4fa3" },
    stats: [
      ["Genre", "Rhythm runner"],
      ["Engine", "three.js + Web Audio"],
      ["Platform", "Browser, gamepad, touch"],
      ["Made in", "One week, Oct 2026"],
      ["Role", "Solo design and direction; code with Claude"],
      ["Status", "Prototype"],
    ],
    gdd: "gdd/beat-runner.html",
    shots: [
      ["shot-2", "Pick your sound: 14 genres"],
      ["shot-3", "EDM: a hold wall"],
      ["shot-4", "Fever mode"],
      ["shot-5", "Metal: the fake side"],
      ["shot-6", "Results and the share card"],
    ],
    cards: {
      vision: {
        text: "You don't steer the runner. You rotate a four-sided tunnel so the one glowing side lands under you on the beat. Fourteen genres of music are written live in the browser, so the song is the level.",
        pillars: ["One input, on the beat", "The music is the level", "Readable at a glance", "Fail fast, retry faster", "Your music stays yours"],
      },
      loop: {
        steps: ["A wall rushes in", "Read the glowing side", "Turn on the beat", "Chain perfects", "Fever and boss loops", "Three misses ends it"],
        text: "After a miss the tunnel snaps to the side you should have reached, so one mistake never costs you twice.",
      },
      controls: {
        keys: [["A / ←", "turn left"], ["D / →", "turn right"], ["W / Space", "flip"], ["Swipe", "on phones"]],
        text: "Perfect is ±60 ms. Input off the beat does nothing at all, so mashing never works. Walls blend from red to green in the 80 ms before the Perfect window.",
      },
      art: {
        palette: ["#0a0716", "#38d4ff", "#ff4fa3", "#ffc93a", "#8a7bff", "#2fdc74"],
        shot: "shot-4",
        text: "A neon tunnel at night, with each plane in its own colour so you always know where you are. No textures, sprites or images ship: every visual is built in code.",
      },
      process: {
        stat: ["14", "genres of music generated live"],
        text: "The pitch was a runner synced to your Spotify playlist. Spotify closed its audio-analysis API and YouTube forbids extracting audio, so the game composes its own music and beat-tracks your local files instead. Next: an outside playtest.",
      },
    },
  },

  {
    slug: "ratrace",
    title: "RAT-RACE",
    native: null,
    kicker: "A game poem",
    hook: "150 seconds. A whole life. The belt never stops.",
    skin: { bg: "#15131e", panel: "#2a2936", accent: "#62e0a2", ink: "#ebe8df", soft: "#e3bb3c" },
    pixel: true,
    stats: [
      ["Genre", "Interactive poem, endurance"],
      ["Engine", "Unity 6, URP 2D"],
      ["Platform", "Browser, keyboard and touch"],
      ["Made in", "NID Game Design 02, rebuilt Oct 2026"],
      ["Role", "Solo: design, code, sprite pipeline, sound"],
      ["Status", "Released"],
    ],
    gdd: "gdd/rat-race.html",
    shots: [
      ["shot-2", "Infancy"],
      ["shot-3", "Teenage"],
      ["shot-4", "Early adulthood"],
      ["shot-5", "Middle age"],
      ["shot-6", "The belt stops"],
    ],
    cards: {
      vision: {
        text: "A faceless everyperson walks an industrial treadmill through six ages, from crawling infant to stooped elder, while the belt gets faster and the sky gets older. There's no score and no game over.",
        pillars: ["Movement without escape", "A life in 150 seconds", "Feel over score", "Show, don't explain", "Small and honest"],
      },
      loop: {
        steps: ["Begin", "Walk against the belt", "Lean and jump", "Age through six stages", "The belt stops"],
        text: "There's no fail state. A way to lose would quietly imply a way to win, and nobody wins this one.",
      },
      controls: {
        keys: [["A / D", "walk"], ["Shift", "lean"], ["Space", "jump"], ["M", "mute"]],
        text: "The stance foot moves at exactly the belt's speed, so nobody skates. Jumps get 0.14 s of grace after leaving the ground, and they get harder as you age.",
      },
      art: {
        palette: ["#15131e", "#2a2936", "#ebe8df", "#62e0a2", "#e3bb3c", "#f2992e"],
        shot: "shot-4",
        text: "320 × 180 pixels and 32 locked colours. Every one of the 331 sprites is generated by my own Python figure rig, and dither is the only transition.",
      },
      process: {
        stat: ["6 May", "first shown at NID Jury 02"],
        text: "The jury version was a casual endurance game about a system pushing back. In October I rebuilt it as pixel art and turned the challenge into an experience: a slower belt, and crates that nudge instead of hurt.",
      },
    },
  },
];

window.EXTRAS = {
  // Files live in portfolio\artwork\ (slug = file name). Order here is the order on the page.
  art: [
    "bandit-mahadev", "rakshas", "koh-the-soul-eater", "barbarian-and-t-rex", "absolute-batman",
    "daft-punk", "the-end-of-evangelion", "miles-morales", "avicii", "skulls", "venom",
    "optimus-prime", "untitled-portrait",
  ],
  artTitles: {
    "bandit-mahadev": "Bandit Mahadev", "rakshas": "Rakshas", "koh-the-soul-eater": "Koh, the Soul Eater",
    "barbarian-and-t-rex": "Barbarian and T-Rex", "absolute-batman": "Absolute Batman", "daft-punk": "Daft Punk",
    "the-end-of-evangelion": "The End of Evangelion", "miles-morales": "Miles Morales", "avicii": "Avicii",
    "skulls": "Skulls", "venom": "Venom", "optimus-prime": "Optimus Prime", "untitled-portrait": "Untitled",
  },
  renders: [
    { key: "reel", title: "Unreal Engine 5 renders", note: "My UE5 render work, compiled into one video." },
  ],
  analyses: [
    { href: "analyses/destiny-raids.html", game: "Destiny", title: "Vault of Glass, deconstructed",
      line: "Every encounter mapped and flowed, both bosses broken down, damage strategy, loot and the exotic. From 9,000+ hours in Destiny 2.",
      img: "img/analyses/destiny/vault-of-glass.webp", logo: "img/analyses/destiny/destiny-2-logo.webp" },
    { href: "analyses/path-of-exile.html", game: "Path of Exile 2", title: "One class, any build",
      line: "How the Gemling Legionnaire plays a Huntress's Twister and a Sorceress's Spark from the same Mercenary start. From 900+ hours in PoE 2.",
      img: "img/analyses/poe/logo.webp" },
    { href: "analyses/archero.html", game: "Archero", title: "Carnival of Arrows",
      line: "A live-ops event designed to win back one-time payers, with a playable prototype.",
      img: "img/analyses/archero/carnival-prototype.webp", imgPos: "center 42%" },
  ],
};
