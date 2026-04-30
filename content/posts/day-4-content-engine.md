---
title: "Day 4 – Content Engine"
date: "2026-04-25"
summary: "YouTube's API can't tell you what trended in one call. `search.list` returns titles; `videos.list` returns view counts. Two calls and 101 quota units later, the scraper landed 25 rows alongside Reddit's — plus a Windows codec error and HTML entities I had to scrub on the way."
tags: ["python", "content-engine", "devlog", "youtube", "api", "day-4"]
---
The YouTube Data API has a search endpoint that returns titles, descriptions, and channels. It does not return view counts, like counts, or comment counts. To get those you make a second batched call to a different endpoint — and the whole "what's trending right now?" story takes two API calls instead of one, at 101 quota units against a 10k daily budget. 📹

## ✅ What got done today

- **`scrapers/youtube.py`** — `fetch_trending_videos(query, max_results)` using YouTube Data API v3. Two-call: `search.list` to find videos by query, `videos.list` (batched by id, comma-joined) to pull engagement stats. Returns dicts pre-shaped to the `raw_posts` schema. Same dedup contract as Reddit; same caller in `main.py`.
- **`main.py` updates** — `scrape` got a `--query` flag and a wired YouTube branch alongside Reddit. `query` got rewired to actually call `db.database.get_posts` and print formatted `[score] title` + url. Both Day 1 stubs are now real.
- **`README.md`** — public-facing setup, credentials table, usage examples, project-state checklist. Distinct from `CLAUDE.md` (internal Claude-session context — same project, two audiences, no cross-references).
- **Repo flipped `master` → `main`.** Four commands: `git branch -m`, `git push -u origin main`, `gh repo edit --default-branch main`, `git push origin --delete master`. Repo is now `https://github.com/MiggyDev619/content-engine`, public, on `main`. GitHub keeps redirects on the old refs indefinitely.
- **Live-verified end-to-end.** `scrape --source youtube --query "roblox game dev" --limit 25` landed 25 rows. Re-ran immediately — 0 new rows. DB now holds 25 reddit + 25 youtube. `query --top 5 --source reddit` returned five real titles from yesterday's scrape.

## 🧠 Biggest Takeaway — the YouTube API split (and why it costs 101 quota units)

Most "trending" APIs let you ask the question in one call. YouTube's Data API doesn't. It's split along an axis you don't notice from the docs until you're staring at a `search.list` JSON response and there's no `viewCount` field anywhere:

- **`search.list`** — _matching_. Pass a query, get back IDs + titles + descriptions + channel names. Costs **100 quota units** per call.
- **`videos.list`** — _stats_. Pass a comma-separated list of IDs, get back view / like / comment counts. Costs **1 quota unit** per call, regardless of how many IDs you batch in.

If your goal is "show me the top videos for this query right now," neither call is enough on its own. You need both. The pattern in code:

```python
# 1. find the candidates (100 units)
search_resp = youtube.search().list(
    q=query, part="snippet", type="video", maxResults=max_results,
).execute()
ids = [item["id"]["videoId"] for item in search_resp["items"]]

# 2. fetch stats for all of them in one batched call (1 unit)
videos_resp = youtube.videos().list(
    part="snippet,statistics", id=",".join(ids),
).execute()
```

Total: 101 units per scrape, against a 10k daily quota. That's <1% per run — comfortable headroom even if I scrape ten queries a day.

Once you stop fighting the design, the reason it's split this way is reasonable: search is genuinely expensive (full-text indexes, ranking, freshness), so it's metered hard; the per-video stat lookup is a key/value fetch on a different system, so it's metered cheaply. Trying to design around that — scraping the web front page, dropping the engagement stats — either breaks ToS or kills the trend signal I'm building this whole pipeline to capture. So 101 it is.

Two other small things from the day, easy to lose otherwise:

1. **`UnicodeEncodeError` on emoji titles, fixed in one line.** YouTube titles routinely contain `😱` / `💀` / `😹`, and Windows' default cp1252 stdout codec can't encode them. The first scrape printed three rows then died with `'charmap' codec can't encode character`. Fix at the top of `main.py`:
   ```python
   sys.stdout.reconfigure(encoding="utf-8", errors="replace")
   ```
   One line, fixes every downstream `print` and every CLI subcommand. Probably belongs at the top of every Python script I run on Windows.
2. **HTML-entity-encoded titles.** YouTube returns `Exposing Roblox&#39;s Richest Player` instead of `Exposing Roblox's Richest Player`. Caught it on the first `query` output. Fix: `html.unescape()` on `title` and `description` in the scraper. Cleared the 25 dirty rows, re-scraped clean. The lesson is one I keep relearning: APIs return text the way the source database stored it, not the way you'd want it rendered.

## 🔥 Plan for Day 5

Phase 1's "multi-source scrape" goal is 2 of 3 done. One source left:

- **TikTok via Apify.** Custom scrapers don't survive TikTok's anti-bot for long, so the plan from Day 1 was always to delegate to an Apify actor (~$5/mo). New `scrapers/tiktok.py` calling the actor's API; same `list[dict]` contract as Reddit and YouTube. Same dedup story.

There's also one non-coding question worth answering before the analyzer arrives: Reddit upvotes and YouTube view counts both land in the `likes` column right now, and they don't mean the same thing. A `query --top 5` across sources currently ranks YouTube above Reddit because views >>> upvotes. Needs either a per-source ranking or a normalized score before cross-platform analysis is meaningful. Filed for the Week 3 analyzer; not blocking today.

Two of three sources live. The pipeline is feeding itself. 🧪
