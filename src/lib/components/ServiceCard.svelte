<script>
	/** @type {{ id: string, href?: string, name: string, desc?: string, featured?: boolean, svc?: string }} */
	let { id, href = '', name, desc = '', featured = false, svc = '' } = $props();
	const kind = $derived(svc || String(id).split('-')[0] || id);
</script>

{#if href}
	<a class="card" class:featured {id} {href}>
		<div class="media" data-svc={kind}>
			<div class="ph" aria-hidden="true"></div>
		</div>
		<div class="body">
			<p class="name">{name}</p>
			{#if desc}
				<p class="desc">{desc}</p>
			{/if}
		</div>
	</a>
{:else}
	<div class="card" class:featured {id}>
		<div class="media" data-svc={kind}>
			<div class="ph" aria-hidden="true"></div>
		</div>
		<div class="body">
			<p class="name">{name}</p>
			{#if desc}
				<p class="desc">{desc}</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.card {
		display: block;
		width: 100%;
		background: var(--surface);
		border: 1px solid var(--hairline);
		border-radius: 22px;
		overflow: hidden;
		text-align: center;
		box-sizing: border-box;
		text-decoration: none;
		color: inherit;
		-webkit-font-smoothing: antialiased;
		text-rendering: geometricPrecision;
	}

	/* Mobile: square. Desktop: landscape (see mq below). */
	.media {
		aspect-ratio: 1;
		background: color-mix(in srgb, var(--ink) 6%, var(--bg));
		overflow: hidden;
	}

	.ph {
		width: 100%;
		height: 100%;
		background:
			radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 55%),
			linear-gradient(145deg, var(--surface), color-mix(in srgb, var(--ink) 10%, var(--bg)));
	}

	.media[data-svc='mail'] .ph {
		background:
			radial-gradient(80% 70% at 20% 20%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 55%),
			linear-gradient(160deg, color-mix(in srgb, var(--ink) 8%, var(--bg)), var(--surface));
	}

	.media[data-svc='drive'] .ph {
		background:
			radial-gradient(70% 60% at 70% 30%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 50%),
			linear-gradient(210deg, var(--surface), color-mix(in srgb, var(--ink) 9%, var(--bg)));
	}

	.media[data-svc='chat'] .ph {
		background:
			radial-gradient(90% 80% at 50% 80%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 55%),
			linear-gradient(125deg, color-mix(in srgb, var(--ink) 6%, var(--bg)), var(--surface));
	}

	.media[data-svc='projects'] .ph {
		background:
			radial-gradient(75% 65% at 40% 25%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 52%),
			linear-gradient(185deg, var(--surface), color-mix(in srgb, var(--ink) 11%, var(--bg)));
	}

	.body {
		padding: 0.85rem 0.9rem 1rem;
	}

	.name {
		font-family: var(--font-display);
		font-weight: 650;
		font-size: 1.15rem;
		color: var(--ink);
		margin: 0;
		line-height: 1.25;
	}

	.desc {
		margin: 0.4rem 0 0;
		font-size: 13px;
		font-weight: 500;
		line-height: 1.4;
		color: var(--ink66);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.card {
			border-radius: 24px;
		}

		.media {
			aspect-ratio: 16 / 10;
		}

		.name {
			font-size: 1.25rem;
		}
	}
</style>
