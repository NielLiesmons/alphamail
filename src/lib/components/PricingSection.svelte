<script>
	import PrimaryButton from './PrimaryButton.svelte';
	import GlassButton from './GlassButton.svelte';
	import Check from './icons/Check.svelte';
	import { t, locale } from '$lib/i18n';
	import { localizedPath } from '$lib/i18n-path';

	const tiers = $derived($t.pricingTiers);
</script>

<section class="pricing section" id="pricing" aria-labelledby="pricing-title">
	<header class="head">
		<p class="eyebrow">{$t.pricingEyebrow}</p>
		<h2 id="pricing-title" class="display-section">{$t.pricingTitle}</h2>
		<p class="text-desc">{$t.pricingSub}</p>
	</header>

	<div class="frame">
		<div class="track" data-chrome-scroll>
			{#each tiers as tier (tier.id)}
				<article class="card" class:featured={tier.featured}>
					<header class="card-head">
						<h3 class="name">{tier.name}</h3>
						<div class="price-row">
							<span class="price" class:muted={tier.priceMuted}>{tier.price}</span>
							{#if tier.suffix}
								<span class="suffix">{tier.suffix}</span>
							{/if}
						</div>
						<p class="desc">{tier.desc}</p>
					</header>
					<ul class="features">
						{#each tier.features as feature}
							<li>
								<span class="check" aria-hidden="true">
									<Check variant="outline" size={14} strokeWidth={1.4} color="var(--accent)" />
								</span>
								<span>{feature}</span>
							</li>
						{/each}
					</ul>
					<footer class="foot">
						{#if tier.primary}
							<PrimaryButton href={localizedPath($locale, '/contact')}>{tier.cta}</PrimaryButton>
						{:else}
							<GlassButton href={localizedPath($locale, '/contact')}>{tier.cta}</GlassButton>
						{/if}
					</footer>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.pricing {
		padding-top: 2.5rem;
		padding-bottom: 2.5rem;
		text-align: center;
	}

	.head {
		max-width: 36rem;
		margin: 0 auto 1.75rem;
		padding-inline: var(--pad-x);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.65rem;
	}

	.eyebrow {
		margin: 0;
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink33);
	}

	.head .text-desc {
		margin: 0;
	}

	.frame {
		border-top: 1px solid var(--hairline);
		border-bottom: 1px solid var(--hairline);
	}

	.track {
		display: flex;
		align-items: stretch;
		overflow-x: auto;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.track::-webkit-scrollbar {
		display: none;
	}

	.card {
		flex: 0 0 min(300px, 85vw);
		display: flex;
		flex-direction: column;
		text-align: left;
		border-right: 1px solid var(--hairline);
		box-sizing: border-box;
		min-height: 100%;
		background: transparent;
	}

	.card:last-child {
		border-right: 0;
	}

	.card.featured {
		background: color-mix(in srgb, var(--ink) 3.5%, transparent);
	}

	.card-head {
		padding: 1.15rem 1.35rem 0;
	}

	.name {
		margin: 0 0 0.4rem;
		font-family: var(--font-sans);
		font-size: 18px;
		font-weight: 650;
		letter-spacing: -0.01em;
		color: var(--ink);
	}

	.price-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem;
		margin-bottom: 0.55rem;
	}

	.price {
		font-size: 18px;
		font-weight: 650;
		color: var(--ink);
	}

	.price.muted {
		color: var(--ink66);
	}

	.suffix {
		font-size: 14px;
		font-weight: 400;
		color: var(--ink33);
	}

	.desc {
		margin: 0;
		min-height: 2.75rem;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.55;
		color: var(--ink66);
	}

	.features {
		list-style: none;
		margin: 0;
		padding: 1rem 1.35rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		border-top: 1px solid var(--hairline);
	}

	.features li {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.5;
		color: var(--ink66);
	}

	.check {
		display: flex;
		flex-shrink: 0;
		padding-top: 2px;
	}

	.foot {
		padding: 0 1.35rem 1.35rem;
		margin-top: auto;
	}

	.foot :global(.btn),
	.foot :global(.btn-glass) {
		width: 100%;
		justify-content: center;
	}

	@media (min-width: 900px) {
		.track {
			overflow: visible;
		}

		.card {
			flex: 1 1 0;
			width: auto;
			min-width: 0;
		}

		.name,
		.price {
			font-size: 20px;
		}
	}
</style>
