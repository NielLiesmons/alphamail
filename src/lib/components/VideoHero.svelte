<script>
	/**
	 * Hero panel — Bley frame heights; Collaborate On + cycling topic pill over chat mock.
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

		<div class="veil" aria-hidden="true"></div>

		<div class="copy">
			<h1 class="headline">
				<span class="sr-only">{$t.heroTitleSr}</span>
				<span class="lead" aria-hidden="true">
					<span class="lead-a">{$t.heroLeadA}</span><span class="lead-b">{$t.heroLeadB}</span>
				</span>
				<HeroTopicPill {topics} bind:active />
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
		/* Bley: stable svh band with fixed desktop sizes — not full-screen */
		height: 82svh;
		min-height: 520px;
		max-height: 760px;
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
		height: min(62%, 28rem);
		z-index: 2;
		pointer-events: none;
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		mask-image: linear-gradient(
			to bottom,
			#000 0%,
			rgba(0, 0, 0, 0.9) 28%,
			rgba(0, 0, 0, 0.4) 62%,
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to bottom,
			#000 0%,
			rgba(0, 0, 0, 0.9) 28%,
			rgba(0, 0, 0, 0.4) 62%,
			transparent 100%
		);
		background: linear-gradient(
			to bottom,
			color-mix(in srgb, var(--bg) 58%, transparent) 0%,
			color-mix(in srgb, var(--bg) 26%, transparent) 42%,
			transparent 100%
		);
	}

	.copy {
		position: absolute;
		left: 0;
		right: 0;
		/* Sit lower in the panel (not stuck under the nav) */
		top: 34%;
		z-index: 3;
		padding: 0 var(--pad-x);
		text-align: center;
		pointer-events: none;
		transform: translateY(-42%);
	}

	.copy :global(.pill) {
		pointer-events: auto;
	}

	.headline {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.85rem;
	}

	.lead {
		display: inline-flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.28em;
		font-family: var(--font-display);
		font-weight: 650;
		letter-spacing: -0.03em;
		line-height: 1.05;
		font-size: clamp(34px, 6.4vw, 58px);
		text-wrap: balance;
	}

	.lead-a,
	.lead-b {
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		-webkit-text-fill-color: transparent;
	}

	/* Zapstore hero title recipe — graydient + blurple-light */
	.lead-a {
		background-image: var(--gradient-gray);
	}

	.lead-b {
		background-image: var(--gradient-blurple-light);
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
			top: 36%;
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
			height: 700px;
			min-height: 700px;
			max-height: none;
		}

		.copy {
			top: 38%;
		}
	}

	@media (min-width: 1600px) {
		.frame {
			height: 740px;
			min-height: 740px;
		}
	}
</style>
