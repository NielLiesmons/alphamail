<script>
	/**
	 * Sidebar section rows + mobile bottom pill — presentation only.
	 * Used by UiShell; apps may also compose it directly.
	 */
	import NavIcon from './NavIcon.svelte';

	/**
	 * @typedef {{
	 *   href: string,
	 *   label: string,
	 *   icon: string,
	 *   countKey?: string,
	 *   createKind?: string
	 * }} NavSection
	 */

	/**
	 * @type {{
	 *   sections?: NavSection[],
	 *   mobileSections?: NavSection[] | null,
	 *   counts?: Record<string, number>,
	 *   isActive?: (href: string) => boolean,
	 *   onNavigate?: (href: string) => void,
	 *   onNavPlus?: (kind: string | undefined) => void,
	 *   pillTrack?: HTMLDivElement | undefined,
	 *   variant?: 'sidebar' | 'pill' | 'both'
	 * }}
	 */
	let {
		sections = [],
		mobileSections = null,
		counts = {},
		isActive = () => false,
		onNavigate = () => {},
		onNavPlus = () => {},
		pillTrack = $bindable(),
		variant = 'both'
	} = $props();

	const roleMobileNav = $derived(mobileSections ?? sections);
</script>

{#if variant === 'sidebar' || variant === 'both'}
	<nav class="sidebar-nav" aria-label="Sections">
		{#each sections as item (item.href)}
			{@const count = item.countKey ? counts[item.countKey] : null}
			{@const rowActive = isActive(item.href)}
			<div class="nav-row" class:active={rowActive} class:creatable={Boolean(item.createKind)}>
				<button
					type="button"
					class="nav-item"
					class:active={rowActive}
					onclick={() => onNavigate(item.href)}
				>
					<span class="icon-wrap"><NavIcon name={item.icon} size={18} /></span>
					<span class="nav-label">{item.label}</span>
				</button>
				{#if item.createKind || count != null}
					<span class="row-end">
						{#if count != null}
							<span class="count">{count}</span>
						{/if}
						{#if item.createKind}
							<button
								type="button"
								class="row-plus"
								aria-label={`New ${item.createKind}`}
								onclick={() => onNavPlus(item.createKind)}
							>
								<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
									<path
										d="M6 1.5v9M1.5 6h9"
										stroke="currentColor"
										stroke-width="1.6"
										stroke-linecap="round"
									/>
								</svg>
							</button>
						{/if}
					</span>
				{/if}
			</div>
		{/each}
	</nav>
{/if}

{#if variant === 'pill' || variant === 'both'}
	<nav class="bottom-pill" aria-label="Sections">
		<div class="pill-inner">
			<div class="pill-track" bind:this={pillTrack}>
				{#each roleMobileNav as item (item.href)}
					<button
						type="button"
						class="pill-item"
						class:on={isActive(item.href)}
						data-href={item.href}
						aria-label={item.label}
						aria-current={isActive(item.href) ? 'page' : undefined}
						onclick={() => onNavigate(item.href)}
					>
						<span class="pill-icon"><NavIcon name={item.icon} size={22} /></span>
						<span class="pill-label">{item.label}</span>
					</button>
				{/each}
			</div>
		</div>
	</nav>
{/if}

<style>
	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	.nav-row {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 999px;
		overflow: hidden;
	}

	.nav-row:hover {
		background: var(--white4);
	}

	.nav-row.active {
		border: 1px solid transparent;
		background:
			linear-gradient(var(--nav-selected, var(--glass)), var(--nav-selected, var(--glass)))
				padding-box,
			var(--glass-shine) border-box;
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
	}

	.nav-row.active .nav-item {
		color: var(--white);
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: 1;
		min-width: 0;
		padding: 8px 10px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--white66);
		font-family: 'Inter', var(--font), system-ui, sans-serif;
		font-size: 14px;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
	}

	.nav-item.active {
		color: var(--white);
	}

	.nav-row.creatable .nav-item,
	.nav-row:has(.row-end) .nav-item {
		padding-right: 36px;
	}

	.icon-wrap {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: inherit;
	}

	.nav-label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.row-end {
		position: absolute;
		right: 6px;
		top: 50%;
		width: 24px;
		height: 24px;
		transform: translateY(-50%);
		display: grid;
		place-items: center;
		pointer-events: none;
	}

	.count,
	.row-plus {
		grid-area: 1 / 1;
	}

	.count {
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		margin: 0;
		padding: 0;
		font-family: 'Inter', var(--font), system-ui, sans-serif;
		font-size: 12px;
		font-weight: 500;
		line-height: 1;
		font-variant-numeric: lining-nums;
		font-feature-settings: 'lnum' 1, 'tnum' 0, 'onum' 0;
		color: var(--white33);
		text-align: center;
		transition: opacity 0.22s var(--ease);
	}

	.nav-row.active .count {
		color: var(--white66);
	}

	.row-plus {
		width: 24px;
		height: 24px;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--nav-plus-fg);
		padding: 0;
		cursor: pointer;
		flex-shrink: 0;
		opacity: 0;
		pointer-events: none;
		box-sizing: border-box;
		transition:
			opacity 0.22s var(--ease),
			color 0.15s ease,
			background 0.15s ease;
	}

	.nav-row.creatable:hover .count,
	.nav-row.creatable:focus-within .count {
		opacity: 0;
	}

	.nav-row.creatable:hover .row-plus,
	.nav-row.creatable:focus-within .row-plus {
		opacity: 1;
		pointer-events: auto;
	}

	.row-plus:hover {
		color: var(--white);
		background: var(--white8);
	}

	.bottom-pill {
		display: none;
	}

	@media (max-width: 767px) {
		.bottom-pill {
			display: block;
			position: fixed;
			z-index: 40;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 0 12px calc(10px + env(safe-area-inset-bottom, 0px));
			pointer-events: none;
		}

		.pill-inner {
			pointer-events: auto;
			max-width: 100%;
			margin: 0 auto;
			border-radius: 999px;
			border: 1px solid var(--glass-border);
			background: var(--glass-panel);
			box-shadow: 0 8px 28px var(--shadow-strong);
			overflow: hidden;
			backdrop-filter: blur(var(--glass-blur));
			-webkit-backdrop-filter: blur(var(--glass-blur));
		}

		.pill-track {
			display: flex;
			align-items: stretch;
			gap: 0;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			scrollbar-width: none;
			-ms-overflow-style: none;
			padding: 6px 8px;
			scroll-padding-inline: 40%;
		}

		.pill-track::-webkit-scrollbar {
			display: none;
		}

		.pill-item {
			scroll-snap-align: center;
			flex: 0 0 auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 2px;
			min-width: 64px;
			padding: 6px 10px;
			border: 0;
			border-radius: 999px;
			background: transparent;
			color: var(--white33);
			cursor: pointer;
		}

		.pill-item.on {
			color: var(--white);
			background: var(--white8);
		}

		.pill-icon {
			display: flex;
			width: 24px;
			height: 24px;
			align-items: center;
			justify-content: center;
		}

		.pill-icon :global(svg) {
			display: block;
			max-width: 22px;
			max-height: 20px;
		}

		.pill-label {
			font-size: 9px;
			font-weight: 500;
			letter-spacing: 0.02em;
			max-width: 4.5rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
