// contentlayer.config.ts
import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// Nested type for author details
export const Author = defineNestedType(() => ({
  name: 'Author',
  fields: {
    name: { type: 'string', required: true },
    picture: { type: 'string', required: true },
  },
}))

// Nested type for Open Graph image
export const OgImage = defineNestedType(() => ({
  name: 'OgImage',
  fields: {
    url: { type: 'string', required: true },
    alt: { type: 'string', required: false },
  },
}))

// Main Post document type
export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: '**/*.md',
  contentType: 'markdown',
  fields: {
    title:      { type: 'string', required: true },
    excerpt:    { type: 'string', required: true },
    coverImage: { type: 'string', required: true },
    date:       { type: 'date',   required: true },
    author:     { type: 'nested', of: Author, required: true },
    ogImage:    { type: 'nested', of: OgImage, required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
    url: {
      type: 'string',
      resolve: (doc) => `/posts/${doc._raw.flattenedPath}`,
    },
  },
}))

// Export the Contentlayer source config
export default makeSource({
  contentDirPath: '_posts',
  documentTypes: [Post],
  mdx: { // even for markdown files, use the mdx key for plugins
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
})
