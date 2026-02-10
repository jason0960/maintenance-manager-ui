# S & E Realty — Company Website

Marketing website for **S & E Realty**, a Dallas, TX–based contractor specializing in apartment remodeling, cleaning, make-ready, painting, and general maintenance for property managers and apartment complexes across the DFW metroplex.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Bundler | Vite 5 |
| Styling | Tailwind CSS 3.4 (custom brand palette) |
| Routing | React Router v6 |
| i18n | react-i18next + browser language detection |
| Forms | React Hook Form + Yup validation |
| Font | Inter (Google Fonts) |

## Features

- **Bilingual (EN / ES)** — Auto-detects browser language, with manual toggle. Choice persists in localStorage.
- **6 pages** — Home, About, Services, Gallery, Contact, Get a Quote
- **Lead capture** — Contact form and detailed quote request form with client-side validation
- **Responsive** — Mobile-first design with hamburger nav, tested across breakpoints
- **Scroll-to-top** on route changes
- **404 page** with bilingual messaging
- **SVG icon system** — Custom icon components (no emoji, no icon library dependency)
- **Fade-in animations** via Intersection Observer
- **Per-page SEO titles** via `usePageTitle` hook

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero with stats, services preview grid, values section, CTA banner |
| `/about` | Company story, core values, stats bar |
| `/services` | Alternating layout for 5 service categories with gradient cards |
| `/gallery` | Project showcase grid (placeholder — ready for real photos) |
| `/contact` | Contact form + sidebar with phone, email, address, hours |
| `/quote` | Detailed quote request form with property info and service selection |
| `*` | 404 Not Found |

## Project Structure

```
src/
├── App.tsx                  # Router + ScrollToTop + routes
├── main.tsx                 # React entry point
├── index.css                # Tailwind directives + custom classes
├── components/
│   ├── Header.tsx           # Sticky nav, mobile menu, language toggle
│   ├── Footer.tsx           # 4-column footer with links + contact info
│   ├── Layout.tsx           # Header + Outlet + Footer wrapper
│   ├── CTABanner.tsx        # Reusable call-to-action section
│   ├── ScrollToTop.tsx      # Scrolls to top on route change
│   └── Icons.tsx            # 12+ SVG icon components
├── hooks/
│   ├── useFadeIn.ts         # IntersectionObserver fade-in animation
│   └── usePageTitle.ts      # Sets document.title per page
├── i18n/
│   ├── i18n.ts              # i18next config with language detection
│   └── locales/
│       ├── en.json          # English translations (~150 keys)
│       └── es.json          # Spanish translations (~150 keys)
└── pages/
    ├── Home.tsx
    ├── About.tsx
    ├── Services.tsx
    ├── Gallery.tsx
    ├── Contact.tsx
    ├── Quote.tsx
    └── NotFound.tsx
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (localhost:5173)
npm run dev

# Type-check and build for production
npm run build

# Preview production build
npm run preview
```

**Requirements:** Node.js 18+ and npm 9+

## Configuration

- **Brand colors** are defined in `tailwind.config.js` under `theme.extend.colors` (`brand` = blue, `accent` = gold)
- **Translations** live in `src/i18n/locales/`. Add keys to both `en.json` and `es.json`.
- **Contact info** (phone, email, address) is in the translation files under the `contact.*` keys and in `Header.tsx` / `Footer.tsx`

## Roadmap

- [ ] Replace placeholder gallery with real before/after project photos
- [ ] Add client testimonials section
- [ ] Add "Our Process" step-by-step visual to Home page
- [ ] Connect forms to email service (Formspree / EmailJS / Resend)
- [ ] Add trust badges to footer (licensed, insured, BBB)
- [ ] Google Analytics / Meta Pixel integration
- [ ] Sitemap + robots.txt for SEO

## License

Private — All rights reserved.
