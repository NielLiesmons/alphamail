<script>
	/**
	 * Menu — icons/menu.svg (two full bars, short third bar on the left).
	 * `mirror` flips it so the short bar sits on the right.
	 * @type {{ size?: number, mirror?: boolean, className?: string }}
	 */
	let { size = 18, mirror = false, className = '' } = $props();
</script>

<span class="icon {className}" class:mirror style:width="{size}px" style:height="{size}px">
	<svg viewBox="0 0 9 9" fill="none" aria-hidden="true">
		<path d="M0.5 0.5H8.5M0.5 4.5H8.5M0.5 8.5H5.5" stroke="currentColor" stroke-linecap="round" />
	</svg>
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

	.icon :global(path) {
		vector-effect: non-scaling-stroke;
		stroke-width: var(--icon-stroke, 1.4);
	}

	.mirror {
		transform: scaleX(-1);
	}
</style>
