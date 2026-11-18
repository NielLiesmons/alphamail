<script>
	/**
	 * Edge / carousel control — same glass chrome as Admin ChromeActionButton
	 * (mobile 44 round: --glass fill + --glass-shine stroke).
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
		<ChevronRight variant="outline" size={20} color="currentColor" strokeWidth={1.6} />
	{:else}
		<ChevronLeft variant="outline" size={20} color="currentColor" strokeWidth={1.6} />
	{/if}
</button>

<style>
	.chevron {
		width: 44px;
		height: 44px;
		border-radius: 9999px;
		border: 1px solid transparent;
		background:
			linear-gradient(var(--glass), var(--glass)) padding-box,
			var(--glass-shine) border-box;
		backdrop-filter: blur(var(--glass-blur, 22px));
		-webkit-backdrop-filter: blur(var(--glass-blur, 22px));
		color: var(--fg-66, var(--ink66));
		cursor: pointer;
		display: grid;
		place-items: center;
		padding: 0;
		padding-right: 2px;
		transition: transform 0.15s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
		flex-shrink: 0;
		box-sizing: border-box;
		-webkit-tap-highlight-color: transparent;
	}

	.chevron.next {
		padding-right: 0;
		padding-left: 2px;
	}

	.chevron.muted {
		/* Same glass chrome — only the glyph quietens on photo edges. */
		color: color-mix(in srgb, var(--fg, var(--ink)) 55%, transparent);
	}

	.chevron.muted:hover,
	.chevron:hover {
		color: var(--fg, var(--ink));
		transform: scale(1.04);
	}

	.chevron:active {
		transform: scale(0.96);
	}
</style>
