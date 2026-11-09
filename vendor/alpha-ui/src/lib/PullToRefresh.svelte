<script>
	/**
	 * Mobile pull-to-refresh over a nested scroller (.feed / .fill / .body).
	 * @type {{
	 *   onRefresh: () => Promise<void> | void,
	 *   disabled?: boolean,
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let { onRefresh, disabled = false, children } = $props();

	/** @type {HTMLDivElement | undefined} */
	let root = $state();
	let pulling = $state(false);
	let refreshing = $state(false);
	let pullPx = $state(0);

	let startY = 0;
	let tracking = false;

	const THRESHOLD = 64;

	/** @param {HTMLElement | null | undefined} el */
	function findScroller(el) {
		if (!el) return null;
		const candidates = el.querySelectorAll('.feed, .fill, .body, .ptr-scroll');
		for (const node of candidates) {
			const style = getComputedStyle(node);
			const oy = style.overflowY;
			if ((oy === 'auto' || oy === 'scroll' || oy === 'overlay') && node.scrollHeight > node.clientHeight + 1) {
				return /** @type {HTMLElement} */ (node);
			}
		}
		for (const node of candidates) {
			return /** @type {HTMLElement} */ (node);
		}
		return el;
	}

	function scrollTopNow() {
		const scroller = findScroller(root);
		return scroller?.scrollTop ?? 0;
	}

	/** @param {TouchEvent} e */
	function onTouchStart(e) {
		if (disabled || refreshing) return;
		if (scrollTopNow() > 1) return;
		tracking = true;
		startY = e.touches[0]?.clientY ?? 0;
		pulling = false;
		pullPx = 0;
	}

	/** @param {TouchEvent} e */
	function onTouchMove(e) {
		if (!tracking || disabled || refreshing) return;
		if (scrollTopNow() > 1) {
			tracking = false;
			pullPx = 0;
			pulling = false;
			return;
		}
		const y = e.touches[0]?.clientY ?? 0;
		const dy = y - startY;
		if (dy <= 0) {
			pullPx = 0;
			pulling = false;
			return;
		}
		pulling = true;
		pullPx = Math.min(96, dy * 0.45);
		if (pullPx > 8) e.preventDefault();
	}

	async function onTouchEnd() {
		if (!tracking) return;
		tracking = false;
		const should = pullPx >= THRESHOLD && !disabled;
		pulling = false;
		pullPx = 0;
		if (!should) return;
		refreshing = true;
		try {
			await onRefresh();
		} finally {
			refreshing = false;
		}
	}
</script>

<div
	class="ptr"
	bind:this={root}
	ontouchstart={onTouchStart}
	ontouchmove={onTouchMove}
	ontouchend={onTouchEnd}
	ontouchcancel={onTouchEnd}
>
	<div
		class="ptr-indicator"
		class:on={pulling || refreshing}
		style:height="{refreshing ? 36 : pullPx}px"
		aria-hidden="true"
	>
		{#if refreshing || pullPx >= THRESHOLD}
			<span class="ptr-label">{refreshing ? 'Updating…' : 'Release'}</span>
		{:else if pullPx > 12}
			<span class="ptr-label">Pull</span>
		{/if}
	</div>
	{@render children()}
</div>

<style>
	.ptr {
		position: relative;
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	.ptr-indicator {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		overflow: hidden;
		flex-shrink: 0;
		transition: height 0.15s ease;
		pointer-events: none;
	}

	.ptr-label {
		padding-bottom: 8px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--fg-33);
	}

	@media (min-width: 768px) {
		.ptr-indicator {
			display: none;
		}
	}
</style>
