# steamie.net

Website for the **STEAM-IE AI & Robotics Centre, Bengaluru**, built from the
*Why AI, Why Now* parent seminar deck (2026–27).

It is a single static page: plain HTML, CSS and a small script, with no build step.

## Structure

```
index.html              All page content, one section per part of the deck
assets/css/styles.css   Layout and theme (the deck's palette and type)
assets/css/fonts.css    Self-hosted Barlow Condensed + Nunito (SIL OFL)
assets/js/main.js       Mobile nav, curriculum tabs, project filter,
                        scroll reveal, demo-booking form
assets/img/             Photos cropped from the deck, plus favicon
assets/fonts/           WOFF2 font files
```

## Preview locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Any static host works: GitHub Pages (serve from the repository root),
Netlify, Cloudflare Pages or S3. Nothing needs to be compiled.

## Before going live

- **Next cohort date**: the deck had `[date]`. The site says "Ask us when
  the next cohort starts" until a date is set (demo section, step 03).
- **Booking form**: the form opens the visitor's email app with a pre-filled
  message to `info@steam-ie.com`. To collect requests without email, point
  the form at a form service (Formspree, Google Forms, a CRM webhook) and
  update the submit handler in `assets/js/main.js`.
