import Image from "next/image";

import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">Miggy Dev Log</h1>
        <p className="mt-4 text-zinc-400 max-w-2xl">
          Documenting my game development journey, experiments, wins, bugs,
          lessons learned, and progress as I build.
        </p>

        <div className="mt-8">
          <Link
            href="/posts"
            className="inline-block rounded-lg bg-zinc-100 text-zinc-900 px-4 py-2 font-medium hover:bg-zinc-300"
          >
            View all posts
          </Link>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold">Recent posts</h2>

          <div className="mt-6 space-y-4">
            {posts.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <p className="text-sm text-zinc-500">{post.date}</p>
                <h3 className="mt-1 text-xl font-semibold">
                  <Link href={`/posts/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-zinc-400">{post.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
