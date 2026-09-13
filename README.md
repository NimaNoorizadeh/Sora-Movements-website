# Sora Movement

A responsive fictional boutique movement studio website built with React, TypeScript, Vite, and custom CSS. Photography is supplied by the project owner; fonts are served locally.

## Run locally

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

## Structure

- `src/App.tsx`: homepage sections and fictional studio content.
- `src/components/Navigation.tsx`: accessible navigation and footer.
- `src/sections/Schedule.tsx`: class filter, session dialog, calendar reminder export.
- `src/styles/global.css`: design tokens, layout, responsive styles, focus and motion rules.
- `src/assets/sora/`: supplied photographs, including unused reference assets.
- `DESIGN.md`: visual direction and critique.
- `scripts/verify.mjs`: browser checks at 1440, 768, 390 and 320 pixels. Requires Google Chrome on Windows and the local development server on port 5173.
- `review/results.json`: browser verification results.

## Before use by a real studio

Replace fictional instructor names, biographies, testimonial, opening hours, schedule and class pack terms. Add real pricing, studio contact details and the correct social profile. The current email uses the reserved `.example` domain and no real address is displayed.

Connect an actual booking provider for reservations, availability and payment. The session dialog explicitly states that the studio is fictional and only creates a personal calendar reminder; it does not reserve a place. Reminder times use the visitor's local timezone and the next occurrence of the chosen weekday. Confirm rights to the supplied photography before public commercial use.
