<script>
	/**
	 * Animated bars ↔ cross.
	 * - `short="bot"` (default): two full + shorter bottom (Admin legacy).
	 * - `short="mid"`: shorter top/bottom, longer middle — left-aligned for site nav pills.
	 * `align` hugs the short bar(s) left or right when short !== mid ends.
	 * @type {{
	 *   open?: boolean,
	 *   align?: 'left' | 'right',
	 *   short?: 'bot' | 'mid',
	 *   size?: number,
	 *   className?: string
	 * }}
	 */
	let {
		open = false,
		align = 'left',
		short = 'bot',
		size = 16,
		className = ''
	} = $props();
</script>

<svg
	class="menu-toggle {className}"
	class:open
	class:align-right={align === 'right'}
	class:short-mid={short === 'mid'}
	width={size}
	height={size}
	viewBox="0 0 16 16"
	fill="none"
	aria-hidden="true"
>
	{#if short === 'mid'}
		<!-- Site pill: left-aligned; middle bar is the long one -->
		<path class="bar top" d="M2.5 4h7" />
		<path class="bar mid" d="M2.5 8h11" />
		<path class="bar bot" d="M2.5 12h7" />
	{:else if align === 'right'}
		<path class="bar top" d="M2.5 4h11" />
		<path class="bar mid" d="M2.5 8h11" />
		<path class="bar bot" d="M6.5 12h7" />
	{:else}
		<path class="bar top" d="M2.5 4h11" />
		<path class="bar mid" d="M2.5 8h11" />
		<path class="bar bot" d="M2.5 12h7" />
	{/if}
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
