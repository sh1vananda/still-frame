import { supabase } from '$lib/supabaseClient';
import type { PostMetadata, Post } from './contentTypes';

interface ReviewDbRow {
    slug: string; title: string; director: string | null; year: number | null;
    date: string; published: boolean; summary: string | null;
    poster_url: string | null; featured_image_url: string | null;
    body: string; created_at: string; updated_at: string;
}

interface ReviewMetadataDbRow {
    slug: string; title: string; director: string | null; year: number | null;
    date: string; published: boolean; summary: string | null;
    poster_url: string | null; featured_image_url: string | null;
}

function mapRowToPostMetadata(row: ReviewMetadataDbRow): PostMetadata {
     return {
        slug: row.slug, title: row.title, director: row.director, year: row.year,
        date: row.date, published: row.published, summary: row.summary,
        posterUrl: row.poster_url, featuredImageUrl: row.featured_image_url,
    };
}

 function mapRowToPost(row: ReviewDbRow): Post {
     return { ...mapRowToPostMetadata(row), body: row.body };
 }

export async function getAllPostsDB(): Promise<PostMetadata[]> {
    try {
        const columnsToSelect = 'slug, title, director, year, date, published, summary, poster_url, featured_image_url';
        const { data, error } = await supabase
            .from('reviews')
            .select(columnsToSelect)
            .order('date', { ascending: false });

        if (error) throw error;
        if (!data) return [];

        const posts = data.map(mapRowToPostMetadata);
        return posts;
    } catch (error) {
        console.error("Error fetching posts from Supabase:", error);
        return [];
    }
}

export async function getPostBySlugDB(slug: string): Promise<Post | null> {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

        if (error) throw error;
        if (!data) {
            return null;
        }

        const post = mapRowToPost(data as ReviewDbRow);

        // Check published status *after* fetching, relying on RLS primarily
        if (!post.published) {
            return null;
        }

        return post;

    } catch (error) {
        console.error(`Error fetching post "${slug}" from Supabase:`, error);
        return null;
    }
}