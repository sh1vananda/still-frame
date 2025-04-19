<script lang="ts">
  import '../app.css';
  import { navigating, page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { quintOut } from 'svelte/easing'; // Keep smooth easing

  const siteTitle = "Still Frame";

  $: isNavigating = $navigating !== null;
  $: currentPath = $page.route.id;
</script>

{#if isNavigating}
  <div class="navigation-indicator"></div>
{/if}

<div class="site-wrapper">
  <header class="site-header">
    <a href="/" class="site-title">{siteTitle}</a>
    <div class="header-controls">
      <nav>
        <a href="/reviews">Reviews</a>
      </nav>
      <ThemeToggle />
    </div>
  </header>

  <main class="site-content">
     {#key currentPath}
         <div
            class="page-container"
            in:fade={{ duration: 350, delay: 100, easing: quintOut }}
            out:fade={{ duration: 150, easing: quintOut }}
         >
            <slot />
         </div>
     {/key}
  </main>

  <footer class="site-footer">
    <p>© {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
  </footer>
</div>

<style>
  .navigation-indicator {
    position: fixed; top: 0; left: 0; right: 0; height: 1px;
    background: var(--accent-color, #ccc); z-index: 999;
    animation: pulse 2s infinite ease-in-out;
    transition: background-color var(--theme-transition-duration) ease-out;
    opacity: 0.6;
  }
  @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }

  .site-wrapper {
    max-width: 760px; margin: 0 auto; padding: 0 2rem;
    min-height: 100vh;
    display: flex; flex-direction: column;
  }
  .site-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 2rem 0;
    border-bottom: 1px solid var(--border-color);
    transition: border-color var(--theme-transition-duration) ease-out,
                background-color var(--theme-transition-duration) ease-out;
    position: sticky; top: 0; z-index: 10;
    background-color: var(--header-bg);
  }
  .site-title {
    font-size: 1.3rem; font-weight: 400;
    text-decoration: none; color: inherit; letter-spacing: 0.5px;
    transition: color var(--theme-transition-duration) ease-out;
    border-bottom: none;
  }
  .site-title:hover { color: var(--link-hover-color); border-bottom: none; }
  .header-controls { display: flex; align-items: center; gap: 1.5rem; }
  nav a {
    text-decoration: none; color: var(--text-secondary-color);
    transition: color 0.2s ease-in-out; font-family: var(--font-sans); font-size: 0.9rem;
    padding-bottom: 2px;
    border-bottom: 1px solid transparent;
  }
  nav a:hover {
      color: var(--link-hover-color);
      border-bottom-color: var(--accent-color);
  }

  .site-content {
      position: relative; flex-grow: 1;
      padding: 5rem 0;
  }
  .page-container { width: 100%; }

  .site-footer {
    padding: 3rem 0 3rem 0;
    border-top: 1px solid var(--border-color);
    text-align: center; font-size: 0.8rem;
    color: var(--text-secondary-color);
    transition: color var(--theme-transition-duration) ease-out,
                border-color var(--theme-transition-duration) ease-out;
    background-color: var(--footer-bg); /* Solid */
    margin-top: 6rem;
  }
</style>