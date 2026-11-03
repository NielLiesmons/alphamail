<script>
	/**
	 * Rounded image hero — same top inset as landing VideoHero.
	 * Default: bottom-aligned, fixed-height title + description over a fade.
	 * grow=true (Contact): content-sized frame; spacer clears the floating nav
	 * so title/form never sit under the pill and the top band shows the bg.
	 */
	let { title, description = '', grow = false, children } = $props();
</script>

<section class="hero" class:hero-grow={grow}>
	<header class="frame on-media">
		<div class="media" aria-hidden="true">
			<div class="photo"></div>
			<div class="scrim"></div>
		</div>
		{#if grow}
			<!--
			  Explicit spacer (not padding on .copy) so shorthand padding in
			  media queries can't collapse the nav clearance.
			  Height = frame→nav-bottom + breathing room (bg shows behind the pill).
			-->
			<div class="nav-clear" aria-hidden="true"></div>
		{/if}
		<div class="copy">
			<h1 class="display-section">{title}</h1>
			{#if description}
				<p class="text-desc">{description}</p>
			{/if}
			{#if children}
				<div class="extra">
					{@render children()}
				</div>
			{/if}
		</div>
	</header>
</section>

<style>
	.hero {
		padding: var(--hero-inset);
		padding-bottom: 1.5rem;
		display: flex;
		justify-content: center;
	}

	.frame {
		position: relative;
		isolation: isolate;
		z-index: 1;
		width: 100%;
		/* svh = stable; dvh jumps when the mobile URL bar shows/hides */
		height: 52svh;
		min-height: 360px;
		max-height: 520px;
		border-radius: var(--radius-hero);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		box-sizing: border-box;
	}

	/* Contact: grow with content, top-aligned under the nav spacer */
	.hero-grow .frame {
		height: auto;
		min-height: 0;
		max-height: none;
		justify-content: flex-start;
		align-items: stretch;
	}

	.nav-clear {
		position: relative;
		z-index: 1;
		flex-shrink: 0;
		width: 100%;
		pointer-events: none;
		height: calc(var(--nav-inset) - var(--hero-inset) + var(--nav-h) + 3.75rem + 80px);
	}

	.media {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.photo {
		width: 100%;
		height: 100%;
		background:
			radial-gradient(120% 80% at 20% 10%, color-mix(in srgb, var(--ink) 18%, transparent), transparent 55%),
			radial-gradient(90% 70% at 90% 80%, color-mix(in srgb, var(--ink) 12%, transparent), transparent 50%),
			linear-gradient(
				160deg,
				color-mix(in srgb, var(--ink) 8%, var(--bg)) 0%,
				var(--bg) 45%,
				color-mix(in srgb, var(--ink) 22%, var(--bg)) 100%
			);
	}

	.scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			color-mix(in srgb, var(--bg) 92%, transparent) 0%,
			color-mix(in srgb, var(--bg) 40%, transparent) 42%,
			transparent 70%
		);
	}

	.copy {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: min(100%, 48rem);
		padding: 4.5rem var(--pad-x) 1.35rem;
		text-align: center;
		box-sizing: border-box;
	}

	.copy .display-section {
		margin: 0;
		text-wrap: balance;
	}

	.copy .text-desc {
		margin: 0.65rem auto 0;
		max-width: 44rem;
		color: var(--ink66);
	}

	/* Title+desc only: extra bottom air so copy sits higher in the frame */
	.copy:has(.text-desc):not(:has(.extra)) {
		padding-bottom: calc(1.35rem + 32px);
	}

	.extra {
		margin: 1.1rem auto 0;
		max-width: 26rem;
		/* Contact forms: site-theme fields, not .on-media poles */
		--bg: var(--theme-bg);
		--ink: var(--theme-ink);
		--ink66: var(--theme-ink66);
		--ink33: var(--theme-ink33);
		--surface: var(--theme-surface);
		--field-bg: var(--theme-field-bg);
		--field-border: var(--theme-field-border);
		--hairline: var(--theme-field-border);
		color: var(--theme-ink);
	}

	/* Double bottom padding under form / subscribe field */
	.copy:has(.extra) {
		padding-bottom: 2.7rem;
	}

	.hero-grow .copy {
		padding-top: 0.35rem;
		padding-bottom: 2rem;
		max-width: min(100%, 40rem);
		margin-inline: auto;
	}

	.hero-grow .extra {
		max-width: 100%;
		margin-top: 1.35rem;
	}

	.hero-grow .scrim {
		background: linear-gradient(
			to top,
			color-mix(in srgb, var(--bg) 94%, transparent) 0%,
			color-mix(in srgb, var(--bg) 62%, transparent) 42%,
			color-mix(in srgb, var(--bg) 28%, transparent) 72%,
			transparent 100%
		);
	}

	@media (min-width: 768px) {
		.hero {
			padding-bottom: 1.75rem;
		}

		.frame {
			height: 46svh;
			min-height: 340px;
			max-height: 480px;
		}

		.hero-grow .frame {
			height: auto;
			min-height: 0;
			max-height: none;
		}

		.copy {
			max-width: min(100%, 52rem);
			padding: 5rem 2rem 1.6rem;
		}

		.copy .text-desc {
			max-width: 48rem;
		}

		.copy:has(.text-desc):not(:has(.extra)) {
			padding-bottom: calc(1.6rem + 32px);
		}

		.copy:has(.extra) {
			padding-bottom: 3.2rem;
		}

		.hero-grow .copy {
			padding-top: 0.5rem;
			padding-bottom: 2.5rem;
			padding-inline: 2rem;
			max-width: min(100%, 42rem);
		}

		.hero-grow .nav-clear {
			height: calc(var(--nav-inset) - var(--hero-inset) + var(--nav-h) + 4rem + 80px);
		}
	}

	@media (min-width: 1024px) {
		.hero {
			padding-top: var(--hero-inset);
			padding-inline: var(--pad-x);
			padding-bottom: 2rem;
		}

		.frame {
			width: min(100%, var(--container-max));
			height: 420px;
			min-height: 420px;
			max-height: none;
		}

		.hero-grow .frame {
			height: auto;
			min-height: 0;
			max-height: none;
		}

		.copy {
			max-width: min(100%, 56rem);
		}

		.hero-grow .copy {
			padding-top: 0.65rem;
			padding-bottom: 2.75rem;
		}

		.hero-grow .nav-clear {
			height: calc(var(--nav-inset) - var(--hero-inset) + var(--nav-h) + 4.25rem + 80px);
		}
	}
</style>
