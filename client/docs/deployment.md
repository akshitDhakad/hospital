# Deployment Checklist (Static Hosting)

## Build/Packaging

1. Optimize images to `.webp` or `.avif`.
2. Minify CSS and JS.
3. Enable long-term caching headers for `/assets/*`.
4. Ensure `index.html` has short cache TTL.

## Hosting Requirements

- HTTPS only
- Automatic HTTP to HTTPS redirect
- Gzip/Brotli compression
- Support for `404.html` fallback

## SEO and Crawl

- Replace all `example-hospital.com` placeholders.
- Keep `robots.txt` and `sitemap.xml` in sync with live pages.
- Add organization schema and local business metadata.

## Runtime Validation

- Lighthouse performance/accessibility audit
- Mobile viewport checks
- Form submission and CTA validation
- Monitoring for uptime and JavaScript errors
