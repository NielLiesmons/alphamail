<script>
	/** @type {{ size?: number, className?: string, active?: boolean }} */
	let { size = 22, className = '', active = false } = $props();
</script>

<span class="icon {className}" class:active style:width="{size}px" style:height="{size}px">
	<svg viewBox="0 0 64 64" width={size} height={size} fill="none" aria-hidden="true">
		<path
			d="M0 6C0 2.68629 2.68629 0 6 0H10C13.3137 0 16 2.68629 16 6V10C16 13.3137 13.3137 16 10 16H6C2.68629 16 0 13.3137 0 10V6Z"
			fill="currentColor"
		/>
		<path
			d="M0 30C0 26.6863 2.68629 24 6 24H10C13.3137 24 16 26.6863 16 30V34C16 37.3137 13.3137 40 10 40H6C2.68629 40 0 37.3137 0 34V30Z"
			fill="currentColor"
		/>
		<path
			d="M0 54C0 50.6863 2.68629 48 6 48H10C13.3137 48 16 50.6863 16 54V58C16 61.3137 13.3137 64 10 64H6C2.68629 64 0 61.3137 0 58V54Z"
			fill="currentColor"
		/>
		<path
			d="M24 8C24 5.79086 25.7909 4 28 4H60C62.2091 4 64 5.79086 64 8C64 10.2091 62.2091 12 60 12H28C25.7909 12 24 10.2091 24 8Z"
			fill="currentColor"
		/>
		<path
			d="M24 32C24 29.7909 25.7909 28 28 28H60C62.2091 28 64 29.7909 64 32C64 34.2091 62.2091 36 60 36H28C25.7909 36 24 34.2091 24 32Z"
			fill="currentColor"
		/>
		<path
			d="M24 56C24 53.7909 25.7909 52 28 52H60C62.2091 52 64 53.7909 64 56C64 58.2091 62.2091 60 60 60H28C25.7909 60 24 58.2091 24 56Z"
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
		opacity: 0.28;
	}
	.icon.active {
		opacity: 1;
	}
	.icon :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
