<script>
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { dragDismiss as dragDismissAction } from './drag-dismiss.js';

	/**
	 * Create / edit overlay — mobile bottom sheet, desktop centered card.
	 * Pass fullscreen for true edge-to-edge mobile (e.g. now-playing).
	 * Mobile: optional drag-down dismiss (full surface; respects inner scroll).
	 * Never show a visual drag handle — Alpha design system forbids grabbers on modals/sheets.
	 * Pickers (emoji, labels, assignees) use FloatPanel popovers — never nested sheets.
	 */
	let {
		open = false,
		label = 'Create',
		fullscreen = false,
		/** Enable drag-down dismiss on mobile (gesture only — no handle UI) */
		dragDismiss = true,
		/** @deprecated Ignored — drag handles are banned in the design system */
		showHandle: _showHandle = false,
		onclose = () => {},
		children
	} = $props();

	function close() {
		onclose();
	}

	/** @param {KeyboardEvent} event */
	function onKey(event) {
		if (!open) return;
		if (event.key === 'Escape') {
			event.stopPropagation();
			close();
		}
	}

	/** @param {HTMLElement} _node @param {{ duration?: number }} [opts] */
	function sheetSlide(_node, { duration = 320 } = {}) {
		const mobile =
			typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;
		if (!mobile) {
			return {
				duration: 240,
				easing: cubicOut,
				css: (/** @type {number} */ t, /** @type {number} */ u) =>
					`opacity: ${t}; transform: translate3d(0, ${u * 12}px, 0)`
			};
		}
		return {
			duration,
			easing: (/** @type {number} */ t) => 1 - Math.pow(1 - t, 4),
			css: (/** @type {number} */ _t, /** @type {number} */ u) =>
				`transform: translate3d(0, ${u * 100}%, 0)`
		};
	}
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="overlay" onclick={close} role="presentation" transition:fade={{ duration: 180 }}></div>
	<div class="wrap" class:fullscreen role="dialog" aria-modal="true" aria-label={label}>
		<div
			class="sheet"
			class:fullscreen
			transition:sheetSlide
			use:dragDismissAction={{
				onclose: close,
				enabled: dragDismiss,
				scrollSelector: '.sheet-inner'
			}}
		>
			<div class="sheet-inner">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		top: var(--vv-top, 0px);
		left: 0;
		right: 0;
		height: var(--app-height, 100dvh);
		z-index: 60;
		background: var(--scrim);
	}

	.wrap {
		position: fixed;
		/* Track visualViewport so sheets sit above the soft keyboard */
		top: var(--vv-top, 0px);
		left: 0;
		right: 0;
		height: var(--app-height, 100dvh);
		z-index: 70;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		pointer-events: none;
		padding: 0;
		box-sizing: border-box;
	}

	.sheet {
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
		/* Prefer live visual viewport so the keyboard doesn't cover the sheet */
		max-height: min(92%, calc(var(--app-height, 100dvh) - 8px), 880px);
		min-height: 0;
		border: 1px solid var(--glass-border);
		border-bottom: none;
		border-radius: var(--radius-hero) var(--radius-hero) 0 0;
		background: var(--glass-panel);
		box-shadow: 0 16px 48px var(--shadow-strong);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		overflow: visible;
		/* No top pad — content rows own their inset; never a drag handle */
		padding: 0 0 calc(14px + env(safe-area-inset-bottom, 0px));
		box-sizing: border-box;
		will-change: transform;
	}

	.wrap.fullscreen {
		align-items: stretch;
	}

	.sheet.fullscreen {
		height: 100%;
		max-height: 100%;
		min-height: 100%;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		padding: 0;
		overflow: hidden;
		background: var(--bg, var(--glass-panel));
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}

	.sheet.fullscreen .sheet-inner {
		overflow: hidden;
		border-radius: 0;
		height: 100%;
	}

	.sheet-inner {
		display: flex;
		flex-direction: column;
		min-height: 0;
		flex: 1;
		overflow: auto;
		overscroll-behavior: contain;
		border-radius: inherit;
		/* Stop browsers from scrolling focused fields under the keyboard chrome */
		scroll-padding-bottom: 0;
	}

	.sheet-inner > :global(*) {
		min-width: 0;
	}

	@media (min-width: 640px) {
		.wrap {
			align-items: center;
			padding: 0.55rem;
		}

		.sheet {
			width: min(640px, calc(100vw - 7.5rem));
			max-width: min(640px, calc(100vw - 7.5rem));
			height: auto;
			max-height: min(720px, 90svh);
			border-radius: calc(var(--radius-hero) - 2px);
			border-bottom: 1px solid var(--glass-border);
			padding: 0 0 14px;
			overflow: hidden;
		}

		.sheet-inner {
			overflow: auto;
			border-radius: inherit;
		}
	}
</style>
