<script>
	/**
	 * Landing hero — Zapstore “Release with ease” preview under CTAs.
	 * Shot lives under /media (Caddy-safe) with accent bloom + bottom fade.
	 */
	import PrimaryButton from './PrimaryButton.svelte';
	import GlassButton from './GlassButton.svelte';
	import { t, locale } from '$lib/i18n';
	import { localizedPath } from '$lib/i18n-path';
</script>

<section class="hero">
	<div class="copy">
		<h1 class="display-hero">{$t.heroTitle}</h1>
		<p class="text-desc">{$t.heroDesc}</p>
		<div class="cta">
			<GlassButton href={localizedPath($locale, '/product')}>{$t.heroSecondary}</GlassButton>
			<PrimaryButton href={localizedPath($locale, '/contact')}>{$t.heroCta}</PrimaryButton>
		</div>
	</div>

	<div class="preview">
		<img
			class="shot"
			src="/media/studio-screenshot.png"
			alt=""
			width="1720"
			height="1123"
			decoding="async"
			fetchpriority="high"
		/>
		<div class="fade" aria-hidden="true"></div>
	</div>
</section>

<style>
	.hero {
		padding: calc(var(--nav-inset) + var(--nav-h) + 1.25rem) var(--pad-x) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
	}

	.copy {
		position: relative;
		z-index: 2;
		text-align: center;
		width: 100%;
		max-width: 40rem;
		margin-bottom: 1.5rem;
	}

	.copy .display-hero {
		text-wrap: balance;
	}

	.copy .text-desc {
		margin: 0.85rem auto 1.5rem;
		max-width: 32rem;
	}

	.cta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
	}

	.cta :global(.btn),
	.cta :global(.btn-glass) {
		min-width: 9.25rem;
	}

	.preview {
		position: relative;
		width: 100vw;
		margin-left: calc(50% - 50vw);
		height: clamp(220px, 42vw, 440px);
		overflow: hidden;
	}

	.shot {
		display: block;
		width: 100%;
		height: auto;
		filter: drop-shadow(0 0 60px color-mix(in srgb, var(--accent) 18%, transparent))
			drop-shadow(0 24px 80px color-mix(in srgb, var(--accent) 10%, transparent));
	}

	.fade {
		position: absolute;
		inset: auto 0 0 0;
		height: min(160px, 50%);
		background: linear-gradient(
			to top,
			var(--bg) 0%,
			color-mix(in srgb, var(--bg) 80%, transparent) 20%,
			color-mix(in srgb, var(--bg) 40%, transparent) 50%,
			color-mix(in srgb, var(--bg) 15%, transparent) 75%,
			transparent 100%
		);
		pointer-events: none;
	}

	@media (min-width: 768px) {
		.copy {
			max-width: 48rem;
			margin-bottom: 2rem;
		}
	}

	@media (min-width: 1024px) {
		.hero {
			padding-top: calc(var(--nav-inset) + var(--nav-h) + 2rem);
		}

		.copy {
			max-width: 52rem;
			margin-bottom: 2.5rem;
		}
	}
</style>
