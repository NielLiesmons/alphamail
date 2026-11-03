<script>
	let { href = '', onclick = undefined, children } = $props();

	/** @type {HTMLAnchorElement | undefined} */
	let el = $state();

	/** @param {MouseEvent} e */
	function onMove(e) {
		if (!el) return;
		const r = el.getBoundingClientRect();
		el.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
		el.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
	}
</script>

<a class="btn-glass" {href} {onclick} bind:this={el} onmousemove={onMove}>
	<span class="label">
		{@render children()}
	</span>
</a>

<style>
	.btn-glass {
		--mouse-x: 50%;
		--mouse-y: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 46px;
		padding: 0 22px;
		font-size: 15px;
		font-weight: 500;
		color: var(--ink);
		background: color-mix(in srgb, var(--ink) 6%, transparent);
		border: 1.4px solid color-mix(in srgb, var(--ink) 16%, transparent);
		border-radius: var(--radius-pill);
		cursor: pointer;
		text-decoration: none;
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
		transition: transform 0.2s var(--ease);
	}

	.btn-glass::before {
		content: '';
		position: absolute;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--ink) 14%, transparent) 0%,
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

	.btn-glass:hover::before {
		opacity: 1;
	}

	.btn-glass:hover {
		transform: scale(1.015);
	}

	.btn-glass:active {
		transform: scale(0.98);
	}

	.label {
		position: relative;
		z-index: 1;
	}

	@media (max-width: 767px) {
		.btn-glass {
			height: 42px;
			padding: 0 18px;
		}
	}
</style>
