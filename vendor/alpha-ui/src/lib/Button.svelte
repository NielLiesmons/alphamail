<script>
	/**
	 * Shared Alpha CTA button — glass stroke (--glass-shine) + pointer highlight + scale.
	 * Variants: primary (Admin publish / site main CTA), glass (secondary outline).
	 *
	 * @typedef {'primary' | 'glass'} BtnVariant
	 * @typedef {'md' | 'sm' | 'sheet'} BtnSize
	 */
	let {
		variant = /** @type {BtnVariant} */ ('primary'),
		href = '',
		children,
		type = 'button',
		onclick,
		size = /** @type {BtnSize} */ ('md'),
		disabled = false,
		target = undefined,
		rel = undefined,
		class: className = '',
		form = undefined
	} = $props();

	/** @type {HTMLAnchorElement | HTMLButtonElement | undefined} */
	let el = $state();

	/** @param {MouseEvent} e */
	function onMove(e) {
		if (!el || disabled) return;
		const r = el.getBoundingClientRect();
		el.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
		el.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
	}
</script>

{#if href}
	<a
		class="alpha-btn {variant} {size} {className}"
		class:disabled
		{href}
		{target}
		{rel}
		aria-disabled={disabled || undefined}
		bind:this={el}
		onmousemove={onMove}
		onclick={disabled ? (e) => e.preventDefault() : onclick}
	>
		<span class="label">
			{@render children()}
		</span>
	</a>
{:else}
	<button
		class="alpha-btn {variant} {size} {className}"
		{type}
		{disabled}
		{form}
		bind:this={el}
		onmousemove={onMove}
		{onclick}
	>
		<span class="label">
			{@render children()}
		</span>
	</button>
{/if}

<style>
	.alpha-btn {
		--mouse-x: 50%;
		--mouse-y: 50%;
		--btn-hover-scale: var(--button-hover-scale, 1.03);
		--btn-active-scale: var(--button-active-scale, 0.97);
		--btn-shine-size: var(--button-shine-size, 100px);
		--btn-shine-blur: var(--button-shine-blur, 20px);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		height: 46px;
		padding: 0 22px;
		border: 1px solid transparent;
		border-radius: var(--radius-pill, 999px);
		font-family: var(--font-sans, var(--font, inherit));
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
		flex-shrink: 0;
		-webkit-tap-highlight-color: transparent;
		backdrop-filter: blur(var(--glass-blur, 22px));
		-webkit-backdrop-filter: blur(var(--glass-blur, 22px));
		transition: transform 0.2s var(--ease, cubic-bezier(0.22, 1, 0.36, 1));
	}

	.alpha-btn.md {
		height: 46px;
		padding: 0 22px;
		font-size: 15px;
	}

	.alpha-btn.sm {
		height: 100%;
		min-height: 34px;
		padding: 0 0.95rem;
		font-size: 13px;
		font-weight: 600;
	}

	/* Admin create-sheet / publish row */
	.alpha-btn.sheet {
		height: var(--ctrl-h, 44px);
		min-height: var(--ctrl-h, 44px);
		padding: 0 18px;
		font-size: 14px;
		font-weight: 500;
		border-radius: 9999px;
		margin-left: auto;
	}

	.alpha-btn.primary {
		background:
			var(--button-primary-bg) padding-box,
			var(--glass-shine) border-box;
		background-color: transparent;
		color: var(--button-primary-fg, var(--fg, var(--ink)));
	}

	.alpha-btn.glass {
		/* Fill must read on photo heroes; shine stroke stays the Admin glass edge. */
		background:
			color-mix(in srgb, var(--fg, var(--ink)) 10%, transparent) padding-box,
			var(--glass-shine) border-box;
		background-color: transparent;
		color: var(--fg, var(--ink));
		font-weight: 500;
	}

	.alpha-btn::before {
		content: '';
		position: absolute;
		width: var(--btn-shine-size);
		height: var(--btn-shine-size);
		border-radius: 50%;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--fg, var(--ink)) 22%, transparent) 0%,
			transparent 70%
		);
		filter: blur(var(--btn-shine-blur));
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			left 0.1s ease-out,
			top 0.1s ease-out;
		left: var(--mouse-x);
		top: var(--mouse-y);
		transform: translate(-50%, -50%);
	}

	.alpha-btn.primary:hover:not(:disabled):not(.disabled),
	.alpha-btn.glass:hover:not(:disabled):not(.disabled) {
		transform: scale(var(--btn-hover-scale));
	}

	.alpha-btn.primary:hover:not(:disabled):not(.disabled) {
		background:
			var(--button-primary-bg-hover, var(--button-primary-bg)) padding-box,
			var(--glass-shine) border-box;
	}

	.alpha-btn:hover:not(:disabled):not(.disabled)::before {
		opacity: 1;
	}

	.alpha-btn:active:not(:disabled):not(.disabled) {
		transform: scale(var(--btn-active-scale));
	}

	.alpha-btn:disabled,
	.alpha-btn.disabled {
		opacity: 0.5;
		cursor: default;
	}

	.label {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	@media (max-width: 767px) {
		.alpha-btn.md {
			height: 42px;
			padding: 0 18px;
		}
	}
</style>
