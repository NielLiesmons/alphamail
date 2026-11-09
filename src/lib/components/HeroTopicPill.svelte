<script>
	/**
	 * Large cycling topic pill under the hero headline.
	 */
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	/** @typedef {{ id: string, label: string, icon: string }} HeroTopic */

	/** @type {{ topics: HeroTopic[], active?: number, intervalMs?: number }} */
	let { topics = [], active = $bindable(0), intervalMs = 3600 } = $props();

	let reduceMotion = $state(false);
	/** @type {ReturnType<typeof setInterval> | undefined} */
	let timer;

	const topic = $derived(topics[active] ?? topics[0]);

	function setActive(i, { restart = true } = {}) {
		if (!topics.length) return;
		active = ((i % topics.length) + topics.length) % topics.length;
		if (restart) arm();
	}

	function arm() {
		if (timer) clearInterval(timer);
		if (reduceMotion || topics.length < 2) return;
		timer = setInterval(() => {
			setActive(active + 1, { restart: false });
		}, intervalMs);
	}

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => {
			reduceMotion = mq.matches;
			arm();
		};
		sync();
		mq.addEventListener?.('change', sync);
		const onVis = () => {
			if (document.hidden) {
				if (timer) clearInterval(timer);
				timer = undefined;
			} else arm();
		};
		document.addEventListener('visibilitychange', onVis);
		return () => {
			mq.removeEventListener?.('change', sync);
			if (timer) clearInterval(timer);
			document.removeEventListener('visibilitychange', onVis);
		};
	});
</script>

<span class="pill-slot" role="group" aria-label="Topic">
	{#key topic?.id}
		<button
			type="button"
			class="pill"
			aria-current="true"
			in:fly={{ y: reduceMotion ? 0 : 12, duration: reduceMotion ? 0 : 420 }}
			out:fade={{ duration: reduceMotion ? 0 : 220 }}
			onclick={() => setActive(active + 1)}
		>
			{#if topic?.icon}
				<img class="ico" src={topic.icon} alt="" width="40" height="40" draggable="false" />
			{/if}
			<span class="label">{topic?.label}</span>
		</button>
	{/key}
</span>

<style>
	.pill-slot {
		display: inline-grid;
		vertical-align: middle;
		place-items: center;
		min-width: min(100%, 15rem);
		min-height: 3.65rem;
		position: relative;
	}

	.pill {
		grid-area: 1 / 1;
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		height: 3.65rem;
		padding: 0 1.25rem 0 0.55rem;
		margin: 0;
		border: 0;
		border-radius: 9999px;
		cursor: pointer;
		appearance: none;
		position: relative;
		isolation: isolate;
		background: color-mix(in srgb, var(--glass, var(--bg)) 78%, transparent);
		backdrop-filter: blur(var(--glass-blur, 18px));
		-webkit-backdrop-filter: blur(var(--glass-blur, 18px));
		color: var(--ink);
		box-sizing: border-box;
		-webkit-tap-highlight-color: transparent;
		white-space: nowrap;
	}

	.pill::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		padding: 1px;
		pointer-events: none;
		z-index: 1;
		background: var(
			--glass-shine,
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--ink) 28%, transparent),
				color-mix(in srgb, var(--ink) 8%, transparent)
			)
		);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
	}

	.ico {
		width: 2.15rem;
		height: 2.15rem;
		object-fit: contain;
		display: block;
		flex-shrink: 0;
		position: relative;
		z-index: 2;
		filter: drop-shadow(0 1px 2px color-mix(in srgb, var(--ink-raw, #000) 18%, transparent));
	}

	.label {
		position: relative;
		z-index: 2;
		font-family: var(--font-display);
		font-weight: 650;
		font-size: clamp(1.25rem, 3.2vw, 1.75rem);
		letter-spacing: -0.025em;
		line-height: 1;
		padding-bottom: 1px;
	}

	@media (max-width: 767px) {
		.pill-slot {
			min-width: 12.5rem;
			min-height: 3.25rem;
		}

		.pill {
			height: 3.25rem;
			padding: 0 1.05rem 0 0.48rem;
			gap: 0.5rem;
		}

		.ico {
			width: 1.85rem;
			height: 1.85rem;
		}
	}
</style>
