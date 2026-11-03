<script>
	import PricingSection from '$lib/components/PricingSection.svelte';
	import { site } from '$lib/site';
	import { t } from '$lib/i18n';
</script>

<svelte:head>
	<title>{$t.pricingTitle} – {site.name}</title>
	<meta name="description" content={$t.pricingSub} />
</svelte:head>

<div class="page">
	<PricingSection />
</div>

<style>
	.page {
		padding-top: calc(var(--nav-inset) + var(--nav-h) + 0.5rem);
		padding-bottom: 2rem;
	}

	.page :global(.pricing) {
		border-top: none;
		padding-top: 1rem;
	}
</style>
