<script>
	/** @type {'fill' | 'outline'} */
	export let variant = 'fill';
	export let strokeWidth = 1.4;
	export let color = 'var(--ink)';
	export let size = 24;
	export let className = '';

	$: fillColor = variant === 'fill' ? color : 'none';
	$: strokeColor = variant === 'outline' ? color : 'none';
	$: currentStrokeWidth = variant === 'outline' ? strokeWidth : 0;
</script>

<div class="icon {className}" style="width: {size}px; height: {size}px; color: {color};">
	<slot {fillColor} {strokeColor} strokeWidth={currentStrokeWidth} {size} />
</div>

<style>
	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		line-height: 0;
		overflow: visible;
	}

	.icon :global(svg) {
		display: block;
		overflow: visible;
	}
</style>
