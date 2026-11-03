<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ServiceCard from './ServiceCard.svelte';
	import ChevronButton from './ChevronButton.svelte';
	import { pillars } from '$lib/site';
	import { t } from '$lib/i18n';
	import { langFromPath, localizedPath } from '$lib/i18n-path';

	const lang = $derived(langFromPath($page.url.pathname) || 'en');

	const n = pillars.length;
	let active = $state(0);
	let dir = $state(1);
	/** @type {HTMLDivElement | undefined} */
	let trackEl = $state();

	const slots = [-1, 0, 1];

	const centerService = $derived(pillars[mod(active)]);
	const learnHref = $derived(`${localizedPath(lang, '/product')}#${centerService.id}`);

	function mod(i) {
		return ((i % n) + n) % n;
	}

	function prev() {
		dir = -1;
		active -= 1;
	}

	function next() {
		dir = 1;
		active += 1;
	}

	/**
	 * Neighbors sit further out for wider landscape cards.
	 * @param {number} d
	 */
	function xPercent(d) {
		const ad = Math.abs(d);
		const sign = Math.sign(d) || 0;
		if (ad < 0.01) return 0;
		return sign * ad * 88;
	}

	/** @param {number} d */
	function scaleFor(d) {
		const ad = Math.abs(d);
		if (ad < 0.01) return 1;
		return 0.88;
	}

	/**
	 * @param {HTMLElement} node
	 * @param {{ direction: number }} params
	 */
	function edgeIn(node, { direction }) {
		const dx = direction > 0 ? 120 : -120;
		return {
			duration: 420,
			easing: (t) => 1 - Math.pow(1 - t, 3),
			css: (_t, u) => `transform: translateY(-50%) translateX(${u * dx}px) scale(var(--s))`
		};
	}

	/**
	 * @param {HTMLElement} node
	 * @param {{ direction: number }} params
	 */
	function edgeOut(node, { direction }) {
		const dx = direction > 0 ? -120 : 120;
		return {
			duration: 420,
			easing: (t) => 1 - Math.pow(1 - t, 3),
			css: (_t, u) => `transform: translateY(-50%) translateX(${u * dx}px) scale(var(--s))`
		};
	}

	let touchX = 0;

	/** @param {TouchEvent} e */
	function onTouchStart(e) {
		touchX = e.changedTouches[0].clientX;
	}

	/** @param {TouchEvent} e */
	function onTouchEnd(e) {
		const dx = e.changedTouches[0].clientX - touchX;
		if (Math.abs(dx) < 40) return;
		if (dx < 0) next();
		else prev();
	}

	onMount(() => {
		/** @param {WheelEvent} e */
		function onWheel(e) {
			if (!trackEl?.contains(/** @type {Node} */ (e.target))) return;
			if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && Math.abs(e.deltaX) < 8) return;
			e.preventDefault();
			if (e.deltaX > 12 || e.deltaY > 12) next();
			else if (e.deltaX < -12 || e.deltaY < -12) prev();
		}
		window.addEventListener('wheel', onWheel, { passive: false });
		return () => window.removeEventListener('wheel', onWheel);
	});
</script>

<div class="carousel">
	<div class="fade fade-left" aria-hidden="true"></div>
	<div class="fade fade-right" aria-hidden="true"></div>

	<div class="chev chev-prev">
		<ChevronButton direction="prev" label="Previous" onclick={prev} />
	</div>
	<div class="chev chev-next">
		<ChevronButton direction="next" label="Next" onclick={next} />
	</div>

	<div
		class="stage"
		bind:this={trackEl}
		ontouchstart={onTouchStart}
		ontouchend={onTouchEnd}
		role="listbox"
		tabindex="0"
		aria-label={$t.pillarsTitle}
	>
		{#each slots as d (active + d)}
			{@const pillar = pillars[mod(active + d)]}
			{@const copy = $t.services[pillar.id]}
			{@const s = scaleFor(d)}
			{@const x = xPercent(d)}
			<div
				class="slide"
				class:center={d === 0}
				class:near={Math.abs(d) === 1}
				style="--x: {x}; --s: {s}; --z: {10 - Math.abs(d)};"
				role="option"
				aria-selected={d === 0}
				in:edgeIn={{ direction: dir }}
				out:edgeOut={{ direction: dir }}
			>
				<div class="face">
					<ServiceCard
						id={`${pillar.id}-${active + d}`}
						href={
							d === 0
								? `${localizedPath(lang, '/product')}#${pillar.id}`
								: ''
						}
						name={copy.name}
						desc={copy.desc}
						featured={d === 0}
						svc={pillar.id}
					/>
					<div class="veil" aria-hidden="true"></div>
				</div>
			</div>
		{/each}
	</div>

	<div class="learn">
		<a class="learn-pill" href={learnHref}>{$t.learnMore}</a>
	</div>
</div>

<style>
	.carousel {
		position: relative;
		width: 100%;
		max-width: min(100%, calc(var(--container-max) + 120px));
		margin-inline: auto;
		overflow: visible;
	}

	.stage {
		position: relative;
		width: 100%;
		height: clamp(360px, 62vw, 440px);
		touch-action: pan-y;
		overflow: hidden;
	}

	.slide {
		--w: min(268px, 68vw);
		position: absolute;
		top: 50%;
		left: calc(50% - (var(--w) / 2) + (var(--w) * var(--x) / 100));
		width: var(--w);
		transform: translateY(-50%) scale(var(--s));
		transform-origin: center center;
		transition:
			left 0.42s var(--ease),
			transform 0.42s var(--ease);
		z-index: var(--z);
		border-radius: 22px;
		pointer-events: none;
		will-change: left, transform;
	}

	.slide.center {
		pointer-events: auto;
		cursor: pointer;
	}

	.face {
		position: relative;
		border-radius: inherit;
	}

	.veil {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: var(--bg);
		/* Wash toward page bg — strength from --carousel-veil* (softer in light) */
		opacity: var(--carousel-veil);
		pointer-events: none;
		transition: opacity 0.42s var(--ease);
		z-index: 2;
	}

	.slide.near .veil {
		opacity: var(--carousel-veil-near);
	}

	.slide.center .veil {
		opacity: 0;
	}

	.fade {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 72px;
		z-index: 20;
		pointer-events: none;
	}

	.fade-left {
		left: 0;
		background: linear-gradient(
			to right,
			var(--bg) 0%,
			var(--bg) 18%,
			color-mix(in srgb, var(--bg) 75%, transparent) 48%,
			transparent 100%
		);
	}

	.fade-right {
		right: 0;
		background: linear-gradient(
			to left,
			var(--bg) 0%,
			var(--bg) 18%,
			color-mix(in srgb, var(--bg) 75%, transparent) 48%,
			transparent 100%
		);
	}

	.chev {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 30;
	}

	.chev-prev {
		left: 8px;
	}

	.chev-next {
		right: 8px;
	}

	.learn {
		display: flex;
		justify-content: center;
		padding: 0.85rem var(--pad-x) 0.25rem;
	}

	.learn-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 36px;
		padding: 0 1.05rem;
		border-radius: var(--radius-pill);
		border: 1.4px solid color-mix(in srgb, var(--ink) 16%, transparent);
		background: color-mix(in srgb, var(--ink) 5%, transparent);
		color: var(--ink);
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		transition: transform 0.2s var(--ease);
	}

	.learn-pill:hover {
		transform: scale(1.03);
	}

	.learn-pill:active {
		transform: scale(0.97);
	}

	@media (min-width: 768px) {
		.slide {
			/* Wider landscape covers */
			--w: min(420px, 48vw);
			border-radius: 24px;
		}

		.stage {
			/* Shorter stage: landscape cards are less tall */
			height: 380px;
		}

		.fade {
			width: 96px;
		}

		.chev-prev {
			left: 14px;
		}

		.chev-next {
			right: 14px;
		}

		.learn {
			padding-top: 1rem;
		}
	}

	@media (min-width: 1024px) {
		.carousel {
			max-width: calc(var(--container-max) + 140px);
		}

		.stage {
			height: 400px;
		}

		.slide {
			--w: 460px;
		}

		.fade {
			width: 110px;
		}

		.chev-prev {
			left: 18px;
		}

		.chev-next {
			right: 18px;
		}
	}
</style>
