import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 pt-14 pb-24">

        {/* Back link */}
        <div>
          <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-cyan-400 transition-colors duration-150 mb-10"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Posts
          </Link>
        </div>

        <article>

          {/* Header */}
          <header className="mb-12">
            <time className="font-mono text-xs text-zinc-600 uppercase tracking-wider block mb-4">
              {formatDate(post.date)}
            </time>

            <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 leading-snug mb-4">
              {post.title}
            </h1>

            {post.summary && (
              <p className="text-base text-zinc-400 leading-relaxed mb-5">
                {post.summary}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 font-mono text-xs rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Cover image */}
          {post.image && (
            <div className="mb-10 rounded-xl overflow-hidden border border-zinc-800">
              <img
                src={post.image}
                alt={post.title}
                style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-zinc-800 mb-10" />

          {/* Content */}
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-zinc-800">
            <Link
              href="/posts"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-cyan-400 transition-colors duration-150"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all posts
            </Link>
          </div>

        </article>
    </div>
  );
}
