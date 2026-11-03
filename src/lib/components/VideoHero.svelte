<script>
	/**
	 * Landing hero — Zapstore “Release with ease” pattern:
	 * centered copy, then a full-bleed preview that fades into the page (no rounded card).
	 */
	import PrimaryButton from './PrimaryButton.svelte';
	import GlassButton from './GlassButton.svelte';
	import { t, locale } from '$lib/i18n';
	import { localizedPath } from '$lib/i18n-path';
</script>

<section class="hero">
	<div class="copy">
		<p class="eyebrow">Alpha Mail</p>
		<h1 class="display-hero">{$t.heroTitle}</h1>
		<p class="text-desc">{$t.heroDesc}</p>
		<div class="cta">
			<GlassButton href={localizedPath($locale, '/product')}>{$t.heroSecondary}</GlassButton>
			<PrimaryButton href={localizedPath($locale, '/contact')}>{$t.heroCta}</PrimaryButton>
		</div>
	</div>

	<div class="preview" aria-hidden="true">
		<div class="preview-stage">
			<div class="ui">
				<aside class="ui-rail">
					<span class="dot"></span>
					<span class="line w60"></span>
					<span class="line w40"></span>
					<span class="line w55"></span>
					<span class="line on w70"></span>
					<span class="line w45"></span>
				</aside>
				<div class="ui-main">
					<div class="ui-bar">
						<span class="chip"></span>
						<span class="chip short"></span>
					</div>
					<div class="ui-rows">
						<span class="row"></span>
						<span class="row mid"></span>
						<span class="row short"></span>
						<span class="row"></span>
						<span class="row mid"></span>
					</div>
				</div>
			</div>
		</div>
		<div class="preview-fade"></div>
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
		margin-bottom: 1.75rem;
	}

	.eyebrow {
		margin: 0 0 0.85rem;
		font-size: 1.05rem;
		font-weight: 500;
		color: var(--ink33);
		letter-spacing: 0.01em;
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

	/* Full-bleed preview — clipped + bottom fade into --bg (Zapstore release) */
	.preview {
		position: relative;
		width: 100vw;
		margin-left: calc(50% - 50vw);
		height: clamp(220px, 42vw, 440px);
		overflow: hidden;
		pointer-events: none;
	}

	.preview-stage {
		width: 100%;
		height: 140%;
		padding: 0 clamp(1rem, 4vw, 3rem);
		box-sizing: border-box;
		background:
			radial-gradient(70% 55% at 18% 8%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 55%),
			radial-gradient(55% 45% at 88% 22%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 50%),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--ink) 5%, var(--bg)) 0%,
				var(--bg) 100%
			);
		border-top: 1px solid var(--hairline);
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 1.25rem;
	}

	.ui {
		width: min(920px, 100%);
		height: 100%;
		display: flex;
		border: 1px solid var(--hairline);
		border-bottom: 0;
		background: color-mix(in srgb, var(--surface) 92%, var(--bg));
		overflow: hidden;
	}

	.ui-rail {
		width: 168px;
		flex-shrink: 0;
		padding: 1.1rem 0.85rem;
		border-right: 1px solid var(--hairline);
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		background: color-mix(in srgb, var(--ink) 2.5%, var(--surface));
	}

	.dot {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--ink) 14%, transparent);
		margin-bottom: 0.35rem;
	}

	.line {
		display: block;
		height: 10px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--ink) 8%, transparent);
	}

	.line.on {
		background: color-mix(in srgb, var(--ink) 14%, transparent);
	}

	.w40 {
		width: 40%;
	}
	.w45 {
		width: 45%;
	}
	.w55 {
		width: 55%;
	}
	.w60 {
		width: 60%;
	}
	.w70 {
		width: 70%;
	}

	.ui-main {
		flex: 1;
		min-width: 0;
		padding: 1rem 1.15rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.ui-bar {
		display: flex;
		gap: 0.45rem;
	}

	.chip {
		height: 22px;
		width: 88px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--ink) 7%, transparent);
	}

	.chip.short {
		width: 56px;
	}

	.ui-rows {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	.row {
		display: block;
		height: 52px;
		border-radius: 12px;
		background: color-mix(in srgb, var(--ink) 4.5%, transparent);
		border: 1px solid color-mix(in srgb, var(--ink) 5%, transparent);
	}

	.row.mid {
		width: 92%;
	}

	.row.short {
		width: 78%;
		height: 40px;
	}

	.preview-fade {
		position: absolute;
		inset: auto 0 0 0;
		height: min(180px, 55%);
		background: linear-gradient(
			to top,
			var(--bg) 0%,
			color-mix(in srgb, var(--bg) 85%, transparent) 28%,
			color-mix(in srgb, var(--bg) 40%, transparent) 62%,
			transparent 100%
		);
	}

	@media (max-width: 640px) {
		.ui-rail {
			width: 112px;
			padding: 0.85rem 0.65rem;
		}

		.row {
			height: 40px;
		}
	}

	@media (min-width: 768px) {
		.copy {
			max-width: 48rem;
			margin-bottom: 2.25rem;
		}

		.eyebrow {
			font-size: 1.125rem;
		}

		.preview-stage {
			padding-top: 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.hero {
			padding-top: calc(var(--nav-inset) + var(--nav-h) + 2rem);
		}

		.copy {
			max-width: 52rem;
			margin-bottom: 2.75rem;
		}

		.eyebrow {
			font-size: 1.25rem;
		}
	}
</style>
