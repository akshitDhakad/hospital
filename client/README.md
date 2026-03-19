# Hospital Static Website (`client`)

Production-ready static site structure for the hospital web presence.

## Directory Structure

- `index.html` - main entry page
- `404.html` - not found fallback page
- `assets/`
  - `css/` - global and page styles
  - `js/` - progressive enhancement scripts
  - `images/` - optimized images (`.webp`/`.avif` preferred)
  - `icons/` - favicon and app icons
  - `fonts/` - self-hosted web fonts
- `pages/` - additional static pages (`about.html`, `services.html`, etc.)
- `components/` - reusable HTML partials/snippets
- `data/` - static JSON data files
- `config/` - environment-agnostic site configuration
- `docs/` - deployment and operational docs
- `robots.txt` - crawler instructions
- `sitemap.xml` - URL index for SEO

## Production Guidelines

- Keep HTML semantic and accessible (`aria-*`, landmarks, heading order).
- Minify CSS/JS and compress assets before deployment.
- Use responsive images (`srcset`, `sizes`) and modern formats.
- Serve with gzip/brotli, long-cache static assets, and TLS.
- Add monitoring for uptime, web vitals, and form/error events.

## Suggested Next Steps

1. Move current hospital homepage markup into `index.html`.
2. Split inline CSS and JS into `assets/css/` and `assets/js/`.
3. Add all real public pages under `pages/`.
4. Configure final domain in `robots.txt` and `sitemap.xml`.
