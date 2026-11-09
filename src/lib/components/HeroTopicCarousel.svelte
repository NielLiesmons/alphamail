<script>
	/**
	 * Centered topic carousel — active word full size/opacity; neighbors quiet.
	 * Slides so the active item stays centered.
	 */
	import { onMount } from 'svelte';

	/** @type {{ words: string[], active?: number, intervalMs?: number, onchange?: (i: number) => void }} */
	let {
		words = [],
		active = $bindable(0),
		intervalMs = 3400,
		onchange
	} = $props();

	/** @type {HTMLDivElement | undefined} */
	let viewport = $state();
	/** @type {HTMLDivElement | undefined} */
	let track = $state();
	let shift = $state(0);
	let ready = $state(false);
	let reduceMotion = $state(false);

	/** @type {ReturnType<typeof setInterval> | undefined} */
	let timer;

	function setActive(i, { restart = true } = {}) {
		if (!words.length) return;
		const next = ((i % words.length) + words.length) % words.length;
		active = next;
		onchange?.(next);
		queueMeasure();
		if (restart) arm();
	}

	function queueMeasure() {
		requestAnimationFrame(() => {
			requestAnimationFrame(measure);
		});
	}

	function measure() {
		if (!viewport || !track) return;
		const items = /** @type {NodeListOf<HTMLElement>} */ (track.querySelectorAll('.word'));
		const el = items[active];
		if (!el) return;
		const itemCenter = el.offsetLeft + el.offsetWidth / 2;
		shift = viewport.clientWidth / 2 - itemCenter;
		ready = true;
	}

	function arm() {
		if (timer) clearInterval(timer);
		if (reduceMotion || words.length < 2) return;
		timer = setInterval(() => {
			const len = words.length || 1;
			setActive(((active % len) + 1) % len, { restart: false });
		}, intervalMs);
	}

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const syncMq = () => {
			reduceMotion = mq.matches;
			arm();
		};
		syncMq();
		mq.addEventListener?.('change', syncMq);

		queueMeasure();
		const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(queueMeasure) : null;
		if (viewport) ro?.observe(viewport);

		const onVis = () => {
			if (document.hidden) {
				if (timer) clearInterval(timer);
				timer = undefined;
			} else arm();
		};
		document.addEventListener('visibilitychange', onVis);

		return () => {
			mq.removeEventListener?.('change', syncMq);
			ro?.disconnect();
			if (timer) clearInterval(timer);
			document.removeEventListener('visibilitychange', onVis);
		};
	});

	$effect(() => {
		words;
		active;
		queueMeasure();
	});
</script>

<div class="carousel" class:ready bind:this={viewport} role="group" aria-label="Topics">
	<div
		class="track"
		bind:this={track}
		style:transform="translate3d({shift}px, 0, 0)"
		class:instant={reduceMotion || !ready}
	>
		{#each words as word, i (word)}
			<button
				type="button"
				class="word"
				class:on={i === active}
				class:near={Math.abs(i - active) === 1}
				class:far={Math.abs(i - active) > 1}
				aria-current={i === active ? 'true' : undefined}
				onclick={() => setActive(i)}
			>
				{word}
			</button>
		{/each}
	</div>
</div>

<style>
	.carousel {
		position: relative;
		width: 100%;
		overflow: hidden;
		opacity: 0;
		mask-image: linear-gradient(
			90deg,
			transparent 0%,
			#000 14%,
			#000 86%,
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			90deg,
			transparent 0%,
			#000 14%,
			#000 86%,
			transparent 100%
		);
	}

	.carousel.ready {
		opacity: 1;
		transition: opacity 0.35s ease;
	}

	.track {
		display: flex;
		align-items: baseline;
		justify-content: flex-start;
		gap: clamp(1.1rem, 3.5vw, 2.4rem);
		width: max-content;
		will-change: transform;
		transition: transform 0.85s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
	}

	.track.instant {
		transition: none;
	}

	.word {
		appearance: none;
		border: 0;
		background: transparent;
		padding: 0;
		margin: 0;
		font-family: var(--font-display);
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.05;
		font-size: clamp(34px, 6.6vw, 68px);
		color: var(--ink);
		cursor: pointer;
		white-space: nowrap;
		transform: scale(0.7);
		opacity: 0.12;
		filter: blur(0.35px);
		transition:
			transform 0.85s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
			opacity 0.85s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
			filter 0.85s ease;
		-webkit-tap-highlight-color: transparent;
	}

	.word.near {
		opacity: 0.2;
		transform: scale(0.78);
		filter: blur(0.15px);
	}

	.word.far {
		opacity: 0.08;
		transform: scale(0.64);
	}

	.word.on {
		opacity: 1;
		transform: scale(1);
		filter: none;
		cursor: default;
	}

	@media (max-width: 767px) {
		.track {
			gap: 1rem;
		}

		.word {
			font-size: clamp(30px, 9vw, 44px);
		}
	}
</style>
