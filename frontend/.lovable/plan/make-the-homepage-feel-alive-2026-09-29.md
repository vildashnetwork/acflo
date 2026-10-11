# Make the homepage feel alive

## What will change
- Replace the single homepage photo with a four-image slider using the existing ACFLO photography.
- Rotate slides automatically with a slow cinematic zoom and soft crossfade.
- Add previous/next controls, slide indicators, pause-on-hover, and keyboard navigation.
- Keep the headline and calls to action readable and stable while imagery changes behind them.
- Add restrained entrance and hover motion to homepage photos, story tiles, partner logos, and key content blocks.
- Respect reduced-motion settings so visitors who disable animation get a calm, accessible experience.

## Technical details
- Build the slider as a focused reusable React component, with timed progression and cleanup.
- Use CSS transitions and keyframes rather than adding a new animation dependency.
- Keep all imagery and captions sourced from the existing centralized ACFLO content data.
- Verify slider controls, automatic rotation, desktop layout, and mobile layout in the running preview.
