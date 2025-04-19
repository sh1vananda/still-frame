import { getAllPosts, type PostMetadata } from '$lib/server/content';

export async function load(): Promise<{ posts: PostMetadata[] }> {
    const posts = await getAllPosts();
    return {
        posts
    };
}