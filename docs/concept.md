# Velvet Room — Concepts, Terminology & Business Logic

**RPG self-improvement app · Android · Version 1 (MVP) with room to grow**

Velvet Room reframes everyday personal growth as a Persona-3-reload-style role-playing game. The player levels up five **life stats** by completing real-world **quests**, and tracks their real relationships as **bonds**. A lunar cycle gives each day a rhythm: the evening **Dark Hour** and **Full Moon** days grant temporary XP boosts.

This document defines the *language*, the *core concepts*, and the *rules* of the app from a product point of view. It deliberately leaves out UI/screen requirements. Everything marked **tunable** is a starting value meant to live in central configuration so it can be balanced without code changes.

---

## 1. Terminology & Glossary

| Term | Definition |
|---|---|
| **Player** | The user. Represented in the app by an **Overall Level** that rises from all activity. |
| **Overall Level / Overall XP** | A single headline progress track fed by every completed quest. Gives the player a sense of total momentum independent of any one stat. |
| **Life Stat** (Stat) | One of five dimensions of growth the player develops: *Knowledge, Guts, Proficiency, Kindness, Charm*. Each has its own level, progress bar, and rank. |
| **Rank / Rank Tier** | A named milestone inside a stat. Every stat has **8 ranks**, each with a themed name (e.g. Knowledge: *Curious → … → Luminary*). A stat's level (1–8) selects the current rank. |
| **Quest** (Task) | A concrete real-world action the player commits to. Completing it awards XP to exactly one **linked stat** (and to the Overall Level). |
| **XP** | Experience points. Earned by completing quests; fills bars; may be multiplied by active boosts. |
| **Progress Bar / Bar Fill** | A track defined by current XP toward the next level. When it fills, it triggers a level-up (and, for a stat, a rank-up). |
| **Overflow** | XP earned beyond what a level needs. It **carries over** into the next level rather than being lost. |
| **Level-Up** | The bar fills, the level rises, and the next level needs a little more XP. Applies to both stats and the Overall Level. |
| **Rank-Up** | A stat level-up that also advances the **rank name** and surfaces a celebratory *RANK UP* moment. |
| **Boost** | A temporary condition that raises the XP a quest awards. Two exist in V1: **Dark Hour** and **Full Moon**. |
| **Multiplier** | The factor a boost contributes (e.g. ×1.5). With no boost active, the multiplier is `1.0`. |
| **Dark Hour** | An evening **window** during which completed quests earn extra XP. Named after Persona 3's hidden hour. |
| **Full Moon** | A whole **day** on which quests earn a larger, all-day boost: the local calendar day that contains the real full-moon moment. |
| **Moon Phase** | The current step of an 8-phase lunar cycle (New → … → Full → … → Waning Crescent). Drives atmosphere and the Full Moon boost. |
| **Bond** (Social Link) | A tracked real relationship. Has a rank from 0–10 shown as **pips**, a short note, a color, and an **Arcana**. |
| **Arcana** | A thematic card identity attached to a bond (e.g. *The Compass*). **Cosmetic in V1**; reserved to carry gameplay meaning later. |
| **Pip** | One unit of bond rank in the UI: filled pips out of the maximum. |
| **Hue** | A per-stat or per-bond accent color used for bars, cards, and highlights. |
| **Day Rollover** | The local-midnight transition that resets the day's quests, advances history, and recomputes the moon phase. |
| **Streak** | Count of consecutive days on which all of that day's quests were cleared. Display-only in V1. |
| **History (Journal)** | The permanent record of completed quests over time, shown as a calendar and a daily timeline. |

---

## 2. How it all fits together

Three progression systems run in parallel, and every one of them is fed by a single act — **completing a quest**:

```
                 completes a quest (base XP)
                          │
             ┌────────────┼──────────────┐
             ▼            ▼               ▼
       apply BOOSTS   credit LINKED    credit OVERALL
      (Dark Hour,     STAT's bar       LEVEL bar
       Full Moon)          │                │
             │             ▼                ▼
             └──────►  bar fills?  ─────►  level-up
                           │
                           ▼
                     rank-up (new tier name)
```

**Bonds** are a separate, slower system — one per relationship, advanced by the player rather than by quests. **The lunar cycle** sits above everything, setting the daily mood and deciding when boosts apply. **History** quietly records each completion so progress is visible over time.

---

## 3. Core concepts (the business view)

Rather than a data schema, this section describes *what each thing is and why it exists in the product*. The precise fields and formulas live in Section 4.

### The player & Overall Level
The player is the person using the app; there is no separate character to manage — *you* are the character. Their headline number is the **Overall Level**, a single figure that only ever goes up and captures total momentum across every area of growth.
**Why it matters:** it gives an at-a-glance answer to "am I making progress?", is a reason to come back, and rewards consistency without forcing the player to care about any single stat.

### Life stats — the five dimensions of growth
Self-improvement is vague; life stats make it concrete. The app ships with five fixed stats, each with its own identity, color, and rank path:

- **Knowledge** — focused study, reading, deep work, languages.
- **Guts** — facing discomfort, hard conversations, showing up when it's easier not to.
- **Proficiency** — hands-on craft, training, and repetitions that build skill.
- **Kindness** — care, helping, listening, small acts of generosity.
- **Charm** — presence, social connection, speaking up.

**Why it matters:** the player can see at a glance where they're investing and which areas they neglect. Five well-chosen stats cover most of what people actually want to improve, while staying simple enough to grasp instantly.

### Ranks — milestones that feel earned
Inside each stat are **8 named ranks** (for Knowledge: *Curious → Diligent → Studious → Scholar → Erudite → Sage → Polymath → Luminary*). Levelling a stat advances its rank name.
**Why it matters:** a bare number is forgettable; becoming a "Scholar" and then a "Sage" turns progress into a small story and gives the player something aspirational to chase.

### Quests — the daily bridge to real life
A quest is a concrete action the player commits to (e.g. *Deep work block — 90 min*). Each quest is tied to one stat and is worth a set amount of XP; completing it is the app's core moment of satisfaction and the *only* thing that generates XP.
**Why it matters:** this is the habit loop. A quest is a promise to yourself; checking it off is the reward; and because XP flows to a specific stat, every real action visibly moves a number the player cares about.

### Bonds — relationships as progression
Bonds turn the player's real relationships into a gentle, trackable system: each person has a rank from 0–10, a short note, a color, and an Arcana. In V1 bonds are nudged forward by the player after meaningful contact.
**Why it matters:** growth isn't only individual. Bonds encourage the player to invest in people, and they open a whole second axis of long-term depth for the product.

### Arcana — flavour now, depth later
Every bond carries an **Arcana** — a thematic card identity like *The Compass* or *The Lantern*. In V1 it is purely cosmetic.
**Why it matters:** it adds character and a light sense of collection today, and it is a deliberate hook for the future — Arcana can later grant stat bonuses or unlock relationship storylines without any redesign.

### The lunar cycle & boosts — the rhythm of the month
An 8-phase moon runs continuously and sets the daily mood. Two conditions turn it into real stakes:

- **Dark Hour** — an evening window (default 21:00–24:00) when completed quests earn extra XP. It rewards finishing the day strong.
- **Full Moon** — one special day per lunar month, when quests earn a bigger all-day boost.

**Why it matters:** without rhythm every day feels identical. The Dark Hour rewards evening follow-through; Full Moon days become anticipated "events" that create natural engagement spikes and make timing feel meaningful.

### History & streak — proof of progress
Every completion is quietly recorded, surfaced as a calendar and a daily timeline. A **streak** counts consecutive days on which all quests were cleared.
**Why it matters:** a visible track record is motivating on its own, and the streak is a classic, low-cost retention mechanic — people work to avoid breaking a run they've built.

---

## 4. Business logic (the rules)

This section makes the rules precise. Values marked **tunable** are starting points for balancing.

### 4.1 Earning XP from a quest
When the player marks an incomplete quest as done, in one step:

1. Take the quest's **base XP** and its **linked stat**.
2. Work out the active **boost multiplier** for the completion time (§4.2) → `mult`.
3. Award: `awardedXP = round(baseXP × mult)`.
4. Add `awardedXP` to the **linked stat** and resolve any level/rank-ups (§4.3).
5. Add the same `awardedXP` to the **Overall Level** and resolve any level-up.
6. Mark the quest done, stamp the time, and record it in **History**.
7. If a rank-up happened, show the *RANK UP* moment.

> **Undoing a completion.** The prototype lets a done quest be toggled back but does **not** remove the XP already earned. The simplest, least-exploitable rule for V1 is *XP awards are permanent for the day*. (Open decision.)

### 4.2 When boosts apply, and how they stack
Two independent conditions are checked against the completion time:

- **Dark Hour active** — the time falls inside the evening window (default **21:00–24:00**, tunable, multiplier **×1.5**).
- **Full Moon active** — that calendar day is a Full Moon (multiplier **×2.0**, tunable, applies all day).

They combine per one **stacking rule** (a balance decision to confirm):

- **Multiplicative (recommended):** `mult = darkHour × fullMoon`, capped (default cap **×3.0**). A Full Moon evening reaches `1.5 × 2.0 = ×3.0` — rare, well-timed effort is rewarded, and the cap keeps the economy bounded.
- **Highest-only:** `mult = max(darkHour, fullMoon)` — simpler and flatter; the stronger boost simply wins.

With nothing active, `mult = 1.0` and the award equals the base XP.

### 4.3 Levelling up and ranking up
Both stat bars and the Overall Level use the same fill rule. After XP is added, while the bar is full:

```
while xp >= maxXp:
    xp    -= maxXp                 # overflow carries into the next level
    level += 1
    maxXp  = round(maxXp × growth) # ×1.25 for a stat, ×1.15 for Overall Level
    # for a stat, the new level also selects the next rank name
```

- The loop handles a big award that crosses **several** levels at once.
- A stat's level *is* its rank pointer, so a stat level-up is always a rank-up.
- **Growth multipliers (tunable):** stats **×1.25**, Overall Level **×1.15** — later levels take progressively more XP, so early wins come fast and long-term mastery stays meaningful.

### 4.4 The moon phase
Eight phases drive the mood and the Full Moon boost:

| Index | Phase | Index | Phase |
|---|---|---|---|
| 0 | New Moon | 4 | **Full Moon (boost day)** |
| 1 | Waxing Crescent | 5 | Waning Gibbous |
| 2 | First Quarter | 6 | Last Quarter |
| 3 | Waxing Gibbous | 7 | Waning Crescent |

**V1:** compute the *real* phase from the device date so the in-app moon matches the sky. The four principal phases (New Moon, First Quarter, Full Moon, Last Quarter) are instants, computed with Meeus' true-phase algorithm (*Astronomical Algorithms*, ch. 49, accurate to about a minute). A principal phase names only the local calendar day that contains its instant; the days between take the intermediate names (Waxing Crescent, Waxing Gibbous, Waning Gibbous, Waning Crescent). The **Full Moon day** — the boost day — is therefore exactly one local calendar day per lunar cycle, and the countdown counts calendar days to it. The disc's lit fraction follows the cycle position between the true New and Full Moon instants. The header, the calendar, and the boost logic must all read from the **same** source so they never disagree.

### 4.5 The daily reset
At local midnight: the day's quests reset to not-done; History advances to the new date and the moon phase is recomputed; the streak goes up if yesterday was fully cleared, or resets to zero if it wasn't. Past History is never changed — it is the permanent record.

### 4.6 Growing a bond
A bond advances by raising its rank toward the maximum (0 → 10). In **V1** this is a **manual** action the player takes after meaningful contact; automatic or quest-linked progression is deferred. The **Arcana** is a name only in V1, reserved to later grant effects (a stat bonus, a storyline) without changing anything else. Reaching the maximum rank is a natural hook for a future "storyline finale."

### 4.7 Balancing levers (tunable)
All the numbers a product owner would adjust to tune the feel, kept in one place: stat growth (×1.25) and Overall growth (×1.15); the Dark Hour window (21:00–24:00) and its multiplier (×1.5); the Full Moon multiplier (×2.0); the stacking rule and its cap (×3.0); and the suggested quest XP bands (small 30–50, medium 60–80, large 90+).

### 4.8 Worked examples

**A — a normal completion (no boost).**
Knowledge is level 5 with 340 of 500 XP. The player finishes *Read 20 pages* (base 45) in the afternoon on an ordinary day. `mult = 1.0`, so it awards 45. Knowledge moves to 385 / 500 — no rank-up. The Overall Level also gains 45.

**B — Dark Hour on a Full Moon.**
Same Knowledge at 340 / 500. The player finishes *Deep work block* (base 80) at 22:10 on a Full Moon day. `mult = 1.5 × 2.0 = ×3.0`, so it awards 240. Knowledge reaches 580, which is past 500 → **rank-up** to level 6 with 80 XP carried over, and the next level now needs 625. Knowledge's rank name advances to *Sage*.

**C — one award, several levels.**
Charm is level 2 with 80 of 350 XP. A large 300-XP quest completed during the Dark Hour (×1.5) awards 450. Charm goes to 530, crosses 350 → level 3 with 180 carried over; 180 is below the new requirement of 438, so it lands at level 3 with 180 / 438.

---

## Appendix A — Full rank tiers

| Stat | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| **Knowledge** | Curious | Diligent | Studious | Scholar | Erudite | Sage | Polymath | Luminary |
| **Guts** | Nervous | Steady | Bold | Fearless | Resolute | Unshaken | Valiant | Indomitable |
| **Proficiency** | Novice | Skilled | Adept | Craftsman | Expert | Master | Virtuoso | Grandmaster |
| **Kindness** | Considerate | Warm | Caring | Generous | Selfless | Nurturing | Devoted | Radiant |
| **Charm** | Shy | Present | Poised | Magnetic | Captivating | Charismatic | Iconic | Legendary |

## Appendix B — Seed data (demo)

**Stats**

| Stat | Level | XP | Max XP | Hue |
|---|---|---|---|---|
| Knowledge | 5 | 340 | 500 | `#6FB4FF` |
| Guts | 3 | 120 | 400 | `#8F9DFF` |
| Proficiency | 4 | 290 | 450 | `#5FE0D6` |
| Kindness | 6 | 410 | 600 | `#7DE8FF` |
| Charm | 2 | 80 | 350 | `#B39BFF` |

**Overall Level:** 24, with 720 of 1000 XP.

**Bonds**

| Name | Arcana | Note | Rank / 10 |
|---|---|---|---|
| Mei | The Compass | Career mentor | 6 |
| Dad | The Anchor | Weekly call | 8 |
| Jonas | The Signal | Gym partner | 4 |
| Ari | The Hearth | Oldest friend | 9 |
| Lena | The Lantern | Language tandem | 3 |
