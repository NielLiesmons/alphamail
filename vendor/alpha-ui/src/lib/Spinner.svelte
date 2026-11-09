<script>
	/** @type {{ size?: number, label?: string }} */
	let { size = 22, label = 'Loading' } = $props();
</script>

<span class="spinner" style="width:{size}px;height:{size}px" role="status" aria-label={label}></span>

<style>
	.spinner {
		display: inline-block;
		box-sizing: border-box;
		border: 2px solid var(--fg-11);
		border-top-color: var(--fg-66);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
