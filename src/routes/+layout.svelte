<script>
	import '../app.css';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { site } from '$lib/site';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={site.ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={site.ogImage} />
</svelte:head>

<div class="shell">
	<SiteNav />
	<main>
		{@render children()}
	</main>
	<SiteFooter />
</div>

<style>
	.shell {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
	}
</style>
