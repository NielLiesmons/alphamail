<script>
	/**
	 * Zapstore-style icon frame: fixed square slot, glyph keeps its viewBox aspect.
	 * @type {{ size?: number, className?: string, children?: import('svelte').Snippet }}
	 */
	let { size = 22, className = '', children } = $props();
</script>

<span class="icon {className}" style:width="{size}px" style:height="{size}px">
	{@render children?.()}
</span>

<style>
	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		line-height: 0;
		color: inherit;
	}

	.icon :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	/* Screen-px stroke — equal weight across different viewBoxes */
	.icon :global(path),
	.icon :global(rect),
	.icon :global(circle),
	.icon :global(line),
	.icon :global(polyline) {
		vector-effect: non-scaling-stroke;
		stroke-width: var(--icon-stroke);
	}
</style>
