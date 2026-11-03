<script>
	/** @typedef {'md' | 'sm'} BtnSize */
	let {
		href = '',
		children,
		type = 'button',
		onclick,
		size = /** @type {BtnSize} */ ('md'),
		disabled = false
	} = $props();

	/** @type {HTMLAnchorElement | HTMLButtonElement | undefined} */
	let el = $state();

	/** @param {MouseEvent} e */
	function onMove(e) {
		if (!el) return;
		const r = el.getBoundingClientRect();
		el.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
		el.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
	}
</script>

{#if href}
	<a class="btn" class:sm={size === 'sm'} {href} bind:this={el} onmousemove={onMove}>
		<span class="label">
			{@render children()}
		</span>
	</a>
{:else}
	<button
		class="btn"
		class:sm={size === 'sm'}
		{type}
		{disabled}
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
	.btn {
		--mouse-x: 50%;
		--mouse-y: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 46px;
		padding: 0 22px;
		border: none;
		border-radius: var(--radius-pill);
		background: var(--ink);
		color: var(--bg);
		font-family: var(--font-sans);
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
		transition: transform 0.2s var(--ease);
		flex-shrink: 0;
	}

	.btn.sm {
		height: 100%;
		min-height: 34px;
		padding: 0 0.95rem;
		font-size: 13px;
	}

	/* Shine uses --bg (broken white / broken black) against solid ink fill */
	.btn::before {
		content: '';
		position: absolute;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--bg) 28%, transparent) 0%,
			transparent 70%
		);
		filter: blur(20px);
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

	.btn:hover::before {
		opacity: 1;
	}

	.btn:hover {
		transform: scale(1.03);
	}

	.btn:active {
		transform: scale(0.97);
	}

	.label {
		position: relative;
		z-index: 1;
	}

	@media (max-width: 767px) {
		.btn {
			height: 42px;
			padding: 0 18px;
		}
	}
</style>
