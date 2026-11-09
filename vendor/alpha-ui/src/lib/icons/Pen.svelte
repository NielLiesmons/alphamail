<script>
	/**
	 * Pen — outlined stroke from alpha-ui/icons/pen.svg.
	 * Stroke is 1.5 screen px (non-scaling) to match chrome plus/filter.
	 * @type {{ size?: number, className?: string }}
	 */
	let { size = 13, className = '' } = $props();
</script>

<span class="icon {className}" style:width="{size}px" style:height="{size}px">
	<svg viewBox="0 0 13 13" width={size} height={size} fill="none" aria-hidden="true">
		<path
			d="M12.0781 0.92194C11.3127 0.156563 10.432 -0.203665 10.111 0.117347L2.06734 8.16099C0.468919 9.75941 -0.304728 12.4732 0.111023 12.889C0.526774 13.3047 3.24059 12.5311 4.83901 10.9327L12.8827 2.88902C13.2037 2.56801 12.8434 1.68732 12.0781 0.92194Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
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
		stroke-width: 1.5;
	}
</style>
