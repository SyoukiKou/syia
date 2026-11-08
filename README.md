# SYIA Official Portfolio

Artist portfolio website for **SYIA** (しあ), a Japan-based violinist. This is a static website inspired by yoichiochiai.com with custom modifications for SYIA's branding and concert information.

## ✅ Currently Completed Features

### Global Customizations
- **SYIA branding**: All occurrences of "Your Name" replaced with "SYIA" across every page
- **Loading screen** (sub pages): the home page's opening in short — on a deep navy overlay, five staff lines are drawn across the screen and come apart into five-line fragments while the page appears (about 1.5 s, `js/main.js`)
- **Cursor** (mouse/pen only, all pages): a calm glow on the pointer (like the specks of light around the violin, a little larger over links) and a shooting star trailing the pointer (bright head, long pale-blue tail, stardust), with a twinkle on click (`js/cursor.js`). Touch screens and reduced-motion settings keep the normal cursor
- **Renamed Exhibition → Concert**: `exhibition.html` renamed to `concert.html` with all navigation links updated sitewide

### Pages
1. **index.html** — Home page (served at `/`). Opening animation modelled on [Post-Classical Debussy](https://jumpeikaneko.github.io/Post-Classical-Debussy/): five staff lines are drawn across the screen, come apart into five-line fragments and settle into a 3D line drawing of a violin (front-view scroll with fluting and ears, pegbox and heart-shaped pegs, f-holes, ribs and a maple back). It sways slowly; strokes give way around the cursor, the cursor's side leans it, dragging turns it a full 360° (it drifts back to the front after a few seconds), click sends a ripple. Touching it makes sound (see below). Lines behind the head are hidden; surfaces facing away are drawn faintly. The text (SOUND × COMPUTER × BRAIN / SYIA / Violinist / Neuro Media Artist / profile line, the two latest concerts, then SNS links and copyright) rises out of a blur; the header fades in last. The two latest concerts are written by `scripts/build.mjs` from `js/concerts.js`
2. **information.html** — News other than concerts (date, Japanese/English title, optional text and link) with year filter and pagination (6 items per page), written by `scripts/build.mjs` from `js/information.js`. Shows a short note pointing to Concert while there is no news
3. **art.html** — Shows 「準備中」(Coming Soon), kept out of search results (`noindex`) until it is published. The art index built earlier (left sidebar filter, grid of artworks, pagination) is kept in the file inside a `<div hidden>` wrapper
4. **concert.html** — The concert list (cover image, event date, title, venue, newest first)
5. **concert/&lt;id&gt;.html** — One page per concert at `/concert/<id>` (e.g. `/concert/showcase202603`): its text, images, flyers, performer profiles, maps and links, plus Prev / Next. Made by `scripts/build.mjs` from `concert.html` and `js/concerts.js`; not edited by hand
6. **js/concerts.js** — All concert data in one file. Adding a new concert means adding one entry there (a template and the body format are described at the top of the file); the concert list, the concert's own page, the home page's latest concerts, the latest items in every page's menu and `sitemap.xml` all follow from it (see **Adding or changing a concert** below)
7. **lesson.html** — Lesson information migrated from [syiaviolin.com/lesson](https://syiaviolin.com/lesson), with an inquiry form
8. **artist-statement.html** — Artist statement (NEURO ROMANTIC) in Japanese and English, from the SYIA world-view document (Oct 24, 2026)
9. **biography.html** — Biography with artist photo displayed on the right side (sticky on desktop), Profile/Activities/Education sections (profile text from the old site's home page)
10. **contact.html** — Contact form with Name, Email, Subject, Message fields
11. **sitepolicy.html** — Site policy with copyright, disclaimer, and link policy sections
12. **404.html** — Shown by Vercel at any address that does not exist (「ページが見つかりませんでした」 with links to Home, Concert, Information and Contact; kept out of search results)

### Design & Interaction
- Responsive layout with mobile/desktop breakpoints (768px/769px)
- Night-sky look on every page, matching the home page: deep navy gradient with a soft blue light, quietly twinkling stars behind the content and in the menu (`js/main.js`), thin translucent white rules
- Full-screen hamburger menu in the same look: italic menu items with Japanese labels, the photo slideshow tinted into the navy, latest news and language toggle (JP/EN)
- Page title fade-in/slide-up animation on all sub-pages
- Scroll reveal animations using IntersectionObserver
- Custom scrollbar styling
- Google Fonts: Cormorant Garamond (Latin: titles, dates, navigation; page titles in italic) and Shippori Mincho (Japanese text)

## 🎻 Violin sound (home page)

Touching the violin plays it. Sounds are made in the browser (`js/violin-sound.js`); `js/hero.js` decides what was touched, where and how fast. With a mouse it sounds as the pointer moves over it and on click; on a phone, on a sideways swipe or a tap (scrolling past it stays silent).

| Where | How | Sound |
|---|---|---|
| Strings | slow, light touch | a glassy harmonic from the nearest node (octave at the middle, and so on) |
| Strings | quicker swipe | pizzicato, louder and brighter the faster; over the fingerboard the note rises towards the bridge, past it the open string rings (thinner near the bridge). The string shivers on screen from where it was stopped |
| Body | stroking | a soft rustle and the strings humming back, higher on the upper bout and to the right, panned left/right |
| f-holes | moving into one | a breath of air (the body's air resonance) |
| Body | click / tap | a knock on the wood, and the open strings ring on quietly (duller on the back when turned round) |
| Scroll, pegbox | moving / click | small bells, higher towards the top / three rising bells |
| Pegs | moving across | that string sounds and slides into tune |

Every note is in C major pentatonic, which holds all four open strings (G D A E), so anything played together agrees. Browsers only allow sound after the visitor's first click, tap or key press on the page, so the violin is silent until then. It also sounds with reduced-motion settings (without the string animation).

## 🎼 Adding or changing a concert

1. Put the images in `images/` and add or edit the concert in `js/concerts.js` (news goes in `js/information.js`)
2. Run `node scripts/build.mjs`. It writes the concert list in `concert.html`, every concert's page `concert/<id>.html`, the news list in `information.html`, the two latest concerts on the home page (`index.html`) and `sitemap.xml`, and removes the page of a concert that was taken out. Running it again changes nothing
3. Commit and push. Vercel runs the same script on every deploy (`buildCommand` in `vercel.json`), so the published site is up to date even if step 2 was forgotten

The parts the script writes sit between `<!-- build:… -->` and `<!-- /build:… -->` comments; edit `js/concerts.js`, `js/information.js` or `scripts/build.mjs` rather than those parts. Everything else in `concert.html` (header, menu, footer) is the template for the concert pages. The script needs only Node.js (no packages).

## 📁 File Structure

```
index.html              — Home page (/)
art.html                — Art index
concert.html            — Concert list (the list is written by scripts/build.mjs), and the template for the concert pages
concert/<id>.html       — One page per concert (/concert/<id>), made by scripts/build.mjs — do not edit by hand
lesson.html             — Lesson information and inquiry form
artist-statement.html   — Artist statement
biography.html          — Biography with artist photo
information.html        — News with year filter & pagination
contact.html            — Contact form
sitepolicy.html         — Site policy
404.html                — Page shown at addresses that do not exist
vercel.json             — Vercel settings: URLs without .html or a trailing slash, the build on each deploy, redirects from /home and the old Adobe Portfolio URLs
scripts/
  └── build.mjs         — Writes the concert pages, lists and sitemap from js/concerts.js and js/information.js
css/
  └── master.css        — All styles (reset, layout, animations, responsive)
js/
  ├── concerts.js       — Concert data (edit this file to add or change concerts)
  ├── information.js    — News for the Information page (anything that is not a concert)
  ├── main.js           — Shared JavaScript (loading screen, menu and its latest items, old concert#id links, filters, contact form)
  ├── hero.js           — Home page opening animation (violin line drawing generated in code) and what touching it does
  ├── violin-sound.js   — The violin's sounds, synthesised in the browser (Web Audio API, no audio files)
  └── cursor.js         — Custom cursor on every page (calm glow and a shooting-star tail)
images/                 — All images, in one flat folder (concert images re-saved as JPEG at quality 82–85 on 2026-11-08: 21.5 MB → 8.6 MB)
  ├── <id>-cover.*      — Concert list thumbnail for each event (e.g. showcase202603-cover.jpg)
  ├── <id>-01.*, -02.* … — Images in each concert's text, in order
  ├── lesson-01.jpg     — Lesson page image
  ├── home-masthead.jpg — Old site's main visual (not used)
  ├── home-background.jpg — Old site's background (not used)
  ├── syia-portrait.jpg — Artist photo used on the pages and in the menu (1600 px wide copy of syia.png, 250 KB)
  ├── ogp.jpg           — Share image for social media and search (1200×630, cropped from syia.png)
  ├── favicon.svg       — Site icon: the home page violin glowing on a night-sky tile
  └── favicon.png (32 px), apple-touch-icon.png (180 px) — PNG copies of favicon.svg for older browsers and iOS
syia.png                — Original full-resolution artist photo (2.6 MB; not used by the pages)
robots.txt              — Lets search engines crawl everything and points them to the sitemap
sitemap.xml             — The list of pages for search engines, made by scripts/build.mjs (every .html page at the root except 404.html and noindex pages, plus every concert)
reference/              — Reference files from original sites (not deployed)
```

## 🔍 SEO

- Every page has its own `<title>` and `description` in Japanese (written for searches like 「しあ ヴァイオリン」), a canonical URL (`https://syiaviolin.com/<page>`), Open Graph and X (Twitter) card tags. The share image is `images/ogp.jpg`, except Lesson, which uses `images/lesson-01.jpg`
- Page titles end with ` | SYIA（しあ）ヴァイオリニスト`. Each concert page gets `<concert title> | SYIA（しあ）ヴァイオリニスト`, a description made from its date, venue and opening lines (or the concert's own `description`), its own canonical URL, and its cover image as the share image
- Concerts, the concert list, the news list and the home page's latest concerts are plain HTML (written by `scripts/build.mjs`), so search engines and link previews read them without running JavaScript. Pictures carry their width and height, and only the first one on a page loads at once
- The home page is served at `/` (canonical `https://syiaviolin.com/`); `/home` redirects there
- The Art page has `<meta name="robots" content="noindex">` while it shows 「準備中」. Remove that line when the art index is published; the page then joins `sitemap.xml` on the next build
- The home page carries structured data (JSON-LD): `WebSite` (site name SYIA / しあ) and `Person` (SYIA, Violinist / Neuro Media Artist, with the Instagram, X and Facebook accounts), so search engines can tie the site and the accounts to one person
- `robots.txt` and `sitemap.xml` are at the site root (`sitemap.xml` is rewritten by every build). Submit `https://syiaviolin.com/sitemap.xml` in Google Search Console

## 🔗 Functional URIs

URLs have no `.html` and no trailing slash (`cleanUrls` and `trailingSlash` in `vercel.json`; `/concert.html` and `/concert/` redirect to `/concert`). `/home` redirects to `/`. Any other address shows `404.html`.

| Path | Description |
|------|-------------|
| `/` | Home page with staff-to-violin opening animation (`index.html`) |
| `/information` | News & announcements (filterable by year) |
| `/art` | Art index with category/year filters |
| `/concert` | Concert list |
| `/concert/<id>` | One concert (e.g. `/concert/fccj2025`). Old links of the form `/concert#<id>` are sent there by `js/main.js` |
| `/lesson` | Lesson information and inquiry form |
| `/artist-statement` | Artist statement |
| `/biography` | Biography with photo |
| `/contact` | Contact form |
| `/sitepolicy` | Site policy |

## 🎵 Concert Data Source

Concert, lesson, profile and contact content was migrated from the old site https://syiaviolin.com (Adobe Portfolio) on 2026-10-10. All 17 concerts from 2023–2026 are included with their original Japanese text, and the images were downloaded from the old CDN (cdn.myportfolio.com) into `images/` at web size (up to 1920px wide). Dates shown in the lists are the event dates stated on the old pages.

## 🌐 Domain and Old URLs

The site is deployed on Vercel and served at https://syiaviolin.com (the domain was registered at お名前.com and used to point to the Adobe Portfolio site). `vercel.json` sends the old Adobe Portfolio addresses to the new pages with permanent (308) redirects, so links shared on social media and search results keep working:

| Old URL | New page |
|---------|----------|
| `/concert`, `/lesson`, `/contact` | the same paths (no redirect needed) |
| `/home` | `/` |
| `/<concert id>` (e.g. `/showcase202603`, the 17 concerts on the old site) | `/concert/<concert id>` |

Every page loads Google Analytics (GA4, measurement ID `G-JX7REYZTQF`, the same property the Adobe Portfolio site used), so visits keep being counted in the existing SYIA property.

## 🚧 Not Yet Implemented / Recommended Next Steps

1. **Art page** — currently 「準備中」; remove the `<div hidden>` wrapper and the Coming Soon block in `art.html` to publish the index
2. **Contact form backend** — the Contact and Lesson forms have no server; on submit they open the visitor's mail app with a message addressed to syiaviolin@gmail.com (`js/main.js`). Replace with a form service if server-side submission is needed
3. **Event details in search results** — each concert now has its own page; adding `MusicEvent` structured data to it (date, venue name and address) would let upcoming concerts show their date and place in Google. The venue addresses are not yet in `js/concerts.js` as separate fields
4. **Performance optimization** — images could also be offered as WebP; preload critical assets
