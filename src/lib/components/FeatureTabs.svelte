<script>
	/**
	 * Zapstore-style three-item stack: tabs + simple rotating placeholder.
	 */
	import { onMount, onDestroy } from 'svelte';

	/**
	 * @typedef {{ title: string, description: string }} FeatureCard
	 * @type {{ title?: string, sub?: string, cards?: FeatureCard[], intervalMs?: number }}
	 */
	let { title = '', sub = '', cards = [], intervalMs = 9000 } = $props();

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
		{#if title}
			<h2 class="display-section">{title}</h2>
		{/if}
		{#if sub}
			<p class="text-desc">{sub}</p>
		{/if}
	</header>

	<div class="mobile">
		<div class="mobile-track">
			{#each cards as card, i (card.title)}
				<article class="mob-card">
					<div class="ph" aria-hidden="true"></div>
					<div class="mob-body">
						<h3 class="card-title">{card.title}</h3>
						<p class="card-desc">{card.description}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>

	<div class="desktop">
		<div class="tabs">
			{#each cards as card, i (card.title)}
				<button
					type="button"
					class="tab"
					class:active={activeIndex === i}
					onclick={() => selectTab(i)}
				>
					<h3 class="card-title">{card.title}</h3>
					<p class="card-desc">{card.description}</p>
				</button>
			{/each}
		</div>

		<div class="stage" aria-hidden="true">
			{#each cards as card, i (card.title)}
				<div class="ph panel" class:visible={activeIndex === i}></div>
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
		width: min(100% - 2 * var(--pad-x), var(--container-max));
		margin: 0 auto 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.65rem;
	}

	.head .display-section {
		max-width: none;
		text-wrap: balance;
	}

	.head .text-desc {
		margin: 0;
		max-width: 40rem;
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
	}

	.mob-body {
		padding: 1rem 0.15rem 0;
	}

	.ph {
		width: 100%;
		aspect-ratio: 4 / 3;
		border-radius: 14px;
		background: color-mix(in srgb, var(--ink) 6%, var(--surface));
		border: 1px solid var(--hairline);
	}

	.desktop {
		display: none;
	}

	.card-title {
		margin: 0 0 0.35rem;
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
			width: min(100% - 2 * var(--pad-x), var(--container-max));
			margin: 0 auto;
		}

		.tabs {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			justify-content: center;
		}

		.tab {
			text-align: left;
			width: 100%;
			padding: 1.1rem 1.15rem;
			border: 0;
			border-radius: 14px;
			background: transparent;
			cursor: pointer;
			font: inherit;
			transition: background-color 0.35s ease;
		}

		.tab.active {
			background: color-mix(in srgb, var(--ink) 5%, transparent);
		}

		.stage {
			position: relative;
			min-height: 320px;
		}

		.panel {
			position: absolute;
			inset: 0;
			opacity: 0;
			filter: blur(8px);
			transform: scale(0.98);
			transition:
				opacity 0.5s ease,
				filter 0.5s ease,
				transform 0.5s ease;
			pointer-events: none;
			aspect-ratio: auto;
			height: 100%;
		}

		.panel.visible {
			opacity: 1;
			filter: blur(0);
			transform: scale(1);
		}
	}
</style>
