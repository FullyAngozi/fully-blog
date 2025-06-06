import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";
import { PostBody } from "./_components/post-body";

export default async function Index() {
  const allPosts = getAllPosts();

  if (allPosts.length === 0) {
    return (
      <Container>
        <p>No blog posts found.</p>
      </Container>
    );
  }

  const heroPost = allPosts[0];

  const morePosts = allPosts.length > 1 ? allPosts.slice(1) : [];
  return (
    <main>
      <Container>
        <Intro />
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </main>
  );
}
