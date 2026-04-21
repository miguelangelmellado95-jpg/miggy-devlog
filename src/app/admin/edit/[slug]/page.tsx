import { notFound } from "next/navigation";
import { getPostRawBySlug } from "@/lib/posts";
import { PostForm } from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostRawBySlug(slug);
  if (!post) notFound();

  return (
    <PostForm
      mode="edit"
      originalSlug={slug}
      initial={{
        title: post.title,
        date: post.date,
        summary: post.summary,
        tagsRaw: (post.tags ?? []).join(", "),
        body: post.body,
        imageWebPath: post.image ?? null,
      }}
    />
  );
}
