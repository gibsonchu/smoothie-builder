# Design QA

## Evidence

- Source visual truth: `/var/folders/rf/kb7vbr1n0dvdj882p6twxsrw0000gn/T/TemporaryItems/NSIRD_screencaptureui_uyIIDO/Screenshot 2026-08-19 at 3.41.20 PM.png`
- Primary implementation: `design-mobile-landing.png`
- Combined comparison: `design-qa-comparison.png`
- Supporting states: `design-mobile-photo-entry.png`, `design-mobile-select.png`, `design-mobile-photo-review.png`, `design-mobile-recipe.png`, `design-desktop-landing.png`
- Source dimensions: 500 x 352 px
- Mobile implementation: 375 x 812 CSS px, 375 x 812 px capture, device scale factor 1
- Desktop implementation: 1440 x 900 CSS px, 1440 x 900 px capture, device scale factor 1
- State: simplified production landing page, manual ingredient flow, photo review, and completed recipe

## Full-View Comparison

The combined comparison shows the supplied cropped artwork beside the mobile implementation. The complete 500 x 352 composition is scaled down inside the ivory paper field without re-cropping, preserving its produce cluster, red fruit anchor, glass, and archival markings. The only landing copy is the requested title and two compact actions.

## Focused Evidence

- `design-mobile-photo-review.png` verifies the uploaded image, retake action, search field, editable ingredient ledger, clear state, and confirm action in a 375 px layout.
- `design-mobile-select.png` verifies that all 20 ingredients and the complete action row fit within a 375 x 812 viewport without document scrolling.
- `design-mobile-photo-entry.png` verifies that the first Photo screen contains only the centered “Take a Photo” and “Upload a Photo” actions.
- `design-mobile-recipe.png` verifies large calorie and macro values, precise ingredient quantities, direct numbered steps, progressive typewriter content, and readable narrow-screen wrapping.
- `design-desktop-landing.png` verifies that the sparse attention geometry remains intact at 1440 px without horizontal overflow.

## Required Fidelity Surfaces

- Fonts and typography: Cormorant Garamond supplies the editorial serif display voice; Special Elite and IBM Plex Mono reproduce the reference's typewriter and archival-label contrast. Mobile titles wrap cleanly and compact labels remain legible.
- Spacing and layout rhythm: the primary cluster stays centered with broad paper margins. Mobile controls remain within 335 px, while desktop content holds a restrained 520-620 px working width.
- Colors and tokens: warm ivory paper, charcoal ink, faded gray metadata, and one tomato-red action/selection color match the reference's restrained palette logic.
- Image quality and asset fidelity: the user-supplied produce crop is used directly as a raster asset with its halftone wear, aged paper, glass, and red fruit anchor intact. It is scaled responsively without further cropping.
- Copy and content: the landing page contains only “Got juice?”, “Photo”, and “Select”. The first Photo screen contains only “Take a Photo” and “Upload a Photo”. Selector metadata is removed, and recipe language is concise and practical without affectionate asides.

## Comparison History

- P2: ingredient rows initially exposed a list-item role instead of their interactive button semantics. Removed the conflicting role, rebuilt, redeployed, and verified search, selection, and confirmation through role-based browser interaction.
- P2: the first mobile capture occurred before the 4.5 MB visual anchor finished decoding. Re-captured after load and confirmed the final implementation screenshot includes the produce study with stable reserved dimensions.
- P2: the first landing direction contained substantially more editorial copy and treated the produce study as an inset figure. Replaced it with the artwork as a full-viewport background and reduced the visible interface to one title and two actions. Mobile and desktop captures confirm the cluster remains visible without overflow.
- P2: the full-background crop made the fruit cluster too visually dominant. Reduced the artwork to 64% of the viewport height and verified the smaller composition at 375 x 812 and 1440 x 900 without overflow.
- P2: the artwork canvas initially formed a faint lighter rectangle against the page. Sampled its edge color, matched the landing background to `#e7d9bd`, and softly masked the raster perimeter so the paper field now renders as one continuous surface.
- P2: the landing still used the original tall poster asset after the desired composition had been cropped externally. Replaced it with the supplied 500 x 352 crop, matched the page to its `#ebdfc2` paper edge, and changed responsive sizing from height-based to width-based so the full crop remains visible.
- P2: the title and actions were pinned near opposite viewport edges, making the landing feel vertically dispersed. Moved the artwork into the document flow and centered the title, artwork, and actions as one responsive group; its measured center is exactly 406 px at 375 x 812 and 450 px at 1440 x 900.
- P2: the manual selector and photo-review ledger required vertical scrolling and repeated selection metadata. Removed the header labels and eyebrow, changed the 20-item ledger to a compact two-column viewport grid, shortened the photo preview, and verified both states at a document height of exactly 812 px in a 375 x 812 viewport.
- P2: the recipe mixed small macro text with decorative metadata, affectionate copy, and a separate note section. Removed those elements, rewrote fallback and generated recipes in direct language, and split nutrition into five labeled values rendered at 37.5 px on the verified mobile viewport.

## Findings

No actionable P0, P1, or P2 visual differences remain.

## Follow-up Polish

- P3: photo detection requires `VITE_OPENAI_API_KEY` in Vercel; the current missing-key state correctly falls back to an editable manual review.

final result: passed
