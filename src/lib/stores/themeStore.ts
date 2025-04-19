import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

const storageKey = 'theme';
const darkThemeClass = 'dark';
const lightThemeClass = 'light';

function getInitialTheme(): Theme {
	if (!browser) { return 'light'; }
	let storedTheme: string | null = null;
	try { storedTheme = localStorage.getItem(storageKey); } catch { console.warn('Could not access localStorage for theme'); }
	if (storedTheme === 'dark' || storedTheme === 'light') { return storedTheme as Theme; }
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { return 'dark'; }
	return 'light';
}

const initialTheme = getInitialTheme();
export const theme = writable<Theme>(initialTheme);

if (browser) {
	theme.subscribe((value) => {
		try {
			localStorage.setItem(storageKey, value);
			const htmlEl = document.documentElement;
			htmlEl.classList.remove(darkThemeClass, lightThemeClass);
			htmlEl.classList.add(value === 'dark' ? darkThemeClass : lightThemeClass);
		} catch { console.warn('Could not update theme in localStorage or DOM'); }
	});

	const prefersDarkMatcher = window.matchMedia('(prefers-color-scheme: dark)');
	const handleSystemThemeChange = (event: MediaQueryListEvent) => {
		if (!localStorage.getItem(storageKey)) { theme.set(event.matches ? 'dark' : 'light'); }
	};
	try { prefersDarkMatcher.addEventListener('change', handleSystemThemeChange); }
    catch { try { prefersDarkMatcher.addListener(handleSystemThemeChange); } catch (e2) { console.warn("Could not add listener for OS theme changes using addListener", e2); } }
}

export function toggleTheme() {
	theme.update((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
}