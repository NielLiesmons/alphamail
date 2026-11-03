<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { site, pillars } from '$lib/site';
	import { t, locale } from '$lib/i18n';
	import { langFromPath, localizedPath } from '$lib/i18n-path';
	import AlphaLogo from '$lib/components/AlphaLogo.svelte';

	const lang = $derived(langFromPath($page.url.pathname) || 'en');
	const year = new Date().getFullYear();
	const address = $derived($locale === 'en' ? site.addressEn : site.addressFr);
	const contactHref = $derived(localizedPath(lang, '/contact'));

	/** @param {MouseEvent} e */
	async function goMessageUs(e) {
		e.preventDefault();
		await goto(contactHref, { noScroll: true, keepFocus: false });
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
	}

	const productLinks = $derived(
		pillars.map((s) => ({
			href: `${localizedPath(lang, '/product')}#${s.id}`,
			label: $t.services[s.id]?.name ?? s.id
		}))
	);
</script>

<footer class="foot">
	<div class="container">
		<div class="panel">
			<div class="col brand-col">
				<a class="brand-row" href={localizedPath(lang, '/')} aria-label={site.name}>
					<AlphaLogo size={36} />
					<span class="word">{site.shortName}</span>
				</a>
				<a class="meta" href="mailto:{site.email}">{site.email}</a>
				<p class="meta addr">{address}</p>
				<p class="note">© {year} {site.name}</p>
			</div>

			<div class="col">
				<p class="col-label">{$t.footerColProduct}</p>
				<ul class="col-list">
					{#each productLinks as link}
						<li><a href={link.href}>{link.label}</a></li>
					{/each}
					<li><a href={localizedPath(lang, '/pricing')}>{$t.navPricing}</a></li>
				</ul>
			</div>

			<div class="col">
				<p class="col-label">{$t.footerColCommunity}</p>
				<ul class="col-list">
					<li>
						<a href={site.communityUrl} target="_blank" rel="noopener noreferrer"
							>{$t.navCommunity}</a
						>
					</li>
				</ul>
			</div>

			<div class="col">
				<p class="col-label">{$t.footerColContact}</p>
				<ul class="col-list">
					<li>
						<a href={contactHref} onclick={goMessageUs}>{$t.footerMessageUs}</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</footer>

<style>
	.foot {
		margin-top: auto;
		padding: 2rem 0 calc(1rem + env(safe-area-inset-bottom, 0px));
	}

	.panel {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
		text-align: left;
		background: var(--surface);
		border: 1px solid var(--hairline);
		border-radius: var(--radius-hero);
		overflow: hidden;
	}

	.col {
		padding: 1rem 1.15rem;
	}

	.col + .col {
		border-top: 1px solid var(--hairline);
	}

	.brand-col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
	}

	.brand-row {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		text-decoration: none;
		color: var(--ink);
		margin-bottom: 0.35rem;
	}

	.word {
		font-family: var(--font-sans);
		font-weight: 550;
		font-size: 0.78rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}

	.meta {
		margin: 0;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.4;
		color: var(--ink66);
		text-decoration: none;
	}

	a.meta:hover {
		color: var(--ink);
	}

	.addr {
		color: var(--ink33);
	}

	.note {
		margin: 0.55rem 0 0;
		font-size: 12px;
		color: var(--ink33);
	}

	.col-label {
		margin: 0 0 0.4rem;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink33);
	}

	.col-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.col-list a {
		font-size: 14px;
		font-weight: 500;
		line-height: 1.4;
		color: var(--ink66);
		text-decoration: none;
	}

	.col-list a:hover {
		color: var(--ink);
	}

	@media (min-width: 768px) {
		.panel {
			grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
		}

		.col {
			padding: 1.1rem 1.25rem;
		}

		.col + .col {
			border-top: none;
			border-left: 1px solid var(--hairline);
		}
	}
</style>
