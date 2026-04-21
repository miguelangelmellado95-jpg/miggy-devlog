"use server";

import { Octokit } from "@octokit/rest";
import { Buffer } from "node:buffer";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import { passwordMatches } from "@/lib/admin-auth";
import { slugify } from "@/lib/slugify";

export type DeleteResult =
  | { ok: true; slug: string; commitUrl: string; commitSha: string }
  | { ok: false; error: string };

export type UpdateResult =
  | {
      ok: true;
      slug: string;
      previousSlug: string;
      commitUrl: string;
      commitSha: string;
    }
  | { ok: false; error: string };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_BODY_BYTES = 200 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

function buildFrontmatter(args: {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  image?: string;
}): string {
  const lines = [
    "---",
    `title: ${JSON.stringify(args.title)}`,
    `date: ${JSON.stringify(args.date)}`,
    `summary: ${JSON.stringify(args.summary)}`,
  ];
  if (args.tags.length > 0) {
    lines.push(
      `tags: [${args.tags.map((t) => JSON.stringify(t)).join(", ")}]`,
    );
  }
  if (args.image) {
    lines.push(`image: ${JSON.stringify(args.image)}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8);
}

function isValidDate(d: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const parsed = new Date(`${d}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime());
}

export async function deletePost(formData: FormData): Promise<DeleteResult> {
  try {
    const password = String(formData.get("password") ?? "");
    if (!passwordMatches(password, process.env.POST_PASSWORD)) {
      return { ok: false, error: "Wrong password." };
    }

    const slug = String(formData.get("slug") ?? "").trim();
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return { ok: false, error: "Invalid slug." };
    }

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_BRANCH ?? "main";
    if (!token || !owner || !repo) {
      return {
        ok: false,
        error:
          "Server misconfigured: missing GITHUB_TOKEN / GITHUB_REPO_OWNER / GITHUB_REPO_NAME.",
      };
    }

    const octokit = new Octokit({ auth: token });
    const markdownPath = `content/posts/${slug}.md`;

    // 1. Read the current markdown to find the cover image path (if any)
    let imagePath: string | null = null;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: markdownPath,
        ref: branch,
      });
      if (Array.isArray(data) || !("content" in data)) {
        return { ok: false, error: "Unexpected content at post path." };
      }
      const md = Buffer.from(data.content, "base64").toString("utf-8");
      const parsed = matter(md);
      const image = (parsed.data as { image?: string }).image;
      if (image && image.startsWith("/")) {
        imagePath = `public${image}`;
      }
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status === 404) return { ok: false, error: "Post not found." };
      throw err;
    }

    // 2. Atomic tree commit that deletes both files
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const baseSha = refData.object.sha;

    const { data: baseCommit } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: baseSha,
    });
    const baseTreeSha = baseCommit.tree.sha;

    const tree: {
      path: string;
      mode: "100644";
      type: "blob";
      sha: string | null;
    }[] = [
      { path: markdownPath, mode: "100644", type: "blob", sha: null },
    ];
    if (imagePath) {
      tree.push({ path: imagePath, mode: "100644", type: "blob", sha: null });
    }

    const { data: newTree } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree,
    });

    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `chore: delete post ${slug}`,
      tree: newTree.sha,
      parents: [baseSha],
    });

    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    revalidatePath("/admin");
    revalidatePath("/posts");
    revalidatePath("/");
    revalidatePath(`/posts/${slug}`);

    return {
      ok: true,
      slug,
      commitSha: newCommit.sha,
      commitUrl: `https://github.com/${owner}/${repo}/commit/${newCommit.sha}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: `Delete failed: ${message}` };
  }
}

export async function updatePost(formData: FormData): Promise<UpdateResult> {
  try {
    const password = String(formData.get("password") ?? "");
    if (!passwordMatches(password, process.env.POST_PASSWORD)) {
      return { ok: false, error: "Wrong password." };
    }

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_BRANCH ?? "main";
    if (!token || !owner || !repo) {
      return {
        ok: false,
        error:
          "Server misconfigured: missing GITHUB_TOKEN / GITHUB_REPO_OWNER / GITHUB_REPO_NAME.",
      };
    }

    const originalSlug = String(formData.get("originalSlug") ?? "").trim();
    if (!originalSlug || !/^[a-z0-9-]+$/.test(originalSlug)) {
      return { ok: false, error: "Invalid original slug." };
    }

    const title = String(formData.get("title") ?? "").trim();
    const date = String(formData.get("date") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    const tagsRaw = String(formData.get("tags") ?? "");
    const body = String(formData.get("body") ?? "").trim();
    const image = formData.get("image");
    const removeImage = String(formData.get("removeImage") ?? "") === "1";

    if (!title || title.length > 120) {
      return { ok: false, error: "Title required (max 120 chars)." };
    }
    if (!isValidDate(date)) {
      return { ok: false, error: "Date must be YYYY-MM-DD." };
    }
    if (!summary || summary.length > 400) {
      return { ok: false, error: "Summary required (max 400 chars)." };
    }
    if (!body) {
      return { ok: false, error: "Body required." };
    }
    if (body.length > MAX_BODY_BYTES) {
      return { ok: false, error: "Body too large (max 200 KB)." };
    }

    const tags = parseTags(tagsRaw);
    const newSlug = slugify(title);
    if (!newSlug) {
      return {
        ok: false,
        error: "Title produced an empty slug — use more letters/numbers.",
      };
    }

    const octokit = new Octokit({ auth: token });
    const oldMarkdownPath = `content/posts/${originalSlug}.md`;
    const newMarkdownPath = `content/posts/${newSlug}.md`;
    const slugChanged = newSlug !== originalSlug;

    let originalImagePath: string | null = null;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: oldMarkdownPath,
        ref: branch,
      });
      if (Array.isArray(data) || !("content" in data)) {
        return { ok: false, error: "Unexpected content at post path." };
      }
      const md = Buffer.from(data.content, "base64").toString("utf-8");
      const parsed = matter(md);
      const existingImage = (parsed.data as { image?: string }).image;
      if (existingImage && existingImage.startsWith("/")) {
        originalImagePath = `public${existingImage}`;
      }
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status === 404) return { ok: false, error: "Post not found." };
      throw err;
    }

    if (slugChanged) {
      try {
        await octokit.rest.repos.getContent({
          owner,
          repo,
          path: newMarkdownPath,
          ref: branch,
        });
        return {
          ok: false,
          error: `A post already exists at ${newMarkdownPath}. Pick a different title.`,
        };
      } catch (err) {
        const status = (err as { status?: number })?.status;
        if (status !== 404) throw err;
      }
    }

    let newImageUpload: { path: string; base64: string; webPath: string } | null =
      null;
    if (image instanceof File && image.size > 0) {
      if (image.size > MAX_IMAGE_BYTES) {
        return { ok: false, error: "Image too large (max 5 MB)." };
      }
      const ext = MIME_TO_EXT[image.type];
      if (!ext) {
        return {
          ok: false,
          error: `Unsupported image type: ${image.type}. Use png, jpg, webp, or gif.`,
        };
      }
      const buf = Buffer.from(await image.arrayBuffer());
      newImageUpload = {
        path: `public/images/posts/${newSlug}.${ext}`,
        base64: buf.toString("base64"),
        webPath: `/images/posts/${newSlug}.${ext}`,
      };
    }

    let finalImageWebPath: string | undefined;
    if (newImageUpload) {
      finalImageWebPath = newImageUpload.webPath;
    } else if (removeImage) {
      finalImageWebPath = undefined;
    } else if (originalImagePath) {
      finalImageWebPath = originalImagePath.replace(/^public/, "");
    }

    const frontmatter = buildFrontmatter({
      title,
      date,
      summary,
      tags,
      image: finalImageWebPath,
    });
    const markdown = frontmatter + body + "\n";

    const blobCalls = [
      octokit.rest.git.createBlob({
        owner,
        repo,
        content: markdown,
        encoding: "utf-8",
      }),
    ];
    if (newImageUpload) {
      blobCalls.push(
        octokit.rest.git.createBlob({
          owner,
          repo,
          content: newImageUpload.base64,
          encoding: "base64",
        }),
      );
    }
    const blobs = await Promise.all(blobCalls);
    const markdownBlobSha = blobs[0].data.sha;
    const imageBlobSha = newImageUpload ? blobs[1].data.sha : null;

    const tree: {
      path: string;
      mode: "100644";
      type: "blob";
      sha: string | null;
    }[] = [];

    if (slugChanged) {
      tree.push({
        path: oldMarkdownPath,
        mode: "100644",
        type: "blob",
        sha: null,
      });
    }
    tree.push({
      path: newMarkdownPath,
      mode: "100644",
      type: "blob",
      sha: markdownBlobSha,
    });

    if (newImageUpload && imageBlobSha) {
      if (originalImagePath && originalImagePath !== newImageUpload.path) {
        tree.push({
          path: originalImagePath,
          mode: "100644",
          type: "blob",
          sha: null,
        });
      }
      tree.push({
        path: newImageUpload.path,
        mode: "100644",
        type: "blob",
        sha: imageBlobSha,
      });
    } else if (removeImage && originalImagePath) {
      tree.push({
        path: originalImagePath,
        mode: "100644",
        type: "blob",
        sha: null,
      });
    }

    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const baseSha = refData.object.sha;

    const { data: baseCommit } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: baseSha,
    });
    const baseTreeSha = baseCommit.tree.sha;

    const { data: newTree } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree,
    });

    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: slugChanged
        ? `post (edit): ${title} [was ${originalSlug}]`
        : `post (edit): ${title}`,
      tree: newTree.sha,
      parents: [baseSha],
    });

    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    revalidatePath("/admin");
    revalidatePath("/posts");
    revalidatePath("/");
    revalidatePath(`/posts/${originalSlug}`);
    if (slugChanged) revalidatePath(`/posts/${newSlug}`);

    return {
      ok: true,
      slug: newSlug,
      previousSlug: originalSlug,
      commitSha: newCommit.sha,
      commitUrl: `https://github.com/${owner}/${repo}/commit/${newCommit.sha}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: `Update failed: ${message}` };
  }
}
