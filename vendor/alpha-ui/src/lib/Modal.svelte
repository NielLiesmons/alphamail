<script>
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { dragDismiss } from './drag-dismiss.js';

	/**
	 * Bottom sheet on small screens, floating sheet on desktop.
	 * Bley modal shell: --modal-bg + hairline (same as public site).
	 * Mobile: drag down to dismiss.
	 */
	let {
		open = $bindable(false),
		label = 'Dialog',
		children
	} = $props();

	function close() {
		open = false;
	}

	function onKey(event) {
		if (open && event.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="overlay" onclick={close} role="presentation" transition:fade={{ duration: 180 }}></div>
	<div class="wrap" role="dialog" aria-modal="true" aria-label={label}>
		<div
			class="sheet"
			transition:fly={{ y: 80, duration: 200, easing: cubicOut }}
			use:dragDismiss={{ onclose: close }}
		>
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: var(--scrim);
		/* Color-only — no backdrop blur */
	}

	.wrap {
		position: fixed;
		z-index: 50;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	.sheet {
		pointer-events: auto;
		width: 100%;
		border: 1px solid var(--glass-border);
		border-bottom: none;
		border-radius: var(--radius-hero) var(--radius-hero) 0 0;
		background: var(--glass-panel);
		padding: 16px;
		box-shadow: 0 16px 48px var(--shadow-strong);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		will-change: transform;
	}

	@media (min-width: 768px) {
		.sheet {
			max-width: 560px;
			margin-bottom: 16px;
			border-radius: 28px;
			border-bottom: 1px solid var(--glass-border);
			padding: 12px;
		}
	}
</style>
