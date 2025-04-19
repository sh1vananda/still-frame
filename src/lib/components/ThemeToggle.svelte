<script lang="ts">
	import { theme, toggleTheme } from '$lib/stores/themeStore';

	let buttonTitle: string;
	$: buttonTitle = `Switch to ${$theme === 'dark' ? 'light' : 'dark'} mode`;
</script>

<button
	on:click={toggleTheme}
	class="theme-toggle-minimal"
	class:dark={$theme === 'dark'}
	role="switch"
	aria-checked={$theme === 'dark'}
	aria-label={buttonTitle}
	title={buttonTitle}
>
	<span class="track">
		<span class="knob"></span>
	</span>
</button>

<style>
	.theme-toggle-minimal {
		background: none; border: none; padding: 0;
		cursor: pointer; outline-offset: 4px;
		display: inline-flex; align-items: center;
        height: 24px; width: 44px;
        border-radius: 12px;
        position: relative;
        border: 1px solid var(--border-color);
        transition: border-color var(--theme-transition-duration) ease-out;
	}
    .theme-toggle-minimal:hover { border-color: var(--accent-color); }
	.track { display: block; width: 100%; height: 100%; border-radius: 12px; position: relative; }
	.knob {
		position: absolute; top: 2px; left: 2px; width: 18px; height: 18px;
		background-color: var(--text-secondary-color);
		border-radius: 50%;
		transition: transform 0.25s ease-out,
                    background-color var(--theme-transition-duration) ease-out;
        will-change: transform;
	}
	.theme-toggle-minimal.dark .knob {
		transform: translateX(20px);
        background-color: var(--accent-color);
	}
	.theme-toggle-minimal:focus-visible {
        box-shadow: 0 0 0 2px var(--bg-color), 0 0 0 4px var(--accent-color);
    }
</style>