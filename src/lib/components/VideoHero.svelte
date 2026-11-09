<script>
	/**
	 * Animated landing hero — topic carousel + "Entered the Chat" + live chat mock.
	 */
	import PrimaryButton from './PrimaryButton.svelte';
	import HeroTopicCarousel from './HeroTopicCarousel.svelte';
	import HeroChatPreview from './HeroChatPreview.svelte';
	import { t, locale } from '$lib/i18n';
	import { localizedPath } from '$lib/i18n-path';

	let active = $state(0);

	const words = $derived($t.heroWords ?? []);
	const scenes = $derived($t.heroScenes ?? []);
</script>

<section class="hero">
	<div class="inner">
		<div class="copy">
			<h1 class="headline">
				<span class="sr-only">{$t.heroTitleSr}</span>
				<span class="carousel-line" aria-hidden="true">
					<HeroTopicCarousel {words} bind:active />
				</span>
				<span class="entered">{$t.heroEntered}</span>
			</h1>
			{#if $t.heroDesc}
				<p class="text-desc">{$t.heroDesc}</p>
			{/if}
			<div class="cta">
				<PrimaryButton href={localizedPath($locale, '/contact')}>{$t.heroCta}</PrimaryButton>
			</div>
		</div>

		<div class="stage">
			<div class="bridge" aria-hidden="true"></div>
			<HeroChatPreview {scenes} {active} composerPh={$t.heroComposerPh} />
		</div>
	</div>
</section>

<style>
	.hero {
		padding: calc(var(--nav-inset) + var(--nav-h) + 2.4rem) 0 0;
		box-sizing: border-box;
	}

	.inner {
		width: min(100% - 2 * var(--pad-x), var(--container-max));
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.copy {
		position: relative;
		z-index: 3;
		text-align: center;
		width: 100%;
		max-width: 48rem;
	}

	.headline {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
	}

	.carousel-line {
		display: block;
		width: 100%;
	}

	.entered {
		display: block;
		font-family: var(--font-display);
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.08;
		font-size: clamp(34px, 6.6vw, 68px);
		color: var(--ink);
		text-wrap: balance;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.copy .text-desc {
		margin: 0.95rem auto 1.35rem;
		max-width: 30rem;
	}

	.cta {
		display: flex;
		justify-content: center;
	}

	.stage {
		position: relative;
		z-index: 1;
		width: 100%;
		margin-top: -0.35rem;
	}

	/* Soft dissolve from headline into the chat mock */
	.bridge {
		position: absolute;
		left: 50%;
		top: -1.25rem;
		transform: translateX(-50%);
		width: min(100%, 40rem);
		height: 4.5rem;
		z-index: 2;
		pointer-events: none;
		background: linear-gradient(
			to bottom,
			var(--bg) 0%,
			color-mix(in srgb, var(--bg) 78%, transparent) 38%,
			color-mix(in srgb, var(--bg) 28%, transparent) 72%,
			transparent 100%
		);
	}

	@media (max-width: 767px) {
		.entered {
			font-size: clamp(30px, 9vw, 44px);
		}
	}

	@media (min-width: 768px) {
		.hero {
			padding-top: calc(var(--nav-inset) + var(--nav-h) + 3.1rem);
		}

		.stage {
			margin-top: -0.15rem;
		}
	}

	@media (min-width: 1024px) {
		.hero {
			padding-top: calc(var(--nav-inset) + var(--nav-h) + 3.75rem);
		}
	}
</style>
