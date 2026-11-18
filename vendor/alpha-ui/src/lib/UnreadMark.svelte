<script>
	/**
	 * Unread mark for notifications targeted at the signed-in user.
	 * Accent dot + count when unread > 0; quiet muted dot when empty.
	 * @type {{ count?: number, size?: number, quiet?: boolean, className?: string }}
	 */
	let { count = 0, size = 7, quiet = false, className = '' } = $props();

	const n = $derived(Math.max(0, Math.floor(Number(count) || 0)));
	const label = $derived(n > 9 ? '9+' : String(n));
	const showQuiet = $derived(quiet || n === 0);
</script>

<span
	class="unread-mark {className}"
	class:quiet={showQuiet}
	class:hot={n > 0 && !quiet}
	title={n > 0 ? String(n) : undefined}
>
	<span class="dot" style:--dot="{size}px" aria-hidden="true"></span>
	{#if n > 0}
		<span class="n">{label}</span>
	{/if}
</span>

<style>
	.unread-mark {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		line-height: 1;
		flex-shrink: 0;
		font-family: 'Inter', var(--font), system-ui, sans-serif;
		font-variant-numeric: lining-nums;
		font-feature-settings: 'lnum' 1, 'tnum' 0, 'onum' 0;
	}

	.dot {
		width: var(--dot, 7px);
		height: var(--dot, 7px);
		border-radius: 999px;
		background: var(--accent-1, #5a58fe);
		flex-shrink: 0;
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--bg, #000) 35%, transparent);
	}

	.unread-mark.quiet .dot {
		background: var(--fg-33);
		box-shadow: none;
		opacity: 0.85;
	}

	.n {
		font-size: 12px;
		font-weight: 650;
		color: var(--accent-1, #5a58fe);
		letter-spacing: 0;
	}

	.unread-mark.quiet .n {
		color: var(--fg-33);
		font-weight: 600;
	}
</style>
