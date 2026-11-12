<script>
	/**
	 * Shared list-column title chrome (Admin + Player).
	 * Root pages: desktop muted label + mobile large page name.
	 * Nested (canBack): desktop back + muted label; mobile round back + centered muted title
	 * (same language as ChromeMobileBar / Admin detail).
	 * @type {{
	 *   title?: string,
	 *   canBack?: boolean,
	 *   onBack?: () => void,
	 *   syncing?: boolean,
	 *   titleClass?: string
	 * }}
	 */
	let {
		title = '',
		canBack = false,
		onBack = () => {},
		syncing = false,
		titleClass = ''
	} = $props();
</script>

{#if canBack}
	<div
		class="list-title-row desktop-only-title nested"
		class:titles-syncing={syncing}
		aria-busy={syncing || undefined}
	>
		<button type="button" class="title-back" aria-label="Back" onclick={onBack}>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path
					d="M10 3.5 5.5 8 10 12.5"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<h1 class="list-title {titleClass}">{title}</h1>
	</div>
	<div class="mobile-page-title nested" class:titles-syncing={syncing} aria-busy={syncing || undefined}>
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
		<span class="mobile-title-stack centered">
			<span class="mobile-type">{title}</span>
		</span>
	</div>
{:else}
	<div
		class="list-title-row desktop-only-title"
		class:titles-syncing={syncing}
		aria-busy={syncing || undefined}
	>
		<h1 class="list-title {titleClass}">{title}</h1>
	</div>
	<div class="mobile-page-title" class:titles-syncing={syncing} aria-busy={syncing || undefined}>
		<span class="mobile-title-stack" class:titles-syncing={syncing} aria-busy={syncing || undefined}>
			<h1 class="mobile-page-name">{title}</h1>
		</span>
	</div>
{/if}

<style>
	.list-title-row {
		display: flex;
		align-items: center;
		/* Match Admin DetailColumn detail-top-start (back ↔ title) */
		gap: 12px;
		min-width: 0;
	}

	@media (min-width: 768px) {
		.list-title-row {
			height: 48px;
		}
	}

	.list-title {
		margin: 0;
		min-width: 0;
		font-family: 'Inter', var(--font), system-ui, sans-serif;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0;
		color: var(--fg-33);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Admin Planning list — fixed label column width */
	.list-title:global(.planning-title) {
		width: 200px;
		max-width: 200px;
		box-sizing: border-box;
		padding-right: 8px;
	}

	/* Match DetailChrome / Admin desktop glass icon-hit */
	.title-back {
		flex-shrink: 0;
		width: 28px;
		height: 28px;
		display: grid;
		place-items: center;
		margin: 0;
		padding: 0;
		border: 1px solid transparent;
		border-radius: 10px;
		background:
			linear-gradient(var(--glass), var(--glass)) padding-box,
			var(--glass-shine) border-box;
		color: var(--fg-66);
		cursor: pointer;
		box-sizing: border-box;
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		transition: transform 0.15s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
	}

	.title-back:hover {
		color: var(--fg);
		transform: scale(1.06);
	}

	.title-back:active {
		transform: scale(0.96);
	}

	.mobile-page-title {
		display: none;
	}

	.mobile-title-stack {
		display: flex;
		align-items: center;
		gap: 6px;
		min-width: 0;
		flex: 1;
		height: 44px;
	}

	.mobile-page-name {
		margin: 0;
		min-width: 0;
		font-family: 'Inter', var(--font), system-ui, sans-serif;
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.01em;
		line-height: 1.15;
		color: var(--fg-66);
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chrome-btn {
		display: none;
	}

	.mobile-type {
		display: none;
	}

	@media (max-width: 767px) {
		.list-title-row.desktop-only-title {
			display: none;
		}

		.mobile-page-title {
			display: flex;
			align-items: center;
			align-self: center;
			justify-content: center;
			min-width: 0;
			flex: 1;
			height: 44px;
		}

		.mobile-page-title:not(.nested) .mobile-title-stack {
			align-items: center;
			justify-content: center;
		}

		.mobile-page-title.nested {
			gap: 4px;
		}

		.mobile-page-title.nested .mobile-title-stack.centered {
			flex: 1;
			min-width: 0;
			height: 44px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0;
		}

		.mobile-type {
			display: block;
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

		.chrome-btn {
			display: grid;
			place-items: center;
			width: 44px;
			height: 44px;
			flex-shrink: 0;
			margin: 0;
			padding: 0;
			border: 1px solid transparent;
			border-radius: 9999px;
			background:
				linear-gradient(var(--glass), var(--glass)) padding-box,
				var(--glass-shine) border-box;
			color: var(--fg-66);
			cursor: pointer;
			box-sizing: border-box;
			backdrop-filter: blur(var(--glass-blur));
			-webkit-backdrop-filter: blur(var(--glass-blur));
			-webkit-tap-highlight-color: transparent;
			transition: transform 0.15s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
		}

		.chrome-btn:hover {
			transform: scale(1.04);
		}

		.chrome-btn :global(svg) {
			width: 22px;
			height: 22px;
		}

		.chrome-btn.chev-back :global(svg) {
			padding-right: 2px;
			box-sizing: content-box;
		}
	}
</style>
