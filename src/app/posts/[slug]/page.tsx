// app/posts/[slug]/page.tsx
import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import Container from '@/app/_components/container'
import Header from '@/app/_components/header'
import { PostHeader } from '@/app/_components/post-header'
import { PostBody } from '@/app/_components/post-body'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  return allPosts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = allPosts.find(p => p.slug === slug)
  if (!post) return notFound()

  const title = `${post.title} | ${post.author.name}`
  const images = post.ogImage?.url ? [post.ogImage.url] : []

  return {
    title,
    openGraph: { title, images },
  }
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = allPosts.find(p => p.slug === slug)
  if (!post) return notFound()

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
        </article>
      </Container>
    </main>
  )
}
