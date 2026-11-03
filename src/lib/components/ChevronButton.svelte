<script>
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
		border-radius: var(--radius-pill);
		border: 1.4px solid color-mix(in srgb, var(--ink) 16%, transparent);
		background: color-mix(in srgb, var(--bg) 72%, transparent);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		color: var(--ink);
		cursor: pointer;
		display: grid;
		place-items: center;
		padding: 0;
		padding-right: 2px;
		transition: transform 0.2s var(--ease);
		flex-shrink: 0;
	}

	.chevron.next {
		padding-right: 0;
		padding-left: 2px;
	}

	/* Soft ink/white depending on theme — not full foreground */
	.chevron.muted {
		border-color: color-mix(in srgb, var(--ink) 10%, transparent);
		background: color-mix(in srgb, var(--bg) 55%, transparent);
		color: color-mix(in srgb, var(--ink) 42%, transparent);
	}

	.chevron.muted:hover {
		color: color-mix(in srgb, var(--ink) 66%, transparent);
	}

	.chevron:hover {
		transform: scale(1.04);
	}

	.chevron:active {
		transform: scale(0.97);
	}
</style>
