/** @type {import('./$types').LayoutLoad} */
export function load({ params }) {
	return { lang: /** @type {'fr' | 'en'} */ (params.lang) };
}
