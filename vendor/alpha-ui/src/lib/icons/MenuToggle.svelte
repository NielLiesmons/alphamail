<script>
	/**
	 * Animated menu glyph: two full bars + one shorter bar ↔ cross.
	 * `align="left"` — short bar on the left (Admin).
	 * `align="right"` — short bar on the right (Bley / AlphaMail / niel).
	 * @type {{
	 *   open?: boolean,
	 *   align?: 'left' | 'right',
	 *   size?: number,
	 *   className?: string
	 * }}
	 */
	let { open = false, align = 'left', size = 18, className = '' } = $props();
</script>

<span
	class="menu-toggle {className}"
	class:open
	class:align-right={align === 'right'}
	style:width="{size}px"
	style:height="{size}px"
	aria-hidden="true"
>
	<span class="bar top"></span>
	<span class="bar mid"></span>
	<span class="bar bot"></span>
</span>

<style>
	.menu-toggle {
		position: relative;
		display: inline-block;
		flex-shrink: 0;
		color: inherit;
	}

	.bar {
		position: absolute;
		left: 0;
		right: 0;
		height: 1.5px;
		border-radius: 1px;
		background: currentColor;
		transform-origin: center;
		transition:
			transform 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
			opacity 0.2s ease,
			width 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
			left 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
			right 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
			top 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
	}

	.top {
		top: calc(50% - 5.5px);
	}

	.mid {
		top: 50%;
		margin-top: -0.75px;
	}

	.bot {
		top: calc(50% + 4px);
		/* Short bar — left-aligned by default */
		right: auto;
		width: 62%;
	}

	.align-right .bot {
		left: auto;
		right: 0;
		width: 62%;
	}

	.open .top {
		top: 50%;
		margin-top: -0.75px;
		transform: rotate(45deg);
		width: 100%;
		left: 0;
		right: 0;
	}

	.open .mid {
		opacity: 0;
		transform: scaleX(0.4);
	}

	.open .bot {
		top: 50%;
		margin-top: -0.75px;
		transform: rotate(-45deg);
		width: 100%;
		left: 0;
		right: 0;
	}
</style>
