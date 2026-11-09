<script>
	/**
	 * Full-height screen hero — headline over a live chat mock (Bley frame shape).
	 */
	import HeroTopicPill from './HeroTopicPill.svelte';
	import HeroChatPreview from './HeroChatPreview.svelte';
	import { t } from '$lib/i18n';

	let active = $state(0);

	const topics = $derived($t.heroTopics ?? []);
	const scenes = $derived($t.heroScenes ?? []);
</script>

<section class="hero">
	<div class="frame">
		<HeroChatPreview {scenes} {active} composerPh={$t.heroComposerPh} />

		<!-- Progressive blur/fade from the top so feed shows through the headline -->
		<div class="veil" aria-hidden="true"></div>

		<div class="copy">
			<h1 class="headline">
				<span class="sr-only">{$t.heroTitleSr}</span>
				<span class="line" aria-hidden="true">
					<span class="lead">{$t.heroLead}</span>
					<HeroTopicPill {topics} bind:active />
				</span>
				<span class="sub" aria-hidden="true">{$t.heroSub}</span>
			</h1>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: var(--hero-inset);
		padding-bottom: 1.15rem;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
	}

	.frame {
		position: relative;
		isolation: isolate;
		z-index: 1;
		width: 100%;
		/* Nearly full viewport; capped on very large screens */
		height: calc(100svh - (2 * var(--hero-inset)));
		min-height: 560px;
		max-height: 920px;
		border-radius: var(--radius-hero);
		overflow: hidden;
		background: color-mix(in srgb, var(--ink) 3.5%, var(--bg));
		box-shadow:
			0 0 0 1px color-mix(in srgb, var(--ink) 8%, transparent),
			0 24px 64px color-mix(in srgb, var(--ink-raw, #000) 18%, transparent);
	}

	.veil {
		position: absolute;
		inset: 0 0 auto;
		height: min(58%, 32rem);
		z-index: 2;
		pointer-events: none;
		/* Strong blur at top → clear toward the conversation */
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
		mask-image: linear-gradient(
			to bottom,
			#000 0%,
			rgba(0, 0, 0, 0.92) 22%,
			rgba(0, 0, 0, 0.45) 55%,
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to bottom,
			#000 0%,
			rgba(0, 0, 0, 0.92) 22%,
			rgba(0, 0, 0, 0.45) 55%,
			transparent 100%
		);
		background: linear-gradient(
			to bottom,
			color-mix(in srgb, var(--bg) 55%, transparent) 0%,
			color-mix(in srgb, var(--bg) 28%, transparent) 38%,
			color-mix(in srgb, var(--bg) 8%, transparent) 68%,
			transparent 100%
		);
	}

	.copy {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		z-index: 3;
		padding: calc(var(--nav-inset) + var(--nav-h) + 0.85rem) var(--pad-x) 1rem;
		text-align: center;
		pointer-events: none;
	}

	.copy :global(.pill) {
		pointer-events: auto;
	}

	.headline {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
	}

	.line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.45rem 0.55rem;
	}

	.lead,
	.sub {
		font-family: var(--font-display);
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.08;
		font-size: clamp(30px, 6.2vw, 56px);
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

	@media (min-width: 768px) {
		.copy {
			padding-top: calc(var(--nav-inset) + var(--nav-h) + 1.25rem);
		}
	}

	@media (min-width: 1024px) {
		.hero {
			padding-top: var(--hero-inset);
			padding-inline: var(--pad-x);
			padding-bottom: 1.5rem;
		}

		.frame {
			width: min(100%, var(--container-max));
			height: min(860px, calc(100svh - 2 * var(--hero-inset)));
			min-height: 640px;
			max-height: 900px;
		}
	}

	@media (min-width: 1600px) {
		.frame {
			height: 820px;
			min-height: 820px;
			max-height: 820px;
		}
	}
</style>
