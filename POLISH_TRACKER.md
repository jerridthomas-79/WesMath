# Boffy Math Quest — Production Polish Tracker

Status: [ ] Not started · [P] Preview ready · [A] Approved · [L] Live and verified on iPhone

## Characters & Animation
- [L] A01 — Boffy master character: premium fuzzy blue plush matching original pose sheet — approved by user Oct 13, 2026; implementation and live verification pending
- [L] A02 — Friend masters: Rocky, Chilly, Sunny, Zippy, distinct shapes and accessories
- [ ] A03 — Boffy expressions: happy, thinking, puzzled, cheering, sleepy, encouraging
- [P] A04 — Boffy idle: breathing and subtle lighting live for approval; blink and articulated wave require additional animation frames
- [P] A05 — Answer reactions: correct, retry, HELP (published, awaiting iPhone signoff)
- [P] A06 — Friends' signature animations (published, pending iPhone signoff)

## Environment & UI
- [P] A07 — Detailed layered forest adventure scenery
- [L] A08 — Home mobile artwork sizing approved by user; illustrated assets visible and responsive
- [L] A09 — final quest-card math-motif artwork explicitly approved by user
- [L] A10 — compact iPhone question screen explicitly approved by user
- [L] A11 — celebration and progress screens explicitly approved by user
- [L] A12 — Goal Meter layout explicitly approved by user; final illustrated treasure chest artwork remains pending
- [L] A13 — Rewards layout explicitly approved by user; custom illustrated card assets still pending
- [L] A14 — Dad Review and Goal Settings layout explicitly approved by user
- [L] A15 — navigation and menu vector icon overhaul explicitly approved by user; hand-illustrated raster assets remain optional outstanding work

## iPhone & QA
- [L] A16 — compact header and fixed slim bottom navigation explicitly approved by user; title overlap preview deployed
- [L] A17 — motion, performance and reduced-motion polish explicitly approved by user
- [L] A18 — responsive pass approved by user on iPhone; iPad/desktop physical-device verification remains outstanding

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

## A01 replacement artwork approval — 2026-10-15
- [x] User approved the NEW complete cartoon-plush Boffy adventurer artwork (blue fuzzy sloth, cream face, brown eye patches, brown backpack, raised waving paw, complete feet). Reference: latest generated image in conversation, not the previously defective cropped PNG.
- [ ] Export and visually inspect actual transparent PNG, especially complete face, fingers, feet and background transparency.
- [ ] Deploy this exact approved image to all live Boffy placements; do not use the older damaged crop.
- [ ] Verify on iPhone Safari and obtain user confirmation before marking A01 live or proceeding to A02.

## A01 verified export — 2026-10-15
- [x] Corrected user-approved 1024×1536 cartoon-plush Boffy to true RGBA transparent PNG with intact cream face, raised hand, both feet, and backpack.
- [x] Inspected composite on navy game-like background; complete silhouette, no face cutout or checkerboard baked into image.
- [x] Final local file `boffy-a01-approved-transparent.png` ready for one-time upload to GitHub at `assets/boffy-a01.png`.
- [ ] Actual binary PNG upload still required; repository game.js already targets `assets/boffy-a01.png`.
- [ ] Verify Safari live image and request final signoff.

## A01 FINAL EXPORT — 2026-10-15
- [x] Confirmed original newly generated Boffy master is already RGBA with transparency; no background-removal needed.
- [x] Preserved original full-resolution 1024x1536 artwork and exported exact filename `boffy-a01.png`.
- [x] Checked complete cream face, eyes, smile, backpack, arms, claws and feet on game-blue background.
- [ ] USER ACTION: Upload `boffy-a01.png` to repo path `assets/boffy-a01.png` (replace existing file if present). Current game code already references this filename.
- [ ] Check iPhone Safari live render; mark A01 live only after confirmation.

## A02 — CHARACTER LINEUP APPROVED (2026-10-15)
- [x] User approved five plush sloths: Boffy blue hero, Rocky charcoal gray builder, Chilly pink girl with glasses and flower (replaces old purple Chilly placeholder), Sunny golden yellow cheerleader, Zippy purple speedster.
- [x] Style locked: saturated, soft fluffy 3D cartoon-plush, cream-colored faces, hiking/adventure accessories, complete anatomy, distinct personalities.
- [ ] Produce FOUR separate, independently usable full-body images (Rocky, Chilly, Sunny, Zippy), not cropped from overlapping group composition; inspect face, paws, feet, fur and transparency.
- [ ] Update in-game Friends, quest and reward assets to new character images; preserve approved A01 Boffy.
- [ ] Publish and verify on iPhone Safari before marking A02 live. Do not delete fallback SVGs until verified.

## A02 integration prepared — 2026-10-15
- [x] Four separate transparent PNG files exported, checked on game-navy background, and packaged: `rocky-a02.png`, `chilly-a02.png`, `sunny-a02.png`, `zippy-a02.png`.
- [x] Updated `game.js` to load each A02 PNG in Friends, quest cards and feedback; each old SVG is its own fallback while PNGs are not uploaded. Boffy A01 left untouched.
- [x] Cache-busted `index.html` script to `a02-friends-20261015a` and PNG image URLs to `20261015a`.
- [ ] USER ACTION: Download `A02_Boffy_Friends_Upload.zip`, extract and upload four PNGs into GitHub repository `assets/` folder (NOT the zip itself); commit. File names must match exactly.
- [ ] Verify on iPhone Safari and inspect all four; approve A02 only after live check.

## iPhone live signoff — 2026-10-15
- [L] A01: User confirmed blue Boffy on live Safari Friends and Quests screens.
- [L] A02: User provided live iPhone Safari screenshots of all four approved friend PNGs and four quest cards, stated 'We are good. Continue'. Four friend assets are now live and verified.
- [P] Next priority A07: detailed layered forest environment; create visual preview before deploying, retaining existing course layout and navigation.

## A07 approved and first live pass — 2026-10-15
- [x] User approved lush mountain/forest art direction after A02 Safari signoff.
- [x] Deployed CSS forest atmosphere pass (lighting, panel depth, forest imagery on Home/Friends/Goal) to `game.css` and cache-busted stylesheet in `index.html`.
- [ ] A07 final high-detail illustrated forest background asset still needs production extraction and deployment; CSS pass is not a replacement for the approved illustration.
- [ ] Verify live iPhone Safari appearance; do not mark A07 final or delete original `forest.svg` until confirmed.

## A03 quest screen polish — 2026-10-15
- [x] Published production parchment question card, animated Boffy coach, high-contrast answer field, two-button HELP/SUBMIT layout, improved hints, and feedback screen treatment.
- [x] Updated `game.css`, `game.js` and cache-busted both in `index.html`.
- [ ] User iPhone Safari approval: check question, HELP, correct and retry screens before closing A03.
- [ ] Continue to next approved polish item after A03 signoff.

## A03 signoff and A04 motion preview — 2026-10-15
- [L] A03 quest question, answer and feedback styling: user explicitly approved and requested continuation.
- [P] A04 gentle breathing on Home and Goal; small light pulse. CSS only, preserves A01 artwork. Reduced-motion users see still image. This is NOT an articulated blink or arm wave; those require new approved sprite frames.
- [ ] User verify A04 motion on iPhone before closing. Do not mark articulated poses complete.

## A04 approval and A05 deployed — 2026-10-15
- [L] A04 breathing/lighting idle effect explicitly approved by user.
- [P] A05 correct-answer star celebration and Boffy jump, Chilly retry encouragement, animated HELP hint deployed to GitHub Pages via game.css/game.js and cache-busted index.html.
- [ ] A05 iPhone Safari approval required; no scoring or approval logic modified.

## A05 approved and A06 deployed — 2026-10-15
- [L] A05 success, retry and HELP effects approved explicitly by user.
- [P] A06 friend card animations: Boffy breathe, Rocky builder rock, Chilly thinker tilt, Sunny bounce, Zippy wiggle. Published in game.css and game.js, cache-busted index.html.
- [ ] User verify Friends and Rewards on iPhone. Whole-sprite motion only; no new facial/arm frames.

## A06 signoff and A08 Home deployment — 2026-10-15
- [L] A06 five distinct friend idle motions explicitly approved by user.
- [P] A08 Home: richer hero hierarchy, improved title, paper reminder, large CTA, and real Dad-approved counter. Preserves existing assets and localStorage.
- [ ] A08 user iPhone Safari signoff required before next item A09.

## Visual overhaul requirement — 2026-10-15
- [x] User confirmed A08 illustrated title, pencil sign and main adventure button artwork preview.
- [ ] A08 approved PNGs still require upload/deployment; do not mark final art live based on layout-only approval.
- [ ] A15 MUST redesign the five bottom navigation icons (Home, Quests, Goal, Rewards, Friends), bottom bar treatment, and ALL top header action buttons (Goal Meter, Friends, Dad's Review). No generic emoji or plain gradient buttons in final design. Present illustrated assets for approval before deployment. Preserve working navigation and touch targets.

## A08 mobile signoff and A09 iPhone pass — 2026-10-15
- [L] User explicitly approved A08 mobile sizing fix for title, wooden sign, and play button.
- [P] A09 four character-led quest cards, chapter labels and progress; additional 320–430px mobile fit rules published. Awaiting user iPhone visual signoff.
- [ ] Final A09 custom illustrated card assets are separate from this CSS/layout pass; do not mark art complete.

## A16 viewport-first layout — 2026-10-15
- [x] User approved A08 mobile graphic sizing and requested no page scrolling on Home, persistent shorter bottom nav, and compact top menu.
- [P] Header replaced with Menu (Goal Meter, Friends, Dad's Review); nav fixed at ~61px plus safe area; Home uses dynamic viewport fit and scales mascot/title/sign/button; footer removed from viewport.
- [ ] iPhone screenshot signoff required. Long content screens intentionally scroll within main content rather than clipping math/parent controls. Keyboard and multiple iPhone sizes still need QA.

## A16 approval and A10 question-fit preview — 2026-10-15
- [L] User explicitly approved A16 compact iPhone shell with fixed bottom navigation and requested continued polishing.
- [P] A10 compact question screen published: reduced padding, legible parchment, smaller Boffy coach, answer input and action controls. No scoring, question generation, or storage logic changed.
- [ ] Check a real question on iPhone, including HELP and keyboard. Long math prompts may scroll within main; bottom navigation remains fixed.

## A10 approval and A11 celebration deployment — 2026-10-15
- [L] User explicitly approved A10 compact question layout and requested A11.
- [P] A11 progress-aware celebration and retry screens published; correct count versus Dad-approved count explicitly separated; animated characters retained; responsive to shorter iPhone viewports.
- [ ] User to verify correct and incorrect answer paths on iPhone. Keep A09 final illustrated quest-card art outstanding and A15 icon overhaul outstanding.

## A11 approval and A12 Goal Meter deployment — 2026-10-15
- [L] User approved A11 celebration/progress and requested A12.
- [P] A12 Goal Meter compact layout published with Boffy, approved/goal/remaining stats, reward, progress and pending correct answers. Parent approval/storage logic untouched.
- [ ] User iPhone signoff needed. Final illustrated treasure chest is NOT yet created/deployed; retain as separate artwork requirement.

## A12 approval and A13 Rewards deployment — 2026-10-15
- [L] User explicitly approved A12 Goal Meter layout.
- [P] A13 compact 2×2 collectible milestone card grid published using approved character art, status badges, progress and real Dad-approved counts. Rewards link to Friends rather than duplicating full crew grid on this page.
- [ ] A13 iPhone signoff needed. Distinct illustrated collectible card backgrounds are not yet created; this is a layout/styling pass.

## A13 approval and A14 Dad Review deployment — 2026-10-15
- [L] User explicitly approved A13 Rewards layout.
- [P] A14 pending-first review, compact status counters, collapsible approved/retry history, and goal settings deployed. Existing approve/save functions retained; no parent authentication added.
- [ ] User to verify Dad Review and Settings on iPhone. A15 five-icon and menu-button complete visual overhaul remains outstanding.

## A14 approval and A15 navigation deployment — 2026-10-15
- [L] User explicitly approved A14 Dad Review and Settings layout.
- [P] A15 custom SVG icons for all five fixed bottom tabs and three header menu actions, compact jewel-button treatments, active states, focus styling, reduced-motion handling deployed.
- [ ] User to verify active states and header dropdown on iPhone. These are code-drawn vector icons, not separately generated hand-illustrated artwork.

## A15 approval and A17 motion deployment — 2026-10-15
- [L] User explicitly approved A15 navigation and menu visual overhaul.
- [P] A17 published: reduced-motion override for animations/transitions, lightweight bounded sparkle and medal motion, touch-action/focus polish, async image decoding and lazy secondary character reactions.
- [ ] User to verify iPhone normal motion and iOS Accessibility > Motion > Reduce Motion. A18 device QA remains outstanding.

## A17 approval and A18 cross-device pass — 2026-10-15
- [L] User explicitly approved A17 motion/performance/reduced-motion polish.
- [P] A18 static/source-level responsive pass deployed: 100vh fallback + 100dvh, scrollable dropdown on short screens, iPad/desktop four-column rewards, landscape header/nav sizing, higher contrast.
- [ ] Actual Safari iPhone, iPad and desktop browser manual functional verification has NOT been performed. User to verify fixed navigation, no horizontal overflow, quest answer submission, feedback, Dad approval, rewards and Reduce Motion.

## Resume — final artwork pass — 2026-10-20
- [L] User confirmed A18 looks good on iPhone.
- [P] Final artwork item 1 deployed: four quest cards now carry distinct geometry, fraction, number and story-math motif layers while preserving approved sloth character art and layout.
- [ ] Next after approval: illustrated Goal Meter treasure chest, then collectible reward-card backgrounds.

## Final artwork item 1 approval / item 2 preview — 2026-10-20
- [L] User approved final quest-card artwork.
- [P] Final artwork item 2 deployed: compact illustrated gold-and-wood treasure chest integrated into Goal Meter reward panel; awaiting user signoff.
- [ ] Next after approval: collectible reward-card backgrounds.
