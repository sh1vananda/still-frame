import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.md'],
    // Optional: Define a default layout for all markdown files if desired
    // layout: {
    //  _: './src/lib/components/MarkdownLayout.svelte' // Path to a layout component
    // },
    // Optional: Add remark/rehype plugins here for more markdown features
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.md'], // Add .md to recognized extensions
    preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)], // Apply mdsvex preprocessing
    kit: {
        adapter: adapter(),
        // Prerendering might be useful later if deploying statically
        // prerender: { entries: ['*', '/reviews/*', ...] } // Example, adjust as needed
        alias: {
             // Optional: Define aliases for easier imports
             '$lib': 'src/lib',
             '$reviews': 'src/reviews' // Example alias for reviews folder
        }
    }
};

export default config;