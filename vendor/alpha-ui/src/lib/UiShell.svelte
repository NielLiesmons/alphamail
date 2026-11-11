<script>
	/**
	 * Configurable Alpha app shell — sidebar + list/detail + mobile pill nav.
	 * Apps pass sections and own domain logic; this owns chrome presentation.
	 */
	import { tick } from 'svelte';
	import { attachChromeScrollFade } from './chrome-scroll-fade.js';
	import NavIcon from './NavIcon.svelte';
	import PullToRefresh from './PullToRefresh.svelte';

	/**
	 * @typedef {{
	 *   href: string,
	 *   label: string,
	 *   icon: string,
	 *   id?: string,
	 *   countKey?: string,
	 *   createKind?: string,
	 *   active?: boolean
	 * }} ShellSection
	 */

	/**
	 * @type {{
	 *   sections?: ShellSection[],
	 *   mobileSections?: ShellSection[] | null,
	 *   activeHref?: string,
	 *   title?: string,
	 *   counts?: Record<string, number>,
	 *   wideList?: boolean,
	 *   syncing?: boolean,
	 *   searchEnabled?: boolean,
	 *   feedPadClass?: string,
	 *   filterOptions?: { id: string, label: string }[] | null,
	 *   filterValue?: string,
	 *   createMenuItems?: { kind: string, label: string }[],
	 *   createKind?: string | undefined,
	 *   onNavigate?: (href: string) => void,
	 *   onCreate?: (kind: string) => void,
	 *   onNavPlus?: (kind: string | undefined) => void,
	 *   onFilterChange?: (id: string) => void,
	 *   onRefresh?: (() => Promise<void> | void) | null,
	 *   isSectionActive?: ((href: string) => boolean) | null,
	 *   sidebarLead?: import('svelte').Snippet,
	 *   sidebarTrail?: import('svelte').Snippet,
	 *   defaultListActions?: boolean,
	 *   listTitleSlot?: import('svelte').Snippet,
	 *   listActionsSlot?: import('svelte').Snippet,
	 *   detail?: import('svelte').Snippet,
	 *   sheets?: import('svelte').Snippet,
	 *   banners?: import('svelte').Snippet,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		sections = [],
		mobileSections = null,
		activeHref = '',
		title = '',
		counts = {},
		wideList = false,
		syncing = false,
		searchEnabled = true,
		feedPadClass = '',
		filterOptions = null,
		filterValue = 'all',
		createMenuItems = [],
		createKind = undefined,
		/** When false, only listActionsSlot is shown (Admin mail/planning chrome). */
		defaultListActions = true,
		onNavigate = () => {},
		onCreate = () => {},
		onNavPlus = () => {},
		onFilterChange = () => {},
		onRefresh = null,
		isSectionActive = null,
		sidebarLead,
		sidebarTrail,
		listTitleSlot,
		listActionsSlot,
		detail,
		sheets,
		banners,
		children
	} = $props();

	/** @type {HTMLDivElement | undefined} */
	let pillTrack = $state();
	/** @type {HTMLElement | undefined} */
	let listColEl = $state();
	let listFade = $state(0);
	let search = $state('');
	let createMenuOpen = $state(false);
	let filterOpen = $state(false);

	const roleMobileNav = $derived(mobileSections ?? sections);

	/** @param {string} href */
	function active(href) {
		if (isSectionActive) return isSectionActive(href);
		return activeHref === href || activeHref.startsWith(`${href}/`);
	}

	const activeItem = $derived.by(() => {
		const hit = sections.find((item) => active(item.href));
		if (hit) return hit;
		return sections[0] ?? { href: '', label: title || 'Alpha', icon: 'dot' };
	});

	const resolvedTitle = $derived(title || activeItem.label);
	const resolvedCreateKind = $derived(
		createKind !== undefined
			? createKind
			: 'createKind' in activeItem
				? activeItem.createKind
				: undefined
	);
	const filterActive = $derived(Boolean(filterOptions) && filterValue !== 'all');

	const filteredNav = $derived.by(() => {
		const q = search.trim().toLowerCase();
		if (!q) return sections;
		return sections.filter((item) => item.label.toLowerCase().includes(q));
	});

	/** @param {string} href */
	function go(href) {
		onNavigate(href);
	}

	/** @param {string} kind */
	function create(kind) {
		createMenuOpen = false;
		onCreate(kind);
	}

	function onListPlus() {
		if (resolvedCreateKind) onNavPlus(resolvedCreateKind);
		else if (createMenuItems.length) createMenuOpen = true;
	}

	async function centerActivePill() {
		await tick();
		const track = pillTrack;
		if (!track) return;
		const href = activeItem.href;
		const el = track.querySelector(`[data-href="${href}"]`);
		if (!(el instanceof HTMLElement)) return;
		const left = el.offsetLeft - track.clientWidth / 2 + el.offsetWidth / 2;
		track.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
	}

	$effect(() => {
		activeItem.href;
		if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
			centerActivePill();
		}
	});

	$effect(() => {
		activeHref;
		resolvedTitle;
		const root = listColEl;
		return attachChromeScrollFade(root, (v) => {
			listFade = v;
		});
	});
</script>

<div class="shell {feedPadClass}">
	{#if banners}
		{@render banners()}
	{/if}
	<aside class="sidebar">
		<header class="side-top">
			{#if sidebarLead}
				{@render sidebarLead()}
			{/if}
			{#if searchEnabled}
				<label class="search">
					<span class="sr-only">Search</span>
					<svg class="search-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path
							d="M7 12.5A5.5 5.5 0 1 0 7 1.5a5.5 5.5 0 0 0 0 11Zm0 0L14 14.5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
					<input type="search" placeholder="Search" bind:value={search} autocomplete="off" />
				</label>
			{:else}
				<span class="side-spacer"></span>
			{/if}
			{#if createMenuItems.length}
				<div class="create-wrap">
					<button
						type="button"
						class="top-plus"
						aria-label="Create"
						aria-expanded={createMenuOpen}
						onclick={() => (createMenuOpen = !createMenuOpen)}
					>
						<svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
							<path d="M6 1.5v9M1.5 6h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
						</svg>
					</button>
					{#if createMenuOpen}
						<button
							type="button"
							class="menu-scrim"
							aria-label="Close"
							onclick={() => (createMenuOpen = false)}
						></button>
						<div class="create-menu" role="menu">
							{#each createMenuItems as item (item.kind)}
								<button type="button" role="menuitem" onclick={() => create(item.kind)}>{item.label}</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</header>

		<nav class="sidebar-nav" aria-label="Sections">
			{#each filteredNav as item (item.href)}
				{@const count = item.countKey ? counts[item.countKey] : null}
				{@const rowActive = active(item.href)}
				<div
					class="nav-row"
					class:active={rowActive}
					class:creatable={Boolean(item.createKind)}
				>
					<button
						type="button"
						class="nav-item"
						class:active={rowActive}
						onclick={() => go(item.href)}
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
		{#if sidebarTrail}
			<div class="sidebar-trail">
				{@render sidebarTrail()}
			</div>
		{/if}
	</aside>

	<div class="workspace-wrap">
		<div class="workspace">
			<section
				class="list-col"
				class:wide={wideList}
				aria-label={resolvedTitle}
				bind:this={listColEl}
			>
				<header
					class="list-top"
					style="--chrome-scroll-fade: {listFade}"
				>
					{#if listTitleSlot}
						{@render listTitleSlot()}
					{:else}
						<div
							class="list-title-row desktop-only-title"
							class:titles-syncing={syncing}
							aria-busy={syncing || undefined}
						>
							<h1 class="list-title">{resolvedTitle}</h1>
						</div>
						<div class="mobile-page-title">
							<span
								class="mobile-title-stack"
								class:titles-syncing={syncing}
								aria-busy={syncing || undefined}
							>
								<h1 class="mobile-page-name">{resolvedTitle}</h1>
							</span>
						</div>
					{/if}
					<div class="list-actions">
						{#if listActionsSlot}
							{@render listActionsSlot()}
						{/if}
						{#if defaultListActions}
							{#if filterOptions}
								<div class="filter-wrap">
									<button
										type="button"
										class="chrome-btn"
										class:on={filterActive}
										aria-label="Filter"
										aria-expanded={filterOpen}
										aria-haspopup="listbox"
										onclick={() => (filterOpen = !filterOpen)}
									>
										<svg class="chrome-ico" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
											<path
												d="M2.5 4h11M4.5 8h7M6.5 12h3"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
											/>
										</svg>
									</button>
									{#if filterOpen}
										<button
											type="button"
											class="menu-scrim"
											aria-label="Close filter"
											onclick={() => (filterOpen = false)}
										></button>
										<div class="filter-menu" role="listbox">
											{#each filterOptions as opt (opt.id)}
												<button
													type="button"
													class:on={filterValue === opt.id}
													onclick={() => {
														onFilterChange(opt.id);
														filterOpen = false;
													}}>{opt.label}</button
												>
											{/each}
										</div>
									{/if}
								</div>
							{/if}
							{#if resolvedCreateKind}
								<button
									type="button"
									class="chrome-btn list-plus"
									aria-label={`New ${resolvedCreateKind}`}
									onclick={onListPlus}
								>
									<svg class="chrome-ico" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
										<path
											d="M8 3.25v9.5M3.25 8h9.5"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
										/>
									</svg>
								</button>
							{/if}
						{/if}
					</div>
				</header>
				{#if onRefresh}
					<PullToRefresh onRefresh={onRefresh}>
						<div class="pane-inner">
							{@render children?.()}
						</div>
					</PullToRefresh>
				{:else}
					<div class="pane-inner">
						{@render children?.()}
					</div>
				{/if}
				<div class="list-bottom-fade" aria-hidden="true"></div>
			</section>
			{#if !wideList && detail}
				{@render detail()}
			{/if}
		</div>
	</div>

	{#if sheets}
		{@render sheets()}
	{/if}

	<nav class="bottom-pill" aria-label="Sections">
		<div class="pill-inner">
			<div class="pill-track" bind:this={pillTrack}>
				{#each roleMobileNav as item (item.href)}
					<button
						type="button"
						class="pill-item"
						class:on={active(item.href)}
						data-href={item.href}
						aria-label={item.label}
						aria-current={active(item.href) ? 'page' : undefined}
						onclick={() => go(item.href)}
					>
						<span class="pill-icon"><NavIcon name={item.icon} size={22} /></span>
						<span class="pill-label">{item.label}</span>
					</button>
				{/each}
			</div>
		</div>
	</nav>
</div>

<style>
	.shell {
		/* Pad ≈ control row; fade is short/soft so content stays readable until the bar */
		/* Clears the solid control row; fade veil is scroll-driven */
		--feed-pad-top: 44px;
		--feed-pad-bottom: 36px;
		--chrome-fade: var(--bg);
		--chrome-scroll-fade: 0;
		display: flex;
		/* --app-height tracks visualViewport so the keyboard shrinks the app */
		height: var(--app-height, 100dvh);
		max-height: var(--app-height, 100dvh);
		width: 100%;
		overflow: hidden;
		background: var(--shell);
	}

	.sidebar {
		width: var(--side);
		flex-shrink: 0;
		padding: 17px 16px 12px;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
		gap: 10px;
		background: var(--shell);
		color: var(--white);
	}

	.side-top {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
		padding: 2px 0 4px;
	}

	.pfp-btn {
		border: 0;
		padding: 0;
		background: transparent;
		border-radius: 999px;
		cursor: pointer;
		display: grid;
		place-items: center;
		flex-shrink: 0;
		transition: opacity 0.15s ease;
	}

	.pfp-btn:hover {
		opacity: 0.85;
	}

	.search {
		flex: 1;
		min-width: 0;
		height: 32px;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 10px;
		border: 1px solid var(--white16);
		border-radius: 12px;
		background: transparent;
		color: var(--white33);
		box-sizing: border-box;
	}

	.search-icon {
		flex-shrink: 0;
	}

	.search input {
		flex: 1;
		min-width: 0;
		height: 100%;
		border: 0;
		background: transparent;
		color: var(--white);
		font: inherit;
		font-size: 13px;
		outline: none;
	}

	.search input::placeholder {
		color: var(--white33);
	}

	.create-wrap,
	.filter-wrap {
		position: relative;
		flex-shrink: 0;
	}

	.top-plus {
		width: 32px;
		height: 32px;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 12px;
		background: var(--nav-plus-bg);
		color: var(--nav-plus-fg);
		cursor: pointer;
		padding: 0;
		box-sizing: border-box;
	}

	.top-plus:hover {
		color: var(--white);
		background: var(--white8);
	}

	.menu-scrim {
		position: fixed;
		inset: 0;
		z-index: 40;
		border: 0;
		background: transparent;
		cursor: default;
	}

	.create-menu,
	.filter-menu {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		z-index: 50;
		min-width: 168px;
		padding: 0;
		border: 1px solid var(--glass-border);
		border-radius: 12px;
		background: var(--glass);
		overflow: hidden;
		box-shadow: 0 8px 28px color-mix(in srgb, var(--fg-raw) 18%, transparent);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
	}

	.create-menu button,
	.filter-menu button {
		display: block;
		width: 100%;
		padding: 8px 12px;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--fg-66);
		font: inherit;
		font-size: 0.9375rem;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
	}

	.create-menu button:not(:last-child),
	.filter-menu button:not(:last-child) {
		border-bottom: 0.33px solid var(--fg-8);
	}

	.create-menu button:hover,
	.filter-menu button:hover,
	.filter-menu button.on {
		background: var(--fg-4);
		color: var(--fg);
	}

	.filter-menu button.on {
		font-weight: 600;
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	.sidebar-trail {
		flex-shrink: 0;
		margin-top: auto;
		min-width: 0;
		padding-top: 8px;
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
			linear-gradient(var(--glass), var(--glass)) padding-box,
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

	.nav-sub {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 2px 8px 8px 36px;
	}

	.nav-sub-item {
		display: block;
		width: 100%;
		padding: 6px 10px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--white66);
		font-family: 'Inter', var(--font), system-ui, sans-serif;
		font-size: 13px;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
	}

	.nav-sub-item:hover {
		background: var(--fg-4);
		color: var(--white);
	}

	.nav-sub-item.active {
		background: var(--fg-4);
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
		font-style: normal;
		line-height: 1;
		letter-spacing: 0;
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

	.workspace-wrap {
		flex: 1;
		min-width: 0;
		min-height: 0;
		padding: 12px 12px 12px 0;
		box-sizing: border-box;
		display: flex;
	}

	.workspace {
		flex: 1;
		min-width: 0;
		min-height: 0;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		overflow: hidden;
		border-radius: 20px;
		/* Follows theme page bg (#121212-ish dark / soft light) */
		background: var(--bg);
		border: 1px solid var(--hairline);
		color: var(--white);
	}

	.list-col {
		position: relative;
		flex: 0 0 var(--list);
		width: var(--list);
		min-width: 280px;
		min-height: 0;
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--hairline);
		overflow: hidden;
	}

	.list-col.wide {
		flex: 1 1 auto;
		width: auto;
		min-width: 0;
		border-right: 0;
	}


	/* Floating header — solid control row; fade veil only as content scrolls under */
	.list-top {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 6;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
		/* Control row ~48px; extra height is the scroll-driven fade zone */
		height: 72px;
		padding: 0 10px 0 16px;
		border-bottom: none;
		box-sizing: border-box;
		pointer-events: none;
		background: transparent;
	}

	/* Three-stop fade: solid near bar → ~80% mid → clear (no solid ::before cliff) */
	.list-top::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 72px;
		background: linear-gradient(
			to bottom,
			var(--chrome-fade) 0%,
			color-mix(in srgb, var(--chrome-fade) 80%, transparent) 50%,
			transparent 100%
		);
		opacity: var(--chrome-scroll-fade, 0);
		pointer-events: none;
		z-index: -1;
	}

	/* :global — slotted titles/actions (AppShell) share the control-row height;
	   scoped selectors alone never match cross-component class names. */
	@media (min-width: 768px) {
		.list-top > :global(.list-title-row),
		.list-top > .list-actions,
		.list-top > :global(.zoom-seg) {
			height: 48px;
			display: flex;
			align-items: center;
		}
	}

	/* :global(*) — slotted ListTitleChrome roots are other components' scoped
	   nodes; without :global, Svelte rewrites this to >:where(.svelte-…) and
	   back/title clicks stay dead under list-top's pointer-events: none. */
	.list-top > :global(*) {
		pointer-events: auto;
	}

	.list-bottom-fade {
		display: none;
		pointer-events: none;
	}

	.list-title-row {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.list-title {
		margin: 0;
		font-family: 'Inter', var(--font), system-ui, sans-serif;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0;
		color: var(--white33);
	}

	.mobile-page-title {
		display: none;
	}

	/* Sit over Planning’s fixed label column */
	.list-title.planning-title {
		width: 200px;
		max-width: 200px;
		box-sizing: border-box;
		padding-right: 8px;
	}

	.list-top.planning-top {
		padding-left: 16px;
		/* Merge visually with Planning’s sticky head row */
		background: transparent;
		z-index: 8;
	}

	.list-top.planning-top::before,
	.list-top.planning-top::after {
		display: none;
	}

	/* Tasks keep prior feed offset; other feeds sit ~4px higher */
	.shell.tasks-pad {
		--feed-pad-top: 48px;
	}

	.zoom-seg {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		height: 28px;
		padding: 2px;
		box-sizing: border-box;
		border: 1px solid transparent;
		border-radius: 10px;
		background:
			linear-gradient(var(--glass), var(--glass)) padding-box,
			var(--glass-shine) border-box;
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		position: relative;
		z-index: 2;
	}

	.zoom-seg button {
		height: 100%;
		padding: 0 10px;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--fg-33);
		font: inherit;
		font-size: 11px;
		font-weight: 600;
		cursor: pointer;
		line-height: 1;
	}

	.zoom-seg button.on {
		background: var(--fg-8);
		color: var(--fg);
	}

	.list-actions {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	/* Desktop: 28px squared chrome (between prior 26 and nav 32); circles mobile-only */
	.chrome-btn {
		width: 28px;
		height: 28px;
		display: grid;
		place-items: center;
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
		-webkit-tap-highlight-color: transparent;
		transition: transform 0.15s var(--ease);
	}

	.chrome-btn:hover,
	.chrome-btn.on,
	.chrome-btn[aria-expanded='true'] {
		transform: scale(1.06);
	}

	.chrome-btn:active {
		transform: scale(0.96);
	}

	.chrome-ico {
		display: block;
		width: 16px;
		height: 16px;
	}

	.pane {
		flex: 1;
		min-width: 0;
		min-height: 0;
		/* Scroll on .feed so rows pass under absolute chrome fades */
		overflow: hidden;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.pane :global(.ptr) {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}

	.pane-inner {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.bottom-pill {
		display: none;
	}

	@media (max-width: 767px) {
		/* Full-bleed shell — darker than desktop workspace; matches desktop sidebar */
		.shell {
			--chrome-fade: var(--shell);
			/* +4px vs prior so feed clears the floating bar with a little air */
			--feed-pad-top: calc(52px + env(safe-area-inset-top, 0px));
			--feed-pad-bottom: calc(100px + env(safe-area-inset-bottom, 0px));
			flex-direction: column;
			padding-bottom: 0;
			background: var(--shell);
		}

		.shell.tasks-pad {
			--feed-pad-top: calc(56px + env(safe-area-inset-top, 0px));
		}

		.sidebar {
			display: none;
		}

		.workspace-wrap {
			padding: 0;
		}

		.workspace {
			border-radius: 0;
			border: 0;
			background: var(--shell);
		}

		.list-col {
			flex: 1;
			width: 100%;
			max-width: none;
			min-width: 0;
			border-right: 0;
			background: var(--shell);
		}

		.list-top {
			height: calc(88px + env(safe-area-inset-top, 0px));
			padding: calc(6px + env(safe-area-inset-top, 0px)) 14px 34px 18px;
			align-items: center;
			background: transparent;
		}

		.list-top::after {
			top: 0;
			height: 100%;
			background: linear-gradient(
				to bottom,
				var(--chrome-fade) 0%,
				color-mix(in srgb, var(--chrome-fade) 80%, transparent) 50%,
				transparent 100%
			);
		}

		/* Soft veil — three-stop; mid ≈ bottom-nav center */
		.list-bottom-fade {
			display: block;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 5;
			height: calc(88px + env(safe-area-inset-bottom, 0px));
			background: linear-gradient(
				to top,
				color-mix(in srgb, var(--chrome-fade) 90%, transparent) 0%,
				color-mix(in srgb, var(--chrome-fade) 80%, transparent) 50%,
				transparent 100%
			);
		}

		.desktop-only-title {
			display: none;
		}

		.mobile-page-title {
			display: flex;
			align-items: center;
			align-self: center;
			min-width: 0;
			flex: 1;
			height: 44px;
		}

		.mobile-title-stack {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			justify-content: center;
			min-width: 0;
			flex: 1;
			height: 44px;
		}

		.mobile-page-name {
			margin: 0;
			min-width: 0;
			font-family: 'Inter', var(--font), system-ui, sans-serif;
			font-size: 22px;
			font-weight: 700;
			letter-spacing: -0.02em;
			line-height: 1.1;
			color: var(--fg);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.list-actions {
			gap: 8px;
		}

		.chrome-btn {
			width: 44px;
			height: 44px;
			border-radius: 9999px;
			border: 1px solid transparent;
			background:
				linear-gradient(var(--glass), var(--glass)) padding-box,
				var(--glass-shine) border-box;
			color: var(--fg-66);
			backdrop-filter: blur(var(--glass-blur));
			-webkit-backdrop-filter: blur(var(--glass-blur));
		}

		.chrome-btn:hover,
		.chrome-btn.on,
		.chrome-btn[aria-expanded='true'] {
			transform: scale(1.04);
		}

		.chrome-ico {
			width: 22px;
			height: 22px;
		}

		.pane {
			padding: 0;
		}

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

	.side-spacer {
		flex: 1;
		min-width: 0;
	}
</style>
