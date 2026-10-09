# SYIA Official Portfolio

Artist portfolio website for **SYIA** (しあ), a Japan-based violinist. This is a static website inspired by yoichiochiai.com with custom modifications for SYIA's branding and concert information.

## ✅ Currently Completed Features

### Global Customizations
- **SYIA branding**: All occurrences of "Your Name" replaced with "SYIA" across every page
- **Loading screen**: Full-screen black overlay with EEG-style brainwave canvas animation and centered "SYIA" mask text reveal animation (letters slide up one by one)
- **Eighth-note navigation**: Left-top desktop navigation trigger changed from a dot to a ♪ (eighth note) musical icon
- **Renamed Exhibition → Concert**: `exhibition.html` renamed to `concert.html` with all navigation links updated sitewide

### Pages
1. **index.html** — Home page with loading animation, YouTube background video, particle effects, autograph canvas, explore button, and top-footer
2. **information.html** — The 17 announcements from the old site (event date, Japanese/English title, link to the detail page) with year filter (All/2026-2023) and pagination (6 items per page)
3. **art.html** — Shows 「準備中」(Coming Soon). The art index built earlier (left sidebar filter, grid of artworks, pagination) is kept in the file inside a `<div hidden>` wrapper
4. **concert.html** — Concert page with all 17 events from [syiaviolin.com/concert](https://syiaviolin.com/concert) (2026–2023; cover image, event date, title and venue), each linking to its detail page
5. **Concert detail pages** — One page per event, named after the old site's URL slug (e.g. `showcase202603.html`, `msp2025winter.html`, `lfj2023.html`): text, images, flyers, performer profiles, maps and links migrated from the old site
6. **lesson.html** — Lesson information migrated from [syiaviolin.com/lesson](https://syiaviolin.com/lesson), with an inquiry form
7. **artist-statement.html** — Artist statement with main image, Japanese/English text sections, and description blocks
8. **biography.html** — Biography with artist photo displayed on the right side (sticky on desktop), Profile/Activities/Education sections (profile text from the old site's home page)
9. **contact.html** — Contact form with Name, Email, Subject, Message fields
10. **sitepolicy.html** — Site policy with copyright, disclaimer, and link policy sections

### Design & Interaction
- Responsive layout with mobile/desktop breakpoints (768px/769px)
- Full-screen hamburger menu with background slideshow and language toggle (JP/EN)
- Page title fade-in/slide-up animation on all sub-pages
- Scroll reveal animations using IntersectionObserver
- Custom scrollbar styling
- Google Fonts: Noto Serif JP, Prompt

## 📁 File Structure

```
index.html              — Home page
art.html                — Art index
concert.html            — Concert listing (from syiaviolin.com)
<slug>.html             — Concert detail pages, one per event (17 files, e.g. showcase202603.html)
lesson.html             — Lesson information and inquiry form
artist-statement.html   — Artist statement
biography.html          — Biography with artist photo
information.html        — News with year filter & pagination
contact.html            — Contact form
sitepolicy.html         — Site policy
css/
  └── master.css        — All styles (reset, layout, animations, responsive)
js/
  └── main.js           — All JavaScript (loading, menu, filters, particles, EEG animation, contact form)
images/                 — All images from the old site, in one flat folder
  ├── <slug>-cover.*    — Concert list thumbnail for each event (e.g. showcase202603-cover.jpg)
  ├── <slug>-01.*, -02.* … — Images on each concert detail page, in page order
  ├── lesson-01.jpg     — Lesson page image
  ├── home-masthead.jpg — Old site's main visual (used as the home video fallback)
  ├── home-background.jpg — Old site's background (not used)
  └── favicon.png, apple-touch-icon.png
reference/              — Reference files from original sites (not deployed)
```

## 🔗 Functional URIs

| Path | Description |
|------|-------------|
| `index.html` | Home page with loading animation |
| `information.html` | News & announcements (filterable by year) |
| `art.html` | Art index with category/year filters |
| `concert.html` | Concert listings from SYIA's official site |
| `<slug>.html` | Concert detail page for each event (same slugs as the old site, e.g. `fccj2025.html`) |
| `lesson.html` | Lesson information and inquiry form |
| `artist-statement.html` | Artist statement |
| `biography.html` | Biography with photo |
| `contact.html` | Contact form |
| `sitepolicy.html` | Site policy |

## 🎵 Concert Data Source

Concert, lesson, profile and contact content was migrated from the old site https://syiaviolin.com (Adobe Portfolio) on 2026-10-10. All 17 concerts from 2023–2026 are included with their original Japanese text, and the images were downloaded from the old CDN (cdn.myportfolio.com) into `images/` at web size (up to 1920px wide). Dates shown in the lists are the event dates stated on the old pages.

## 🚧 Not Yet Implemented / Recommended Next Steps

1. **Artist Statement** — `artist-statement.html` still contains the template text; the old site had no equivalent content
2. **Art page** — currently 「準備中」; remove the `<div hidden>` wrapper and the Coming Soon block in `art.html` to publish the index
3. **Contact form backend** — the Contact and Lesson forms have no server; on submit they open the visitor's mail app with a message addressed to syiaviolin@gmail.com (`js/main.js`). Replace with a form service if server-side submission is needed
4. **SEO optimization** — Open Graph tags are in place (`og:image` assumes the site is served at https://syiaviolin.com); canonical URLs and structured data are not
5. **Google Analytics** integration (the old site used a GA4 property)
6. **Performance optimization** — `syia.png` is a 2.6 MB full-resolution photo; preload critical assets
