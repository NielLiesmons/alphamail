<script>
	/**
	 * Light glass popover portaled to body so it is never clipped by modal overflow.
	 * Drop-ups anchor to the trigger’s top edge using the panel’s real height.
	 */
	import { tick } from 'svelte';

	/**
	 * @type {{
	 *   open?: boolean,
	 *   anchor?: HTMLElement | null,
	 *   placement?: 'above' | 'below',
	 *   align?: 'start' | 'end',
	 *   width?: number,
	 *   maxHeight?: number,
	 *   onclose?: () => void,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		open = false,
		anchor = null,
		placement = 'above',
		align = 'start',
		width = 280,
		maxHeight = 360,
		onclose = () => {},
		children
	} = $props();

	/** @type {HTMLDivElement | undefined} */
	let panelEl = $state();
	let pos = $state({ top: 0, left: 0 });

	/** @param {HTMLElement} node */
	function portal(node) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}

	function reposition() {
		if (!anchor || typeof window === 'undefined') return;
		const r = anchor.getBoundingClientRect();
		const gap = 6;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const panelH = panelEl?.offsetHeight || Math.min(120, maxHeight);

		let left = align === 'end' ? r.right - width : r.left;
		left = Math.max(8, Math.min(left, vw - width - 8));

		let top;
		if (placement === 'below') {
			top = r.bottom + gap;
			if (top + panelH > vh - 8) {
				/* Flip up — sit flush above the trigger */
				top = r.top - gap - panelH;
			}
		} else {
			/* Drop-up: bottom edge of panel sits just above the trigger */
			top = r.top - gap - panelH;
			if (top < 8) {
				top = r.bottom + gap;
			}
		}
		top = Math.max(8, Math.min(top, vh - panelH - 8));
		pos = { top, left };
	}

	$effect(() => {
		if (!open) return;
		anchor;
		placement;
		void tick().then(reposition);

		const onWin = () => reposition();
		window.addEventListener('resize', onWin);
		window.addEventListener('scroll', onWin, true);

		/** @type {ResizeObserver | undefined} */
		let ro;
		if (panelEl && typeof ResizeObserver !== 'undefined') {
			ro = new ResizeObserver(() => reposition());
			ro.observe(panelEl);
		}

		return () => {
			window.removeEventListener('resize', onWin);
			window.removeEventListener('scroll', onWin, true);
			ro?.disconnect();
		};
	});

	/** Keep the underlying text field focused so the mobile keyboard stays up. */
	/** @param {PointerEvent} e */
	function keepKeyboard(e) {
		const t = e.target;
		if (!(t instanceof HTMLElement)) return;
		if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
		e.preventDefault();
	}

	/** @param {KeyboardEvent} e */
	function onKey(e) {
		if (!open) return;
		if (e.key === 'Escape') {
			e.stopPropagation();
			onclose();
		}
	}
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<div class="float-root" use:portal>
		<button type="button" class="scrim" aria-label="Close" onclick={onclose}></button>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={panelEl}
			class="panel"
			role="dialog"
			style:top="{pos.top}px"
			style:left="{pos.left}px"
			style:width="{width}px"
			style:max-height="{maxHeight}px"
			onpointerdown={keepKeyboard}
		>
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.float-root {
		position: fixed;
		inset: 0;
		z-index: 120;
		pointer-events: none;
	}

	.scrim {
		position: absolute;
		inset: 0;
		border: 0;
		padding: 0;
		margin: 0;
		background: transparent;
		cursor: default;
		pointer-events: auto;
	}

	.panel {
		position: absolute;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		min-height: 0;
		/* Canonical float glass — same as TaskCreate project/assignee panels */
		background: var(--float-panel-bg);
		border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
		border-radius: 14px;
		box-shadow: 0 10px 36px color-mix(in srgb, var(--fg-raw) 22%, transparent);
		backdrop-filter: blur(var(--glass-blur, 22px)) saturate(1.2);
		-webkit-backdrop-filter: blur(var(--glass-blur, 22px)) saturate(1.2);
		overflow: hidden;
		box-sizing: border-box;
	}
</style>
