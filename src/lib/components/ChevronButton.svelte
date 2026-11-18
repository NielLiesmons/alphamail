<script>
	/**
	 * Carousel / edge control — Admin glass chrome (shine stroke + frosted fill).
	 */
	import { ChevronLeft, ChevronRight } from '$lib/components/icons';

	let { direction = 'prev', label = 'Previous', muted = false, onclick } = $props();
</script>

<button
	type="button"
	class="chevron"
	class:next={direction === 'next'}
	class:muted
	{onclick}
	aria-label={label}
>
	{#if direction === 'next'}
		<ChevronRight variant="outline" size={16} color="currentColor" strokeWidth={1.6} />
	{:else}
		<ChevronLeft variant="outline" size={16} color="currentColor" strokeWidth={1.6} />
	{/if}
</button>

<style>
	.chevron {
		width: 46px;
		height: 46px;
		border-radius: var(--radius-pill, 999px);
		border: 1px solid transparent;
		background:
			color-mix(in srgb, var(--fg, var(--ink)) 10%, transparent) padding-box,
			var(--glass-shine) border-box;
		backdrop-filter: blur(var(--glass-blur, 22px));
		-webkit-backdrop-filter: blur(var(--glass-blur, 22px));
		color: var(--fg, var(--ink));
		cursor: pointer;
		display: grid;
		place-items: center;
		padding: 0;
		padding-right: 2px;
		transition: transform 0.2s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.chevron.next {
		padding-right: 0;
		padding-left: 2px;
	}

	.chevron.muted {
		background:
			color-mix(in srgb, var(--fg, var(--ink)) 6%, transparent) padding-box,
			var(--glass-shine) border-box;
		color: color-mix(in srgb, var(--fg, var(--ink)) 42%, transparent);
	}

	.chevron.muted:hover {
		color: color-mix(in srgb, var(--fg, var(--ink)) 66%, transparent);
	}

	.chevron:hover {
		transform: scale(1.04);
	}

	.chevron:active {
		transform: scale(0.97);
	}
</style>
