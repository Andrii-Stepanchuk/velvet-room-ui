# Velvet Room — The Rulebook: Quests, XP & Arcana

**Authoritative for every number the engine awards.** `docs/concept.md` defines the world and its vocabulary. This document defines the economy: how a quest gets its XP rate, how an award is computed, how stats and the Overall Level grow, how a day closes, and what each of the 22 Arcana does. The engine (`src/lib/game/`), the UI and the tunables in `src/constants/config.ts` must match this document exactly. If one of them changes, all three change together.

---

## 1. Design goals

1. **Honest effort, honest XP.** A quest is worth what it costs you in time and comfort, not what you feel like typing. The player never enters an XP number. They describe the quest, and the rulebook prices it.
2. **One price, everywhere.** The XP the Quest Forge previews, the XP the row shows and the XP the ledger records come from one function. They can never disagree.
3. **Early wins, long arcs.** Rank 2 arrives inside the first week. Rank 8 is a half-year story.
4. **Time matters.** The Dark Hour and the Full Moon multiply effort that lands at the right moment.
5. **Your card matters.** The Arcana you embody grants one blessing, and it shifts as you grow, so growth changes how you play.
6. **The record is permanent.** Awards are frozen the moment they are earned. Past days are never rewritten.

---

## 2. Pricing a quest (base XP)

Every quest is described by two choices. Its base XP is their product, rounded to the nearest 5:

```
baseXp = roundTo5(EFFORT × CHALLENGE)
```

### 2.1 Effort — what it costs in time and energy

| Effort | Guide | Points |
|---|---|---|
| **QUICK** | up to 15 min | 30 |
| **SHORT** | about 30 min | 45 |
| **SESSION** | about an hour | 65 |
| **DEEP** | about two hours | 90 |
| **EPIC** | half a day or more | 140 |

### 2.2 Challenge — what it costs in comfort

| Challenge | Meaning | Factor |
|---|---|---|
| **ROUTINE** | You'd do it anyway; it only needs remembering. | ×1.0 |
| **STRETCH** | Pushes a little past comfort. | ×1.25 |
| **HARD** | You'd rather not, which is exactly why it counts. | ×1.5 |

### 2.3 The rate table

| Effort | Routine | Stretch | Hard |
|---|---|---|---|
| QUICK | 30 | 40 | 45 |
| SHORT | 45 | 55 | 70 |
| SESSION | 65 | 80 | 100 |
| DEEP | 90 | 115 | 135 |
| EPIC | 140 | 175 | 210 |

The table lines up with the bands concept §4.7 suggested: **small** 30–50, **medium** 55–80, **large** 90+. Examples:

| Quest | Stat | Effort · Challenge | Base |
|---|---|---|---|
| Read 20 pages | Knowledge | SHORT · ROUTINE | 45 |
| Deep work block — 90 min | Knowledge | SESSION · STRETCH | 80 |
| Morning cold shower | Guts | QUICK · HARD | 45 |
| Gym — pull day | Proficiency | SESSION · ROUTINE | 65 |
| Call a friend to check in | Kindness | SHORT · ROUTINE | 45 |
| Introduce yourself to someone new | Charm | QUICK · HARD | 45 |

### 2.4 Pricing rules

- **Repetition never changes the price.** A daily quest is worth the same on day 100 as on day 1. It is the same act.
- **Once per day.** A quest can award XP at most once per local day. A one-off quest awards once, ever.
- **Editing re-prices the future, never the past.** Changing a quest's effort or challenge changes what it awards from then on. XP already in the ledger stays as it was earned.

---

## 3. The award (what clearing a quest pays)

When the player clears a quest, the engine computes the award once and freezes it into the ledger:

```
moon     = min(darkHour × fullMoon, CAP)          # 1.0, 1.5, 2.0 or 3.0
awarded  = round(base × moon × (1 + blessing))
```

| Factor | Value | When |
|---|---|---|
| Dark Hour | ×1.5 | Cleared between 21:00 and 24:00 local (20:00 for The Moon, §6) |
| Full Moon | ×2.0 | Cleared on the local calendar day that holds the real full moon (concept §4.4) |
| Sky cap | ×3.0 | The two moon factors multiply, capped here |
| Blessing | +0%, +5%, +10% or +100% | The active Arcana's blessing, if its condition holds (§6) |

- **The cap bounds the sky, not the card.** The blessing applies after the moon cap, so the strongest normal award is base × 3.0 × 1.1. The card answers to you, not the sky.
- **Rounding:** halves round up, after multiplication.
- **The Arcana in force is the one you hold before the award.** If the award changes your two strongest stats, the new card takes over from the next quest.
- **The award is frozen.** The ledger keeps the base, the moon factor, which blessing fired and its percentage, and the final XP. Nothing recomputes it later.
- **The ledger is the `xp_award` table:** one row per cleared quest per day. A quest can have at most one row per day, and stats and the Overall Level are summed from these rows.

### 3.1 What one award feeds

1. The quest's **linked stat** gains `awarded`.
2. The **Overall Level** gains the same `awarded`.
3. If the stat crosses a level, that is a **Rank-Up** and the *RANK UP* moment plays.

---

## 4. Growth curves

Stats and the Overall Level both use concept §4.3's overflow loop:

```
while xp >= maxXp and level < maxLevel:
    xp    -= maxXp
    level += 1
    maxXp  = round(maxXp × growth)
```

Levels are **derived from lifetime XP**. A stat's level is whatever its total XP in the ledger produces through this loop, which is what makes an undo exact (§5.2).

### 4.1 Life stats — 8 ranks, half a year

| | |
|---|---|
| XP for level 1 → 2 | 450 |
| Growth per level | ×1.5 |
| Maximum level | 8 (the final rank) |

| Rank | Needs | Lifetime XP to reach | At ~75 XP/stat/day |
|---|---|---|---|
| 1 | 450 | 0 | day 1 |
| 2 | 675 | 450 | ~day 6 |
| 3 | 1013 | 1125 | ~day 15 |
| 4 | 1520 | 2138 | ~day 29 |
| 5 | 2280 | 3658 | ~day 49 |
| 6 | 3420 | 5938 | ~day 79 |
| 7 | 5130 | 9358 | ~day 125 |
| 8 | — | 14488 | ~day 193 |

"~75 XP per stat per day" models a steady player: five quests a day at about 60 base XP, with the Dark Hour, Full Moon and blessings averaging ×1.25, spread across five stats.

At **rank 8** the stat is mastered. Its bar stays full, it shows *Highest rank*, and further XP still counts toward the Overall Level and the stat's lifetime total.

> **Why not concept's ×1.25?** At ×1.25 the first and last ranks cost almost the same (a 4.8× spread), so the curve can't be both quick at the start and long at the end. At ×1.5 the spread is 11×: rank 2 in a week, rank 8 in six months.

### 4.2 Overall Level — the headline that only goes up

| | |
|---|---|
| XP for level 1 → 2 | 200 |
| Growth per level | ×1.08 |
| Maximum level | 99 |

| Level | Lifetime XP | At ~375 XP/day |
|---|---|---|
| 10 | 2,498 | ~1 week |
| 20 | 8,295 | ~3 weeks |
| 25 | 13,365 | ~5 weeks |
| 30 | 20,819 | ~2 months |
| 40 | 47,854 | ~4 months |
| 50 | 106,199 | ~9 months |
| 60 | 232,145 | ~1.7 years |

> **Why not concept's ×1.15?** At ×1.15 a year of steady play stalls near level 39, with each level then taking two weeks. ×1.08 keeps a level arriving every few days through the first year.

---

## 5. The day

### 5.1 The day key
A completion belongs to the **real local calendar date** it happened on (`YYYY-MM-DD`). The dev-only *Force Full Moon* switch changes the sky, not the calendar: it grants the Full Moon factor without moving the completion to another day.

### 5.2 Undo (same day only)
- A quest cleared **today** can be un-checked until local midnight. Un-checking deletes its `xp_award` row, so its exact award disappears from the stat, the Overall Level and any level it caused. Levels are derived (§4), so a level-up is undone too.
- Past days are **locked**. History is the permanent record.
- Undo never recomputes *other* awards. If clearing a Knowledge quest let a later Proficiency quest earn The Magician's blessing, that award stays as it was earned.

### 5.3 What is on a day
- A **daily** quest is on every day from the day it was created.
- A **days** quest (e.g. MON · WED · FRI) is on its chosen weekdays.
- A **one-off** quest is on its date. If it isn't cleared, it **carries forward**: it stays on every following day, marked *CARRIED FROM OCT 1*, until it is cleared or deleted. It is never shown in red, and it counts toward the day's target, because the promise is still open.
- A one-off can be **cleared early**, on any day before its date. It then belongs to the day it was cleared.
- **Today's list** is everything on today plus anything cleared today.
- A deleted quest leaves the list from the day it is deleted. Its past completions stay in History.

### 5.4 Closing a day and the streak
- At the first launch after midnight, every unfinished day up to yesterday is **finalized** into the day log as *scheduled* vs *cleared* and never changes again.
- A day is **cleared** when every quest on it was cleared.
- The **streak** counts consecutive cleared days, ending today if today is already cleared, otherwise yesterday. A day with nothing on it neither extends nor breaks the streak; the moon doesn't punish a rest day.

---

## 6. The Arcana

### 6.1 Which card you hold
Your Arcana is read from your five stats (unchanged from the current engine):

1. **XXI · The World**: every stat is at rank 7 or higher.
2. **0 · The Fool**: all five stats are within one rank of each other. Every new player starts here: *the open road*.
3. Otherwise, the card named by the ordered pair of your **strongest** and **second-strongest** stats (ties break by bar fill, then by stat order). Five stats make 20 ordered pairs, for 20 cards. With the Fool and the World, that's all 22 Major Arcana.

Each pair card reads **Dominant ▸ Second**, e.g. *The Star: Kindness ▸ Knowledge*.

### 6.2 How a blessing is written
A blessing is one line in a fixed grammar, **bonus · on which quests · when**:

| Part | Vocabulary |
|---|---|
| Bonus | +5%, +10%, or *double* (+100%) |
| On | every quest · quests of a stat (or two) · your lowest stat |
| When | always · in the Dark Hour · on the Full Moon · before noon · on DEEP/EPIC quests · on HARD quests · after a quest of another stat today · while the streak is 3+ · while no stat is more than 2 ranks behind your best · on the quest that clears the day · when Fortune turns |

Every condition is checked against facts the engine already has: the quest's stat, effort and challenge, the time of the clear, the sky, today's earlier clears, the streak and the stats before the award. Nothing is self-reported.

The **pair rule:** a pair card's blessing always serves one of its own two stats or the card's own meaning. Holding a card nudges you toward the life that made it.

### 6.3 The 22 blessings

| # | Arcana | Formula | Blessing | Why |
|---|---|---|---|---|
| 0 | **The Fool** | balanced | +10% on quests for your **lowest stat** | The open road favours the path you've walked least. |
| I | **The Magician** | Knowledge ▸ Proficiency | +10% on **Proficiency** quests **after a Knowledge quest today** | Learn it in the morning, build it by night. |
| II | **The High Priestess** | Knowledge ▸ Charm | +10% on **Knowledge** quests **in the Dark Hour** | Quiet insight comes after dark. |
| III | **The Empress** | Kindness ▸ Proficiency | +10% on **Kindness** quests | What you nurture grows. |
| IV | **The Emperor** | Guts ▸ Charm | +10% on **Charm** quests | Courage gives your presence weight. |
| V | **The Hierophant** | Knowledge ▸ Kindness | +10% on **Kindness** quests **after a Knowledge quest today** | Learn, then give it away. |
| VI | **The Lovers** | Kindness ▸ Charm | +5% on **Kindness and Charm** quests | Warmth and presence, bound together. |
| VII | **The Chariot** | Guts ▸ Proficiency | +10% on **every quest while your streak is 3+** | Momentum wins. |
| VIII | **Justice** | Guts ▸ Knowledge | +10% on **Knowledge** quests | Courage guided by understanding. |
| IX | **The Hermit** | Proficiency ▸ Knowledge | +10% on **Proficiency** quests **in the Dark Hour** | The workshop at midnight. |
| X | **Wheel of Fortune** | Charm ▸ Proficiency | **Double XP** on the quests **Fortune turns** (about 1 in 8, rerolled each day) | Luck favours the one who shows up. |
| XI | **Strength** | Guts ▸ Kindness | +10% on **HARD** quests | Gentle hands, iron will. |
| XII | **The Hanged Man** | Kindness ▸ Guts | +10% on **Kindness** quests **in the Dark Hour** | Giving when it costs you. |
| XIII | **Death** | Proficiency ▸ Guts | +10% on **DEEP and EPIC** quests | Big work transforms. |
| XIV | **Temperance** | Proficiency ▸ Kindness | +5% on **every quest while no stat is more than 2 ranks behind your best** | Balance sustains. |
| XV | **The Devil** | Charm ▸ Guts | +10% on **Charm** quests **in the Dark Hour** | The night's temptation: be seen. |
| XVI | **The Tower** | Knowledge ▸ Guts | +10% on **Guts** quests | Knowing the truth, then facing it. |
| XVII | **The Star** | Kindness ▸ Knowledge | +10% on **Kindness and Knowledge** quests **on the Full Moon** | Hope shines brightest under the full moon. |
| XVIII | **The Moon** | Charm ▸ Knowledge | **The Dark Hour opens at 20:00** instead of 21:00 | The moon calls the night early. |
| XIX | **The Sun** | Proficiency ▸ Charm | +10% on **every quest cleared before noon** | Shine early. |
| XX | **Judgement** | Charm ▸ Kindness | +10% on **the quest that clears your day** | The final call answered. |
| XXI | **The World** | every stat 7+ | +10% on **every quest** | Completion. |

### 6.4 Blessing details
- **One card, one blessing.** Only the card you hold blesses. A blessing either fires (its full bonus) or doesn't.
- **"After a quest of another stat today"** means at least one quest of that stat is already in today's ledger when this one is cleared.
- **Lowest stat** means every stat at your lowest rank; on ties, all of them count.
- **"No stat more than 2 ranks behind"**: highest rank − lowest rank ≤ 2.
- **The quest that clears your day**: after this clear, every quest on today's list is cleared, and the list has at least one quest. In a bulk clear, quests resolve in list order, so the last one clears the day.
- **Fortune** is deterministic. A quest is turned on a day when `hash(questId : day) mod 8 = 0`. Turned quests show a ✦ in the list, so you can see the wheel's pick for the day, and undoing and re-clearing can't reroll it. The wheel turns at midnight.
- **The Moon** changes the Dark Hour itself: the countdown, the evening veil, the Dark Hour factor and The High Priestess / Hermit / Hanged Man / Devil conditions all follow the 20:00 start while you hold it.

---

## 7. Worked examples

**A. An ordinary afternoon.** You hold **The Fool** with every stat at rank 1. Knowledge has 300/450, and Charm is tied for lowest with the others. You clear *Read 20 pages* (SHORT · ROUTINE = **45**) at 15:00 on an ordinary day. Moon ×1.0. The Fool fires, because Knowledge is among the lowest-ranked stats: 45 × 1.0 × 1.10 = 49.5 → **50**. Knowledge goes to 350/450. Overall +50.

**B. Dark Hour on a Full Moon, with The Star.** Knowledge is rank 4 with 1300/1520, and you hold **The Star** (Kindness ▸ Knowledge). At 22:10 on a Full Moon day you clear *Deep work block* (SESSION · STRETCH = **80**). Moon = 1.5 × 2.0 = ×3.0 (at the cap). The Star fires (a Knowledge quest on the Full Moon): 80 × 3.0 × 1.10 = **264**. Knowledge reaches 1564, past 1520, so **RANK UP** to rank 5 *Erudite* with 44/2280.

**C. Fortune turns, two ranks at once.** Charm is rank 1 with 400/450, and you hold **Wheel of Fortune**. Today the wheel turned *Give the toast* (EPIC · HARD = **210**). You clear it at 22:30 on a Full Moon: 210 × 3.0 × 2.0 = **1260**. Charm 400 + 1260 = 1660, which crosses 450 (rank 2, 1210 left), then crosses 675 (rank 3, 535 left), and lands at **rank 3 *Poised*, 535/1013**. Overall +1260.

**D. Undo.** In example A you un-check *Read 20 pages* at 15:05. Its `xp_award` row (50 XP) is deleted. Knowledge returns to exactly 300/450 and Overall loses 50. At midnight the day closes and the option is gone.

**E. The Moon's early night.** You hold **The Moon**. At 20:30 you clear *Gym — pull day* (SESSION · ROUTINE = **65**). For you the Dark Hour has begun: 65 × 1.5 = 97.5 → **98**. The Status veil darkened at 20:00, too.

**F. Judgement.** You hold **Judgement**. Five of today's six quests are done. Clearing the sixth, *Call a friend to check in* (**45**) at 18:00, clears the day: 45 × 1.10 = 49.5 → **50**.

---

## 8. Tunables (`src/constants/config.ts`)

| Lever | Value |
|---|---|
| Effort points | 30 / 45 / 65 / 90 / 140 |
| Challenge factors | 1.0 / 1.25 / 1.5 |
| Stat curve | 450 · ×1.5 · max 8 |
| Overall curve | 200 · ×1.08 · max 99 |
| Dark Hour | 21:00–24:00 · ×1.5 (The Moon: from 20:00) |
| Full Moon | ×2.0 |
| Sky cap | ×3.0 (applied before the blessing) |
| Fortune odds | 1 in 8 |
| Streak for The Chariot | 3 |
| Rank spread for Temperance | 2 |

Changing a curve re-derives every level from the ledger's lifetime XP. Changing a rate or a factor affects only future awards.
