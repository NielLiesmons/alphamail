<script>
	/**
	 * Animated menu glyph matched to the list filter chrome icon
	 * (16×16 viewBox, stroke 1.5, y=4/8/12) — two full bars + one shorter,
	 * left- or right-aligned, morphing to a cross when open.
	 * @type {{
	 *   open?: boolean,
	 *   align?: 'left' | 'right',
	 *   size?: number,
	 *   className?: string
	 * }}
	 */
	let { open = false, align = 'left', size = 16, className = '' } = $props();
</script>

<svg
	class="menu-toggle {className}"
	class:open
	class:align-right={align === 'right'}
	width={size}
	height={size}
	viewBox="0 0 16 16"
	fill="none"
	aria-hidden="true"
>
	<!-- Mirror filter icon: inset 2.5, stroke 1.5, 4px vertical rhythm -->
	<path class="bar top" d="M2.5 4h11" pathLength="11" />
	<path class="bar mid" d="M2.5 8h11" pathLength="11" />
	<!-- Short bar: 7 units (same as filter mid), left or right -->
	<path
		class="bar bot"
		d="M2.5 12h11"
		pathLength="11"
		stroke-dasharray={open ? '11 0' : '7 4'}
		stroke-dashoffset={align === 'right' && !open ? -4 : 0}
	/>
</svg>

<style>
	.menu-toggle {
		display: block;
		flex-shrink: 0;
		color: inherit;
		overflow: visible;
	}

	.bar {
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linecap: round;
		transform-box: fill-box;
		transform-origin: center;
		transition:
			transform 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
			opacity 0.2s ease,
			stroke-dasharray 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
			stroke-dashoffset 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
	}

	.open .top {
		transform: translateY(4px) rotate(45deg);
	}

	.open .mid {
		opacity: 0;
	}

	.open .bot {
		transform: translateY(-4px) rotate(-45deg);
	}
</style>
