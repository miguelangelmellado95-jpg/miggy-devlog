---
title: "Day 5.1 – Discord Mod Simulator"
date: "2026-04-25"
summary: "The Splitter enemy spawns two children when banned. The interesting part isn't the spawning — it's making the type system prevent recursion by construction, so a banned child can't spawn grandchildren no matter what the gameplay looks like."
tags: ["roblox", "luau", "devlog", "phase-2", "enemies", "type-design"]
---
Day 5.1 adds the Splitter — a wave-4+ enemy that spawns two children when banned. Hot pink, slightly bigger than a Troll, worth 30 coins to whoever finishes it. The mechanically interesting part isn't the spawn logic; it's how I made sure a banned child can't itself spawn grandchildren. The answer is a type split, not a depth counter. ✂️

## ✅ What got done today

- **Splitter enemy** — new type, hot pink, wave 4+, 15% per-slot probability via `Config.SPLITTER_CHANCE = 0.15`. Speed sits between Troll and Spammer (14 studs/s), HP 20, slightly bigger footprint than Troll so it visually reads as "the parent." Reward: 30 coins.
- **`SplitterChild` enemy** — a distinct type that only the Splitter ban hook can spawn. Carnation pink, smaller (size ratio 0.55), faster (1.35× the parent's *effective* speed, so wave multipliers carry through). RoundManager never rolls SplitterChild — that's the recursion guard. Reward: 5 coins each.
- **`spawnEnemy` extended** with three optional override args: `spawnPos`, `sizeOverride`, `speedOverride`. RoundManager calls with the original two-arg shape; the Splitter ban hook is the only caller using the overrides.
- **Splitter ban hook** in `EnemySpawner.banEnemy.OnServerEvent` — gated on `enemyPart.Name == "Splitter"`, runs *before* `Effects.HitFlash` and `Effects.BanEffect`. Looks up the parent's data row to read `parentSpeed`, then spawns 2 children at `(0, π)` radians around the ban position (`SPLITTER_CHILD_OFFSET = 4` studs apart).
- **`Effects.SplitEffect`** — pink particle puff (30 sparks, 1.8 → 0 size) plus the split sound. Fires once per split, not once per child.

## 🧠 Biggest Takeaway — recursion prevention via type design, not depth counters

The naive shape for "enemy that splits when banned" is one type with an integer attribute:

```lua
splitter:SetAttribute("SplitDepth", 0)  -- on spawn
-- on ban:
local depth = splitter:GetAttribute("SplitDepth")
if depth < MAX_DEPTH then
  spawnChild(depth + 1)
  spawnChild(depth + 1)
end
```

That works. It's also a runtime concern bleeding into a structural problem. Every system that touches enemies (ban handler, damage, status effects, spawn tracking) now needs to either know about `SplitDepth` or trust that no one else broke the limit. One day someone forgets the attribute carry-over and splits go infinite.

The version I shipped uses **two distinct types**:

| Type | Spawned by | Spawns children? |
|---|---|---|
| `Splitter` | RoundManager (`pickEnemyType` for wave 4+) | Yes — 2 on ban |
| `SplitterChild` | Splitter ban hook only | No — never |

`RoundManager.pickEnemyType` only knows about Troll, Spammer, Teleporter, and Splitter. `SplitterChild` isn't in its rotation, so it can't be wave-spawned. The Splitter ban hook is the sole producer of children — and it produces a different type than itself, so the recursion path is closed by construction. **No depth counter. No max-recursion check. Just two types and one consumer.**

This is the same shape as a lot of "self-referencing data structures should look like trees, not graphs" advice — except applied to gameplay state instead of a data structure. The structural guarantee is more durable than a runtime guard, and it costs the same number of lines.

Two other quiet decisions worth naming:

1. **Child speed scales off `parentData.speed`, not `Config.SPLITTER_SPEED`.** When wave 6 hits and the parent is moving at `14 × 1.15^5 ≈ 28` studs/s, children should inherit that scaling — otherwise late-wave splits would feel weak compared to their parents. Reading the live data table preserves wave multipliers through the split. Five-line lesson on "use the live state, not the spec value."
2. **Coin economy: parent 30, child 5.** Splitter is dangerous if left alive, so the high reward justifies the risk. Children are 5 each (10 total per split), less than just letting the parent live to pay out (30). This means you get *more* coins by NOT splitting it — Mute → Timeout → Ban once positioning is controlled. Coin economy as gameplay design.

## 🔥 Plan for Day 5.2

UI polish v1 — health bar with color thresholds, live "N left" wave count, cooldown panel that shows remaining time per tool. The cooldown panel reads `<Tool>ReadyAt` attributes off `LocalPlayer` per-frame, no remote events needed. Same Player-attribute pattern that worked for currency on Day 4.

Phase 2 enemy variety: complete. ⚒️
