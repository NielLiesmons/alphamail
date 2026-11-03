<script>
	import VideoHero from '$lib/components/VideoHero.svelte';
	import FeatureTabs from '$lib/components/FeatureTabs.svelte';
	import { page } from '$app/stores';
	import { site } from '$lib/site';
	import { t, locale } from '$lib/i18n';
	import { langFromPath, stripLang } from '$lib/i18n-path';

	const lang = $derived(langFromPath($page.url.pathname) || $locale);
	const description = $derived($locale === 'en' ? site.descriptionEn : site.descriptionFr);
	const pathRest = $derived(stripLang($page.url.pathname));
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={site.name} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="{site.url}/{lang}" />
	<meta property="og:image" content={site.ogImage} />
	<link rel="canonical" href="{site.url}/{lang}" />
	<link rel="alternate" hreflang="fr" href="{site.url}/fr{pathRest === '/' ? '' : pathRest}" />
	<link rel="alternate" hreflang="en" href="{site.url}/en{pathRest === '/' ? '' : pathRest}" />
	<link rel="alternate" hreflang="x-default" href="{site.url}/en" />
</svelte:head>

<VideoHero />

<FeatureTabs
	eyebrow={$t.privateEyebrow}
	title={$t.privateTitle}
	sub={$t.privateSub}
	cards={$t.privateCards}
/>

<FeatureTabs
	eyebrow={$t.publicEyebrow}
	title={$t.publicTitle}
	sub={$t.publicSub}
	cards={$t.publicCards}
/>
