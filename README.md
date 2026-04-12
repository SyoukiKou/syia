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
2. **information.html** — News/announcements with year filter (All/2026-2021) and pagination (6 items per page)
3. **art.html** — Art index with left sidebar filter (Title list, Category in vertical list, Year in vertical list), right grid of artworks, and pagination
4. **concert.html** — Concert page with all 17 events from [syiaviolin.com/concert](https://syiaviolin.com/concert) including titles from the Wayback Machine archive (2026–2023 events, image cards with hover zoom)
5. **artist-statement.html** — Artist statement with main image, Japanese/English text sections, and description blocks
6. **biography.html** — Biography with artist photo displayed on the right side (sticky on desktop), Profile/Education/Awards/Collections sections
7. **contact.html** — Contact form with Name, Email, Subject, Message fields
8. **sitepolicy.html** — Site policy with copyright, disclaimer, and link policy sections

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
artist-statement.html   — Artist statement
biography.html          — Biography with artist photo
information.html        — News with year filter & pagination
contact.html            — Contact form
sitepolicy.html         — Site policy
css/
  └── master.css        — All styles (reset, layout, animations, responsive)
js/
  └── main.js           — All JavaScript (loading, menu, filters, particles, EEG animation)
reference/              — Reference files from original sites (not deployed)
```

## 🔗 Functional URIs

| Path | Description |
|------|-------------|
| `index.html` | Home page with loading animation |
| `information.html` | News & announcements (filterable by year) |
| `art.html` | Art index with category/year filters |
| `concert.html` | Concert listings from SYIA's official site |
| `artist-statement.html` | Artist statement |
| `biography.html` | Biography with photo |
| `contact.html` | Contact form |
| `sitepolicy.html` | Site policy |

## 🎵 Concert Data Source

Concert listings are sourced from https://syiaviolin.com/concert via the Wayback Machine (archived 2026-02-07). All 17 concerts from 2023–2026 are included with original Japanese titles. Images use Unsplash placeholders as the original CDN (cdn.myportfolio.com) requires authentication.

## 🚧 Not Yet Implemented / Recommended Next Steps

1. **Replace placeholder images** with SYIA's actual concert/performance photos
2. **Replace YouTube video ID** (`dQw4w9WgXcQ`) on the home page with SYIA's video
3. **Update social media links** (currently placeholders on most pages; concert.html has real links to @syiaviolin)
4. **Add real concert detail pages** — each concert item currently links to `#`
5. **SEO optimization** — add Open Graph tags, canonical URLs, structured data
6. **Google Analytics** integration
7. **Contact form backend** — currently client-side only (no server submission)
8. **Performance optimization** — lazy loading for concert images, preload critical assets
