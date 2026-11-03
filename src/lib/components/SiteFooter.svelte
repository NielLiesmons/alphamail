<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { site, pillars } from '$lib/site';
	import { t, locale } from '$lib/i18n';
	import { langFromPath, localizedPath } from '$lib/i18n-path';

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
					<span class="mark" aria-hidden="true"></span>
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
				</ul>
			</div>

			<div class="col">
				<p class="col-label">{$t.footerColCommunity}</p>
				<ul class="col-list">
					<li><a href={localizedPath(lang, '/community')}>{$t.navCommunity}</a></li>
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
		grid-template-columns: 1fr 1fr;
		gap: 1.75rem 1.25rem;
		padding: 1.5rem 0 0.5rem;
		border-top: 1px solid var(--hairline);
	}

	@media (min-width: 768px) {
		.panel {
			grid-template-columns: 1.4fr 1fr 1fr 1fr;
			gap: 2rem;
			padding-top: 2rem;
		}
	}

	.brand-col {
		grid-column: 1 / -1;
	}

	@media (min-width: 768px) {
		.brand-col {
			grid-column: auto;
		}
	}

	.brand-row {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		text-decoration: none;
		color: var(--ink);
		margin-bottom: 0.65rem;
	}

	.mark {
		width: 18px;
		height: 18px;
		border-radius: 5px;
		background: var(--ink);
		flex-shrink: 0;
	}

	.word {
		font-family: var(--font-display);
		font-weight: 650;
		font-size: 1.15rem;
		letter-spacing: -0.02em;
	}

	.meta {
		display: block;
		margin: 0.15rem 0;
		font-size: 13px;
		font-weight: 500;
		color: var(--ink66);
		text-decoration: none;
	}

	.meta.addr {
		margin-top: 0.35rem;
	}

	.note {
		margin: 0.85rem 0 0;
		font-size: 12px;
		color: var(--ink33);
	}

	.col-label {
		margin: 0 0 0.55rem;
		font-size: 12px;
		font-weight: 650;
		letter-spacing: 0.04em;
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
		color: var(--ink66);
		text-decoration: none;
	}

	.col-list a:hover {
		color: var(--ink);
	}
</style>
