---
title: "Day 5 – Content Engine (the pivot)"
date: "2026-04-25"
summary: "Today I deleted four days of working code. The scraper that landed 25 reddit + 25 youtube rows yesterday is gone, the pattern-clustering schema is gone, and the six-week roadmap I wrote on Day 1 is in the trash. It's the right call — the original pipeline was solving the wrong problem."
tags: ["python", "content-engine", "devlog", "pivot", "cross-poster", "day-5"]
---
Today I deleted four days of working code. The scraper that landed 25 reddit + 25 youtube rows yesterday is gone, the pattern-clustering schema is gone, and the six-week roadmap I wrote on Day 1 is in the trash. It's the right call. 🪦

## ✅ What got done today

- **Archived the old DB before nuking it.** `cp content.db content.db.archive-pre-pivot` — 50 rows of real Reddit + YouTube data, cost nothing to keep, useful as evidence the old pipeline actually worked end-to-end.
- **Deleted `scrapers/`** — both `reddit.py` and `youtube.py`, the entire directory. Dropped the `raw_posts` and `patterns` tables from `db/schema.sql`. No fallback, no half-deprecation, no "we might come back to this." Same discipline as ripping PRAW out on Day 3.
- **New schema.** Four tables. `clips` (file path + metadata, `UNIQUE(file_path)`), `captions` (multiple drafts per clip per platform, no unique — that's the feature), `schedules` (queued posts, `UNIQUE(clip_id, platform, scheduled_for)` + `CHECK (status IN ('queued', 'posted', 'failed'))`), `metrics` (per-snapshot time series, no unique). Same `INSERT OR IGNORE` discipline; same one-file-per-concern structure.
- **New CLI scaffold.** `clip add`, `caption draft`, `schedule`, `queue`, `metrics pull`, `metrics record`, `metrics show`. Most are stubs today — Day 1 of the new direction is about the schema and the surface, not full implementation.
- **`clip add` works end-to-end.** Registered a test clip with `python main.py clip add ./test.mp4 --title "smoke test" --duration 22 --notes "..."`, confirmed it landed in `clips` with the right shape. That's the vertical-slice deliverable for Day 1.
- **`PLATFORM_SPECS` constant** in `platforms.py` — aspect ratio, length cap, hashtag rules, link policy per platform (TikTok / Shorts / Reels / Twitter). Printed at `schedule` time as a manual-upload checklist for now.
- **`--caption-id` required on `schedule`.** No implicit "latest" — the kind of convenience that ships the wrong caption at 11pm. Schema + CLI enforce intent over memory.

## 🧠 Biggest Takeaway — the original pipeline was solving the wrong problem

The Day 1 plan was: **scrape → cluster patterns → draft platform-specific posts.** It assumed the bottleneck for a faceless gamedev account was *ideas* — what to talk about. So I spent four days building infrastructure to surface trending content from Reddit and YouTube and turn those signals into draft posts.

Wrong bottleneck.

The actual bottleneck for a solo gamedev launching a faceless account is *gameplay clips.* You don't have anything to talk about until you have something to **show.** And the algorithms on TikTok / Shorts / Reels actively suppress posts that pattern-match across accounts as "scraped trend, AI draft" — the reach drops, the comments don't land, the format reads as content marketing instead of content.

So the right tool for this stage of the project is much smaller than what I was building:

1. **Cross-posting** — record a clip once, send it to TikTok + Shorts + Reels + X with per-platform formatting tweaks.
2. **Scheduling** — batch-record on Sunday, queue the week.
3. **Asset generation** — captions and hooks via Claude as a brainstorming partner, not autopilot.
4. **Analytics aggregation** — per-platform metrics in one CLI table so I don't have to open four apps to see what's working.

That's a one-weekend project, not a six-week pipeline. The six-week roadmap was a different project, for a different goal, that I shouldn't have been building.

Two things worth naming about the pivot itself:

1. **The parts that survived weren't the obvious ones.** The scrapers got deleted. The schema got rewritten. But what stayed: SQLite via raw `sqlite3`, the `INSERT OR IGNORE` dedup pattern, the Click CLI shape, `.env` loading, the Anthropic SDK setup with the Opus 4.7 quirks doc, and the hybrid model strategy in spirit (Opus 4.7 for hook brainstorming where quality matters; Sonnet 4.6 for mechanical platform-specific reformatting). The *plumbing* was right; the *direction* was wrong. Recognizing the difference is what made this a one-day pivot instead of a one-week rewrite.
2. **The pivot was cheap because the project had no external dependencies.** Five days old, public for one day, zero clones. Nobody had built anything on top of the old API. Pivots get exponentially more expensive once a tool has users — which is exactly the argument for shipping smaller and earlier, so when the direction is wrong you find out before the cost of being wrong gets steep.

## 🔥 Plan for Day 6

`caption draft <clip-id>` — wire up the Anthropic call. Two prompts: one for hook brainstorming (Opus 4.7, where the quality of the hook matters most), one for platform-specific reformat (Sonnet 4.6, mechanical rewrite from a master caption to TikTok / Shorts / Reels / X variants). Token-tracking columns from the old schema carried straight into `captions` — `model_used` / `input_tokens` / `output_tokens` were the one good idea worth keeping verbatim.

After that: record one real DMS clip on Sunday, run it through the full flow, post it manually, record metrics by hand. End-to-end on one real clip is the next milestone.

Four days of code deleted. One weekend of code ahead. Net direction: positive. 🧪
