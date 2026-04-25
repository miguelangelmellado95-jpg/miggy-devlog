---
title: "Day 5 – Discord Mod Simulator"
date: "2026-04-25"
summary: "Teleporter enemy lands, plus the first deliberate exception to the server-authoritative rule. Kick aim moves to a client-sent vector because body-rotation aiming was UX-broken — and the threat-model math says the trade is fine."
tags: ["roblox", "luau", "devlog", "phase-2", "enemies", "server-authority"]
---
Day 5 ships the Teleporter enemy and breaks one of the rules I wrote down on Day 2. The Kick tool now reads the player's camera vector from the client, not the server — and that's the right call, even though every other destructive tool reads geometry server-side. 🌀

## ✅ What got done today

- **Teleporter enemy 🟣** — bright violet, wave 3+, 20% per-slot probability via `Config.TELEPORTER_CHANCE = 0.2`. Slow on foot (10 studs/s, slower than a Troll) but warps `TELEPORTER_DISTANCE = 22` studs toward the zone every 2.0 seconds. Frozen blocks the warp; Mute does not.
- **`Effects.TeleportEffect(startPos, endPos)`** — two-anchor purple particle burst with PointLight glows at both ends. Sound plays at arrival only — silent depart, audible arrive.
- **Per-enemy state on the spawner's `activeEnemies` data table**, not on Roblox attributes. Teleporter's `nextTeleport` timer is a private spawner concern. Rule that fell out: attributes for cross-script-boundary state (status effects), data tables for private spawner state.
- **Kick aim fix.** Switched from server-side `HumanoidRootPart.CFrame.LookVector` to client-sent camera `LookVector`. Server validates the vector is roughly unit-length (`0.5 < magnitude < 1.5`) and horizontal (`abs(Y) < 0.5`), then flattens it before using as the cone direction.
- **`KickBootScript.client.lua`** — reads `Workspace.CurrentCamera.CFrame.LookVector`, flattens to horizontal, normalizes, sends as `kickEnemies:FireServer(lookDir)`. Bails early if magnitude < 0.01 (player looking straight up/down — no horizontal aim).
- **`CLAUDE.md` updated** — documents the Kick aim exception explicitly so the rule's edges stay visible in the next session.
- **Coin reward `COIN_TELEPORTER = 25`** — between Spammer (20) and the future Splitter (30). Harder to catch, pays a bit more.

## 🧠 Biggest Takeaway — when the server-authoritative rule earns an exception

The rule for destructive tools, since Day 2: client picks a target and sends the request, server validates everything (range, target type, geometry), server destroys. Every tool through Day 4 follows it. Mute, Timeout, Ban — same shape. Kick shipped on Day 4 with empty payload — `kickEnemies:FireServer()` with no args. Server read `HumanoidRootPart.CFrame.LookVector` and built the cone from there. Cleanest possible payload, zero spoofing surface. Textbook.

It didn't work.

In Roblox, the player's body rotation only updates while they're moving. Standing still and rotating the camera leaves the body facing the previous direction. So you'd line up a clear shot, click Kick, and the cone would fire at where you were facing _ten seconds ago_ — meaning, at nothing. Whiff. Repeat. Tool feels broken.

The server can't read the client's camera. It only knows about the character. So the fix is to flip Kick's payload: client now sends the camera-derived `LookVector`, server validates the vector and uses it as the cone direction.

**Why this is fine, despite breaking the rule:**

1. **Threat model.** The worst-case spoof is "kicked enemies behind you" — a UX papercut, not an exploit. Kick is non-destructive (no damage, no rewards, no kill), so a malicious client can't grief or farm anything. Compare: Ban-Hammer-with-arbitrary-range would be exploitable; Kick-with-arbitrary-cone is annoying.
2. **Validation isn't gone.** Server still sanity-checks the vector — magnitude must be roughly 1.0, horizontal component dominant, and the result gets flattened before use. That filters the obvious griefs (teleport-cone, vertical-cone) without trying to validate what the client "should" be looking at.
3. **The rule has an exception, not a hole.** Documented in `CLAUDE.md` so the next time I extend the toolkit, the boundary is clear: read from the server when you can; read from the client when the server doesn't have the data; validate either way.

Two other small things worth naming:

1. **Frozen blocks the warp; Mute doesn't.** Timeout fully pauses an enemy — including its warp tick. Mute slows movement, but a slowed Teleporter should still warp (just slower in between). Falls out of the existing status priority ladder without inventing a new mechanic. Timeout becomes the right counter to Teleporter; Mute is deliberately weaker against this enemy type. Gameplay differentiation for free.
2. **Two-anchor teleport burst, asymmetric audio.** First draft fired the same burst at depart and arrive — symmetric, boring. The split version (silent vanish, audible arrive) reads as "where did they go?" → "oh — there." Asymmetric effects narrate the action; symmetric ones flatten it.

## 🔥 Plan for Day 5.1

The Splitter — wave 4+ enemy that spawns two children when banned. The challenge isn't the spawning; it's making sure the children can't themselves spawn children (no infinite recursion). Solving it with a runtime depth counter is one path; solving it with a type split is cleaner. Going with the second.

Phase 2 enemy variety, halfway done. ⚒️
