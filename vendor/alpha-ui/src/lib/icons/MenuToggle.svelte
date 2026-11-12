<script>
	/**
	 * Animated menu glyph matched to the list filter chrome icon
	 * (16×16 viewBox, stroke 1.5, y=4/8/12) — two full bars + one shorter,
	 * left- or right-aligned, morphing to a cross when open.
	 * Display size should match filter via `.chrome-ico` (22×22 on mobile).
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
	class="menu-toggle chrome-ico {className}"
	class:open
	class:align-right={align === 'right'}
	width={size}
	height={size}
	viewBox="0 0 16 16"
	fill="none"
	aria-hidden="true"
>
	<!-- Same stroke/inset language as filter: M2.5… stroke 1.5, y=4/8/12 -->
	<path class="bar top" d="M2.5 4h11" />
	<path class="bar mid" d="M2.5 8h11" />
	{#if align === 'right'}
		<path class="bar bot short" d="M6.5 12h7" />
	{:else}
		<path class="bar bot short" d="M2.5 12h7" />
	{/if}
	<!-- Full-length cross arms (shown when open) -->
	<path class="bar cross-a" d="M2.5 8h11" />
	<path class="bar cross-b" d="M2.5 8h11" />
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
		transform-origin: 8px 8px;
		transition:
			transform 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
			opacity 0.18s ease;
	}

	.cross-a,
	.cross-b {
		opacity: 0;
	}

	.open .top,
	.open .mid,
	.open .bot {
		opacity: 0;
	}

	.open .cross-a {
		opacity: 1;
		transform: rotate(45deg);
	}

	.open .cross-b {
		opacity: 1;
		transform: rotate(-45deg);
	}
</style>
