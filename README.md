# Smoothie Builder

A mobile-first sensory smoothie builder built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and dnd-kit.

Users can drag ingredients manually or take/upload a photo of fruit and vegetables on the counter. The app identifies likely smoothie ingredients, asks the user to confirm the matches, then adds the confirmed items to the blender for recipe generation.

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
- `gpt-4o` recipe generation for the confirmed blender ingredients

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
