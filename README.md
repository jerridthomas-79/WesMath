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
