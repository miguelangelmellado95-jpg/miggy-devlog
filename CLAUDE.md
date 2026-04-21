# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # start dev server (Next.js 16, port 3000)
npm run build     # production build
npm run lint      # ESLint
```

No test suite is configured.

## Architecture

This is a statically-generated devlog built with **Next.js 16**, **Tailwind CSS v4**, and **next-themes**.

**Content pipeline:** Markdown files in `content/posts/` are read at build/request time by `src/lib/posts.ts` using `gray-matter` (frontmatter) and `remark`/`remark-html` (body → HTML). There is no database or CMS.

**Post frontmatter shape:**
```yaml
title: string
date: "YYYY-MM-DD"
summary: string
tags: string[]   # optional
```

**Routing:**
- `/` — homepage, shows 5 most recent posts (`getAllPosts()` sorted by date desc)
- `/posts` — full post list
- `/posts/[slug]` — individual post; `params` is a `Promise` and must be `await`ed (Next.js 16 async params)

**Theme:** `next-themes` with `attribute="class"`. The `<html>` element gets `suppressHydrationWarning`. Components that read `theme` must be `'use client'` and guard renders with a `mounted` state to prevent hydration mismatches.

**Prose styling:** Markdown HTML is injected via `dangerouslySetInnerHTML` inside a `<div className="prose-content">`. All prose typography is defined manually in `src/app/globals.css` under `.prose-content` (dark mode via `html.dark .prose-content`). The `@tailwindcss/typography` package is installed but **not used** — do not add `prose` classes.

**Tailwind v4 note:** Dark mode is declared with `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css`, not in a config file.
