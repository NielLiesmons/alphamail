<script>
	import BaseIcon from './BaseIcon.svelte';

	export let variant = 'fill';
	export let strokeWidth = 1.4;
	export let color = 'currentColor';
	export let size = 24;
	export let className = '';
</script>

<BaseIcon {variant} {strokeWidth} {color} {size} {className}>
	<!--
	  Own X glyph (two full diagonals). Stroke is always opaque currentColor;
	  fade the whole SVG (parent opacity) so the junction doesn’t double-paint
	  when color is translucent (ink66 etc.).
	-->
	<svg
		width={size}
		height={size}
		viewBox="0 0 14 14"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		stroke="currentColor"
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M2 2 L12 12" />
		<path d="M12 2 L2 12" />
	</svg>
</BaseIcon>
