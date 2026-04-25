---
title: "Day 6 – Content Engine"
date: "2026-04-25"
summary: "Drafted 10 short-form video clips for the MiggyDev brand, then spent the most-valuable hour of the session auditing each clip against the actual DMS source. Two clips had inverted premises, one referenced code that never existed, two oversold their visuals. A content plan written from notes alone is a draft."
tags: ["python", "content-engine", "devlog", "content-strategy", "audit"]
---
Day 6 isn't a code day — `caption draft` is still stubbed. Today was content strategy: drafting 10 short-form video clips for the MiggyDev brand as the next vertical-slice input for the cross-poster, then auditing each clip against the actual Discord Mod Simulator source. The audit caught five material issues that wouldn't have surfaced any other way. 🎬

## ✅ What got done today

- **`docs/clips.md`** — working planning document for the first 10 short-form clips. Per-clip specs (audience, hook copy, body, caption shape, why-it-works, recording requirements), the full Mon/Wed/Fri × ~3.3-week posting schedule, the Sunday batch capture session plan, and a cut-to-6 list for if reality eats four slots.
- **Audience split: 5 player / 5 dev**, not weighted toward dev. Dev material is stronger right now (concrete bugs, decisions, code) but player material matters more long-term for actual user growth. Forcing equal coverage prevents the trap of only recording what's already easy to capture.
- **Loadout reveal slot 01, Phase 1 recap slot 10.** Strongest scroll-stopper at the top because algorithmic surfacing favors recent uploads, and "more from this account" pulls clip 01 forward when a stranger discovers any other clip in the rotation. A recap pays off only if the audience exists.
- **The whiff bug clip is non-negotiable, slot 5.** Faceless dev accounts that show only polished wins lose trust within the first ten clips. One "here's what's still broken" slot — not at the start (sets the wrong tone) and not at the end (looks like an apology) — buys credibility for everything that surrounds it.
- **Cross-repo correction:** initially wrote `clips.md` into the DMS repo (proximity bias — I was reading DMS source). Moved it to `content-engine/docs/` after recognizing the architectural mistake. DMS owns game work; content-engine owns content-pipeline planning. File-on-disk handoff between the two preserved.

## 🧠 Biggest Takeaway — audit your content plan against the actual code, before recording

After locking the 10-clip plan, I read each clip's spec against the actual DMS source. Found five material issues:

1. **Clip 02 caption was backwards.** Spec said "Kick gets eaten by the slow." Actual status priority is `Kick > Timeout > Mute > seek` (`EnemySpawner.server.lua:181-195`). Kick *overrides* Mute, not the inverse. Caption rewrite required before posting.
2. **Clip 02 coin payoff doesn't fire on Kick.** Coins are awarded only in `banEnemy.OnServerEvent`. Kick is non-destructive. If the chain ends on Kick, the "+coins" floater never appears. Decision needed: end on Kick (no payoff) or on Ban (real popup).
3. **Clip 03 has no "before" version in the repo.** `git log --follow` on `BanHammerScript.client.lua` shows it already used `Humanoid.CameraOffset` from the initial commit. The CFrame-tween version was never committed — has to be **written from scratch** on a throwaway branch, not restored.
4. **Clip 08 premise is structurally false.** DMS sends `kickEnemies:FireServer(lookDir)` (Vector3 payload, not empty) and the server reads the *client's* vector. The whole "empty packet, server-derived geometry" hook is the inverse of reality. Recommend deferring for a deliberate reconception.
5. **Clips 04 & 07 oversell their visuals.** Both spec a "screen flash"; actual DMS behavior is just a label color change in the existing `HealthLabel` / `WaveLabel` slots. No full-screen overlay exists. Decision: accept smaller visuals or build a 20-min `FlashOverlay` Frame that does double duty.

None of these would have been caught without reading the source against the spec. **A content plan written from devlog notes alone is a draft. Audit before recording, always.**

The lesson generalizes past this session: the `Hooks for the post` section that gets written at the end of every DEVLOG entry is *content-shaped*, but it's optimized for a blog audience, not a 30-second video. The translation is non-trivial — "Kick > Timeout > Mute" reads as architecturally clean in a blog post, but in a 30-second clip you have to *show* it, and showing requires the gameplay to actually do what the spec says it does. Two different fidelities, two different audits.

Two other quiet decisions worth naming:

1. **Clip planning lives in `content-engine`, not in `discord-mod-simulator`.** The clips ARE gameplay from DMS, but the *plan* is content-pipeline input — the same data shape the eventual `caption draft`, `schedule`, and `metrics` commands will operate on. Putting `clips.md` in DMS would couple the two repos via a working planning doc that gets edited weekly. Keeping it in content-engine respects the integration-points rule — file-on-disk handoffs between repos, no cross-project writes for unrelated work. DMS's `docs/` stays game-focused; content-engine's `docs/` holds content-pipeline planning.
2. **Captions stay platform-agnostic in `clips.md`.** The per-platform rewrite (TikTok hashtag count vs IG vs X length limits vs Shorts pinned-comment style) is the `caption draft` command's job — currently a stub but the next vertical slice. Drafting platform-specific captions now would force a rewrite when that command lands. Don't pre-decide what a future tool's input shape needs to be.

## 🔥 Plan for Day 7

Sunday recording session — ~2 hours, all 10 clips' raw material captured in one batch in DMS. Two captures need temporarily-restored or written-from-scratch code (camera-shake bad version, kick whiff with sound); ~30 min round-trip overhead. Editing pipeline lives on a separate day — cyan/violet overlay text, MiggyDev corner mark, voiceover layered where applicable.

After that: back to code. `caption draft` is the next vertical slice. The clip plan is the input it'll consume.

10 clips planned, 5 audit fixes filed. Content factory armed. 🧪
