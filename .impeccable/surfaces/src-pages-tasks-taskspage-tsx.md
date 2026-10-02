---
version: 1
slug: "src-pages-tasks-taskspage-tsx"
primary_target: "src/pages/tasks/TasksPage.tsx"
related_targets: []
---

# Tasks (quest management)

**Mode:** Operate. The player lands here several times a day: a quick daytime check-in, then a deliberate evening session inside the Dark Hour. They clear quests, add new ones and tidy the list.

**Job:** manage many quests at once. Clear today's quests (each clear is the app's core reward), create and edit quests whose XP the Rulebook (`docs/xp-rules.md`) prices, filter by date, status and life stat, and act on many quests at once (clear, move, delete).

**Proof / content:** real quests from the `quest` table and real awards from the `completion` ledger. A row's XP is the live award (`computeAward`), so it matches what the ledger records. Empty states teach the Forge.

**Constraints:** Android portrait, the dark world from DESIGN.md, the shared PageHeader (date tab · header moon · BACK), `SkewPanel` slants (6° containers, 12° chips), stat hues only on stat visuals, cyan the only UI light, crimson only for delete. 48dp targets. Reduced motion respected. Hardware back closes the Forge sheet, then selection mode, then the page.

**Chosen direction:** the user's concept image, pinned. A column of 6° navy quest plates with a check plate, title, stat tag and +XP, under the established header, plus a quick-filter rail, a pinned dashed ADD QUEST plate and a slanted Quest Forge sheet. Memorable moment: clearing a quest lifts its XP out of the row in the stat's hue, and a rank-up sweeps a Foam blade across the screen.

**Open:** a dateless backlog is deferred (every one-off has a date, today by default).

## Direction contract

THESIS: A quest log that reads like a P3R command list, not a to-do app. Each quest is a slanted plate that names its stat and its price, so clearing one is a visible trade of effort for growth. It refuses the default flat checkbox list with a FAB and Material chips.

OWN-WORLD: Water shows through. 6° Deep Water plates at 70% with 20% cyan hairlines. A 12° check plate that fills with the stat hue and shows an Ink check when cleared. Stat tags are hue hairline boxes with label caps. The date segment is a 12° blade with a Foam selected plate and Ink caps. Stat filter chips are glyph-led and fill with their own hue at 18%. Chakra Petch caps carry every label and action; Barlow carries titles. The add plate is a dashed cyan hairline parallelogram.

STORY: The player sees today's count and what is still open, clears quests with one tap and watches the XP land, filters to find one quickly, long-presses to manage several at once, and forges a new quest knowing its price before sealing it.

FIRST VIEWPORT: PageHeader with TASKS and a `3/6` count lockup (CLEARED TODAY) on the title line, plus a boost chip when the sky boosts. Under it, the filter rail: a date blade (TODAY · TOMORROW · WEEK · ALL), then the status and stat chips. Then the quest plates fill the viewport. `+ ADD QUEST` is pinned above the safe area at the bottom. Primary action: the check plate on each row.

FORM: The user-pinned concept (their image), translated into the established header grammar. Position 1 of 1. Seed: none (user-pinned structure; concept roll skipped).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
