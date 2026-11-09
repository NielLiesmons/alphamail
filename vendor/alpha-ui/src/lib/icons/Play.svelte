<script>
	/** Transport / album play glyph (filled triangle). @type {{ size?: number, className?: string }} */
	let { size = 15, className = '' } = $props();
</script>

<span class="icon {className}" style:width="{size}px" style:height="{Math.round((size * 16) / 15)}px">
	<svg viewBox="0 0 15 16" width={size} height={(size * 16) / 15} fill="none" aria-hidden="true">
		<path
			d="M13.439 5.88263C13.8097 6.08696 14.1199 6.39198 14.3361 6.76502C14.5524 7.13805 14.6667 7.56504 14.6667 8.00022C14.6667 8.43541 14.5524 8.8624 14.3361 9.23543C14.1199 9.60847 13.8097 9.91349 13.439 10.1178L3.54868 15.6914C1.95613 16.589 0 15.421 0 13.5746V2.42664C0 0.578645 1.95613 -0.588552 3.54868 0.308245L13.439 5.88263Z"
			fill="currentColor"
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
	}
</style>
