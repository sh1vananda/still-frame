<script lang="ts">
    import type { PageData } from './$types';
    import { marked } from 'marked';
    import { browser } from '$app/environment';

    export let data: PageData; // data structure is { post: Post }

    let parsedHtml: string = '';
    let currentSlug: string | null = null;

    function parseMarkdown(markdownString: string | undefined | null): string {
        if (!markdownString) return '<p>Loading...</p>';
        try {
            return marked.parse(markdownString, { async: false, gfm: true, breaks: false }) as string;
        } catch (e) {
            console.error("Markdown parsing error:", e);
            return "<p class='error-message'>Failed to render review content.</p>";
        }
    }

    $: if (data?.post && data.post.slug !== currentSlug) {
        currentSlug = data.post.slug;
        if (browser) {
            parsedHtml = parseMarkdown(data.post.body);
        } else {
            // Attempt basic SSR parse (less critical now with client parse)
            parsedHtml = parseMarkdown(data.post.body);
        }
    } else if (!data?.post && currentSlug !== null) {
        currentSlug = null;
        parsedHtml = "<p class='error-message'>Review data unavailable.</p>";
    } else if (data?.post && currentSlug === data.post.slug && !parsedHtml && browser){
         // Catch case where component loads but reactive block didn't run yet
         parsedHtml = parseMarkdown(data.post.body);
    }

</script>

<svelte:head>
  <title>{data.post?.title || 'Review'} ({data.post?.year || 'N/A'}) - Still Frame</title>
  <meta name="description" content={data.post?.summary ?? 'A movie review.'} />
  {#if data.post?.featuredImageUrl || data.post?.posterUrl}
    <meta property="og:image" content={data.post.featuredImageUrl ?? data.post.posterUrl ?? ''} />
  {/if}
  <meta property="og:type" content="article" />
  <meta property="article:published_time" content={data.post?.date ?? ''} />
  <meta property="article:author" content="Still Frame" />
</svelte:head>

<article>
    {#if data.post}
        <header class="review-header">
            <h1>{data.post.title}</h1>
            <p class="subtitle">{data.post.director} ({data.post.year})</p>
            {#if data.post.featuredImageUrl}
                <div class="featured-image-wrapper image-container-fixed">
                    <img
                        src={data.post.featuredImageUrl}
                        alt="Featured image for {data.post.title}"
                        class="featured-image"
                     />
                </div>
            {/if}
            <p class="published-date">
                Published on {new Date(data.post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </header>

        {#key data.post.slug}
             <div class="prose">
                 {#if parsedHtml}
                     {@html parsedHtml}
                 {:else}
                      <p>Loading content...</p>
                 {/if}
             </div>
        {/key}
    {:else}
         <p class="error-message">Review could not be loaded.</p>
    {/if}
</article>

<style>
    .review-header { text-align: center; margin-bottom: 4rem; }
    .review-header h1 { font-size: 2.5rem; font-weight: 300; margin-bottom: 0.75rem; }
    .review-header .subtitle { font-size: 1rem; color: var(--text-secondary-color); font-family: var(--font-sans); margin-bottom: 3rem; }

    .featured-image-wrapper {
        margin: 0 auto 3rem auto;
        width: 100%;
        max-width: 700px;
        max-height: 467px; /* Example for 3:2 at 700px wide */
        aspect-ratio: 3 / 2; /* Enforce 3:2 Ratio */
        /* Inherits shared styles from .image-container-fixed in app.css */
    }
    /* .featured-image styles handled by global rule */

    .published-date { font-size: 0.85rem; color: var(--text-secondary-color); font-family: var(--font-sans); margin-top: 3rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color); transition: border-color var(--theme-transition-duration) ease-out; }
    .error-message { color: #c00; text-align: center; padding: 2rem; border: 1px solid var(--border-color); background-color: rgba(204, 0, 0, 0.05); transition: border-color var(--theme-transition-duration) ease-out, background-color var(--theme-transition-duration) ease-out; }
    .prose { font-size: 1.05rem; line-height: 1.85; min-height: 50px; }
    .prose :global(h2) { margin-top: 2.5em; font-size: 1.5rem; font-weight: 300; }
    .prose :global(p) { margin-bottom: 1.5em; }
    .prose :global(em) { font-style: italic; }
    .prose :global(strong) { font-weight: 700; }
    .prose :global(img) { margin: 2.5rem auto; border-radius: 3px; display: block; max-width: 100%; transition: opacity 0.3s ease; }
    .prose :global(img:hover) { opacity: 0.85; }
    .prose :global(blockquote) { margin: 2em 0; padding-left: 1.5em; border-left: 2px solid var(--border-color); color: var(--text-secondary-color); font-style: italic; font-size: 1rem; transition: color var(--theme-transition-duration) ease-out, border-color var(--theme-transition-duration) ease-out; }
    .prose :global(ul), .prose :global(ol) { margin-bottom: 1.5em; padding-left: 2em; }
    .prose :global(li) { margin-bottom: 0.5em; }
</style>