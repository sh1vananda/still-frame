import { getAllPosts, type PostMetadata } from '$lib/server/content';

const MAX_LATEST_POSTS = 5;

export async function load(): Promise<{ latestPosts: PostMetadata[] }> {
    const allPosts = await getAllPosts();
    const latestPosts = allPosts.slice(0, MAX_LATEST_POSTS);
    return {
        latestPosts
    };
}