# Make Something Good

A mobile-first smoothie recipe maker with a quiet, print-inspired zine interface, built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

Users start in one of two ways: take or upload a photo of the ingredients on the counter, or choose ingredients from a searchable index. Photo matches are editable before confirmation. The final recipe fades in and types itself onto the page with steps, ingredient amounts, estimated calories, macros, and a warm note.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gibsonchu/smoothie-builder)

## Local Setup

```bash
npm install
npm run dev
```

## Environment

Create a local `.env` file if you want AI-generated recipe cards and photo-based ingredient detection:

```bash
VITE_OPENAI_API_KEY=sk-...
```

This app intentionally calls OpenAI directly from the browser because it is a personal/portfolio project with no backend. Any variable prefixed with `VITE_` is exposed client-side, so do not use this pattern for production secrets.

The same key powers:

- `gpt-4o` image analysis for ingredient detection from a user photo
- `gpt-4o` recipe generation for confirmed ingredients, including estimated nutrition

In Vercel, add `VITE_OPENAI_API_KEY` in Project Settings -> Environment Variables.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Deploy

The project includes `vercel.json` for single-page app routing:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Connect the `smoothie-builder` GitHub repository to Vercel, set `VITE_OPENAI_API_KEY`, and deploy from the main branch.
