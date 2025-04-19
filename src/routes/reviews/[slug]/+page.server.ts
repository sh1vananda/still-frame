import { getPostBySlug } from '$lib/server/content';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostMetadata } from '$lib/server/content'; 

export const load: PageServerLoad = async ({ params }): Promise<{ metadata: PostMetadata, slug: string }> => {
    const { slug } = params;
    if (!slug) { throw error(404, 'Review not found (Invalid slug)'); }

    const post = await getPostBySlug(slug); 
    if (!post) { throw error(404, 'Review not found'); }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content: _content, ...metadata } = post;

    return { metadata, slug };
};