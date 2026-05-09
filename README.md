# Jade Gouvernel Static Portfolio

Static one-page artist portfolio and Shopify gateway for JADE GOUVERNEL. Built with only HTML, CSS, and vanilla JavaScript.

## File Structure

- `index.html` - all page sections, placeholder copy, links, and image references.
- `assets/css/styles.css` - responsive layout, typography, colors, spacing, and interaction styles.
- `assets/js/main.js` - mobile menu, smooth scroll, gallery filters, lightbox, contact/newsletter placeholder messages, and scroll reveal.
- `assets/images/` - copied artwork assets from the provided Squarespace export.
- `_source/` - extracted reference copy of the old Squarespace site, kept only as source material.

## Open Locally

Open `index.html` directly in a browser. No build tools, npm packages, server, backend, or database are required.

## Update Shopify URL

Search `index.html` for:

```html
https://your-shopify-store-url.com
```

Replace every instance with the final Shopify store URL. Each shop-related CTA currently points to that same placeholder URL.

## Update Social Links

Search `index.html` for:

```html
https://instagram.com/your-instagram
https://tiktok.com/@your-tiktok
```

Replace them with Jade's final Instagram and TikTok URLs.

## Update Contact Email

Search `index.html` and `assets/js/main.js` for:

```html
jade@example.com
```

Replace with the final contact email. Update both the visible mail link and the no-backend form message.

## Replace Images

Images live in `assets/images/`. The main homepage hero is:

```html
assets/images/hero-jade-work.png
```

To replace it, add the new image to `assets/images/`, then update the hero `<img>` in `index.html`.

## Edit Artist Bio

In `index.html`, search for:

```html
<!-- TODO: Replace artist bio with final approved copy. -->
```

Update the About section text and CV highlights.

## Edit Gallery Items

In `index.html`, search for:

```html
<div class="gallery-grid" data-gallery>
```

Each `<figure class="gallery-item">` controls one artwork. Update:

- `data-category`
- image `src`
- image `alt`
- `data-title`
- `data-caption`
- visible caption text

Supported filter categories are `painting`, `drawing`, `sculpture`, `installation`, and `archive`.

## Edit Portfolio Categories

In `index.html`, search for:

```html
<div class="portfolio-grid">
```

Update the five category cards: ARTWORK, BOOKS, ACTING, VIDEOGRAPHY, and MUSIC.

## Update Newsletter Text

In `index.html`, search for:

```html
10% OFF YOUR FIRST PRINT ORDER
```

Replace with the final discount or mailing list offer.

## Update Navigation Labels

In `index.html`, search for:

```html
<!-- TODO: Update navigation labels here if final page sections change. -->
```

If labels change, keep the `href="#section-id"` values aligned with the section IDs.

## Connect Contact Form Later

The contact form currently prevents default submission and shows a placeholder message. To connect it later, use one of:

- Formspree
- Netlify Forms
- EmailJS
- another email service

Update the `<form>` attributes in `index.html` and remove or adjust the contact submit handler in `assets/js/main.js`.

## Connect Newsletter Later

The newsletter form currently shows a placeholder success message. To connect it later, use one of:

- Shopify newsletter/customer capture
- Mailchimp
- Klaviyo

Update the newsletter `<form>` in `index.html` and remove or adjust the newsletter submit handler in `assets/js/main.js`.

## Deployment Suggestions

- Netlify static deployment
- Vercel static deployment
- GitHub Pages

No build command is needed. Deploy the folder as a static site.
