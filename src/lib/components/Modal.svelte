<script>
	/**
	 * Zapstore-style modal adapted for Bley tokens.
	 * align=center → bottom sheet below 640px (CSS + transition), centered card on desktop.
	 * align=bottom → always bottom sheet (Subscribe CTA).
	 * Scrim fades; sheet only slides (no opacity) so tall News/Shop sheets stay elegant.
	 */
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { Cross } from '$lib/components/icons';

	let {
		open = false,
		onClose,
		ariaLabel = 'Modal dialog',
		title = '',
		description = '',
		align = 'center',
		zIndex = 100,
		maxHeight = 80,
		wide = false,
		/** Instagram-style wide sheet on desktop; bottom sheet on mobile */
		instagram = false,
		/** Hide the default top-right close (e.g. when the child provides its own) */
		hideClose = false,
		closeOnBackdropClick = true,
		closeOnEscape = true,
		children,
		footer
	} = $props();

	let scrollLockHeld = false;

	/** Softer than cubicOut at the end — tall sheets read less abrupt. */
	function easeSheet(t) {
		return 1 - Math.pow(1 - t, 4);
	}

	/**
	 * Decide bottom vs center at the moment the transition starts (not from stale state).
	 * @param {HTMLElement} _node
	 * @param {{ duration?: number, align?: string }} params
	 */
	function sheetSlide(_node, { duration = 380, align: alignMode = 'center' } = {}) {
		const forceBottom = alignMode === 'bottom';
		const forceTop = alignMode === 'top';
		const mobile =
			typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;
		const useBottom = forceBottom || (!forceTop && alignMode === 'center' && mobile);

		if (!useBottom) {
			return {
				duration: duration ?? 240,
				easing: cubicOut,
				css: (t, u) => `opacity: ${t}; transform: translate3d(0, ${u * 14}px, 0)`
			};
		}
		return {
			duration,
			easing: easeSheet,
			css: (_t, u) => `transform: translate3d(0, ${u * 100}%, 0)`
		};
	}

	function dismiss() {
		onClose?.();
	}

	function applyBodyScrollLock() {
		if (!browser) return;
		const scrollY = window.scrollY;
		document.documentElement.style.overflow = 'hidden';
		document.body.style.overflow = 'hidden';
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollY}px`;
		document.body.style.left = '0';
		document.body.style.right = '0';
		document.body.style.width = '100%';
		document.body.dataset.scrollY = String(scrollY);
		scrollLockHeld = true;
	}

	function releaseBodyScrollLock() {
		if (!browser || !scrollLockHeld) return;
		const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
		document.documentElement.style.overflow = '';
		document.body.style.overflow = '';
		document.body.style.position = '';
		document.body.style.top = '';
		document.body.style.left = '';
		document.body.style.right = '';
		document.body.style.width = '';
		delete document.body.dataset.scrollY;
		const root = document.documentElement;
		const prev = root.style.scrollBehavior;
		root.style.scrollBehavior = 'auto';
		window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' });
		root.style.scrollBehavior = prev;
		scrollLockHeld = false;
	}

	$effect(() => {
		if (!browser) return;
		if (open) {
			applyBodyScrollLock();
		} else {
			releaseBodyScrollLock();
		}
	});

	onDestroy(() => {
		releaseBodyScrollLock();
	});

	/** @param {MouseEvent} e */
	function handleBackdropClick(e) {
		if (!closeOnBackdropClick) return;
		const t = /** @type {HTMLElement} */ (e.target);
		if (t === e.currentTarget || t.classList?.contains('scrim')) dismiss();
	}

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (closeOnEscape && open && e.key === 'Escape') {
			e.preventDefault();
			dismiss();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
	<div
		class="layer"
		class:align-top={align === 'top'}
		class:align-bottom={align === 'bottom'}
		class:align-center={align === 'center'}
		style="z-index: {zIndex}"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-label={ariaLabel}
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div
			class="scrim"
			transition:fade={{ duration: 200 }}
			onclick={() => {
				if (closeOnBackdropClick) dismiss();
			}}
			aria-hidden="true"
		></div>

		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="sheet"
			class:wide
			class:instagram
			style="--modal-max-h: {maxHeight}svh"
			in:sheetSlide={{
				duration: align === 'bottom' ? 380 : 360,
				align
			}}
			out:sheetSlide={{
				duration: align === 'bottom' ? 280 : 240,
				align
			}}
			onclick={(e) => e.stopPropagation()}
			role="document"
			tabindex="-1"
		>
			{#if !hideClose}
				<button type="button" class="close" onclick={dismiss} aria-label="Close">
					<Cross variant="outline" size={14} color="currentColor" strokeWidth={1.6} className="cross-glyph" />
				</button>
			{/if}
			<div class="content" class:flush={instagram}>
				{#if title}
					<div class="title-block">
						<h2 class="title">{title}</h2>
						{#if description}
							<p class="desc">{description}</p>
						{/if}
					</div>
				{/if}
				{@render children?.()}
			</div>
			{@render footer?.()}
		</div>
	</div>
{/if}

<style>
	.layer {
		position: fixed;
		inset: 0;
		display: flex;
		justify-content: center;
		padding: 0;
		margin: 0;
		pointer-events: auto;
	}

	.scrim {
		position: absolute;
		inset: 0;
		/* Fixed dark — never theme --ink (light in dark mode) */
		background: var(--scrim);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	/* Explicit alignments */
	.align-top {
		align-items: flex-start;
	}

	.align-bottom {
		align-items: flex-end;
	}

	/* center → desktop centered, mobile bottom — CSS owns layout so JS can't desync */
	.align-center {
		align-items: center;
	}

	@media (max-width: 639px) {
		.align-center {
			align-items: flex-end;
		}
	}

	.sheet {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
		/* Elevated vs page --bg — never frosted page color */
		background: var(--modal-bg);
		/* Recess fields against the sheet, not the page */
		--field-bg: var(--field-on-elevated);
		border: 1px solid var(--hairline);
		box-shadow: 0 16px 48px var(--shadow-strong);
		will-change: transform;
		contain: layout paint;
	}

	.close {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 2;
		width: 36px;
		height: 36px;
		border: 1px solid var(--ui-hairline);
		border-radius: 50%;
		background: var(--popover);
		color: var(--ui-ink);
		font-size: 22px;
		line-height: 1;
		cursor: pointer;
		display: grid;
		place-items: center;
		padding: 0;
		box-sizing: border-box;
		transition: color 0.2s var(--ease);
		-webkit-tap-highlight-color: transparent;
	}

	.close :global(.cross-glyph) {
		opacity: 0.66;
	}

	.close:hover {
		color: var(--ui-ink);
	}

	.close:hover :global(.cross-glyph) {
		opacity: 1;
	}

	/* --- top --- */
	.align-top .sheet {
		margin-bottom: auto;
		border-radius: 0 0 var(--radius-hero) var(--radius-hero);
		max-height: var(--modal-max-h);
		border-top: none;
	}

	/* --- always-bottom (Subscribe) --- */
	.align-bottom .sheet {
		margin: 0;
		border-radius: var(--radius-hero) var(--radius-hero) 0 0;
		max-height: var(--modal-max-h);
		border-bottom: none;
	}

	/* --- center prop: desktop card --- */
	.align-center .sheet {
		margin: 1rem;
		border-radius: 28px;
		max-height: calc(100svh - 2rem);
		max-width: 28rem;
	}

	.align-center .sheet.wide {
		max-width: 36rem;
	}

	.align-center .sheet.instagram {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		--pub-sheet-w: min(640px, calc(100vw - 7.5rem));
		margin: 0.55rem;
		width: var(--pub-sheet-w);
		max-width: var(--pub-sheet-w);
		height: min(880px, 94svh);
		max-height: min(880px, 94svh);
		border-radius: calc(var(--radius-hero) - 2px);
	}

	/* --- center prop: mobile bottom sheet --- */
	@media (max-width: 639px) {
		.align-center .sheet {
			margin: 0;
			border-radius: var(--radius-hero) var(--radius-hero) 0 0;
			max-height: var(--modal-max-h);
			max-width: 100%;
			width: 100%;
			border-bottom: none;
		}

		.align-center .sheet.instagram {
			height: var(--modal-max-h);
			max-height: var(--modal-max-h);
			width: 100%;
			max-width: 100%;
			margin: 0;
			border-radius: calc(var(--radius-hero) - 2px) calc(var(--radius-hero) - 2px) 0 0;
		}
	}

	@media (min-width: 640px) {
		.align-center .sheet {
			max-width: 30rem;
		}

		.align-center .sheet.wide {
			max-width: 40rem;
		}

		.align-bottom .sheet {
			margin-bottom: 16px;
			margin-inline: 16px;
			width: calc(100% - 32px);
			max-width: 30rem;
			border-radius: var(--radius-hero);
			border-bottom: 1px solid var(--hairline);
		}
	}

	.content {
		overflow-y: auto;
		max-height: inherit;
		scrollbar-width: thin;
		padding: 0 1.25rem 1.35rem;
		-webkit-overflow-scrolling: touch;
	}

	.content.flush {
		padding: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.sheet.instagram .content.flush {
		flex: 1;
		min-height: 0;
		height: 100%;
		max-height: none;
	}

	.align-bottom .content,
	.align-center .content {
		padding-bottom: max(1.25rem, env(safe-area-inset-bottom));
	}

	@media (min-width: 640px) {
		.align-center .content {
			padding-bottom: 1.25rem;
		}
	}

	.align-bottom .content.flush,
	.align-center .content.flush {
		padding-bottom: 0;
	}

	.title-block {
		padding: 1.35rem 1.75rem 0.85rem 0;
		text-align: center;
	}

	.title {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(26px, 4vw, 34px);
		letter-spacing: -0.02em;
		line-height: 1.15;
		color: var(--ink);
	}

	.desc {
		margin: 0.55rem 0 0;
		font-size: 15px;
		line-height: 1.5;
		color: var(--ink66);
	}

	:global(body[data-scroll-y]) {
		overflow: hidden !important;
	}
</style>
