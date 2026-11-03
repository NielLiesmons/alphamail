<script>
	import { onMount } from 'svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { site } from '$lib/site';
	import { t } from '$lib/i18n';

	onMount(() => {
		// Soft handoff — marketing path kept for old links; app lives on the subdomain.
		window.location.replace(site.communityUrl);
	});
</script>

<svelte:head>
	<title>{$t.communityTitle} – {site.name}</title>
	<meta name="description" content={$t.communitySoon} />
	<meta http-equiv="refresh" content="0;url={site.communityUrl}" />
	<link rel="canonical" href={site.communityUrl} />
</svelte:head>

<div class="handoff">
	<p class="eyebrow">{$t.navCommunity}</p>
	<h1 class="display-section">{$t.communityTitle}</h1>
	<p class="text-desc">{$t.communitySoon}</p>
	<PrimaryButton href={site.communityUrl} target="_blank" rel="noopener noreferrer"
		>{$t.communityCta}</PrimaryButton
	>
</div>

<style>
	.handoff {
		min-height: 60vh;
		padding: calc(var(--nav-inset) + var(--nav-h) + 2rem) var(--pad-x) 3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0.75rem;
		box-sizing: border-box;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 550;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink33);
	}

	.text-desc {
		margin: 0 0 0.5rem;
		max-width: 28rem;
	}
</style>
