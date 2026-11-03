import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			// Community lives on the subdomain; keep marketing redirects crawlable.
			entries: ['*', '/en/community', '/fr/community']
		}
	}
};

export default config;
