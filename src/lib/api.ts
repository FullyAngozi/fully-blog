// lib/api.ts
import { allPosts, type Post } from 'contentlayer/generated';

// Return all posts sorted by date (newest first).
export function getAllPosts(): Post[] {
  return [...allPosts].sort((a, b) => (a.date > b.date ? -1 : 1))
}

// Find a single post by its slug.
export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find(post => post.slug === slug);
}


