<script>
	/** Fancy Alpha mark — colored SVG (not masked). */
	let { size = 28, className = '' } = $props();

	const height = size;
	const width = Math.round(size * (112 / 122));
</script>

<img
	class="logo {className}"
	src="/icons/alpha-logo-fancy.svg"
	alt=""
	width={width}
	height={height}
	decoding="async"
	aria-hidden="true"
	style="width: {width}px; height: {height}px"
/>

<style>
	.logo {
		display: block;
		flex-shrink: 0;
		object-fit: contain;
	}
</style>
