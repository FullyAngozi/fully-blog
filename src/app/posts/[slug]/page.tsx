// app/posts/[slug]/page.tsx
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostHeader } from "@/app/_components/post-header";
import { PostBody } from "@/app/_components/post-body";
import type { Metadata } from "next";
import { MoreStories } from "@/app/_components/more-stories";
import type { Post } from "contentlayer/generated";

export const revalidate = 60;

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  const title = `${post.title} | ${post.author.name}`;
  const images = post.ogImage?.url ? [post.ogImage.url] : [];

  return {
    title,
    openGraph: { title, images },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  // Get more posts (exclude current post and limit to 3)
  const morePosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .sort((a, b) => {
      // Add your sorting logic here
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <main>
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={post.body.html} />
          <div className="mt-16 border-t pt-12">
            <MoreStories posts={morePosts} />
          </div>
        </article>
      </Container>
    </main>
  );
}
