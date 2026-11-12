<script>
	/**
	 * Configurable Alpha app shell — sidebar + list/detail + mobile drawer nav.
	 * Apps pass sections and own domain logic; this owns chrome presentation.
	 */
	import { attachChromeScrollFade } from './chrome-scroll-fade.js';
	import MenuToggle from './icons/MenuToggle.svelte';
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
	 *   listSize?: 'default' | 'chat',
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
		/** @deprecated Bottom pill removed; kept for call-site compat. */
		mobileSections: _mobileSections = null,
		activeHref = '',
		title = '',
		counts = {},
		wideList = false,
		/** Wider list column (Chat feed on desktop). */
		listSize = 'default',
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

	/** @type {HTMLElement | undefined} */
	let listColEl = $state();
	/** @type {HTMLElement | undefined} */
	let shellEl = $state();
	let listFade = $state(0);
	let search = $state('');
	let createMenuOpen = $state(false);
	let filterOpen = $state(false);
	/** Mobile expanding nav panel. Desktop sidebar stays in-flow. */
	let mobileNavOpen = $state(false);
	/** 0..1 while dragging the menu open/closed; null when idle. */
	let menuDrag = $state(/** @type {number | null} */ (null));
	let isMobileViewport = $state(false);
	/** Ignore our own pushState/back while syncing the Android-back trap. */
	let ignoreNavPop = false;
	/** Last path we armed — popstate with a path change is section back, not nav. */
	let navArmedPath = '';
	/** Only close the menu when the section href actually changes. */
	let lastNavHref = '';
	/** Detail pane covering the list — hide the menu chrome so back stays usable. */
	let detailCovering = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(max-width: 767px)');
		const sync = () => {
			isMobileViewport = mq.matches;
			if (!mq.matches) closeMobileNav({ history: false });
		};
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});

	/* Watch detail open/progress so the fixed menu circle never sits on the back button. */
	$effect(() => {
		const ws = listColEl?.parentElement;
		if (!ws || typeof window === 'undefined') return;

		const sync = () => {
			const detail = ws.querySelector('.detail');
			const open = Boolean(detail?.classList.contains('open'));
			const raw = getComputedStyle(ws).getPropertyValue('--detail-progress').trim();
			const p = raw ? Number.parseFloat(raw) : open ? 1 : 0;
			const covering = open || (Number.isFinite(p) && p > 0.02);
			detailCovering = covering;
			if (covering && mobileNavOpen) closeMobileNav({ history: false });
		};

		sync();
		const mo = new MutationObserver(sync);
		mo.observe(ws, {
			attributes: true,
			subtree: true,
			attributeFilter: ['class', 'style']
		});
		return () => mo.disconnect();
	});

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

	function isMobileShell() {
		return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
	}

	function detailOpen() {
		const workspace = listColEl?.parentElement;
		return Boolean(workspace?.querySelector('.detail.open'));
	}

	/** Drop the alphaNav flag without walking history (section changes). */
	function clearNavHistoryFlag() {
		if (typeof history === 'undefined' || !history.state?.alphaNav) return;
		ignoreNavPop = true;
		const next = { ...(history.state || {}) };
		delete next.alphaNav;
		history.replaceState(next, '');
		queueMicrotask(() => {
			ignoreNavPop = false;
		});
	}

	/**
	 * @param {{ history?: boolean }} [opts]
	 */
	function closeMobileNav(opts = {}) {
		const useHistory = opts.history !== false;
		menuDrag = null;
		if (!mobileNavOpen) {
			if (!useHistory) clearNavHistoryFlag();
			return;
		}
		if (
			useHistory &&
			typeof history !== 'undefined' &&
			history.state?.alphaNav &&
			isMobileShell()
		) {
			ignoreNavPop = true;
			history.back();
			queueMicrotask(() => {
				ignoreNavPop = false;
			});
			mobileNavOpen = false;
			return;
		}
		mobileNavOpen = false;
		if (!useHistory) clearNavHistoryFlag();
	}

	/**
	 * @param {{ history?: boolean }} [opts]
	 */
	function openMobileNav(opts = {}) {
		if (detailOpen()) return;
		if (!isMobileShell()) return;
		const useHistory = opts.history !== false;
		menuDrag = null;
		mobileNavOpen = true;
		if (useHistory && typeof history !== 'undefined' && !history.state?.alphaNav) {
			ignoreNavPop = true;
			history.pushState({ ...(history.state || {}), alphaNav: true }, '');
			queueMicrotask(() => {
				ignoreNavPop = false;
			});
		}
	}

	function toggleMobileNav() {
		if (mobileNavOpen) closeMobileNav();
		else openMobileNav();
	}

	/** @param {string} href */
	function go(href) {
		/* Navigating away — don't history.back() into the previous section. */
		closeMobileNav({ history: false });
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

	$effect(() => {
		activeHref;
		resolvedTitle;
		const root = listColEl;
		return attachChromeScrollFade(root, (v) => {
			listFade = v;
		});
	});

	/* Close drawer when the section href actually changes (not on every effect). */
	$effect(() => {
		const href = activeHref;
		if (lastNavHref && lastNavHref !== href) {
			closeMobileNav({ history: false });
		}
		lastNavHref = href;
	});

	/* Arm one same-URL history entry so Android back can open the nav. */
	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!isMobileViewport) return;
		activeHref;
		const path = window.location.pathname;
		navArmedPath = path;
		if (history.state?.alphaPath === path && history.state?.alphaShell) return;
		ignoreNavPop = true;
		const base = {
			...(history.state || {}),
			alphaShell: true,
			alphaPath: path
		};
		history.replaceState(base, '');
		history.pushState({ ...base, alphaNavTrap: true }, '');
		queueMicrotask(() => {
			ignoreNavPop = false;
		});
	});

	/* Android / browser back: sync drawer to history, or open when still on this list. */
	$effect(() => {
		if (typeof window === 'undefined') return;

		/** @param {PopStateEvent} _e */
		function onPop(_e) {
			if (ignoreNavPop) return;
			if (!isMobileShell()) {
				mobileNavOpen = false;
				return;
			}
			const path = window.location.pathname;
			const pathChanged = Boolean(navArmedPath) && path !== navArmedPath;
			navArmedPath = path;

			/* Detail layers own their history entries — don't steal that back. */
			if (detailOpen() || history.state?.alphaLayer) {
				if (mobileNavOpen) mobileNavOpen = false;
				return;
			}
			if (pathChanged) {
				mobileNavOpen = false;
				menuDrag = null;
				return;
			}
			if (history.state?.alphaNav) {
				mobileNavOpen = true;
				menuDrag = null;
				return;
			}
			if (mobileNavOpen) {
				mobileNavOpen = false;
				menuDrag = null;
				return;
			}
			/* Same-URL back on a main list page opens the nav instead of leaving. */
			openMobileNav({ history: true });
		}

		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	});

	/*
	 * Touch swipe → expanding menu panel (same expand as the toggle).
	 * Open: left-edge swipe right only (keeps scroll / PTR clean).
	 * Close: swipe left on scrim or content while the panel is open.
	 */
	$effect(() => {
		const root = shellEl;
		if (!root || typeof window === 'undefined') return;

		const EDGE = 28;
		const CLAIM = 10;
		const SPAN = 200;
		const OPEN_AT = 0.28;
		const CLOSE_AT = 0.28;

		let startX = 0;
		let startY = 0;
		/** @type {'open' | 'close' | null} */
		let mode = null;
		let claimed = false;
		let startOpen = false;
		let tracking = false;
		let suppressToggleClick = false;

		/** @param {TouchEvent} e */
		function onStart(e) {
			if (!isMobileShell() || detailOpen()) return;
			if (e.touches.length !== 1) return;
			const t = e.target;
			if (
				t instanceof Element &&
				t.closest(
					'input, textarea, select, [contenteditable="true"], [data-no-nav-swipe]'
				)
			) {
				return;
			}
			/* Panel chrome / nav links own their taps — don't start a drag there. */
			if (t instanceof Element && t.closest('.sidebar')) return;

			const touch = e.touches[0];
			startX = touch.clientX;
			startY = touch.clientY;
			startOpen = mobileNavOpen;
			claimed = false;
			tracking = false;
			mode = null;
			menuDrag = null;

			if (mobileNavOpen) {
				mode = 'close';
				tracking = true;
				return;
			}
			/* Open only from the left edge — mid-page right-swipes fought scroll on phones. */
			if (touch.clientX <= EDGE) {
				mode = 'open';
				tracking = true;
			}
		}

		/** @param {TouchEvent} e */
		function onMove(e) {
			if (!tracking || !mode || e.touches.length !== 1) return;
			const touch = e.touches[0];
			const dx = touch.clientX - startX;
			const dy = touch.clientY - startY;
			if (!claimed) {
				if (Math.abs(dx) < CLAIM && Math.abs(dy) < CLAIM) return;
				/* Vertical wins — abandon (let scroll / PTR run). */
				if (Math.abs(dy) > Math.abs(dx) * 0.85) {
					tracking = false;
					mode = null;
					menuDrag = null;
					return;
				}
				if (mode === 'open' && dx < 0) {
					tracking = false;
					mode = null;
					return;
				}
				if (mode === 'close' && dx > 0) {
					tracking = false;
					mode = null;
					return;
				}
				claimed = true;
				suppressToggleClick = true;
			}
			e.preventDefault();
			if (mode === 'open') {
				menuDrag = Math.max(0, Math.min(1, dx / SPAN));
			} else {
				menuDrag = Math.max(0, Math.min(1, 1 + dx / SPAN));
			}
		}

		function onEnd() {
			if (!tracking) {
				suppressToggleClick = false;
				return;
			}
			const p = menuDrag;
			const wasClaimed = claimed;
			tracking = false;
			mode = null;
			claimed = false;
			if (!wasClaimed || p == null) {
				menuDrag = null;
				queueMicrotask(() => {
					suppressToggleClick = false;
				});
				return;
			}
			const nextOpen = startOpen ? p > 1 - CLOSE_AT : p >= OPEN_AT;
			menuDrag = null;
			if (nextOpen) openMobileNav({ history: true });
			else closeMobileNav({ history: true });
			queueMicrotask(() => {
				suppressToggleClick = false;
			});
		}

		/** Swallow the click that follows a finished drag on the toggle. */
		function onClickCapture(e) {
			if (!suppressToggleClick) return;
			const t = e.target;
			if (t instanceof Element && t.closest('.mobile-nav-toggle')) {
				e.preventDefault();
				e.stopPropagation();
			}
		}

		root.addEventListener('touchstart', onStart, { passive: true, capture: true });
		root.addEventListener('touchmove', onMove, { passive: false, capture: true });
		root.addEventListener('touchend', onEnd, { capture: true });
		root.addEventListener('touchcancel', onEnd, { capture: true });
		root.addEventListener('click', onClickCapture, true);
		return () => {
			root.removeEventListener('touchstart', onStart, true);
			root.removeEventListener('touchmove', onMove, true);
			root.removeEventListener('touchend', onEnd, true);
			root.removeEventListener('touchcancel', onEnd, true);
			root.removeEventListener('click', onClickCapture, true);
		};
	});

	const menuProgress = $derived(
		menuDrag != null ? menuDrag : mobileNavOpen ? 1 : 0
	);
</script>

<div
	class="shell {feedPadClass}"
	class:nav-open={mobileNavOpen}
	class:nav-dragging={menuDrag != null}
	class:detail-covering={detailCovering}
	class:list-chat={listSize === 'chat'}
	bind:this={shellEl}
	style="--menu-progress: {menuProgress}"
>
	{#if banners}
		{@render banners()}
	{/if}

	{#if isMobileViewport}
		<button
			type="button"
			class="nav-menu-scrim"
			class:on={mobileNavOpen || menuProgress > 0.02}
			style="opacity: {Math.min(1, menuProgress)}"
			aria-label="Close menu"
			tabindex={mobileNavOpen ? 0 : -1}
			onclick={() => closeMobileNav()}
		></button>
	{/if}

	<aside class="sidebar" id="alpha-shell-sidebar">
		{#if isMobileViewport}
			<button
				type="button"
				class="mobile-nav-toggle"
				aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileNavOpen}
				aria-controls="alpha-shell-sidebar"
				onclick={toggleMobileNav}
			>
				<MenuToggle open={menuProgress > 0.5} align="left" size={16} className="chrome-ico" />
			</button>
		{/if}
		<div
			class="sidebar-inner"
			aria-hidden={isMobileViewport && menuProgress < 0.02 ? true : undefined}
		>
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
		</div>
	</aside>

	<div class="workspace-wrap">
		<div class="workspace">
			<section
				class="list-col"
				class:wide={wideList}
				class:chat={listSize === 'chat'}
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
		box-sizing: border-box;
	}

	.sidebar-inner {
		display: flex;
		flex-direction: column;
		min-height: 0;
		flex: 1;
		gap: 10px;
		overflow: hidden;
	}

	.mobile-nav-toggle,
	.nav-menu-scrim {
		display: none;
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
		position: relative;
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

	.list-col.chat {
		flex-basis: var(--list-chat, var(--list));
		width: var(--list-chat, var(--list));
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

	@media (max-width: 767px) {
		.shell {
			--chrome-fade: var(--shell);
			--menu-progress: 0;
			--feed-pad-top: calc(52px + env(safe-area-inset-top, 0px));
			--feed-pad-bottom: calc(28px + env(safe-area-inset-bottom, 0px));
			position: relative;
			flex-direction: column;
			padding-bottom: 0;
			background: var(--shell);
			touch-action: pan-y;
		}

		.shell.tasks-pad {
			--feed-pad-top: calc(56px + env(safe-area-inset-top, 0px));
		}

		/* Modal-style scrim behind the expanding menu panel */
		.nav-menu-scrim {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 85;
			margin: 0;
			padding: 0;
			border: 0;
			background: var(--scrim);
			cursor: pointer;
			pointer-events: none;
			opacity: 0;
			transition: opacity 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
		}

		.nav-menu-scrim.on {
			pointer-events: auto;
		}

		.shell.nav-dragging .nav-menu-scrim {
			transition: none;
		}

		/*
		 * Expanding menu: circle chrome button → rounded rectangle panel.
		 * Stays fixed in the top-left chrome slot (does not slide the page).
		 */
		.sidebar {
			position: fixed;
			z-index: 90;
			top: calc(6px + env(safe-area-inset-top, 0px));
			left: 14px;
			width: 44px;
			height: 44px;
			padding: 0;
			gap: 0;
			border-radius: 9999px;
			border: 1px solid transparent;
			background:
				linear-gradient(var(--glass), var(--glass)) padding-box,
				var(--glass-shine) border-box;
			color: var(--fg-66);
			overflow: hidden;
			box-shadow: 0 8px 28px color-mix(in srgb, var(--fg-raw, #000) calc(18% * var(--menu-progress)), transparent);
			backdrop-filter: blur(var(--glass-blur));
			-webkit-backdrop-filter: blur(var(--glass-blur));
			transform: scale(calc(0.96 + 0.04 * var(--menu-progress)));
			transform-origin: top left;
			transition:
				width 0.34s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
				height 0.34s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
				max-height 0.34s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
				border-radius 0.34s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
				padding 0.34s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
				background 0.28s ease,
				box-shadow 0.34s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
				transform 0.34s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
			pointer-events: auto;
		}

		.shell.nav-open .sidebar,
		.shell.nav-dragging .sidebar {
			width: min(300px, calc(100vw - 28px));
			height: auto;
			max-height: calc(100dvh - 24px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
			padding: 10px 12px 12px;
			border-radius: 22px;
			background: var(--glass-panel);
			color: var(--fg);
		}

		.shell.nav-dragging .sidebar {
			/* Live drag: circle → panel (width + max-height so height doesn't jump) */
			width: calc(44px + (min(300px, 100vw - 28px) - 44px) * var(--menu-progress));
			height: auto;
			max-height: calc(
				44px + (100dvh - 24px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 44px) *
					var(--menu-progress)
			);
			padding: calc(10px * var(--menu-progress)) calc(12px * var(--menu-progress));
			border-radius: calc(9999px - (9999px - 22px) * var(--menu-progress));
			transition: none;
		}

		.mobile-nav-toggle {
			display: grid;
			place-items: center;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 2;
			width: 44px;
			height: 44px;
			margin: 0;
			padding: 0;
			border: 0;
			border-radius: 9999px;
			background: transparent;
			color: inherit;
			cursor: pointer;
			-webkit-tap-highlight-color: transparent;
		}

		.shell.nav-open .mobile-nav-toggle {
			color: var(--fg-66);
		}

		.sidebar-inner {
			opacity: var(--menu-progress);
			pointer-events: none;
			transform: translate3d(0, calc(6px * (1 - var(--menu-progress))), 0);
			transition:
				opacity 0.22s ease,
				transform 0.34s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
			padding-top: 44px;
			min-height: 0;
			flex: 1;
			overflow: hidden;
		}

		.shell.nav-open .sidebar-inner {
			pointer-events: auto;
		}

		.shell.nav-dragging .sidebar-inner {
			transition: none;
		}

		.workspace-wrap {
			position: relative;
			z-index: 2;
			flex: 1 1 auto;
			width: 100%;
			min-width: 0;
			min-height: 0;
			padding: 0;
			display: flex;
			overflow: hidden;
			background: var(--shell);
		}

		.workspace {
			border-radius: 0;
			border: 0;
			background: var(--shell);
			width: 100%;
			overflow: hidden;
		}

		.list-col {
			flex: 1;
			width: 100%;
			max-width: none;
			min-width: 0;
			border-right: 0;
			background: var(--shell);
			transform-origin: left center;
			/* Paired with DetailColumn: underlay parks left while detail covers */
			transform: translate3d(calc(-30% * var(--detail-progress, 0)), 0, 0)
				scale(calc(1 - 0.08 * var(--detail-progress, 0)));
			border-radius: calc(14px * var(--detail-progress, 0));
			transition:
				transform 0.4s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
				border-radius 0.4s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
			will-change: transform;
		}

		/* iOS-like: list slides left + dims while detail enters from the right */
		.list-col::before {
			content: '';
			position: absolute;
			inset: 0;
			z-index: 40;
			border-radius: inherit;
			background: color-mix(in srgb, var(--fg-raw, #000) 36%, transparent);
			opacity: var(--detail-progress, 0);
			pointer-events: none;
			transition: opacity 0.4s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
		}

		:global(.workspace.detail-dragging) .list-col,
		:global(.workspace.detail-dragging) .list-col::before {
			transition: none;
		}

		.list-top {
			height: calc(88px + env(safe-area-inset-top, 0px));
			padding: calc(6px + env(safe-area-inset-top, 0px)) 14px 34px 14px;
			align-items: center;
			background: transparent;
			gap: 8px;
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

		/* Title is absolutely centered — keep filter/plus on the right */
		.list-top > .list-actions {
			position: relative;
			z-index: 2;
			margin-left: auto;
		}

		/* Fixed menu chrome sits above the list; hide it while a detail covers the list */
		.shell.detail-covering .sidebar,
		.shell.detail-covering .nav-menu-scrim {
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			transition: none;
		}

		/* Soft veil at bottom (safe-area only — no pill) */
		.list-bottom-fade {
			display: block;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 5;
			height: calc(40px + env(safe-area-inset-bottom, 0px));
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
			justify-content: center;
			min-width: 0;
			flex: 1;
			height: 44px;
			transition: transform 0.34s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
		}

		/* True screen-center: full bar width, text centered; side pad only avoids chrome overlap */
		.list-top > :global(.mobile-page-title),
		.list-top > .mobile-page-title,
		.list-top > :global(.mail-title) {
			position: absolute;
			left: 0;
			right: 0;
			top: calc(6px + env(safe-area-inset-top, 0px));
			height: 44px;
			flex: none;
			width: auto;
			padding: 0 58px;
			box-sizing: border-box;
			justify-content: center;
			pointer-events: none;
			z-index: 1;
		}

		.list-top > :global(.mobile-page-title) > :global(*),
		.list-top > .mobile-page-title > :global(*),
		.list-top > :global(.mail-title) > :global(*) {
			pointer-events: auto;
		}

		.shell.nav-open .list-top > :global(.mobile-page-title),
		.shell.nav-open .list-top > .mobile-page-title,
		.shell.nav-dragging .list-top > :global(.mobile-page-title),
		.shell.nav-dragging .list-top > .mobile-page-title,
		.shell.nav-open .list-top > :global(.mail-title),
		.shell.nav-dragging .list-top > :global(.mail-title) {
			position: relative;
			left: auto;
			right: auto;
			top: auto;
			flex: 1;
			width: auto;
			padding: 0;
			justify-content: flex-start;
			transform: none;
			z-index: auto;
		}

		.mobile-title-stack {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			min-width: 0;
			flex: 1;
			height: 44px;
			transition: align-items 0.34s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
		}

		.shell.nav-open .mobile-title-stack,
		.shell.nav-dragging .mobile-title-stack,
		.shell.nav-open .list-top :global(.mobile-title-stack),
		.shell.nav-dragging .list-top :global(.mobile-title-stack) {
			align-items: flex-start;
		}

		.mobile-page-name {
			margin: 0;
			min-width: 0;
			max-width: 100%;
			font-family: 'Inter', var(--font), system-ui, sans-serif;
			/* Match deeper mobile chrome titles */
			font-size: 17px;
			font-weight: 600;
			letter-spacing: -0.01em;
			line-height: 1.15;
			color: var(--fg-66);
			text-align: center;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			transition:
				color 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)),
				text-align 0.28s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
		}

		.shell.nav-open .mobile-page-name,
		.shell.nav-dragging .mobile-page-name,
		.shell.nav-open .list-top :global(.mobile-page-name),
		.shell.nav-dragging .list-top :global(.mobile-page-name),
		.shell.nav-open .list-top :global(.mobile-name),
		.shell.nav-dragging .list-top :global(.mobile-name) {
			text-align: left;
		}

		/* Slotted ListTitleChrome / MailFolderTitle share the quieter centered look */
		.list-top :global(.mobile-page-name),
		.list-top :global(.mobile-name) {
			font-size: 17px;
			font-weight: 600;
			letter-spacing: -0.01em;
			line-height: 1.15;
			color: var(--fg-66);
			text-align: center;
		}

		.list-top :global(.mobile-title-stack) {
			align-items: center;
			justify-content: center;
		}

		.shell.nav-open .list-top :global(.mobile-title-stack),
		.shell.nav-dragging .list-top :global(.mobile-title-stack) {
			align-items: flex-start;
		}

		.list-top :global(.title-btn.mobile) {
			justify-content: center;
			width: 100%;
		}

		.shell.nav-open .list-top :global(.title-btn.mobile),
		.shell.nav-dragging .list-top :global(.title-btn.mobile) {
			justify-content: flex-start;
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
	}

	.side-spacer {
		flex: 1;
		min-width: 0;
	}

</style>
