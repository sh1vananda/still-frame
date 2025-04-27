import { getPostBySlugDB } from '$lib/server/dbContent';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Post } from '$lib/server/contentTypes';

export const load: PageServerLoad = async ({ params, setHeaders }): Promise<{ post: Post }> => {
    const { slug } = params;

    if (typeof slug !== 'string') {
        throw error(404, 'Invalid slug parameter');
    }

    const post = await getPostBySlugDB(slug);

    if (!post) {
        throw error(404, 'Review not found or not published');
    }

    setHeaders({
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600'
    });

    // Returns { post: Post }
    return { post };
};