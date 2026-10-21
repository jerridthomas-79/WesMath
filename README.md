# Boffy Math Quest

Phase 1 provides 1,000 unique sixth-grade questions in each quest: Geometry, Fractions, Number Sense, and Word Problems (4,000 total). Each bank has stable question IDs, retains unique original prompts, and interleaves ten question types. `questions.js` builds the fixed banks deterministically; question selection is random.

Correct questions are excluded from future selection immediately, before Dad approval. Incorrect questions remain available for retry. Completing all 1,000 questions ends that quest. Question progress counters use /1000; configurable goal and reward targets keep their existing behavior.

Progress, the current question, answers, approvals, and goal settings are stored in this browser's `pm-progress` localStorage. Closing/reopening on the same device preserves progress when website storage is allowed. Clearing Safari website data clears that progress. Storage failures produce a visible alert. No backend, SMS, or notifications are used.

Original saved questions migrate by exact prompt. Duplicate original prompts consolidate; previously approved credits remain credited toward goals/rewards. Dad Review retains passcode 7979 (a client-side convenience gate). Reset All Progress requires confirmation, clears question history and credits, and retains goal settings.

Artwork, styling, navigation, and reward rules are preserved. Phase 2 has not started.

## Validation

- `node tests/phase1.test.cjs`: bank size/uniqueness/stable IDs, independent number-sense arithmetic, randomized selection, question resume, complete exhaustion of all four banks, no correct repeats after reload, retries, approval/passcode/reset, goal retention, legacy migration, and storage failures.
- `python tests/browser.py`: requires Playwright and system Chromium at `/usr/bin/chromium`; mobile browser workflow and navigation/overflow checks at 320, 390, 768, 844, and 1280 px widths. Run from the repository root. This is Chromium testing; physical iPhone Safari signoff remains with the user.

GitHub Pages serves the root of the existing publishing branch. Open https://jerridthomas-79.github.io/WesMath/?v=phase1-20261021 in Safari.

## Phase 2 — Congratulations

A Dad approval that crosses the current goal target opens Wesley's celebration. The final correct answer in each 1,000-question quest opens that quest's celebration immediately, without requiring Dad approval. Goal milestones use `goal:<target>` IDs; quests use `quest:<category>` IDs. Each is recorded once before rendering and can be revisited through **Goal / Rewards → View My Achievements**. Celebration and revisiting do not add reward credits.

Goal/reward names are saved as achievement snapshots. Renaming or editing the reward for the same target does not create another milestone. Raising the target above the current approved count allows a new milestone; lowering it below existing progress records it silently for revisiting. Existing Phase 1 achievements are also recorded without an automatic popup. Reset clears all milestone history. The same localStorage key and schema `version: 2` are retained, with an additive `achievements.milestones` field.

**SAVE MY ACHIEVEMENT** exports a 1600×2000 PNG using the original five approved character assets. The PNG is prepared before the tap so browsers supporting file sharing can open the native share sheet directly from that tap. On supported iPhones choose **Save Image**. Other browsers download the PNG and offer **Download PNG / Open PNG** links. Sharing cancellation is handled; image-load errors allow retry. The website does not automatically save to Photos or trigger the device's hardware screenshot function.

Additional tests: `node tests/phase2.test.cjs` and `python tests/phase2-browser.py`. Browser export tests require Pillow, Playwright, system Chromium, and the existing repository image files. The latter verifies actual PNG output and simulates native share-file support, cancellation, and errors; physical iPhone share-sheet behavior still needs device signoff. Test images are written only under `/tmp/boffy-phase2-tests`.

Phase 2 uses a replaceable composition of existing approved assets. Phase 3 final group artwork and Phase 4 visual polish have not started and require separate approval.
