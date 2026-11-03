<script>
	let { title, sub = '', children } = $props();
</script>

<div class="section-title">
	<h2 class="display-section">{title}</h2>
	{#if sub}
		<p class="text-desc sub">{sub}</p>
	{/if}
	{#if children}
		<div class="cta">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.section-title {
		text-align: center;
		max-width: 36rem;
		margin-inline: auto;
		margin-bottom: 1.75rem;
		padding-inline: var(--pad-x);
	}

	.sub {
		margin-top: 0.75rem;
	}

	.cta {
		margin-top: 1.15rem;
		display: flex;
		justify-content: center;
	}
</style>
