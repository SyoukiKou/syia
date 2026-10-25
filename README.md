# SYIA Official Portfolio

Artist portfolio website for **SYIA** (しあ), a Japan-based violinist. This is a static website inspired by yoichiochiai.com with custom modifications for SYIA's branding and concert information.

## ✅ Currently Completed Features

### Global Customizations
- **SYIA branding**: All occurrences of "Your Name" replaced with "SYIA" across every page
- **Loading screen** (sub pages): the home page's opening in short — on a deep navy overlay, five staff lines are drawn across the screen and come apart into five-line fragments while the page appears (about 1.5 s, `js/main.js`)
- **Cursor** (mouse/pen only, all pages): a calm glow on the pointer (like the specks of light around the violin, a little larger over links) and a shooting star trailing the pointer (bright head, long pale-blue tail, stardust), with a twinkle on click (`js/cursor.js`). Touch screens and reduced-motion settings keep the normal cursor
- **Renamed Exhibition → Concert**: `exhibition.html` renamed to `concert.html` with all navigation links updated sitewide

### Pages
1. **index.html** — Home page. Opening animation modelled on [Post-Classical Debussy](https://jumpeikaneko.github.io/Post-Classical-Debussy/): five staff lines are drawn across the screen, come apart into five-line fragments and settle into a 3D line drawing of a violin (front-view scroll with fluting and ears, pegbox and heart-shaped pegs, f-holes, ribs and a maple back). It sways slowly; strokes give way around the cursor, the cursor's side leans it, dragging turns it a full 360° (it drifts back to the front after a few seconds), click sends a ripple. Lines behind the head are hidden; surfaces facing away are drawn faintly. The text (SOUND × COMPUTER × BRAIN / SYIA / Violinist / Neuro Media Artist / profile line, then SNS links and copyright) rises out of a blur; the header fades in last
2. **information.html** — News other than concerts (date, Japanese/English title, optional text and link) with year filter and pagination (6 items per page), built from `js/information.js`. Shows a short note pointing to Concert while there is no news
3. **art.html** — Shows 「準備中」(Coming Soon). The art index built earlier (left sidebar filter, grid of artworks, pagination) is kept in the file inside a `<div hidden>` wrapper
4. **concert.html** — One page for all concerts, built from `js/concerts.js`: the list (cover image, event date, title, venue, newest first) and, at `concert.html#<id>` (e.g. `concert.html#showcase202603`), one concert with its text, images, flyers, performer profiles, maps and links, plus Prev / Next
5. **js/concerts.js** — All concert data in one file. Adding a new concert means adding one entry there (a template and the body format are described at the top of the file); the Concert page and the latest items in every page's menu update from it
6. **lesson.html** — Lesson information migrated from [syiaviolin.com/lesson](https://syiaviolin.com/lesson), with an inquiry form
7. **artist-statement.html** — Artist statement (NEURO ROMANTIC) in Japanese and English, from the SYIA world-view document (Oct 24, 2026)
8. **biography.html** — Biography with artist photo displayed on the right side (sticky on desktop), Profile/Activities/Education sections (profile text from the old site's home page)
9. **contact.html** — Contact form with Name, Email, Subject, Message fields
10. **sitepolicy.html** — Site policy with copyright, disclaimer, and link policy sections

### Design & Interaction
- Responsive layout with mobile/desktop breakpoints (768px/769px)
- Night-sky look on every page, matching the home page: deep navy gradient with a soft blue light, quietly twinkling stars behind the content and in the menu (`js/main.js`), thin translucent white rules
- Full-screen hamburger menu in the same look: italic menu items with Japanese labels, the photo slideshow tinted into the navy, latest news and language toggle (JP/EN)
- Page title fade-in/slide-up animation on all sub-pages
- Scroll reveal animations using IntersectionObserver
- Custom scrollbar styling
- Google Fonts: Cormorant Garamond (Latin: titles, dates, navigation; page titles in italic) and Shippori Mincho (Japanese text)

## 📁 File Structure

```
index.html              — Home page
art.html                — Art index
concert.html            — Concert list and each concert (concert.html#<id>), from js/concerts.js
lesson.html             — Lesson information and inquiry form
artist-statement.html   — Artist statement
biography.html          — Biography with artist photo
information.html        — News with year filter & pagination
contact.html            — Contact form
sitepolicy.html         — Site policy
vercel.json             — Vercel settings: redirects from the old Adobe Portfolio URLs
css/
  └── master.css        — All styles (reset, layout, animations, responsive)
js/
  ├── concerts.js       — Concert data (edit this file to add or change concerts)
  ├── information.js    — News for the Information page (anything that is not a concert)
  ├── main.js           — Shared JavaScript (loading screen, menu, concert pages from the data, filters, contact form)
  ├── hero.js           — Home page opening animation (violin line drawing generated in code)
  └── cursor.js         — Custom cursor on every page (calm glow and a shooting-star tail)
images/                 — All images from the old site, in one flat folder
  ├── <id>-cover.*      — Concert list thumbnail for each event (e.g. showcase202603-cover.jpg)
  ├── <id>-01.*, -02.* … — Images in each concert's text, in order
  ├── lesson-01.jpg     — Lesson page image
  ├── home-masthead.jpg — Old site's main visual (used as the home video fallback)
  ├── home-background.jpg — Old site's background (not used)
  ├── favicon.svg       — Site icon: the home page violin glowing on a night-sky tile
  └── favicon.png (32 px), apple-touch-icon.png (180 px) — PNG copies of favicon.svg for older browsers and iOS
reference/              — Reference files from original sites (not deployed)
```

## 🔗 Functional URIs

| Path | Description |
|------|-------------|
| `index.html` | Home page with staff-to-violin opening animation |
| `information.html` | News & announcements (filterable by year) |
| `art.html` | Art index with category/year filters |
| `concert.html` | Concert list |
| `concert.html#<id>` | One concert (e.g. `concert.html#fccj2025`) |
| `lesson.html` | Lesson information and inquiry form |
| `artist-statement.html` | Artist statement |
| `biography.html` | Biography with photo |
| `contact.html` | Contact form |
| `sitepolicy.html` | Site policy |

## 🎵 Concert Data Source

Concert, lesson, profile and contact content was migrated from the old site https://syiaviolin.com (Adobe Portfolio) on 2026-10-10. All 17 concerts from 2023–2026 are included with their original Japanese text, and the images were downloaded from the old CDN (cdn.myportfolio.com) into `images/` at web size (up to 1920px wide). Dates shown in the lists are the event dates stated on the old pages.

## 🌐 Domain and Old URLs

The site is deployed on Vercel and served at https://syiaviolin.com (the domain was registered at お名前.com and used to point to the Adobe Portfolio site). `vercel.json` sends the old Adobe Portfolio addresses to the new pages with permanent (308) redirects, so links shared on social media and search results keep working:

| Old URL | New page |
|---------|----------|
| `/home` | `/` |
| `/concert`, `/lesson`, `/contact` | `concert.html`, `lesson.html`, `contact.html` |
| `/<concert id>` (e.g. `/showcase202603`, the 17 concerts on the old site) | `concert.html#<concert id>` |

## 🚧 Not Yet Implemented / Recommended Next Steps

1. **Art page** — currently 「準備中」; remove the `<div hidden>` wrapper and the Coming Soon block in `art.html` to publish the index
2. **Contact form backend** — the Contact and Lesson forms have no server; on submit they open the visitor's mail app with a message addressed to syiaviolin@gmail.com (`js/main.js`). Replace with a form service if server-side submission is needed
3. **SEO optimization** — Open Graph tags are in place (`og:image` assumes the site is served at https://syiaviolin.com); canonical URLs and structured data are not
4. **Google Analytics** integration (the old site used a GA4 property)
5. **Performance optimization** — `syia.png` is a 2.6 MB full-resolution photo; preload critical assets
