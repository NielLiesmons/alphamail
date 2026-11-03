<script>
	let { children } = $props();
</script>

<div class="hscroll">
	<div class="track">
		{@render children()}
	</div>
</div>

<style>
	.hscroll {
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.hscroll::-webkit-scrollbar {
		display: none;
	}

	.track {
		display: flex;
		gap: 12px;
		padding-inline: var(--pad-x);
		width: max-content;
		min-width: 100%;
		justify-content: safe center;
	}
</style>
