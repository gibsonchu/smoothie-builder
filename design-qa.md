# Design QA

## Evidence

- Source visual truth: `/var/folders/rf/kb7vbr1n0dvdj882p6twxsrw0000gn/T/codex-clipboard-0f1d4b3f-80aa-4123-a3c5-47ce35d7af6a.png`
- Primary implementation: `design-mobile-landing.png`
- Combined comparison: `design-qa-comparison.png`
- Supporting states: `design-mobile-photo-review.png`, `design-mobile-recipe.png`, `design-desktop-landing.png`
- Source dimensions: 972 x 1619 px
- Mobile implementation: 375 x 812 CSS px, 375 x 812 px capture, device scale factor 1
- Desktop implementation: 1440 x 900 CSS px, 1440 x 900 px capture, device scale factor 1
- State: production landing page, manual ingredient flow, photo review, and completed recipe

## Full-View Comparison

The combined comparison shows the reference and mobile implementation at the same 812 px height. Both use an ivory scanned-paper field, a small central visual cluster, restrained typewriter microcopy, a single saturated ink accent, and large areas of quiet negative space. The product necessarily introduces two primary actions, but their compact rectangular treatment stays inside the reference's print grammar rather than becoming conventional rounded app cards.

## Focused Evidence

- `design-mobile-photo-review.png` verifies the uploaded image, retake action, search field, editable ingredient ledger, clear state, and confirm action in a 375 px layout.
- `design-mobile-recipe.png` verifies calorie and macro estimates, ingredient quantities, numbered steps, Grandma's Note, progressive typewriter content, and readable narrow-screen wrapping.
- `design-desktop-landing.png` verifies that the sparse attention geometry remains intact at 1440 px without horizontal overflow.

## Required Fidelity Surfaces

- Fonts and typography: Cormorant Garamond supplies the editorial serif display voice; Special Elite and IBM Plex Mono reproduce the reference's typewriter and archival-label contrast. Mobile titles wrap cleanly and compact labels remain legible.
- Spacing and layout rhythm: the primary cluster stays centered with broad paper margins. Mobile controls remain within 335 px, while desktop content holds a restrained 520-620 px working width.
- Colors and tokens: warm ivory paper, charcoal ink, faded gray metadata, and one tomato-red action/selection color match the reference's restrained palette logic.
- Image quality and asset fidelity: the generated produce study is a real raster asset with halftone, xerox wear, aged paper, and a visible red fruit anchor. It is correctly cropped at mobile and desktop sizes.
- Copy and content: product language is brief, concrete, and embedded in the composition. No instructional marketing block or obsolete kitchen/glass copy remains.

## Comparison History

- P2: ingredient rows initially exposed a list-item role instead of their interactive button semantics. Removed the conflicting role, rebuilt, redeployed, and verified search, selection, and confirmation through role-based browser interaction.
- P2: the first mobile capture occurred before the 4.5 MB visual anchor finished decoding. Re-captured after load and confirmed the final implementation screenshot includes the produce study with stable reserved dimensions.

## Findings

No actionable P0, P1, or P2 visual differences remain.

## Follow-up Polish

- P3: photo detection requires `VITE_OPENAI_API_KEY` in Vercel; the current missing-key state correctly falls back to an editable manual review.

final result: passed
