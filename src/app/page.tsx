import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

const TECH = ["TypeScript", "Roblox / Luau", "Next.js", "Node.js", "AI workflows"];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 flex flex-col items-center text-center">

        {/* Avatar */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-cyan-400/40 ring-offset-4 ring-offset-zinc-950">
            <img
              src="/images/avatar.gif"
              alt="Miggy"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-zinc-950"
            title="Currently building"
          />
        </div>

        <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">
          hey, i&apos;m
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 tracking-tight mb-4">
          Miggy
        </h1>
        <p className="text-zinc-400 text-lg max-w-sm leading-relaxed mb-2">
          Software engineer building games, tools & experiments.
        </p>
        <p className="font-mono text-sm text-zinc-600 mb-8">
          Build fast. Ship often. Learn in public.
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TECH.map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Currently Building */}
        <div className="w-full max-w-sm border border-cyan-400/20 bg-cyan-400/5 rounded-2xl p-5 text-left">
          <p className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">
            Currently Building
          </p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-zinc-100 text-sm mb-1">
                🎮 Discord Mod Simulator
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Wave-based survival on Roblox · Social commentary + humor
              </p>
            </div>
            <Link
              href="/posts"
              className="shrink-0 font-mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap mt-0.5"
            >
              Dev Log →
            </Link>
          </div>
        </div>

      </section>

      {/* ── Latest Posts ──────────────────────────────────────────────── */}
      <section className="pb-24">
        <h2 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6">
          <span className="text-cyan-400">▸</span> Latest Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-sm text-zinc-600 py-12 text-center">No posts yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.slice(0, 5).map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group flex items-stretch border border-zinc-800 hover:border-cyan-400/30 bg-zinc-900/40 hover:bg-zinc-900/70 rounded-xl overflow-hidden card-glow"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: '128px', height: '96px', objectFit: 'cover', flexShrink: 0, display: 'block' }}
                  />
                )}
                <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <h3 className="font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors duration-150 mb-1.5 leading-snug">
                      {post.title}
                    </h3>
                    {post.summary && (
                      <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                        {post.summary}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap mt-4">
                    <time className="font-mono text-xs text-zinc-600">
                      {formatDate(post.date)}
                    </time>
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 font-mono text-xs rounded bg-zinc-800 text-zinc-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.length > 5 && (
          <div className="mt-6">
            <Link
              href="/posts"
              className="font-mono text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all {posts.length} posts →
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}
