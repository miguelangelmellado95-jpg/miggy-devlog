---
title: "Day 5.2 – Discord Mod Simulator"
date: "2026-04-25"
summary: "UI v1 ships — health bar, live wave count, cooldown panel. Wave 1 then looks completely broken on first load. Three fixes that didn't work, one screenshot that did, and the actual root cause: server scripts boot before client scripts and Roblox doesn't queue RemoteEvents fired before a connection exists."
tags: ["roblox", "luau", "devlog", "phase-2", "ui", "diagnostic"]
---
Day 5.2 ships UI v1 — health bar with color thresholds, live wave count, cooldown panel — and a bug that took an embarrassing number of fixes to pin down. The root cause isn't documented in most Roblox tutorials: server scripts boot before `StarterPlayerScripts` finish their `WaitForChild` chain. Any RemoteEvent fired before the client connects its handler is dropped silently. ⏱️

## ✅ What got done today

- **`HealthLabel` rebuilt as a Frame**, not a TextLabel. Has named `Fill` and `Label` children. Fill width tweens with health %; color crosses green / yellow / red at 60% / 30% thresholds. ClientMain drives the tween from `HealthChanged`.
- **Live wave count** — combines `WaveStarted` + `EnemyCountChanged` into "Wave X / Y — N left." EnemySpawner broadcasts the active count once per heartbeat tick when it changes. Spawn / destroy / zone-damage all surface live without per-event remote traffic.
- **Cooldown panel** — bottom-center frame with 4 slots (Ban / Mute / Kick / Timeout). Each slot reads `<Tool>ReadyAt` off `LocalPlayer` per-frame and dims with a remaining-seconds label.
- **Tool client scripts standardized on `<Tool>ReadyAt`** — `BanHammerScript`, `MuteGunScript`, `KickBootScript`, `TimeoutCardScript` all set `Players.LocalPlayer:SetAttribute("<Tool>ReadyAt", tick() + cooldown)` after a successful activation. Client-only attributes; don't replicate to server.
- **The wave 1 bug.** Health bar worked. Cooldown panel worked. Wave label said `"Wave 1 / 5"` (the model.json default) and never updated to `"Wave 1 / 5 — N left"` until wave 2. Took four attempted fixes before the actual diagnosis.

## 🧠 Biggest Takeaway — server scripts boot before client scripts, and Roblox doesn't queue your wave 1 events

Three fixes that didn't work, in the order I tried them:

1. **Em-dash glyph rendering.** I assumed the `—` in `"Wave 1 / 5 — 1 left"` wasn't rendering in Gotham. Swapped it for a hyphen. No change. The wave 5 screenshot later showed the em-dash rendering perfectly — symptom that didn't exist.
2. **Label width.** 240px → 280px. No change. The label was rendering its `model.json` default text the whole time, not getting truncated.
3. **Heartbeat broadcast timing.** I added an immediate `EnemyCountChanged` broadcast on `SetWaveRemaining` invocation, in addition to the heartbeat dedup. Defensive, kept it, not the cause.

What actually surfaced the bug: the wave 5 screenshot. The label was rendering the suffix correctly there. **If rendering worked at any point, the bug had to be at game-start specifically.**

The root cause: `ServerScriptService` scripts boot before `StarterPlayerScripts` finish their `WaitForChild` chain and connect their `OnClientEvent` handlers. RoundManager's `task.spawn` fires `WaveStarted` and `EnemyCountChanged` for wave 1 before the client's listener exists. **Roblox does NOT queue RemoteEvents fired before a connection is made — they're dropped silently.** The client's `renderWaveLabel` was never called for wave 1, so the label kept its `model.json` default text. By wave 2, the client was fully booted, so subsequent waves worked.

The fix:

```lua
-- in RoundManager.server.lua, top of the wave-loop task.spawn
if #Players:GetPlayers() == 0 then Players.PlayerAdded:Wait() end
task.wait(Config.PRE_WAVE_DELAY)  -- 2 seconds
```

Two lines. Two seconds buys enough time for the client to finish booting and connect its handlers. Tunable via `Config.PRE_WAVE_DELAY` if cold Studio boots get slower, or if late-joining multiplayer ever becomes a real concern.

Two lessons that survive past this specific bug:

1. **Don't trust the `model.json` default text.** When `Text = "Wave 1 / 5"` is the default, "code never ran" silently masquerades as "code ran with stale data." If the default were an empty string, the bug would have surfaced as a missing label on wave 1 — instantly diagnosable. Rule: any UI element that's expected to be populated by code should have an empty default in `.model.json`. Force the bug to surface.
2. **When your fix doesn't fix it, the model is wrong, not the implementation.** I spent three rounds treating symptoms that didn't exist (em-dash rendering, label width, heartbeat timing). The diagnostic move was the wave 5 screenshot reframing the problem — "if it works at all, when does it break?" rather than "what could be wrong with the rendering?" Cheap to remember; expensive when forgotten.

## 🔥 Plan for Day 6

Phase 2 closes here. Path variation, splitter, teleporter, all four tools, UI v1 — the game-feel pass is done. Next is the launch-prep block on the build plan: Roblox listing icons, two thumbnails, soft-launch playtesting with 10 reports collected, public Roblox launch, analytics dashboard. The game itself is mostly built; what remains is making it findable.

UI v1 shipped. Wave 1 actually renders now. Phase 2: closed. ⚒️
