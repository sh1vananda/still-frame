// src/routes/reviews/[slug]/+page.server.ts (Reverted to working structure)
import { getPostBySlugDB } from '$lib/server/dbContent';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Post } from '$lib/server/contentTypes'; // Import the full Post type

export const load: PageServerLoad = async ({ params, setHeaders }): Promise<{ post: Post }> => {
    const { slug } = params;

    if (typeof slug !== 'string') {
        throw error(404, 'Invalid slug parameter');
    }

    // Fetch the full post object, including the body
    const post = await getPostBySlugDB(slug);

    // If post is null (not found or not published), throw 404
    if (!post) {
        throw error(404, 'Review not found or not published');
    }

    setHeaders({
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600'
    });

    // Return the full post object wrapped in { post: ... }
    return { post };
};