<script>
	/**
	 * Shared mobile detail top bar: round glass back, centered muted title, trailing slot.
	 * Matches Admin DetailColumn mobile chrome — use from DetailChrome / nested list titles.
	 * @type {{
	 *   title?: string,
	 *   onBack?: () => void,
	 *   trailing?: import('svelte').Snippet
	 * }}
	 */
	let { title = '', onBack = () => {}, trailing } = $props();
</script>

<header class="mobile-bar">
	<button type="button" class="chrome-btn chev-back" aria-label="Back" onclick={onBack}>
		<svg width="22" height="22" viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path
				d="M11.5 3.5 6 9l5.5 5.5"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>
	<span class="mobile-title-stack">
		<span class="mobile-type">{title}</span>
	</span>
	<span class="trail-slot">
		{#if trailing}
			{@render trailing()}
		{:else}
			<span class="menu-spacer" aria-hidden="true"></span>
		{/if}
	</span>
</header>

<style>
	.mobile-bar {
		display: none;
	}

	.menu-spacer {
		width: 44px;
		height: 44px;
		flex-shrink: 0;
	}

	.trail-slot {
		display: contents;
	}

	@media (max-width: 767px) {
		.mobile-bar {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: 8;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			height: calc(88px + env(safe-area-inset-top, 0px));
			padding: calc(6px + env(safe-area-inset-top, 0px)) 14px 34px;
			border-bottom: none;
			flex-shrink: 0;
			box-sizing: border-box;
			pointer-events: none;
			background: transparent;
		}

		.mobile-bar::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 100%;
			background: linear-gradient(
				to bottom,
				var(--shell, var(--bg)) 0%,
				color-mix(in srgb, var(--shell, var(--bg)) 80%, transparent) 50%,
				transparent 100%
			);
			opacity: var(--chrome-scroll-fade, 0);
			pointer-events: none;
			z-index: -1;
		}

		.mobile-bar > :global(*),
		.trail-slot > :global(*) {
			pointer-events: auto;
		}

		.mobile-title-stack {
			position: relative;
			flex: 1;
			min-width: 0;
			height: 44px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.mobile-type {
			min-width: 0;
			max-width: 100%;
			text-align: center;
			font-family: 'Inter', var(--font), system-ui, sans-serif;
			font-size: 17px;
			font-weight: 600;
			letter-spacing: -0.01em;
			line-height: 1.15;
			color: var(--fg-66);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.trail-slot {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			width: 44px;
			flex-shrink: 0;
		}

		.chrome-btn,
		.trail-slot > :global(.chrome-btn) {
			width: 44px;
			height: 44px;
			display: grid;
			place-items: center;
			border: 1px solid transparent;
			border-radius: 9999px;
			background:
				linear-gradient(var(--glass), var(--glass)) padding-box,
				var(--glass-shine) border-box;
			color: var(--fg-66);
			padding: 0;
			cursor: pointer;
			flex-shrink: 0;
			box-sizing: border-box;
			backdrop-filter: blur(var(--glass-blur));
			-webkit-backdrop-filter: blur(var(--glass-blur));
			-webkit-tap-highlight-color: transparent;
			transition: transform 0.15s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
		}

		.chrome-btn:hover,
		.chrome-btn:global([aria-expanded='true']),
		.trail-slot > :global(.chrome-btn:hover),
		.trail-slot > :global(.chrome-btn[aria-expanded='true']) {
			transform: scale(1.04);
		}

		.chrome-btn :global(svg),
		.trail-slot > :global(.chrome-btn svg) {
			width: 22px;
			height: 22px;
		}

		.trail-slot > :global(.chrome-btn.more-btn svg) {
			width: 26px;
			height: 26px;
		}

		.chrome-btn.chev-back :global(svg) {
			padding-right: 2px;
			box-sizing: content-box;
		}
	}
</style>
