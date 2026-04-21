import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-14 md:py-20">

      {/* Header */}
      <div className="mb-12 pb-8 border-b border-zinc-800">
        <div className="inline-flex items-center gap-2 mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
          <span>▸</span> Archive
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 tracking-tight mb-3">
          All <span className="gradient-text">Logs</span>
        </h1>
        <p className="font-mono text-sm text-zinc-500">
          {posts.length} {posts.length === 1 ? "entry" : "entries"}
          <span className="mx-2 text-zinc-700">/</span>
          newest first
        </p>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <p className="text-sm text-zinc-600 py-16 text-center font-mono">
          {"// archive empty"}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group flex items-stretch border border-zinc-800 hover:border-cyan-400/30 bg-zinc-900/40 hover:bg-zinc-900/70 rounded-xl overflow-hidden card-glow"
            >
              {post.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: "128px",
                    height: "104px",
                    objectFit: "cover",
                    flexShrink: 0,
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "128px",
                    height: "104px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #18181b, #09090b)",
                    borderRight: "1px solid #27272a",
                  }}
                >
                  <span style={{ fontSize: "1.5rem", opacity: 0.4 }}>🎮</span>
                </div>
              )}
              <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <h2 className="font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors duration-150 mb-1 leading-snug">
                    {post.title}
                  </h2>
                  {post.summary && (
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                      {post.summary}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2.5 flex-wrap mt-3">
                  <time className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                    {formatDate(post.date)}
                  </time>
                  {post.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 font-mono text-[10px] rounded bg-zinc-800/70 text-zinc-500"
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

    </div>
  );
}
