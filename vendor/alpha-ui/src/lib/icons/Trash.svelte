<script>
	/**
	 * Trash — single stroke path from alpha-ui/icons/trash.svg.
	 * Subpaths leave gaps so round caps don’t stack at low opacity.
	 * @type {{ size?: number, className?: string }}
	 */
	let { size = 13, className = '' } = $props();
</script>

<span class="icon {className}" style:width="{size}px" style:height="{size}px">
	<svg viewBox="0 0 19 20" width={size} height={size} fill="none" aria-hidden="true">
		<path
			d="M7 2.85V2.15C7 1.34 7.67 0.7 8.5 0.7H10.5C11.33 0.7 12 1.34 12 2.15V2.85M1.2 4.6H17.8M3.4 6.4L4.65 17.15C4.75 17.85 5.35 18.35 6.05 18.35H12.95C13.65 18.35 14.25 17.85 14.35 17.15L15.6 6.4M7.4 8.6V15.2M11.6 8.6V15.2"
			stroke="currentColor"
			stroke-linecap="round"
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
