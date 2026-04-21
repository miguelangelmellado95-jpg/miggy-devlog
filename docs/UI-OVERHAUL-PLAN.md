# UI Overhaul Plan — Dev Log

> **Status:** draft, awaiting answers on clarifying questions (see bottom) before kicking off Phase 0.

---

## Root Cause of Current Broken UI

The project runs **Tailwind CSS v4** but `src/app/globals.css` uses **v3 directives**:

```css
/* v3 syntax — silently ignored by v4 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

v4 requires:

```css
@import "tailwindcss";
```

Result: **zero utility classes are generated**. Every `flex`, `grid`, `bg-zinc-950`, `rounded-xl` in the codebase is a no-op. What renders in the current screenshots is only:

- Custom CSS classes defined in `globals.css` (e.g. `.gradient-text`, `.card-glow`) — these DO work
- Inline `style={{ }}` props (e.g. image sizing) — these DO work
- Browser defaults — everything else

The build succeeds and lint passes because Next.js + Tailwind don't error on an empty utility layer. This is why the issue went undetected across multiple "polish" passes.

---

## Honest Assessment of What Went Wrong

1. **No visual feedback loop.** I write layouts blind. Without seeing rendered output I can't iteratively tighten spacing, fix overflow, or validate that classes are actually applying.
2. **I layered effects on a broken foundation.** I kept adding `.gradient-text`, `.dot-grid`, and `.card-glow` (which worked) without verifying the underlying utilities (which didn't).
3. **No design system.** I invented classes ad-hoc per page instead of establishing spacing / type / color primitives first. That produces the "out of scale" feel you're seeing even where styles DO apply.
4. **Tailwind v4 is recent and I defaulted to v3 patterns.** The `@tailwind` directive is reflex muscle memory; the v4 `@import` is the correct pattern.
5. **Responsive behavior untested.** Breakpoint classes were written without being able to check 375px / 768px / 1440px viewports.

**Tech stack verdict:** the stack (Next.js 16 + React 19 + Tailwind v4 + next-themes) is modern and fine. The problem is my execution, not the tools.

---

## Phase 0 — Restore Foundation

**Goal:** make utility classes actually work. Non-negotiable prerequisite for every later phase.

**Tasks**

- [ ] Replace `@tailwind base/components/utilities` with `@import "tailwindcss";` in `globals.css`
- [ ] Delete `tailwind.config.js` (v4 uses CSS-based config, the legacy file is a footgun — I already broke it converting to ESM)
- [ ] Decide on `@tailwindcss/typography`: either wire via `@plugin "@tailwindcss/typography"` in CSS or uninstall (CLAUDE.md notes it's already unused)
- [ ] Declare design tokens in a `@theme { … }` block (colors, fonts, radii, spacing)
- [ ] Keep the existing `@custom-variant dark (&:where(.dark, .dark *))`
- [ ] `npm run dev`, screenshot homepage, confirm utilities work before continuing

**Done when:** homepage has proper dark background, flex layout works, typography renders with chosen fonts. Visible sanity check.

---

## Phase 1 — Design System & Primitives

**Goal:** stop designing ad-hoc per component. Lock a token palette and 5 primitives.

**Tokens (in `@theme`)**

- **Color layers:** `base` (#09090b), `raised` (#18181b), `overlay` (#27272a), `border` (#27272a/60)
- **Text:** `primary` (#fafafa), `secondary` (#a1a1aa), `tertiary` (#71717a), `muted` (#52525b)
- **Accent:** `accent` cyan-400 (#22d3ee), `accent-secondary` violet-400 (#a78bfa), `live` emerald-400
- **Spacing scale:** rely on Tailwind default but standardize: section padding `py-16 md:py-24`, card padding `p-5 md:p-6`, gutter `px-4 md:px-6`
- **Radii:** `sm 6px / md 10px / lg 14px / xl 20px / 2xl 28px` — pick 2-3 and stick to them
- **Type scale:** fluid using `clamp()` — h1 `clamp(2.25rem, 5vw, 4rem)`, h2 `clamp(1.5rem, 3vw, 2.25rem)`, body `1rem`
- **Motion:** `150ms cubic-bezier(0.4, 0, 0.2, 1)` for UI, `400ms` for reveals, `8s` for ambient gradients

**Primitives (in `src/components/ui/`)**

- [ ] `<Container>` — max-width wrapper with consistent gutters
- [ ] `<Card>` — standard border + bg + radius + hover state
- [ ] `<Pill>` — tag / status / tech chip
- [ ] `<SectionHeader>` — eyebrow + title + optional action
- [ ] `<Stat>` — label + number, monospace

**Done when:** every page below uses only these primitives + raw Tailwind utilities. No more hand-rolled one-offs.

---

## Phase 2 — Layout Shell

**Goal:** nav, footer, page container all locked.

- [ ] **Navbar v2:** logo, nav links, theme toggle. Mobile: hamburger → slide-in panel. Active link state.
- [ ] **Footer v2:** either minimal monospace row (current direction) or 3-column (about / links / social) — pick one and commit.
- [ ] **Page wrapper:** consistent max-width across `/`, `/posts`, `/posts/[slug]` (probably `max-w-5xl` for index pages, `max-w-2xl` for reading).
- [ ] **Skip link** + visible focus rings for keyboard nav.
- [ ] Ambient background (glow corners + dot grid + noise) applied once at layout level, not per page.

---

## Phase 3 — Homepage ("Dev HUD")

**Goal:** a homepage that says "this is a developer who ships games."

- [ ] Hero: avatar with animated ring, gradient name, status pill ("online / building"), one-line bio
- [ ] Stats strip: Logs count / Currently Building / Day N — monospace, underline in cyan
- [ ] "Now Building" feature card: gradient border, project name, milestones checklist, progress bar, external link (Roblox game), GitHub link
- [ ] Tech row: horizontal scroll of tech pills (TypeScript, Luau, Next.js, etc.)
- [ ] Latest Logs: 3-column grid on desktop, 1-col on mobile, hover lift
- [ ] Every element respects Phase 1 tokens. No inline style unless for dynamic runtime values.

---

## Phase 4 — Posts Index

**Goal:** archive that's browsable, not just a list.

- [ ] Header with total count
- [ ] Tag filter chips (click to toggle; multi-select with AND or OR — decide in questions below)
- [ ] Card grid: 2-col desktop, 1-col mobile
- [ ] Each card: cover thumb (proper aspect ratio), title, summary (2-line clamp), date, tags
- [ ] Empty state
- [ ] (Optional) sort dropdown: newest / oldest / reading time

---

## Phase 5 — Post Detail

**Goal:** great reading experience.

- [ ] Reading progress bar (exists, keep)
- [ ] Cover image with gradient fade at bottom blending into content
- [ ] Title block: tags / h1 / summary / meta row
- [ ] Prose styles: polish existing `.prose-content` — tighten line-height, code block padding, blockquote emphasis
- [ ] (Optional) Sticky table of contents on desktop ≥1280px, drawer button on mobile
- [ ] Footer: prev / next post links with titles, not just "back to logs"
- [ ] (Optional) "Share" button — copy link + X/Twitter intent
- [ ] (Optional) Related posts by shared tags

---

## Phase 6 — Micro-interactions & Polish

- [ ] Page transitions (fade on route change)
- [ ] Intersection-observer scroll reveals on card rows (one time, restrained)
- [ ] Hover states: card lift, button glow, link underline slide
- [ ] Custom 404 page on-theme
- [ ] Loading skeletons for post list (in case we add async data later)

---

## Phase 7 — Responsive QA

**Goal:** nothing overlaps, nothing overflows, nothing looks out of scale.

- [ ] Manual pass at 320 / 375 / 414 / 768 / 1024 / 1440 / 1920
- [ ] Verify touch targets ≥ 44px
- [ ] Verify no horizontal overflow on any page at any width
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95
- [ ] Keyboard nav: tab through every interactive element, visible focus ring
- [ ] Test dark & light if we keep both

---

## Out of Scope This Overhaul

- Admin `/admin/new` posting UI
- Comments (Giscus)
- Full-text search
- Analytics
- RSS feed (nice to add later but not blocking)

---

## Open Decisions (need answers before Phase 0)

1. **Aesthetic direction** — pick one axis:
   - (a) **Heavy HUD / gamer** — neon cyan, heavy monospace, corner brackets, glitch effects, scanlines. Think Destiny / Valorant / Cyberpunk 2077 menus.
   - (b) **Modern minimal + gamer accents** — clean typography-forward layout like leerob.io / brittanychiang.com / rauchg.com, with subtle gaming touches (monospace timestamps, cyan accents, status pills).
   - (c) **Blend** — tell me which elements from (a) to sprinkle on top of (b).

2. **Light mode** — do you actually want a polished light theme, or are we dark-only? (Light mode roughly doubles the styling work.)

3. **Component library** — hand-roll everything, or adopt `shadcn/ui` as the primitive layer? shadcn gives us battle-tested a11y + responsive primitives we own/customize, and would cut Phase 1 roughly in half.

4. **Reference sites** — drop 2-3 URLs whose UI you want to pull from. Specific > abstract.

5. **HUD widgets on homepage** — any of these interest you? Currently listening (Spotify), now playing (Steam), commits this week, typing speed, uptime since Day 1, weather in your city. Pick 0-2; skipping all is fine.

6. **Priority order** — is the homepage the most important to nail first, or the post detail page (since that's where people actually read)?

7. **Tag filter behavior on posts index** — single-select (click one tag = only that tag), multi-select AND, or multi-select OR?

---

## Execution Contract

- Each phase ends with: a dev-server screenshot, a short note on what changed, a ✓ in this doc.
- I don't start Phase N+1 until Phase N is checked off and you've seen the screenshot.
- If I can't visually verify a phase is working, I tell you — I don't claim "done" when I only mean "compiled."
