# Jade Gouvernel Static Portfolio

Static artist portfolio and Shopify gateway for JADE GOUVERNEL. Built with only HTML, CSS, and vanilla JavaScript.

## Current Structure

- `index.html` - refined landing page with an artwork-led hero, About section, infinite collections carousel, Shopify CTA, and newsletter.
- `work.html` - portfolio page using content and imagery from the Google Sites export.
- `assets/css/styles.css` - responsive layout, dropdown navigation, carousel, portfolio grids, lightbox, and visual styling.
- `assets/js/main.js` - mobile menu, clickable dropdowns, smooth scroll, lightbox, newsletter placeholder message, and scroll reveal.
- `assets/images/` - first-round Squarespace artwork assets.
- `assets/images/google/` - selected images copied from the Google Sites archive.

## Open Locally

Open `index.html` directly in a browser. No build tools, npm packages, server, backend, or database are required.

## Google Sites Content Used

The second iteration uses the Google Sites export as the main content source for:

- About copy
- Blue Series
- Dream Series
- Collage Series
- Sun Series
- Portrait Series
- Nude Series
- Private Commission
- Ceramics
- Film
- Poetry
- Singing
- Cover Art
- Body Art
- Vimeo embeds for film/video work
- Portfolio images copied into `assets/images/google/`

## Update Shopify URL

Search all HTML files for:

```html
https://your-shopify-store-url.com
```

Replace every instance with the final Shopify store URL.

## Update Contact Email

The current email from the Google Sites export is:

```html
gouverneljade@gmail.com
```

Search `index.html` and `work.html` to update it if the final contact email changes.

## Update Hero Artwork

The homepage hero currently uses:

```html
assets/images/hero-jade-work.png
```

Replace that image or update its path and alt text in `index.html` if Jade wants a different landing artwork.

Google Sites Vimeo references used in the Film portfolio include:

- `https://player.vimeo.com/video/632515373`
- `https://player.vimeo.com/video/625831028`

## Update Portfolio Images

Images from the Google Sites export are in:

```html
assets/images/google/
```

To replace an image, add the new file to that folder and update the relevant `<img src="">` in `index.html` or `work.html`.

## Update Artist Bio

In `index.html`, search for:

```html
<section class="about section" id="about"
```

Update the About copy there. The longer portfolio content lives in `work.html`.

## Update Collections Carousel

In `index.html`, search for:

```html
<div class="carousel-track">
```

The carousel is duplicated for the infinite effect. If you add, remove, or reorder cards, update both halves of the carousel.

## Update Portfolio Sections

In `work.html`, each collection is a section with an ID, for example:

```html
<section class="work-section section" id="blue-series">
```

Update section titles, body copy, images, lightbox captions, and navigation anchors together.

## Navigation Dropdowns

Navigation dropdowns are controlled by:

- HTML: `data-dropdown-toggle` and `data-dropdown`
- CSS: `.dropdown-panel`
- JS: dropdown logic in `assets/js/main.js`

Keep each dropdown button's `data-dropdown-toggle` value matched to the corresponding dropdown panel ID.

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
