<script>
	import VideoHero from '$lib/components/VideoHero.svelte';
	import FeatureTabs from '$lib/components/FeatureTabs.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { page } from '$app/stores';
	import { site } from '$lib/site';
	import { t, locale } from '$lib/i18n';
	import { langFromPath, localizedPath, stripLang } from '$lib/i18n-path';

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

<FeatureTabs title={$t.privateTitle} sub={$t.privateSub} cards={$t.privateCards} />

<FeatureTabs title={$t.publicTitle} sub={$t.publicSub} cards={$t.publicCards} />

<section class="close">
	<div class="band">
		<h2 class="display-section">{$t.closeTitle}</h2>
		<p class="text-desc">{$t.closeSub}</p>
		<PrimaryButton href={localizedPath(lang, '/contact')}>{$t.heroCta}</PrimaryButton>
	</div>
</section>

<style>
	.close {
		padding: 3rem var(--pad-x) 3.5rem;
		border-top: 1px solid var(--hairline);
		text-align: center;
	}

	.band {
		width: min(100%, var(--container-max));
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.85rem;
	}

	.band .text-desc {
		margin: 0 0 0.35rem;
		max-width: 32rem;
	}
</style>
