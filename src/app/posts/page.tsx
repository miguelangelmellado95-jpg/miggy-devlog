import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">All Posts</h1>
        <p className="mt-3 text-zinc-400">Dev logs, lessons, experiments, and progress updates.</p>

        <div className="mt-10 space-y-4">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <p className="text-sm text-zinc-500">{post.date}</p>
              <h2 className="mt-1 text-2xl font-semibold">
                <Link href={`/posts/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-zinc-400">{post.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
