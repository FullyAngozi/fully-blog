import fs from "fs";
import path, { join } from "path";
import matter from "gray-matter";
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import { unified } from "unified";
import remarkParse from "remark-parse";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: "2025-04-02",
  token: process.env.SANITY_API_TOKEN,
});

const postsDirectory = join(process.cwd(), "_posts");

// Utility: sanitize file names and slugs
function sanitizeSlug(str) {
  return str
    .toLowerCase()
    .replace(".md", "")
    .replace(/[^a-z0-9-_]/g, "-") // allow only URL-safe characters
    .replace(/-+/g, "-") // collapse multiple dashes
    .replace(/^-|-$/g, ""); // trim dashes
}

// Uploads an image to Sanity and returns the asset ref
async function uploadImageToSanity(imagePath, client) {
  try {
    const fullPath = join(process.cwd(), "public", imagePath);
    const imageBuffer = fs.readFileSync(fullPath);
    return await client.assets.upload("image", imageBuffer, {
      filename: path.basename(imagePath),
    });
  } catch (err) {
    console.warn(`⚠️ Could not upload image: ${imagePath}`);
    return null;
  }
}

// Get or create an author
async function getOrCreateAuthor(authorData, client) {
  const { name, picture } = authorData;

  const existingAuthor = await client.fetch(
    `*[_type == "author" && name == $name][0]`,
    { name }
  );

  if (existingAuthor) return existingAuthor._id;

  let imageRef = null;
  if (picture) {
    const uploaded = await uploadImageToSanity(picture, client);
    if (uploaded) {
      imageRef = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: uploaded._id,
        },
      };
    }
  }

  const newAuthor = await client.create({
    _type: "author",
    name,
    image: imageRef,
    bio: [],
  });

  return newAuthor._id;
}

function markdownToSanityBlocks(markdown) {
  const tree = unified().use(remarkParse).parse(markdown);

  const blocks = [];
  for (const node of tree.children) {
    if (node.type === "paragraph") {
      const text = node.children.map((c) => c.value || "").join("");
      blocks.push({
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text,
            marks: [],
          },
        ],
      });
    }
    // Handle more types as needed (headings, lists, etc.)
  }

  return blocks;
}

async function importPosts() {
  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));

  for (const file of files) {
    console.log(`📄 Processing ${file}...`);
    const fullPath = join(postsDirectory, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const slug = sanitizeSlug(file);
    const _id = `post-${slug}`;

    try {
      const authorId = await getOrCreateAuthor(data.author, client);

      const coverAsset = data.coverImage
        ? await uploadImageToSanity(data.coverImage, client)
        : null;

      const ogAsset = data.ogImage
        ? await uploadImageToSanity(data.ogImage, client)
        : null;

      // Convert markdown string content into Sanity blockContent format
      const blocks = markdownToSanityBlocks(content) // ✅
        // split paragraphs
        .map((paragraph) => ({
          _type: "block",
          style: "normal",
          children: [{ _type: "span", text: paragraph.replace(/\r?\n/g, " ") }],
        }));

      const doc = {
        _id,
        _type: "post",
        title: data.title,
        slug: { _type: "slug", current: slug },
        excerpt: data.excerpt,
        date: data.date,
        coverImage: coverAsset
          ? {
              _type: "image",
              asset: { _type: "reference", _ref: coverAsset._id },
            }
          : undefined,
        ogImage: ogAsset
          ? {
              _type: "image",
              asset: { _type: "reference", _ref: ogAsset._id },
            }
          : undefined,
        content: blocks, // now matches blockContent schema
        author: {
          _type: "reference",
          _ref: authorId,
        },
      };

      const res = await client.createOrReplace(doc);
      console.log(`✅ Imported: ${res._id}`);
    } catch (err) {
      console.error(`❌ Error importing ${file}:`, err.message);
    }
  }
}

importPosts();
