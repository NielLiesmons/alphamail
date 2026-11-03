import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/** @typedef {'fr' | 'en'} Locale */
/** @typedef {'light' | 'dark' | 'system'} Theme */

const KEYS = {
	theme: 'niel-theme'
};

/** @returns {Locale} */
function initialLocale() {
	// URL (/fr|/en) is the source of truth — layout calls setLocale from the path.
	return 'en';
}

/** @returns {Theme} */
function initialTheme() {
	if (!browser) return 'system';
	const saved = localStorage.getItem(KEYS.theme);
	if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
	return 'system';
}

export const locale = writable(/** @type {Locale} */ (initialLocale()));
export const theme = writable(/** @type {Theme} */ (initialTheme()));

function applyTheme(/** @type {Theme} */ t) {
	if (!browser) return;
	const root = document.documentElement;
	const dark =
		t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
	root.dataset.theme = dark ? 'dark' : 'light';
	root.style.colorScheme = dark ? 'dark' : 'light';
}

if (browser) {
	locale.subscribe((v) => {
		document.documentElement.lang = v;
	});
	theme.subscribe((v) => {
		localStorage.setItem(KEYS.theme, v);
		applyTheme(v);
	});
	applyTheme(initialTheme());

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		let current;
		theme.subscribe((v) => (current = v))();
		if (current === 'system') applyTheme('system');
	});
}

/** @param {Locale} next */
export function setLocale(next) {
	locale.set(next);
}

/** @param {Theme} next */
export function setTheme(next) {
	theme.set(next);
}
