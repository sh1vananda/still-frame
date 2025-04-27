<script lang="ts">
	import type { PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let data: PageData;
</script>

<svelte:head>
	<title>Still Frame - Latest Movie Reviews</title>
	<meta name="description" content="The latest minimalist and atmospheric movie reviews." />
</svelte:head>

<section class="latest-reviews-container">
	<h1>Latest Reviews</h1>

	{#if data.latestPosts.length > 0}
		<ul class="review-list">
			{#each data.latestPosts as post, i (post.slug)}
				<li
					class="review-item"
					in:fade={{ duration: 400, delay: 60 * i, easing: cubicOut }}
				>
					<a href="/reviews/{post.slug}" class="review-link">
						<div class="review-image-container image-container-fixed">
							{#if post.posterUrl}
								<img src={post.posterUrl} alt="Poster for {post.title}" loading="lazy" />
							{:else}
								<div class="placeholder-image"></div>
							{/if}
						</div>
						<div class="review-text">
							<h2>{post.title} ({post.year})</h2>
							<p class="director">{post.director}</p>
							<p class="summary">{post.summary}</p>
							<span
								class="date"
								>{new Date(post.date).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}</span
							>
						</div>
					</a>
				</li>
			{/each}
		</ul>
		{#if data.latestPosts.length >= 5}
			<p class="see-all-link">
				<a href="/reviews">See all reviews...</a>
			</p>
		{/if}
	{:else}
		<p>No reviews have been published yet.</p>
	{/if}
</section>

<style>
  .latest-reviews-container h1 { margin-bottom: 3rem; text-align: center; font-weight: 300; }
  .review-list { list-style: none; padding: 0; margin: 0; }
  .review-item { margin-bottom: 2.5rem; opacity: 1; transform: none; }
  .review-item:last-child { margin-bottom: 0; }

  .review-link {
    display: flex; gap: 1.5rem; text-decoration: none; color: inherit;
    border-radius: 4px; padding: 0.5rem; margin: -0.5rem;
    transition: background-color 0.25s ease-out;
    border: none; box-shadow: none; background-color: transparent;
    opacity: 1; transform: none; filter: none;
  }
  .review-link:hover {
    background-color: color-mix(in srgb, var(--bg-color) 90%, var(--border-color) 10%);
    transform: none; box-shadow: none;
  }

  .review-image-container {
    flex-shrink: 0;
    width: 80px;
    aspect-ratio: 2 / 3; /* Use aspect-ratio to derive height */
    /* Inherits shared styles from .image-container-fixed */
  }
  /* Img styles handled by .image-container-fixed img */
  .placeholder-image { width: 100%; height: 100%; }

  .review-text h2 { margin: 0 0 0.15rem 0; font-size: 1.3rem; font-weight: 400; }
  .review-text .director { font-size: 0.85rem; color: var(--text-secondary-color); font-family: var(--font-sans); margin-bottom: 0.6rem; }
  .review-text .summary { font-size: 0.95rem; margin-bottom: 0.8rem; line-height: 1.7; color: var(--text-secondary-color); }
  .review-text .date { font-size: 0.8rem; color: var(--text-secondary-color); font-family: var(--font-sans); opacity: 0.8; }
  .see-all-link { text-align: center; margin-top: 4rem; font-family: var(--font-sans); font-size: 0.9rem; }

  .see-all-link a { padding-bottom: 2px; border-bottom: 1px solid transparent; }
  .see-all-link a:hover { border-bottom-color: var(--accent-color); }
</style>