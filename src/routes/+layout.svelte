<script lang="ts">
  import '../app.css';
  import { navigating, page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { quintOut } from 'svelte/easing';

  const siteTitle = "Still Frame";

  $: isNavigating = $navigating !== null;
  $: currentPath = $page.route.id;
</script>

{#if isNavigating}
  <div class="navigation-indicator"></div>
{/if}

<header class="site-header">
  <div class="header-content-wrapper">
      <a href="/" class="site-title">{siteTitle}</a>
      <div class="header-controls">
        <nav>
          <a href="/reviews">Reviews</a>
        </nav>
        <ThemeToggle />
      </div>
  </div>
</header>

<div class="site-wrapper">
  <main class="site-content">
     {#key currentPath}
         <div
            class="page-container"
            in:fade={{ duration: 400, delay: 150, easing: quintOut }}
            out:fade={{ duration: 150, easing: quintOut }}
         >
            <slot />
         </div>
     {/key}
  </main>

  <footer class="site-footer">
     <div class="footer-content-wrapper">
        <p>© {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
     </div>
  </footer>
</div>

<style>
  .navigation-indicator {
    position: fixed; top: 0; left: 0; right: 0; height: 1px;
    background: var(--accent-color, #ccc); z-index: 101; /* Higher z-index */
    animation: pulse 2s infinite ease-in-out;
    transition: background-color var(--theme-transition-duration) ease-out;
    opacity: 0.6;
  }
  @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }

  /* Header Styling (Full Width Background) */
  .site-header {
    width: 100%; /* Explicit full width */
    position: sticky; top: 0; z-index: 10; /* Stick to top */
    border-bottom: 1px solid var(--border-color);
    background-color: var(--header-bg);
    transition: border-color var(--theme-transition-duration) ease-out,
                background-color var(--theme-transition-duration) ease-out;
  }
  /* Inner Wrapper for Content Centering */
  .header-content-wrapper {
      max-width: 760px; /* Max width of the content inside header */
      margin: 0 auto; /* Center the content */
      padding: 2rem 2rem; /* Horizontal padding matches site-wrapper */
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .site-title {
    font-size: 1.3rem; font-weight: 400;
    text-decoration: none; color: inherit; letter-spacing: 0.5px;
    transition: color var(--theme-transition-duration) ease-out;
    border-bottom: none;
    white-space: nowrap; /* Prevent wrapping */
  }
  .site-title:hover { color: var(--link-hover-color); border-bottom: none; }
  .header-controls { display: flex; align-items: center; gap: 1.5rem; flex-shrink: 0; }
  nav a {
    text-decoration: none; color: var(--text-secondary-color);
    transition: color 0.2s ease-in-out; font-family: var(--font-sans); font-size: 0.9rem;
    padding-bottom: 2px;
    border-bottom: 1px solid transparent;
    white-space: nowrap; /* Prevent wrapping */
  }
  nav a:hover {
      color: var(--link-hover-color);
      border-bottom-color: var(--accent-color);
  }

  /* Site Wrapper only constraints main/footer content */
  .site-wrapper {
    max-width: 760px; margin: 0 auto; padding: 0 2rem;
    /* No min-height needed here usually */
    display: flex; flex-direction: column;
    flex-grow: 1; /* Allow wrapper to grow if needed */
  }

  .site-content {
      position: relative; flex-grow: 1;
      padding: 5rem 0; /* Vertical padding for content */
  }
  .page-container { width: 100%; }

  /* Footer Styling (Full Width Background) */
  .site-footer {
    width: 100%; /* Explicit full width */
    border-top: 1px solid var(--border-color);
    background-color: var(--footer-bg);
    margin-top: 6rem; /* Keep space above footer */
    transition: color var(--theme-transition-duration) ease-out,
                border-color var(--theme-transition-duration) ease-out,
                background-color var(--theme-transition-duration) ease-out;
  }
  /* Inner Wrapper for Content Centering */
  .footer-content-wrapper {
       max-width: 760px;
       margin: 0 auto;
       padding: 3rem 2rem;
       text-align: center; font-size: 0.8rem;
       color: var(--text-secondary-color);
  }
  .footer-content-wrapper p { margin-bottom: 0; }

</style>