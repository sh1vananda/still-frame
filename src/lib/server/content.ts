import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ensure this path points correctly to your reviews folder
const postsDirectory = path.resolve(__dirname, '../../reviews');

export interface PostMetadata {
  title: string;
  director: string;
  year: number;
  date: string;
  slug: string;
  published: boolean;
  summary: string;
  posterUrl?: string;
  featuredImageUrl?: string;
}

export interface Post extends PostMetadata {
  content: string;
}

export async function getAllPosts(): Promise<PostMetadata[]> {
    try {
        if (!fs.existsSync(postsDirectory)) {
            console.warn(`Posts directory not found: ${postsDirectory}`);
            return [];
        }
        const filenames = fs.readdirSync(postsDirectory).filter((file: string) => file.endsWith('.md'));

        const posts = filenames.map((filename: string) => {
            const filePath = path.join(postsDirectory, filename);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(fileContents);

            if (!data.title || !data.slug || !data.date || data.published === undefined) {
                console.warn(`Skipping ${filename}: Missing required frontmatter (title, slug, date, published).`);
                return null;
            }
            const expectedSlug = filename.replace(/\.md$/, '');
            if (data.slug !== expectedSlug) {
                 console.warn(`Skipping ${filename}: Frontmatter slug "${data.slug}" does not match filename base "${expectedSlug}".`);
                 return null;
            }
            return data as PostMetadata;

        }).filter((post): post is PostMetadata => post !== null && post.published);

        posts.sort((a: PostMetadata, b: PostMetadata) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return posts;
    } catch (error) {
        console.error("Error reading posts directory:", error);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`Post not found for slug: ${slug} at path: ${filePath}`);
            return null;
        }
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        if (!data.title || !data.slug || !data.date || data.published === undefined) {
            console.warn(`Invalid frontmatter for slug: ${slug}`);
             return null;
        }
        if (!data.published) {
            console.log(`Attempted to access unpublished post by slug: ${slug}`);
            return null;
        }
        return { ...(data as PostMetadata), content };
    } catch (error) {
        console.error(`Error reading post with slug ${slug}:`, error);
        return null;
    }
}