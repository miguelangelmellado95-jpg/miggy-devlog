---
title: "Build Plan"
lastUpdated: "2026-05-04"
nextReview: "2026-07-25"
quitTrigger: "$6–8k/month for 6 consecutive months"
runwayTarget: "24 months"
bet: "Stay employed, ship games on Roblox until one earns enough to justify quitting, build an audience in parallel, decide about Steam only when there's data to decide with."
---

## 3-Month Plan (now → 2026-07-25)

**Theme:** Ship one. Start one. Lock the cadence.

> **Update 2026-05-04** — Server Mod Simulator (the project formerly known as Discord Mod Simulator) shipped publicly on Roblox on **May 3, 2026** — Day 14 of the 30-day plan, **16 days ahead of schedule**. Phase 6 launch post and 14-day post-mortem are live in the dev log. Month 1's "Ship one" is closed; the rest of Month 1 shifts to the post-launch soak + content-engine completion + cadence start.

### Month 1 — Ship Server Mod Simulator (✓ done, on to soak + cadence)

#### SMS / DMS — Launched May 3 ✓

- [x] Phase 2 closeout — path variation, one new enemy type *(closed Day 12 as bookkeeping; recording session May 1 was the de-facto closing beat)*
- [x] Real UI pass (custom hotbar with hover/equip states) *(shipped Day 11 — health bar + live wave count + cooldown panel; custom hotbar deliberately skipped per Phase 5 cost-benefit call)*
- [x] One progression hook so wave 5 victory unlocks something *(XP / level system + 3 tool unlock gates + 4 cooldown upgrades shipped in Phase 3)*
- [x] Game icon iteration (3 versions, A/B in Studio) *(single 512×512 PNG shipped Day 30 — brand-yellow ban hammer + electric energy + visible enemies + scattered coins)*
- [x] Two thumbnails for the Roblox listing *(one 1920×1080 cinematic shipped — player Mod with hood + headphones, all 4 tools labeled, troll/Karen framing)*
- [x] Soft launch — 10 playtest reports collected *(soft launch happened May 3; structured 10-report collection rolls into post-launch soak)*
- [x] Public Roblox launch *(live at roblox.com/games/94039045722660/Server-Mod-Simulator — public privacy flipped on, all-ages publishing tier unlocked)*
- [ ] Roblox analytics dashboard set up (DAU, session length, Robux)

#### SMS post-launch soak (added 2026-05-04)

- [ ] One-week soak window — no breaking changes for first 7 days (until 2026-05-10)
- [ ] First-week metrics watch — active players, session length, gamepass conversion, drop-off points, exploits, touch-UX scaling
- [ ] Player-feedback-driven iteration — pull from §9 backlog based on real complaints (Mute Gun aim, per-element responsive layout, settings menu, hover tooltips, ambient sound)
- [ ] Phase 4 monetization rebalance if conversion data warrants it — Coin Pack pricing, gamepass effect strength, unlock cost curve

#### Content engine (post-pivot)

- [x] Day 1 commits A → B → C landed (clip add working)
- [x] Cross-poster scaffold + `clip add` E2E *(Day 5 pivot — ingestion pipeline shelved, cross-poster shape locked)*
- [x] First 10 DMS clips planned & audited against source *(Day 6 — `docs/clips.md`, audience-balanced 5 player / 5 dev split, audit caught 5 material issues)*
- [x] Sunday recording session executed *(May 1 overnight push — 7 of 8 clips captured, plus 2 game-feel polish commits as a side-effect)*
- [ ] Clip editing pass — voiceovers for Clips 05 + 07, edits per `recording-status.md`
- [ ] `caption draft` command shipped (Anthropic per platform)
- [ ] `schedule` + `queue` commands working
- [ ] YouTube Shorts metrics auto-pull working
- [ ] Manual metrics entry for TikTok/IG/X
- [ ] First 7 SMS clips posted (8-clip rotation collapsed to 7 after Clip 06 was dropped)

#### Audience baseline

- [ ] Cross-posting live across TikTok, YT Shorts, IG Reels, X
- [ ] 3 clips/week cadence locked (Mon/Wed/Fri starting after editing pass — last post Mon May 18)
- [x] Devlog post for every milestone above *(holding the line — Day 7 launch post + Day 6 marathon post live)*

#### Tableword (parallel work, not in original Month 1 scope)

> Live multiplayer Bible study app. Not on the original Roblox / content-engine path; treat as "ship-when-ready" side work that doesn't compete for Month 1 attention.

- [x] v1 — all 27 NT books authored, Genesis 1–14, patristic Phase 1 (267 cards), heartbeat resync shipped
- [x] v2 platform spec written end-to-end (~700 lines + 3 tier docs)
- [ ] v2 Tier A Phase A — Supabase auth + profiles + study counts (1.5–2 weeks if not sidetracked by content runs)

**Month 1 win condition:** ~~SMS publicly playable.~~ ✓ done **16 days early.** | 7+ clips posted (was 12+). | Content engine running unattended.

### Month 2 — Game 2 prototype, audience signal

#### SMS (maintenance mode)

- [ ] Two post-launch patches based on real player data
- [ ] Post-mortem devlog — what worked, what didn't *(partial — 14-day post-mortem live in launch post; full post-mortem after first month of metrics)*
- [ ] One bug-fix patch per week max, no new features

#### Game 2 (Roblox, different genre from SMS)

- [ ] Genre picked based on SMS audience overlap data *(needs first-month metrics to be meaningful)*
- [ ] 1-page design doc with hard scope cap (4 weeks to playable)
- [ ] New repo, fresh `CLAUDE.md`, fresh `DEVLOG-NOTES.md`
- [ ] Phase 1 core loop playable
- [ ] First Game 2 devlog post

#### Content + audience

- [ ] 12+ more clips posted
- [ ] Per-platform analytics review — cut the dead one if obvious
- [ ] 500 followers on at least one platform
- [ ] First "behind the build" devlog targeting players, not devs

#### Steam (research only — no code)

- [ ] 5 solo Steam launch post-mortems read
- [ ] Target genre lane written down (not committing)

**Month 2 win condition:** Game 2 has a playable core loop. 500+ followers somewhere.

### Month 3 — Ship Game 2, decide

#### Game 2

- [ ] Phase 2 game feel pass
- [ ] Public launch
- [ ] First 7 days of analytics captured

#### Audience

- [ ] 1500+ followers on best-performing platform
- [ ] 36+ clips posted across the quarter
- [ ] Audience inventory — who's following, what drives engagement

#### Quarterly review (the most important checkbox)

- [ ] Public quarterly retrospective devlog
- [ ] Savings runway recalculated
- [ ] Quit trigger re-evaluated
- [ ] Months 4–6 plan written based on actual data, not predictions

**Month 3 win condition:** Two games live, 1500+ followers, defensible answer to "Steam prototype in month 4 or stay on Roblox?"

## 6-Month Plan (2026-07-25 → 2026-10-25)

**Theme:** Pattern-match. The first hit usually isn't game 1.

This half of the plan is intentionally lighter on detail — month 4–6 priorities depend entirely on what month 1–3 produced. The structure is fixed, the specifics fill in at the quarterly review.

### Months 4–5 — Game 3 OR Steam prototype (one, not both)

#### Path A: Roblox Game 3 (default if neither SMS nor Game 2 broke through)

- [ ] Apply pattern-matched lessons from Games 1 and 2
- [ ] 6-week scope cap — same vertical-slice discipline
- [ ] Lean harder into whatever clip format performed best
- [ ] Public launch by end of month 5

#### Path B: Steam prototype (only if Game 1 or Game 2 has $1k+/month earning)

- [ ] Pick engine and don't relitigate (Godot or Unity — pick once)
- [ ] Steam Direct fee paid ($100)
- [ ] Genre locked from month 2 research
- [ ] 6-week prototype goal: one playable level, not a full game
- [ ] No Roblox dev during this window — context-switching is the killer

#### Audience

- [ ] 5,000+ followers on best platform
- [ ] First viral-ish clip (>50k views) by end of month 5 — if not, content strategy gets reviewed
- [ ] Devlog cadence holds: 1 post per shipped milestone

### Month 6 — Ship + second quarterly review

- [ ] Whatever started in month 4 ships (or fails publicly — both are okay, "in progress for 8 weeks" is not)
- [ ] Second post-mortem devlog
- [ ] Second quarterly retrospective
- [ ] Runway recalc, quit trigger recalc
- [ ] 12-month plan revised based on 6 months of real data

### 6-month win conditions

- 3 games shipped (or 2 games + 1 Steam prototype)
- 5,000+ followers
- At least one game earning real money (>$500/month sustained)
- Honest answer to "is this working?" — yes/no based on numbers, not feelings

## 12-Month Plan (2026-10-25 → 2027-04-25)

**Theme:** First real signal. By month 12, you should know whether this is a 2-year path or a 5-year path.

Even less detail here on purpose. A specific 12-month plan written today will be wrong by month 6 — you'll have data that changes everything. What matters is the shape of where you end up.

### The 12-month decision framework

By 2027-04-25, evaluate against these:

1. Is at least one game earning money? (yes/no, dollar amount)
2. Is the audience growing or flat? (followers, view trends)
3. Is the cadence holding or slipping? (clips posted, games shipped)
4. Is runway growing or shrinking? (months of expenses saved)
5. Has the quit trigger moved closer or further? (project months until hit)

**Three or more "good" answers** → continue, plan year 2.
**Two "good" answers** → continue with structural changes (scope, genre, platform, content strategy).
**One or zero** → honest conversation about whether this path is right.

### Things this plan deliberately does NOT include

- Hiring (solo discipline holds for the full 12 months)
- Quitting the day job (trigger isn't met until it is)
- Patreon, Discord server, newsletter (audience size doesn't justify them yet)
- Engine commitment beyond month 4 (don't pre-decide)
- Specific Steam game concept (hasn't earned the right yet)
- Year 2 anything (come back with data)

### Review cadence

- **Monthly:** Update completion state in the doc, snapshot follower / revenue / runway numbers.
- **Quarterly** (months 3, 6, 9, 12): Public retrospective devlog, plan revision, quit trigger recalc.
- **Annual** (month 12): Full strategic review, decide year 2 framing.
