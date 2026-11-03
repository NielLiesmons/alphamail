<script>
	import PageHero from '$lib/components/PageHero.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { site, pillars } from '$lib/site';
	import { t } from '$lib/i18n';
	import { localizedPath } from '$lib/i18n-path';
	import { locale } from '$lib/prefs';
</script>

<svelte:head>
	<title>{$t.productTitle} – {site.name}</title>
</svelte:head>

<div class="page section page-chrome has-hero">
	<PageHero title={$t.productTitle} description={$t.productSub} />
</div>

{#each pillars as pillar, i}
	{@const copy = $t.services[pillar.id]}
	<section class="section pillar-block" class:first={i === 0} id={pillar.id}>
		<div class="container intro">
			<h2 class="display-section">{copy.name}</h2>
			<p class="text-desc">{copy.long}</p>
		</div>
	</section>
{/each}

<section class="section cta-block">
	<div class="container center">
		<PrimaryButton href={localizedPath($locale, '/contact')}>{$t.closeCta}</PrimaryButton>
	</div>
</section>

<style>
	.pillar-block.first {
		border-top: none;
		padding-top: 0.5rem;
	}

	.intro {
		text-align: center;
		max-width: 36rem;
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding-bottom: 0.5rem;
	}

	.intro .text-desc {
		margin: 0;
	}

	.cta-block {
		padding-top: 1rem;
		padding-bottom: 3rem;
	}

	.center {
		display: flex;
		justify-content: center;
	}
</style>
