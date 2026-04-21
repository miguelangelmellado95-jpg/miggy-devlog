import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-14 md:py-20">

      {/* Header */}
      <div className="mb-10 pb-10 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">
          All Posts
        </h1>
        <p className="font-mono text-sm text-zinc-600">
          {posts.length} {posts.length === 1 ? "entry" : "entries"}
        </p>
      </div>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <p className="text-sm text-zinc-600 py-12 text-center">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group flex items-stretch border border-zinc-800 hover:border-cyan-400/30 bg-zinc-900/40 hover:bg-zinc-900/70 rounded-xl overflow-hidden card-glow"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '128px', height: '96px', objectFit: 'cover', flexShrink: 0, display: 'block' }}
                />
              ) : (
                <div style={{ width: '128px', height: '96px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #27272a, #18181b)' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎮</span>
                </div>
              )}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors duration-150 mb-1.5 leading-snug">
                    {post.title}
                  </h2>
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

    </div>
  );
}
