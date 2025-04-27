import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte'], // Only .svelte extension needed now
    preprocess: [vitePreprocess()], // Only vitePreprocess needed now
    kit: {
        adapter: adapter(),
        alias: {
            $lib: 'src/lib'
        }
    }
};

export default config;