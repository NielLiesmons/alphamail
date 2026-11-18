<script>
	/**
	 * Folder outline — matches icons/folder.svg / folder.png silhouette for Files nav.
	 * Stroke uses --icon-stroke (non-scaling) so weight matches peer NavIcon glyphs.
	 * @type {{ size?: number, className?: string }}
	 */
	let { size = 18, className = '' } = $props();
</script>

<span class="icon {className}" style:width="{size}px" style:height="{size}px">
	<svg viewBox="0 0 69 66" width={size} height={size} fill="none" aria-hidden="true">
		<path
			d="M4 64.9953C2.83333 65.162 0.5 63.9953 0.5 57.9953V9.88774C0.5 8.48407 1.4733 7.2768 2.84289 6.96934L22.5619 2.54262C23.8121 2.26197 25 3.21278 25 4.49405V4.98975C25 6.27319 26.1917 7.22445 27.4432 6.94001L55.5568 0.550577C56.8083 0.266139 58 1.2174 58 2.50084V8.99529M3.49997 64.9752C7.09997 64.9752 7.99997 61.3085 7.99997 59.4752C8.8333 48.4752 12.6 27.9744 13 23.9744C13.4766 19.2084 15.5 18.9737 18.5 17.9743C21.3855 17.0131 60.5478 8.7253 63.5 7.99423C66.4504 7.26359 68.5 8.4953 68 12.0016C67.3592 16.4953 64.8563 38.0012 64.5 40.4953C63.5 47.4953 62.6871 50.6121 58.2871 52.2121C54.7368 53.5031 23.7871 60.5308 9.28708 64.5402C5.82792 65.1292 5.28708 65.1847 3.49997 64.9752Z"
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
		stroke-width: var(--icon-stroke, 1.5);
	}
</style>
