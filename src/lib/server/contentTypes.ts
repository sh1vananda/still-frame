export interface PostMetadata {
    slug: string;
    title: string;
    director: string | null;
    year: number | null;
    date: string;
    published: boolean;
    summary: string | null;
    posterUrl: string | null;
    featuredImageUrl: string | null;
}

export interface Post extends PostMetadata {
    body: string;
}