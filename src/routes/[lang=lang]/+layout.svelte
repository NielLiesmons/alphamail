<script>
	import { page } from '$app/stores';
	import { site } from '$lib/site';
	import { setLocale } from '$lib/prefs';
	import { stripLang } from '$lib/i18n-path';

	let { data, children } = $props();

	$effect.pre(() => {
		setLocale(data.lang);
	});

	const rest = $derived(stripLang($page.url.pathname));
	const restSuffix = $derived(rest === '/' ? '' : rest);
</script>

<svelte:head>
	<link rel="alternate" hreflang="fr" href="{site.url}/fr{restSuffix}" />
	<link rel="alternate" hreflang="en" href="{site.url}/en{restSuffix}" />
	<link rel="alternate" hreflang="x-default" href="{site.url}/en{restSuffix}" />
</svelte:head>

{@render children()}
