<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from '$lib/i18n';
	import { locale, theme, setLocale, setTheme } from '$lib/prefs';
	import { langFromPath, localizedPath, stripLang } from '$lib/i18n-path';
	import { site } from '$lib/site';
	import AlphaLogo from '$lib/components/AlphaLogo.svelte';
	import { ChevronDown } from '$lib/components/icons';
	import MenuToggle from '@alpha/ui/icons/MenuToggle.svelte';
	import SegmentedControl from '@alpha/ui/SegmentedControl.svelte';

	let open = $state(false);
	let settingsOpen = $state(false);
	/** 0..1 — fades in over the first ~20px of scroll */
	let scrollShade = $state(0);
	/** @type {HTMLDivElement | undefined} */
	let settingsWrap = $state();

	const lang = $derived(langFromPath($page.url.pathname) || $locale);

	const links = $derived([
		{ href: localizedPath(lang, '/contact'), label: $t.navTry },
		{
			href: site.communityUrl,
			label: $t.navCommunity,
			external: true
		},
		{ href: localizedPath(lang, '/pricing'), label: $t.navPricing }
	]);

	const homeHref = $derived(localizedPath(lang, '/'));

	const settingsLabel = $derived($locale === 'fr' ? 'FR' : 'EN');

	function isActive(href) {
		const path = $page.url.pathname;
		return path === href || path.startsWith(href + '/');
	}

	/** @param {'fr' | 'en'} next */
	function switchLang(next) {
		setLocale(next);
		const rest = stripLang($page.url.pathname);
		goto(localizedPath(next, rest));
	}

	function toggle() {
		open = !open;
		if (!open) settingsOpen = false;
	}

	function close() {
		open = false;
		settingsOpen = false;
	}

	function toggleSettings() {
		settingsOpen = !settingsOpen;
	}

	$effect(() => {
		$page.url.pathname;
		open = false;
		settingsOpen = false;
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	onMount(() => {
		/** @param {MouseEvent} e */
		function onDoc(e) {
			if (!settingsWrap) return;
			if (!settingsWrap.contains(/** @type {Node} */ (e.target))) {
				settingsOpen = false;
			}
		}
		function onScroll() {
			scrollShade = Math.min(1, window.scrollY / 20);
		}
		onScroll();
		document.addEventListener('click', onDoc);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			document.removeEventListener('click', onDoc);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<div
	class="scroll-shade"
	style="opacity: {scrollShade * 0.5}"
	aria-hidden="true"
></div>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="menu-scrim" onclick={close} aria-hidden="true" transition:fade={{ duration: 200 }}></div>
{/if}

<header class="nav-wrap">
	<div class="pill" class:open>
		<div class="bar">
			<a class="brand" href={homeHref} onclick={close} aria-label={site.shortName}>
				<AlphaLogo size={18} className="nav-mark" />
				<span class="word desktop-word">{site.shortName}</span>
			</a>

			<a class="word mobile-word" href={homeHref} onclick={close}>{site.shortName}</a>

			<nav class="desktop-links" aria-label="Main">
				{#each links as link}
					<a
						href={link.href}
						class="nav-link"
						class:selected={!link.external && isActive(link.href)}
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noopener noreferrer' : undefined}
					>
						{link.label}
					</a>
				{/each}

				<div class="settings" bind:this={settingsWrap}>
					<button
						type="button"
						class="settings-btn"
						class:open={settingsOpen}
						aria-expanded={settingsOpen}
						aria-haspopup="true"
						onclick={toggleSettings}
					>
						<span>{settingsLabel}</span>
						<span class="settings-chev">
							<ChevronDown variant="outline" size={12} color="currentColor" strokeWidth={1.6} />
						</span>
					</button>

					{#if settingsOpen}
						<div class="menu alpha-popover" role="dialog" aria-label={$t.navSettings}>
							<section class="menu-section">
								<p class="menu-label">{$t.settingsLang}</p>
								<SegmentedControl
									label={$t.settingsLang}
									value={$locale}
									options={[
										{ value: 'fr', label: 'FR' },
										{ value: 'en', label: 'EN' }
									]}
									onchange={(next) => switchLang(/** @type {'fr' | 'en'} */ (next))}
								/>
							</section>

							<section class="menu-section">
								<p class="menu-label">{$t.settingsTheme}</p>
								<SegmentedControl
									label={$t.settingsTheme}
									value={$theme}
									options={[
										{ value: 'light', label: $t.themeLight },
										{ value: 'dark', label: $t.themeDark },
										{ value: 'system', label: $t.themeSystem }
									]}
									onchange={(next) =>
										setTheme(/** @type {'light' | 'dark' | 'system'} */ (next))
									}
								/>
							</section>
						</div>
					{/if}
				</div>
			</nav>

			<button
				type="button"
				class="burger"
				aria-expanded={open}
				aria-controls="mobile-menu"
				aria-label={open ? 'Close menu' : 'Open menu'}
				onclick={toggle}
			>
				<MenuToggle open={open} align="left" short="mid" size={20} />
			</button>
		</div>

		<div id="mobile-menu" class="mobile-shell" class:open>
			<nav class="mobile-inner" aria-label="Mobile">
				<div class="mobile-links">
					{#each links as link}
						<a
							href={link.href}
							class="nav-link mobile-link"
							class:selected={!link.external && isActive(link.href)}
							target={link.external ? '_blank' : undefined}
							rel={link.external ? 'noopener noreferrer' : undefined}
							onclick={close}
						>
							{link.label}
						</a>
					{/each}
				</div>

				<div class="mobile-settings">
					<section class="menu-section">
						<p class="menu-label">{$t.settingsLang}</p>
						<SegmentedControl
							label={$t.settingsLang}
							value={$locale}
							options={[
								{ value: 'fr', label: 'FR' },
								{ value: 'en', label: 'EN' }
							]}
							onchange={(next) => switchLang(/** @type {'fr' | 'en'} */ (next))}
						/>
					</section>
					<section class="menu-section">
						<p class="menu-label">{$t.settingsTheme}</p>
						<SegmentedControl
							label={$t.settingsTheme}
							value={$theme}
							options={[
								{ value: 'light', label: $t.themeLight },
								{ value: 'dark', label: $t.themeDark },
								{ value: 'system', label: $t.themeSystem }
							]}
							onchange={(next) => setTheme(/** @type {'light' | 'dark' | 'system'} */ (next))}
						/>
					</section>
				</div>
			</nav>
		</div>
	</div>
</header>

<style>
	.scroll-shade {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 80px;
		z-index: 40;
		pointer-events: none;
		opacity: 0;
		background: linear-gradient(
			to bottom,
			var(--bg) 0%,
			color-mix(in srgb, var(--bg) 72%, transparent) 42%,
			transparent 100%
		);
	}

	.menu-scrim {
		position: fixed;
		inset: 0;
		z-index: 45;
		background: var(--scrim);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.nav-wrap {
		position: fixed;
		top: var(--nav-inset);
		left: var(--nav-inset);
		right: var(--nav-inset);
		z-index: 50;
		pointer-events: none;
	}

	@media (min-width: 1024px) {
		.nav-wrap {
			left: 50%;
			right: auto;
			/*
			  Match hero frame width with ~8px inset each side so the pill
			  sits neatly inside the rounded rectangle padding.
			*/
			width: min(
				calc(100% - 2 * var(--pad-x) - 16px),
				calc(var(--container-max) - 16px)
			);
			transform: translateX(-50%);
		}
	}

	.pill {
		pointer-events: auto;
		background: var(--glass);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		border: 1px solid var(--hairline);
		/* Collapsed = fully rounded pill of fixed height */
		border-radius: calc(var(--nav-h) / 2);
		overflow: hidden;
		position: relative;
		transition: border-radius 0.35s var(--ease);
	}

	.pill.open {
		/* Concentric with hero rounded rect */
		border-radius: var(--nav-radius-open);
	}

	.bar {
		display: grid;
		grid-template-columns: 44px 1fr 44px;
		align-items: center;
		height: var(--nav-h);
		min-height: var(--nav-h);
		max-height: var(--nav-h);
		/* Match desktop logo inset: a bit more pad on the mark side */
		padding: 0 8px 0 12px;
		box-sizing: border-box;
		flex-shrink: 0;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: calc(0.55rem + 2px);
		justify-self: start;
		padding: 0.35rem;
		color: var(--ink);
	}

	.word {
		font-family: var(--font-sans);
		font-weight: 550;
		font-size: 0.78rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: inherit;
	}

	.mobile-word {
		justify-self: center;
		text-align: center;
		color: inherit;
		text-decoration: none;
		-webkit-tap-highlight-color: transparent;
	}

	.desktop-word {
		display: none;
	}

	.desktop-links {
		display: none;
	}

	.burger {
		justify-self: end;
		width: 44px;
		height: 44px;
		border: none;
		background: transparent;
		cursor: pointer;
		display: grid;
		place-items: center;
		padding: 0;
		color: var(--ink66);
		transition: color 0.2s var(--ease);
	}

	.burger:hover {
		color: var(--ink);
	}

	.burger-lines,
	.burger-lines::before,
	.burger-lines::after {
		display: block;
		width: 18px;
		height: 1.5px;
		background: currentColor;
		border-radius: 1px;
		transition:
			transform 0.3s var(--ease),
			opacity 0.2s var(--ease),
			background 0.2s var(--ease);
	}

	.burger-lines {
		position: relative;
	}

	.burger-lines::before,
	.burger-lines::after {
		content: '';
		position: absolute;
		left: 0;
	}

	.burger-lines::before {
		top: -6px;
	}

	.burger-lines::after {
		top: 6px;
	}

	.burger-lines.x {
		background: transparent;
	}

	.burger-lines.x::before {
		top: 0;
		transform: rotate(45deg);
	}

	.burger-lines.x::after {
		top: 0;
		transform: rotate(-45deg);
	}

	.mobile-shell {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.35s var(--ease);
	}

	.mobile-shell.open {
		grid-template-rows: 1fr;
	}

	.mobile-inner {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		/* No horizontal pad here — settings dividers bleed to the panel edge */
		padding: 0;
	}

	.mobile-links {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 1rem 0.85rem;
	}

	/* Higher specificity than .nav-link so type size actually wins */
	a.nav-link.mobile-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: auto;
		max-width: 100%;
		padding: 0.5rem 1.05rem;
		text-align: center;
		font-size: 1.0625rem;
		line-height: 1.2;
		font-weight: 500;
		border-radius: var(--radius-pill);
		color: var(--ink66);
	}

	a.nav-link.mobile-link.selected {
		background: color-mix(in srgb, var(--ink) 8%, transparent);
		color: var(--ink);
	}

	.mobile-settings {
		margin-top: 0;
		border-top: 1px solid var(--hairline);
	}

	/* Full-bleed hairlines; pad content inside each section only */
	.mobile-settings .menu-section {
		padding: 0.85rem 1rem;
	}

	.mobile-settings .menu-section:last-child {
		padding-bottom: 1rem;
	}

	.nav-link {
		font-size: 14px;
		font-weight: 500;
		color: var(--ink66);
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.35rem 0.1rem;
		border-radius: var(--radius-pill);
		transition:
			color 0.2s var(--ease),
			background 0.2s var(--ease);
	}

	.nav-link:hover,
	.nav-link.selected {
		color: var(--ink);
	}

	.settings {
		position: relative;
		margin-left: 0.35rem;
	}

	.settings-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		color: var(--fg-66, var(--ink66));
		/* Team glass chrome (same as ChromeActionButton) */
		border: 1px solid transparent;
		border-radius: var(--radius-pill);
		background:
			linear-gradient(var(--glass), var(--glass)) padding-box,
			var(--glass-shine) border-box;
		backdrop-filter: blur(var(--glass-blur, 22px));
		-webkit-backdrop-filter: blur(var(--glass-blur, 22px));
		padding: 0.35rem 0.7rem 0.35rem 0.85rem;
		cursor: pointer;
		transition: color 0.2s var(--ease);
		box-sizing: border-box;
	}

	.settings-btn:hover,
	.settings-btn.open {
		color: var(--ink);
	}

	.settings-chev {
		display: inline-flex;
		padding-top: 2px;
		line-height: 0;
		transition: transform 0.15s ease;
	}

	.settings-btn.open .settings-chev {
		transform: rotate(180deg);
	}

	.menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		width: 280px;
		min-width: 14rem;
		padding: 0;
		/* alpha-popover + elevated popover fill */
		--float-panel-bg: var(--popover);
		--field-bg: var(--field-on-elevated);
		z-index: 60;
		overflow: hidden;
	}

	.menu-section {
		padding: 0.85rem 0.95rem;
	}

	.menu-section + .menu-section {
		border-top: 1px solid var(--hairline);
	}

	.menu-label {
		margin: 0 0 0.45rem;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink33);
	}

	@media (min-width: 768px) {
		.pill {
			/* Settings dropdown hangs below the bar */
			overflow: visible;
		}

		.bar {
			display: flex;
			justify-content: space-between;
			gap: 1rem;
			/* Match left inset — settings chip already clears the end-cap */
			padding: 0 12px;
			height: var(--nav-h);
			min-height: var(--nav-h);
			max-height: var(--nav-h);
		}

		.mobile-word,
		.burger,
		.mobile-shell {
			display: none;
		}

		.desktop-word {
			display: inline;
		}

		.desktop-links {
			display: flex;
			align-items: center;
			/* Links sit flush; space only before settings */
			gap: 0;
		}

		.desktop-links > .nav-link {
			padding: 0.4rem 0.85rem;
		}

		.desktop-links > .settings {
			margin-left: 0.55rem;
		}

		.desktop-links > .nav-link.selected {
			background: color-mix(in srgb, var(--ink) 8%, transparent);
		}

		.menu-scrim {
			display: none;
		}
	}
</style>
