<script>
	/** @type {{ size?: number, className?: string }} */
	let { size = 28, className = '' } = $props();
</script>

<span class="icon {className}" style:width="{size}px" style:height="{Math.round((size * 16) / 28)}px">
	<svg viewBox="0 0 28 16" width={size} height={(size * 16) / 28} fill="none" aria-hidden="true">
		<path
			d="M13.25 2.42644C13.25 0.578447 15.2063 -0.58852 16.7988 0.308278L26.6895 5.8825C27.0599 6.08676 27.3698 6.39161 27.5859 6.76433C27.8022 7.1373 27.917 7.56457 27.917 7.99968C27.917 8.43487 27.8022 8.862 27.5859 9.23503C27.3697 9.60798 27.0601 9.91352 26.6895 10.1178L16.7988 15.6911C15.2063 16.5887 13.25 15.4203 13.25 13.5739V10.2243L3.54883 15.6911C1.95628 16.5887 0 15.4203 0 13.5739V2.42644C0 0.578447 1.95628 -0.58852 3.54883 0.308278L13.25 5.77507V2.42644Z"
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
