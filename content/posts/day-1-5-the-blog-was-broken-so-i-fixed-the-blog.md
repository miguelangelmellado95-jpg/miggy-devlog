---
title: "Day 1.5 – The blog was broken, so I fixed the blog"
date: "2026-04-21"
summary: "Small detour from the game. Turns out my \"modern\" dev blog was rendering with zero Tailwind utilities because of a v4/v3 mismatch. Rebuilt it on Tailwind v4 + shadcn and added a one-click posting flow so I stop editing markdown files by hand."
tags: ["devlog", "nextjs", "tailwind", "shadcn"]
image: "/images/posts/day-1-5-the-blog-was-broken-so-i-fixed-the-blog.png"
---
Plan for today was enemy spawning. Plan got hijacked.

  I kept shipping "polish" passes on the blog and the screenshots kept looking like WordPress in 2007. I blamed myself. Turns out the build was the saboteur.

  ## 🕵️  The bug

  The project is on Tailwind CSS **v4**, but `globals.css` was using **v3 syntax**:

  ✅ What got done today

  - Ripped out the broken v3 config, migrated everything to v4
  - Dropped next-themes + the typography plugin → committed to dark-only
  - Installed shadcn/ui primitives (Button, Card, Badge, Container, etc.) so future pages don't get invented from scratch each time
  - Rebuilt the homepage as a "Dev HUD" — cursor-follow glow, animated gradient-border feature card with corner brackets, stats strip, progress bar
  - Shipped /admin/new — password-protected form that commits markdown straight to the repo via the GitHub API. Vercel picks up the push and redeploys.

  🔥 Back to Day 2 tomorrow

  - Enemy spawning 👾
  - Ban Hammer tool 🔨
  - Server health + win/lose ❤️ 

  This post itself is the first one made via the new /admin/new endpoint. If you're reading this, it worked.
