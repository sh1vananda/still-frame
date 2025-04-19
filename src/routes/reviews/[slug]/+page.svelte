<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import type { SvelteComponent } from 'svelte';
    import { browser } from '$app/environment';

	export let data: PageData;
	let ContentComponent: typeof SvelteComponent | null = null;
	let loadError: Error | null = null;
    let isLoading = true;

	$: if (data.slug && browser) {
        isLoading = true;
		ContentComponent = null; loadError = null;
        // Verify this path relative to this file location or use alias
        const importPath = `../../../reviews/${data.slug}.md`;
		import(/* @vite-ignore */ importPath)
			.then(module => {
                if (module && module.default) { ContentComponent = module.default; loadError = null; }
                else { throw new Error('Invalid module structure received.'); }
            })
			.catch(err => { loadError = err as Error; ContentComponent = null; })
            .finally(() => { isLoading = false; });
	} else if (!browser) { isLoading = false; } // Handle SSR case
</script>

<svelte:head>
  <title>{data.metadata.title} ({data.metadata.year}) - Still Frame</title>
  <meta name="description" content={data.metadata.summary} />
  <meta property="og:title" content={`${data.metadata.title} (${data.metadata.year})`} />
  <meta property="og:description" content={data.metadata.summary} />
  {#if data.metadata.featuredImageUrl || data.metadata.posterUrl}
    <meta property="og:image" content={data.metadata.featuredImageUrl ?? data.metadata.posterUrl ?? ''} />
  {/if}
  <meta property="og:type" content="article" />
  <meta property="article:published_time" content={data.metadata.date} />
  <meta property="article:author" content="Still Frame" />
</svelte:head>

<article>
	<header class="review-header">
		<h1>{data.metadata.title}</h1>
		<p class="subtitle">{data.metadata.director} ({data.metadata.year})</p>
		{#if data.metadata.featuredImageUrl}
            <div class="featured-image-wrapper">
                <img
                    src={data.metadata.featuredImageUrl}
                    alt="Featured image for {data.metadata.title}"
                    class="featured-image"
                />
            </div>
		{/if}
		<p class="published-date">
			Published on {new Date(data.metadata.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
		</p>
	</header>

    <div class="prose">
        {#if isLoading}
             <p>Loading review...</p>
        {:else if ContentComponent}
            <div transition:fade={{duration: 300, delay: 50}}>
                 <svelte:component this={ContentComponent} />
            </div>
        {:else if loadError}
            <p class="error-message">Could not load review content. Check console.</p>
        {:else}
             <p class="error-message">Review content unavailable.</p>
        {/if}
    </div>

</article>

<style>
    .review-header { text-align: center; margin-bottom: 4rem; }
    .review-header h1 { font-size: 2.5rem; font-weight: 300; margin-bottom: 0.75rem; opacity: 1; transform: none;}
    .review-header .subtitle { font-size: 1rem; color: var(--text-secondary-color); font-family: var(--font-sans); margin-bottom: 3rem; opacity: 1; transform: none;}
    .featured-image-wrapper { margin: 0 auto 3rem auto; max-width: 100%; display: inline-block; opacity: 1; transform: none;}
    .featured-image {
        max-width: 100%; height: auto; display: block;
        border-radius: 3px; box-shadow: none;
        transition: opacity var(--subtle-animation-duration) var(--subtle-easing);
    }
    .featured-image:hover { opacity: 0.85; transform: none; box-shadow: none; }
    .published-date {
        font-size: 0.85rem; color: var(--text-secondary-color); font-family: var(--font-sans);
        margin-top: 3rem; padding-bottom: 2rem;
        border-bottom: 1px solid var(--border-color);
        transition: border-color var(--theme-transition-duration) ease-out;
        opacity: 1; transform: none;
    }
    .error-message {
        color: #c00; text-align: center; padding: 2rem; border: 1px solid var(--border-color);
        background-color: rgba(204, 0, 0, 0.05);
        transition: border-color var(--theme-transition-duration) ease-out, background-color var(--theme-transition-duration) ease-out;
    }
	.prose { font-size: 1.05rem; line-height: 1.85; opacity: 1; transform: none; min-height: 50px; }
</style>