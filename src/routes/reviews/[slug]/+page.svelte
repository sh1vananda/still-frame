<script lang="ts">
    import type { PageData } from './$types';
    import { fade } from 'svelte/transition';
    import { marked } from 'marked';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    export let data: PageData;

    let renderedHtml: string = '';
    let currentSlug: string | null = null;

    function parseMarkdown(markdownString: string | undefined | null): string {
        let outputHtml = '<p>Error: Could not render content.</p>';
        if (typeof markdownString !== 'string' || !markdownString) {
            console.warn("parseMarkdown received invalid input:", markdownString);
            return "<p>Review content is empty or invalid.</p>";
        }
        try {
            // --- MODIFICATION: Rely on GFM for paragraphs, remove breaks: true ---
            outputHtml = marked.parse(markdownString, {
                async: false,
                gfm: true // GitHub Flavored Markdown should handle paragraphs correctly
                // breaks: false // Explicitly false or just remove the line
            }) as string;
            // --- END MODIFICATION ---

            console.log("Rendered HTML Output:", outputHtml); // <-- ADD THIS LOG

        } catch (e) {
            console.error("Error parsing markdown:", e);
        }
        return outputHtml;
    }

    $: if (data?.post && data.post.slug !== currentSlug) {
        currentSlug = data.post.slug;
        renderedHtml = parseMarkdown(data.post.body);
    } else if (!data?.post && currentSlug !== null) {
        currentSlug = null;
        renderedHtml = "<p>Review data not available.</p>";
    }

    onMount(() => {
        if (data?.post && !renderedHtml) {
             renderedHtml = parseMarkdown(data.post.body);
        } else if (!data?.post) {
             renderedHtml = "<p>Review data not available on mount.</p>";
        }
    });
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
                <div class="featured-image-wrapper">
                    <img src={data.post.featuredImageUrl} alt="Featured image for {data.post.title}" class="featured-image" />
                </div>
            {/if}
            <p class="published-date">
                Published on {new Date(data.post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </header>

        {#key data.post.slug}
             <div class="prose" transition:fade={{duration: 300, delay: 50}}>
                 {#if renderedHtml}
                     {@html renderedHtml}
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
    /* Styles remain the same */
    .review-header { text-align: center; margin-bottom: 4rem; }
    .review-header h1 { font-size: 2.5rem; font-weight: 300; margin-bottom: 0.75rem; }
    .review-header .subtitle { font-size: 1rem; color: var(--text-secondary-color); font-family: var(--font-sans); margin-bottom: 3rem; }
    .featured-image-wrapper { margin: 0 auto 3rem auto; max-width: 100%; display: inline-block; }
    .featured-image {
        max-width: 100%; height: auto; display: block; border-radius: 3px; box-shadow: none;
        transition: opacity var(--subtle-animation-duration) var(--subtle-easing);
    }
    .featured-image:hover { opacity: 0.85; }
    .published-date { font-size: 0.85rem; color: var(--text-secondary-color); font-family: var(--font-sans); margin-top: 3rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color); transition: border-color var(--theme-transition-duration) ease-out; }
    .error-message { color: #c00; text-align: center; padding: 2rem; border: 1px solid var(--border-color); background-color: rgba(204, 0, 0, 0.05); transition: border-color var(--theme-transition-duration) ease-out, background-color var(--theme-transition-duration) ease-out; }
    .prose { font-size: 1.05rem; line-height: 1.85; min-height: 50px; }
    .prose :global(h2) { margin-top: 2.5em; font-size: 1.5rem; }
    .prose :global(p) { margin-bottom: 1.5em; }
    .prose :global(img) { margin: 2.5rem auto; border-radius: 3px; display: block; max-width: 100%; transition: opacity 0.3s ease; }
    .prose :global(img:hover) { opacity: 0.85; }
</style>