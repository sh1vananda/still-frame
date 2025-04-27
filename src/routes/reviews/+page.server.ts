// src/routes/reviews/+page.server.ts
import { getAllPostsDB } from '$lib/server/dbContent'; // Use DB function
// import type { PostMetadata } from '$lib/server/contentTypes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
    const posts = await getAllPostsDB();

     // Configure ISR
    setHeaders({
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    });

    return { posts };
};