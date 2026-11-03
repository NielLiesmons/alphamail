<script>
	import VideoHero from '$lib/components/VideoHero.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import ServiceCarousel from '$lib/components/ServiceCarousel.svelte';
	import PricingSection from '$lib/components/PricingSection.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import GlassButton from '$lib/components/GlassButton.svelte';
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

<section class="section pillars after-hero">
	<SectionTitle title={$t.pillarsTitle} sub={$t.pillarsSub}>
		<GlassButton href={localizedPath(lang, '/product')}>{$t.learnMore}</GlassButton>
	</SectionTitle>
	<ServiceCarousel />
</section>

<PricingSection />

<section class="section community">
	<div class="container band">
		<h2 class="display-section">{$t.communityTitle}</h2>
		<p class="text-desc">{$t.communitySub}</p>
		<div class="cta">
			<PrimaryButton href={site.communityUrl} target="_blank" rel="noopener noreferrer"
				>{$t.communityCta}</PrimaryButton
			>
		</div>
	</div>
</section>

<section class="section how">
	<div class="container band">
		<h2 class="display-section">{$t.howTitle}</h2>
		<p class="text-desc">{$t.howSub}</p>
	</div>
</section>

<section class="section close">
	<div class="container band">
		<h2 class="display-section">{$t.closeTitle}</h2>
		<div class="cta">
			<PrimaryButton href={localizedPath(lang, '/contact')}>{$t.closeCta}</PrimaryButton>
		</div>
	</div>
</section>

<style>
	.after-hero {
		border-top: none;
		padding-top: 1.75rem;
	}

	@media (min-width: 640px) {
		.after-hero {
			padding-top: 2.25rem;
		}
	}

	@media (min-width: 1024px) {
		.after-hero {
			padding-top: 2.75rem;
		}
	}

	.pillars {
		overflow: visible;
	}

	.pillars :global(.section-title) {
		margin-bottom: 0.85rem;
	}

	.band {
		text-align: center;
		max-width: 36rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.85rem;
	}

	.band .text-desc {
		margin: 0;
	}

	.cta {
		margin-top: 0.35rem;
	}

	.community,
	.how,
	.close {
		padding-top: 2.5rem;
		padding-bottom: 2.5rem;
	}
</style>
