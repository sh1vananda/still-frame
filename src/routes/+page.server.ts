// src/routes/+page.server.ts
import { getAllPostsDB } from '$lib/server/dbContent'; // Use DB function
// import type { PostMetadata } from '$lib/server/contentTypes';
import type { PageServerLoad } from './$types';

const MAX_LATEST_POSTS = 5;

export const load: PageServerLoad = async ({ setHeaders }) => {
    const allPosts = await getAllPostsDB();
    const latestPosts = allPosts.slice(0, MAX_LATEST_POSTS);

    // Configure ISR (e.g., cache for 1 minute, serve stale for 5 min)
    setHeaders({
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    });

    return { latestPosts };
};