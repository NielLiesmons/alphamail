<script>
	/**
	 * Zapstore-style animated three-item feature stack:
	 * desktop tabs (auto-advance) + mobile horizontal cards.
	 */
	import { onMount, onDestroy } from 'svelte';

	/**
	 * @typedef {{ title: string, description: string, label?: string }} FeatureCard
	 * @type {{
	 *   eyebrow?: string,
	 *   title?: string,
	 *   sub?: string,
	 *   cards?: FeatureCard[],
	 *   intervalMs?: number
	 * }}
	 */
	let {
		eyebrow = '',
		title = '',
		sub = '',
		cards = [],
		intervalMs = 9000
	} = $props();

	let activeIndex = $state(0);
	/** @type {ReturnType<typeof setInterval> | null} */
	let timer = null;
	/** @type {IntersectionObserver | null} */
	let observer = null;
	/** @type {HTMLElement | null} */
	let sectionEl = $state(null);

	function selectTab(i) {
		if (i === activeIndex) return;
		activeIndex = i;
		restartTimer();
	}

	function advance() {
		activeIndex = (activeIndex + 1) % Math.max(cards.length, 1);
	}

	function startTimer() {
		if (timer || cards.length < 2) return;
		timer = setInterval(advance, intervalMs);
	}

	function stopTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function restartTimer() {
		stopTimer();
		startTimer();
	}

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) startTimer();
				else stopTimer();
			},
			{ threshold: 0.45 }
		);
		if (sectionEl) observer.observe(sectionEl);
	});

	onDestroy(() => {
		stopTimer();
		observer?.disconnect();
	});
</script>

<section class="feat" bind:this={sectionEl}>
	<header class="head">
		{#if eyebrow}
			<p class="eyebrow">{eyebrow}</p>
		{/if}
		{#if title}
			<h2 class="display-section">{title}</h2>
		{/if}
		{#if sub}
			<p class="text-desc">{sub}</p>
		{/if}
	</header>

	<!-- Mobile: horizontal cards -->
	<div class="mobile">
		<div class="mobile-track">
			{#each cards as card, i (card.title)}
				<article class="mob-card" class:on={activeIndex === i}>
					<div class="mob-visual" aria-hidden="true">
						<span class="idx">{String(i + 1).padStart(2, '0')}</span>
						{#if card.label}
							<span class="chip">{card.label}</span>
						{/if}
					</div>
					<div class="mob-body">
						<h3 class="card-title">{card.title}</h3>
						<p class="card-desc">{card.description}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>

	<!-- Desktop: tabs + stage -->
	<div class="desktop">
		<div class="tabs">
			{#each cards as card, i (card.title)}
				<button
					type="button"
					class="tab"
					class:active={activeIndex === i}
					onclick={() => selectTab(i)}
				>
					{#if card.label}
						<span class="chip">{card.label}</span>
					{/if}
					<h3 class="card-title">{card.title}</h3>
					<p class="card-desc">{card.description}</p>
				</button>
			{/each}
		</div>

		<div class="stage" aria-live="polite">
			{#each cards as card, i (card.title)}
				<div class="panel" class:visible={activeIndex === i}>
					<span class="idx big">{String(i + 1).padStart(2, '0')}</span>
					{#if card.label}
						<span class="chip">{card.label}</span>
					{/if}
					<h3 class="card-title">{card.title}</h3>
					<p class="card-desc">{card.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.feat {
		padding: 2.75rem 0 2.5rem;
		border-top: 1px solid var(--hairline);
	}

	.head {
		text-align: center;
		max-width: 36rem;
		margin: 0 auto 1.5rem;
		padding-inline: var(--pad-x);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.65rem;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 550;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink33);
	}

	.head .text-desc {
		margin: 0;
	}

	.mobile {
		display: block;
		overflow: hidden;
	}

	.mobile-track {
		display: flex;
		gap: 0.75rem;
		overflow-x: auto;
		padding: 0 var(--pad-x) 0.5rem;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.mobile-track::-webkit-scrollbar {
		display: none;
	}

	.mob-card {
		flex: 0 0 min(86vw, 320px);
		scroll-snap-align: center;
		border: 1px solid var(--hairline);
		border-radius: 18px;
		overflow: hidden;
		background: var(--surface);
	}

	.mob-visual {
		position: relative;
		height: 140px;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 1rem 1.15rem;
		background:
			radial-gradient(70% 90% at 15% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 60%),
			linear-gradient(165deg, color-mix(in srgb, var(--ink) 6%, var(--surface)), var(--surface));
	}

	.mob-body {
		padding: 1.1rem 1.15rem 1.25rem;
	}

	.desktop {
		display: none;
	}

	.idx {
		font-family: var(--font-display);
		font-weight: 650;
		font-size: 2.5rem;
		letter-spacing: -0.04em;
		line-height: 1;
		color: color-mix(in srgb, var(--ink) 18%, transparent);
	}

	.idx.big {
		font-size: clamp(4rem, 8vw, 6.5rem);
		position: absolute;
		right: 1.25rem;
		bottom: 0.75rem;
		pointer-events: none;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		padding: 0.28rem 0.65rem;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 550;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink66);
		background: color-mix(in srgb, var(--ink) 7%, transparent);
	}

	.card-title {
		margin: 0.45rem 0 0.35rem;
		font-family: var(--font-sans);
		font-size: 1.125rem;
		font-weight: 650;
		letter-spacing: -0.015em;
		line-height: 1.25;
		color: var(--ink);
	}

	.card-desc {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 400;
		line-height: 1.55;
		color: var(--ink66);
	}

	.tab .card-title {
		color: var(--ink66);
		transition: color 0.35s ease;
	}

	.tab .card-desc {
		color: var(--ink33);
		transition: color 0.35s ease;
	}

	.tab.active .card-title {
		color: var(--ink);
	}

	.tab.active .card-desc {
		color: var(--ink66);
	}

	@media (min-width: 1024px) {
		.mobile {
			display: none;
		}

		.desktop {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 2.5rem;
			align-items: stretch;
			max-width: 1100px;
			margin: 0 auto;
			padding-inline: var(--pad-x);
		}

		.tabs {
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
			justify-content: center;
		}

		.tab {
			text-align: left;
			width: 100%;
			padding: 1.15rem 1.25rem;
			border: 0;
			border-radius: 16px;
			background: transparent;
			cursor: pointer;
			font: inherit;
			transition: background-color 0.35s ease;
		}

		.tab.active {
			background: color-mix(in srgb, var(--ink) 5.5%, transparent);
		}

		.stage {
			position: relative;
			min-height: 340px;
			border: 1px solid var(--hairline);
			border-radius: 22px;
			overflow: hidden;
			background:
				radial-gradient(80% 70% at 10% 0%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 55%),
				var(--surface);
		}

		.panel {
			position: absolute;
			inset: 0;
			padding: 1.75rem 1.5rem;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			gap: 0.35rem;
			opacity: 0;
			filter: blur(10px);
			transform: scale(0.97);
			transition:
				opacity 0.55s ease,
				filter 0.55s ease,
				transform 0.55s ease;
			pointer-events: none;
		}

		.panel.visible {
			opacity: 1;
			filter: blur(0);
			transform: scale(1);
			pointer-events: auto;
		}

		.panel .card-title {
			font-size: 1.45rem;
			max-width: 16rem;
		}

		.panel .card-desc {
			max-width: 18rem;
			font-size: 1rem;
		}
	}
</style>
