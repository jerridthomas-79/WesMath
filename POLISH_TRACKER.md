# Boffy Math Quest — Production Polish Tracker

Status: [ ] Not started · [P] Preview ready · [A] Approved · [L] Live and verified on iPhone

## Characters & Animation
- [A] A01 — Boffy master character: premium fuzzy blue plush matching original pose sheet — approved by user Oct 13, 2026; implementation and live verification pending
- [ ] A02 — Friend masters: Rocky, Chilly, Sunny, Zippy, distinct shapes and accessories
- [ ] A03 — Boffy expressions: happy, thinking, puzzled, cheering, sleepy, encouraging
- [ ] A04 — Boffy idle: breathing, blink, head tilt, wave
- [ ] A05 — Answer reactions: correct, retry, HELP
- [ ] A06 — Friends' signature animations

## Environment & UI
- [ ] A07 — Detailed layered forest adventure scenery
- [ ] A08 — Home composition and hero artwork
- [ ] A09 — Four illustrated quest cards and progress
- [ ] A10 — Question parchment, character bubble, HELP overlay
- [ ] A11 — Correct-answer celebration and progress
- [ ] A12 — Goal meter, reward treasure chest, stats
- [ ] A13 — Original collectible reward cards and locked states
- [ ] A14 — Dad's Review rows and settings
- [ ] A15 — Navigation, iconography, buttons, typography, transitions

## iPhone & QA
- [ ] A16 — Safe-area header, bottom navigation, keyboard and scroll clearance
- [ ] A17 — Motion, performance, reduced-motion support
- [ ] A18 — iPhone Safari, iPad and desktop QA

## Approval and release rules
1. Show user a visual preview of one asset or tightly coupled set.
2. Wait for explicit approval or revisions.
3. Implement approved asset(s) in GitHub Pages.
4. Provide live link and explain how to view on iPhone.
5. User confirms visual match; mark as Live and verified.
6. Do not label previewed assets as live or approved.

## Current reference
- User's uploaded Boffy plush pose sheet (blue, long-armed, cream face).
- Approved eight-screen game mockup with detailed plush sloths, layered forest, wooden signs, parchment, and colorful quest cards.
- User's Oct 13, 2026 iPhone Safari screenshots of home, quests, friends, rewards, and Dad goal settings.
- Existing site: https://jerridthomas-79.github.io/WesMath/

## Priority
A01 master Boffy → A02 friends → A07 scenery → A08 home → A09 quests → A10/A11 questions and reactions → A12/A13 goal/rewards → A14/A15 admin/UI → A16/A17/A18 QA.

## A01 approved art direction
- Master character board approved: fuzzy royal-blue plush, cream face, expressive eyes, long arms and little claws.
- Brown adventure backpack is removable/optional.
- Use approved image-generation artwork, not the existing simplified SVG as the final asset.
- Do not mark [L] until a production image asset is deployed and user sees it on iPhone Safari.

## A01 Approval Record
- Approved by user: October 13, 2026.
- Approved artwork: Boffy production master character sheet (fuzzy royal-blue plush, cream face, long arms, expressive face, optional adventure backpack).
- Status: Visual master APPROVED. Do not mark LIVE until the actual approved image assets are integrated and user confirms Safari rendering.
- A02 remains blocked until A01 live verification.

## A01 Live Implementation — 2026-10-13
- [L pending user verification] Approved furry Boffy image embedded in `assets/boffy-a01.svg` and referenced from `game.js` for all Boffy images.
- `index.html` cache version updated to `a01-20261013`.
- Important: currently a compact web preview asset, not a full-resolution transparent production sprite; higher-resolution transparency and animation pose exports remain for a later polish pass.
- User must verify the live iPhone Safari result before A02.

## A01 — OPEN BLOCKER (confirmed 2026-10-13)
- [ ] **NOT LIVE:** The approved final furry Boffy rendering is NOT being loaded by the current game. The attempted embedded JPEG/SVG asset displayed as a broken question-mark image on Safari, and the current game has been reverted to a placeholder.
- [ ] Export the exact approved A01 Boffy master artwork to a real browser-compatible transparent PNG/WebP file (no JPEG wrapped inside SVG; no low-resolution placeholder).
- [ ] Publish the actual image binary in the GitHub Pages repository and update every Boffy image reference (Home, Friends, feedback, Goal Meter, other screens).
- [ ] Verify image loading and quality in iPhone and iPad Safari; request screenshot and user confirmation.
- [ ] Only then mark A01 Live/Verified and unblock A02. Preserve user-approved appearance; do not replace with a newly invented design.

## A01 work on 2026-10-15
- [x] Extracted the approved furry master as an actual RGBA PNG file `boffy-a01.png` (580×1040 presentation upscale from 145×260 approved crop; no new detail fabricated).
- [x] Updated `game.js` to load `assets/boffy-a01.png` on all Boffy appearances with `assets/boffy.svg` fallback to prevent broken-image blocks.
- [x] Cache-busted the script in `index.html`.
- [ ] **BLOCKED ON BINARY UPLOAD**: GitHub connector available here writes UTF-8 text only; the actual PNG binary is prepared but has not been uploaded to repository. Upload `boffy-a01.png` at exact path `assets/boffy-a01.png` in GitHub to activate it.
- [ ] User verify actual rendering in Safari; do not mark A01 complete or start A02 yet.
