<script>
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { site } from '$lib/site';
	import { t, locale } from '$lib/i18n';
	import { localizedPath } from '$lib/i18n-path';

	const channels = $derived([
		{ id: 'general', label: $locale === 'fr' ? 'Général' : 'General' },
		{ id: 'letters', label: $locale === 'fr' ? 'Lettres' : 'Letters' },
		{ id: 'updates', label: $locale === 'fr' ? 'Actus' : 'Updates' },
		{ id: 'members', label: $locale === 'fr' ? 'Membres' : 'Members' }
	]);

	let active = $state('general');
</script>

<svelte:head>
	<title>{$t.communityTitle} – {site.name}</title>
	<meta name="description" content={$t.communitySub} />
</svelte:head>

<div class="community-page">
	<header class="intro">
		<p class="eyebrow">{$t.navCommunity}</p>
		<h1 class="display-section">{$t.communityTitle}</h1>
		<p class="text-desc">{$t.communitySub}</p>
	</header>

	<div class="board">
		<aside class="rail" aria-label={$t.navCommunity}>
			<p class="rail-label">{$locale === 'fr' ? 'Espaces' : 'Spaces'}</p>
			<ul class="channel-list">
				{#each channels as ch (ch.id)}
					<li>
						<button
							type="button"
							class="channel"
							class:on={active === ch.id}
							onclick={() => (active = ch.id)}
						>
							{ch.label}
						</button>
					</li>
				{/each}
			</ul>
		</aside>

		<section class="feed" aria-live="polite">
			<div class="feed-head">
				<h2 class="feed-title">{channels.find((c) => c.id === active)?.label}</h2>
			</div>
			<div class="feed-empty">
				<p class="soon">{$t.communitySoon}</p>
				<PrimaryButton href={localizedPath($locale, '/contact')}>{$t.closeCta}</PrimaryButton>
			</div>
		</section>
	</div>
</div>

<style>
	.community-page {
		padding: calc(var(--nav-inset) + var(--nav-h) + 1rem) var(--pad-x) 3rem;
		box-sizing: border-box;
		max-width: var(--container-max);
		margin-inline: auto;
		width: 100%;
	}

	.intro {
		text-align: center;
		max-width: 36rem;
		margin: 0 auto 1.75rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.65rem;
	}

	.eyebrow {
		margin: 0;
		font-size: 1rem;
		font-weight: 500;
		color: var(--ink33);
	}

	.intro .text-desc {
		margin: 0;
	}

	/* Soft two-column board — Zapstore community bones, quieter marketing chrome */
	.board {
		display: flex;
		flex-direction: column;
		min-height: min(62vh, 560px);
		border-top: 1px solid var(--hairline);
		border-bottom: 1px solid var(--hairline);
		overflow: hidden;
	}

	.rail {
		flex-shrink: 0;
		padding: 1rem 0 0.75rem;
		border-bottom: 1px solid var(--hairline);
	}

	.rail-label {
		margin: 0 0 0.55rem;
		padding: 0 0.15rem;
		font-size: 11px;
		font-weight: 650;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink33);
	}

	.channel-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 0.35rem;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.channel-list::-webkit-scrollbar {
		display: none;
	}

	.channel {
		flex-shrink: 0;
		border: 0;
		border-radius: 999px;
		padding: 0.45rem 0.9rem;
		background: color-mix(in srgb, var(--ink) 5%, transparent);
		color: var(--ink66);
		font: inherit;
		font-size: 13px;
		font-weight: 550;
		cursor: pointer;
	}

	.channel.on,
	.channel:hover {
		background: color-mix(in srgb, var(--ink) 9%, transparent);
		color: var(--ink);
	}

	.feed {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		min-height: 280px;
	}

	.feed-head {
		padding: 1rem 0.15rem 0.75rem;
		border-bottom: 1px solid var(--hairline);
	}

	.feed-title {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 15px;
		font-weight: 650;
		letter-spacing: -0.01em;
		color: var(--ink);
	}

	.feed-empty {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 2.5rem 1rem;
		text-align: center;
	}

	.soon {
		margin: 0;
		max-width: 26rem;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.45;
		color: var(--ink66);
	}

	@media (min-width: 768px) {
		.community-page {
			padding-top: calc(var(--nav-inset) + var(--nav-h) + 1.5rem);
		}

		.intro {
			margin-bottom: 2rem;
			max-width: 40rem;
		}

		.board {
			flex-direction: row;
			min-height: min(68vh, 620px);
			border-left: 1px solid var(--hairline);
			border-right: 1px solid var(--hairline);
			border-radius: 0;
		}

		.rail {
			width: 220px;
			padding: 1.15rem 0.85rem;
			border-bottom: 0;
			border-right: 1px solid var(--hairline);
		}

		.channel-list {
			flex-direction: column;
			overflow: visible;
			gap: 2px;
		}

		.channel {
			width: 100%;
			border-radius: 10px;
			text-align: left;
			padding: 0.55rem 0.7rem;
			background: transparent;
		}

		.channel.on {
			background: color-mix(in srgb, var(--ink) 7%, transparent);
		}

		.feed-head {
			padding: 1.1rem 1.25rem;
		}

		.feed-empty {
			padding: 3rem 1.5rem;
		}
	}
</style>
