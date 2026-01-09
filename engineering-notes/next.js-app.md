Scenario

You’re building acme-blog:

Public:

/ shows latest posts

/posts/[slug] shows a post

Admin:

/admin lists drafts + published posts

/admin/new create post

/admin/edit/[id] edit post

External CMS calls a webhook: POST /api/webhooks/post-published to invalidate caches.

You store posts in a DB. (We’ll mock DB with a module to keep code understandable.)

1) Architecture choices

Interviewer: For each part, choose Server Component, Client Component, Server Action, Route Handler. Explain why.

Candidate:

Public pages (/, /posts/[slug]) → Server Components

Fast initial render, smaller client JS

Can fetch on server with caching/revalidation

Admin pages → mostly Server Components

Admin table and forms can be server-rendered

Only make small parts client if needed (rich editor, drag-drop)

Mutations (create/update/publish) → Server Actions

Tight coupling to UI forms

Easy to validate on server

Can call revalidateTag() immediately after mutation

Webhook → Route Handler

External system needs HTTP endpoint

Server Actions aren’t meant to be called by external services

Auth gate

Middleware for coarse redirect to /login

Server enforcement inside server actions/route handlers too (never rely only on middleware)

2) Folder structure (App Router)

Interviewer: Show me a sane structure.

Candidate:

app/
  layout.tsx
  page.tsx
  posts/
    [slug]/
      page.tsx
      loading.tsx
      not-found.tsx
  admin/
    layout.tsx
    page.tsx
    new/
      page.tsx
    edit/
      [id]/
        page.tsx
  api/
    posts/
      route.ts
    webhooks/
      post-published/
        route.ts

lib/
  auth.ts
  db.ts
  posts.ts
  cache-tags.ts
middleware.ts


Key: lib/ is server-only by usage pattern. If any file must be server-only, either:

keep it imported only by Server Components / route handlers / actions, and/or

use import "server-only"; at top to prevent accidental client bundling.

3) “DB” layer (mocked)

Interviewer: Write a minimal DB module + posts service that demonstrates separation.

Candidate:

// lib/db.ts
import "server-only";

export type Post = {
  id: string;
  slug: string;
  title: string;
  body: string;
  status: "draft" | "published";
  updatedAt: number;
};

const posts = new Map<string, Post>();

function now() {
  return Date.now();
}

// seed
posts.set("1", {
  id: "1",
  slug: "hello-world",
  title: "Hello World",
  body: "My first post.",
  status: "published",
  updatedAt: now(),
});

export const db = {
  listPosts(): Post[] {
    return Array.from(posts.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  },
  getPostBySlug(slug: string): Post | null {
    return Array.from(posts.values()).find(p => p.slug === slug) ?? null;
  },
  getPostById(id: string): Post | null {
    return posts.get(id) ?? null;
  },
  upsertPost(input: Omit<Post, "updatedAt">): Post {
    const post: Post = { ...input, updatedAt: now() };
    posts.set(post.id, post);
    return post;
  },
};


Then a posts service that adds caching tags semantics:

// lib/cache-tags.ts
import "server-only";

export const cacheTags = {
  postsList: () => "posts:list",
  postBySlug: (slug: string) => `posts:slug:${slug}`,
  postById: (id: string) => `posts:id:${id}`,
};

// lib/posts.ts
import "server-only";
import { db } from "./db";
import { cacheTags } from "./cache-tags";

export async function listPosts() {
  // In a real DB call, this is where you'd query.
  // We'll return tags alongside so callers can use them consistently.
  return {
    data: db.listPosts(),
    tags: [cacheTags.postsList()],
  };
}

export async function getPostBySlug(slug: string) {
  const post = db.getPostBySlug(slug);
  return {
    data: post,
    tags: [cacheTags.postBySlug(slug)],
  };
}

export async function getPostById(id: string) {
  const post = db.getPostById(id);
  return {
    data: post,
    tags: [cacheTags.postById(id)],
  };
}

4) Public pages with caching + tags
Home page

Interviewer: Build / using server fetch patterns and show how you’d tag caches.

Candidate:

In App Router you can rely on Next’s caching around fetch, but with a DB call you control invalidation via revalidateTag at the segment level.

We can make the page revalidate by tag using unstable_cache (official Next export) to cache arbitrary async work and attach tags.

// lib/cached.ts
import "server-only";
import { unstable_cache } from "next/cache";
import { listPosts, getPostBySlug } from "./posts";
import { cacheTags } from "./cache-tags";

export const cachedListPosts = unstable_cache(
  async () => {
    const { data } = await listPosts();
    return data;
  },
  ["posts:list:v1"],
  { tags: [cacheTags.postsList()], revalidate: 60 } // time-based + tag-based
);

export const cachedGetPostBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const { data } = await getPostBySlug(slug);
      return data;
    },
    [`posts:slug:${slug}:v1`],
    { tags: [cacheTags.postBySlug(slug)], revalidate: 300 }
  )();


Now app/page.tsx:

// app/page.tsx
import Link from "next/link";
import { cachedListPosts } from "@/lib/cached";

export default async function HomePage() {
  const posts = await cachedListPosts();

  return (
    <main style={{ padding: 24 }}>
      <h1>Acme Blog</h1>
      <ul>
        {posts
          .filter(p => p.status === "published")
          .map(p => (
            <li key={p.id}>
              <Link href={`/posts/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
      </ul>
    </main>
  );
}

Post detail page
// app/posts/[slug]/page.tsx
import { notFound } from "next/navigation";
import { cachedGetPostBySlug } from "@/lib/cached";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await cachedGetPostBySlug(params.slug);

  if (!post || post.status !== "published") notFound();

  return (
    <article style={{ padding: 24 }}>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}


Optional loading.tsx to demonstrate streaming fallback:

// app/posts/[slug]/loading.tsx
export default function Loading() {
  return <div style={{ padding: 24 }}>Loading post…</div>;
}

5) Auth: middleware + server enforcement

Interviewer: Implement auth that protects /admin/*. Also show server enforcement (not only middleware).

Candidate:

Middleware (coarse gate)
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  const session = req.cookies.get("session")?.value;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

Server-side enforcement helper
// lib/auth.ts
import "server-only";
import { cookies } from "next/headers";

export type User = { id: string; role: "admin" | "user" };

// toy session parse
function decodeSession(token: string | undefined): User | null {
  if (!token) return null;
  // In real life: verify signed cookie / JWT.
  if (token === "admin") return { id: "u1", role: "admin" };
  return null;
}

export function requireAdmin(): User {
  const token = cookies().get("session")?.value;
  const user = decodeSession(token);
  if (!user || user.role !== "admin") {
    // Throwing is fine; error.tsx can catch it, or you can redirect.
    throw new Error("Unauthorized");
  }
  return user;
}


This gets used in Server Actions and Route Handlers.

6) Admin UI (Server Components) + Server Actions for mutations

Interviewer: Build /admin/new with a form that creates a post, then revalidates caches.

Candidate:

Server Action
// app/admin/actions.ts
"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { cacheTags } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createPostAction(formData: FormData) {
  requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!title || !body) {
    return { ok: false, error: "Title and body are required." };
  }

  const id = String(Date.now());
  const slug = slugify(title);

  db.upsertPost({
    id,
    slug,
    title,
    body,
    status: "draft",
  });

  // Invalidate admin list and public list (if it becomes published later, we’ll revalidate again)
  revalidateTag(cacheTags.postsList());

  return { ok: true, id };
}

export async function publishPostAction(id: string) {
  requireAdmin();

  const post = db.getPostById(id);
  if (!post) return { ok: false, error: "Not found" };

  db.upsertPost({ ...post, status: "published" });

  // Invalidate list + the post page (by slug)
  revalidateTag(cacheTags.postsList());
  revalidateTag(cacheTags.postBySlug(post.slug));

  return { ok: true };
}

/admin/new page
// app/admin/new/page.tsx
import Link from "next/link";
import { createPostAction } from "../actions";

export default function AdminNewPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>New Post</h1>

      <form action={createPostAction} style={{ display: "grid", gap: 12 }}>
        <label>
          Title
          <input name="title" required style={{ display: "block", width: "100%" }} />
        </label>

        <label>
          Body
          <textarea name="body" required rows={6} style={{ display: "block", width: "100%" }} />
        </label>

        <button type="submit">Create Draft</button>
      </form>

      <p style={{ marginTop: 16 }}>
        <Link href="/admin">Back to admin</Link>
      </p>
    </main>
  );
}

/admin list page with publish buttons

To keep it simple, we’ll do publish via a small form per row.

// app/admin/page.tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { cachedListPosts } from "@/lib/cached";
import { publishPostAction } from "./actions";

export default async function AdminPage() {
  requireAdmin();
  const posts = await cachedListPosts();

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin</h1>
      <p>
        <Link href="/admin/new">Create new</Link>
      </p>

      <table cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th align="left">Title</th>
            <th align="left">Status</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id} style={{ borderTop: "1px solid #ddd" }}>
              <td>{p.title}</td>
              <td>{p.status}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link href={`/admin/edit/${p.id}`}>Edit</Link>

                {p.status === "draft" ? (
                  <form
                    action={async () => {
                      "use server";
                      await publishPostAction(p.id);
                    }}
                  >
                    <button type="submit">Publish</button>
                  </form>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}


This demonstrates the “server action inline form per row” pattern.

7) Route Handler: external webhook invalidation

Interviewer: Implement POST /api/webhooks/post-published that receives { slug } and invalidates caches safely.

Candidate:

// app/api/webhooks/post-published/route.ts
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";

// In real life: verify a shared secret signature header.
function requireWebhookAuth(req: Request) {
  const token = req.headers.get("x-webhook-token");
  if (token !== process.env.WEBHOOK_TOKEN) {
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  if (!requireWebhookAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const slug = body?.slug ? String(body.slug) : "";

  if (!slug) {
    return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
  }

  revalidateTag(cacheTags.postsList());
  revalidateTag(cacheTags.postBySlug(slug));

  return NextResponse.json({ ok: true });
}


Notes:

Route Handler is appropriate for external system calls.

We validate auth via header token (or signature).

We invalidate both list and specific post.

8) Public API route (optional)

Interviewer: If we also want GET /api/posts?slug=... for a mobile client, what changes?

Candidate:
This is a sign you’re moving beyond “BFF only.” I’d still implement it as a Route Handler. But I’d be careful:

Avoid leaking draft content

Add rate limiting, auth if needed

Stabilize schema and versioning

Example:

// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (slug) {
    const post = db.getPostBySlug(slug);
    if (!post || post.status !== "published") {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: post });
  }

  const posts = db.listPosts().filter(p => p.status === "published");
  return NextResponse.json({ ok: true, data: posts });
}

9) Deep-dive questions (rapid fire)

Interviewer: Answer quickly but precisely.

Why keep db.ts server-only?
Candidate: Prevent accidental bundling into client; it could contain secrets/ORM; keeps runtime expectations correct.

Why not rely only on middleware for auth?
Candidate: Middleware can be bypassed (misconfig, direct action call, route handler). Server actions and APIs must enforce auth too.

When would you convert admin editor into a Client Component?
Candidate: Rich text editor requiring DOM APIs, selection, plugins; but keep data loading and saving server-side.

What’s the common caching failure mode here?
Candidate: Forgetting to revalidate tags after mutations → stale content; or using dynamic triggers (cookies/headers) on public routes causing caches to never hit.