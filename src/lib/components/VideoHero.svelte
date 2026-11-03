<script>
	/**
	 * Landing hero — copy + Zapstore-style preview inside container width.
	 */
	import PrimaryButton from './PrimaryButton.svelte';
	import { t, locale } from '$lib/i18n';
	import { localizedPath } from '$lib/i18n-path';
</script>

<section class="hero">
	<div class="inner">
		<div class="copy">
			<h1 class="display-hero">{$t.heroTitle}</h1>
			<p class="text-desc">{$t.heroDesc}</p>
			<div class="cta">
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
	</div>
</section>

<style>
	.hero {
		/* Nav clearance + real breathing room above the headline */
		padding: calc(var(--nav-inset) + var(--nav-h) + 2.75rem) 0 0;
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
		z-index: 2;
		text-align: center;
		width: 100%;
		max-width: 40rem;
		margin-bottom: 1.75rem;
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
		justify-content: center;
	}

	.preview {
		position: relative;
		width: 100%;
		height: clamp(200px, 38vw, 400px);
		overflow: hidden;
	}

	.shot {
		display: block;
		width: 100%;
		height: auto;
		filter: drop-shadow(0 0 48px color-mix(in srgb, var(--accent) 16%, transparent))
			drop-shadow(0 18px 56px color-mix(in srgb, var(--accent) 8%, transparent));
	}

	.fade {
		position: absolute;
		inset: auto 0 0 0;
		height: min(140px, 48%);
		background: linear-gradient(
			to top,
			var(--bg) 0%,
			color-mix(in srgb, var(--bg) 80%, transparent) 22%,
			color-mix(in srgb, var(--bg) 40%, transparent) 55%,
			transparent 100%
		);
		pointer-events: none;
	}

	@media (min-width: 768px) {
		.hero {
			padding-top: calc(var(--nav-inset) + var(--nav-h) + 3.5rem);
		}

		.copy {
			max-width: 44rem;
			margin-bottom: 2.25rem;
		}
	}

	@media (min-width: 1024px) {
		.hero {
			padding-top: calc(var(--nav-inset) + var(--nav-h) + 4.25rem);
		}

		.copy {
			max-width: 48rem;
			margin-bottom: 2.75rem;
		}
	}
</style>
