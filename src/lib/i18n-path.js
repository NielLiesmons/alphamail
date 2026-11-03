/** @typedef {'fr' | 'en'} Locale */

/**
 * @param {string} pathname
 * @returns {Locale | null}
 */
export function langFromPath(pathname) {
	const m = String(pathname || '').match(/^\/(fr|en)(?=\/|$)/);
	return m ? /** @type {Locale} */ (m[1]) : null;
}

/**
 * Path without /fr|/en prefix. Always starts with `/` (or `/` alone).
 * @param {string} pathname
 */
export function stripLang(pathname) {
	const stripped = String(pathname || '').replace(/^\/(fr|en)(?=\/|$)/, '');
	return stripped === '' ? '/' : stripped;
}

/**
 * @param {Locale} lang
 * @param {string} path - absolute path without locale, e.g. `/boutique` or `/`
 */
export function localizedPath(lang, path = '/') {
	const p = path.startsWith('/') ? path : `/${path}`;
	if (p === '/') return `/${lang}`;
	return `/${lang}${p}`;
}
