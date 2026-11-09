<script>
	/**
	 * Full-bleed chat mock — Admin-faithful bubbles, entity panels, composer.
	 */
	import { fade } from 'svelte/transition';

	/**
	 * @typedef {{
	 *   kind: 'panel' | 'in' | 'out',
	 *   panel?: 'mail' | 'task' | 'ai' | 'file',
	 *   name?: string,
	 *   hue?: number,
	 *   title?: string,
	 *   meta?: string,
	 *   body?: string,
	 *   when?: string,
	 *   text?: string
	 * }} HeroMsg
	 */

	/** @type {{ scenes: HeroMsg[][], active?: number, composerPh?: string }} */
	let { scenes = [], active = 0, composerPh = 'Message' } = $props();

	const scene = $derived(scenes[active] ?? scenes[0] ?? []);

	function initial(name = '') {
		return (name.trim()[0] || '?').toUpperCase();
	}

	function avatarStyle(hue = 250) {
		return `background: oklch(0.62 0.14 ${hue} / 0.28); color: oklch(0.78 0.12 ${hue});`;
	}

	function nameColor(hue = 250) {
		return `oklch(0.74 0.11 ${hue})`;
	}
</script>

<div class="stage" aria-hidden="true">
	{#key active}
		<div class="feed" in:fade={{ duration: 420, delay: 60 }} out:fade={{ duration: 240 }}>
			{#each scene as msg, i (`${active}-${i}-${msg.kind}-${msg.text || msg.title || ''}`)}
				{#if msg.kind === 'panel'}
					<article class="entity" class:mail={msg.panel === 'mail'} style:animation-delay="{90 + i * 95}ms">
						<header class="entity-head">
							<div class="avatar sm" style={avatarStyle(msg.hue)}>{initial(msg.name)}</div>
							<div class="entity-meta">
								<div class="entity-row1">
									<span class="entity-name">{msg.name}</span>
									{#if msg.meta}
										<span class="entity-sub">{msg.meta}</span>
									{/if}
								</div>
								{#if msg.title}
									<p class="entity-title">{msg.title}</p>
								{/if}
							</div>
							{#if msg.when}
								<span class="entity-when">{msg.when}</span>
							{/if}
						</header>
						{#if msg.body}
							<div class="entity-rule"></div>
							<div class="entity-body">{msg.body}</div>
						{/if}
					</article>
				{:else}
					<article
						class="row"
						class:mine={msg.kind === 'out'}
						style:animation-delay="{110 + i * 110}ms"
					>
						{#if msg.kind === 'in'}
							<div class="avatar" style={avatarStyle(msg.hue)}>{initial(msg.name)}</div>
						{/if}
						<div class="bubble" class:mine={msg.kind === 'out'}>
							{#if msg.kind === 'in' && msg.name}
								<div class="bubble-head">
									<span class="who" style:color={nameColor(msg.hue)}>{msg.name}</span>
								</div>
							{/if}
							<p class="text">{msg.text}</p>
						</div>
					</article>
				{/if}
			{/each}
		</div>
	{/key}

	<div class="composer-fade"></div>
	<div class="composer-dock">
		<div class="composer-pill">
			<div class="composer-row">
				<span class="side-btn plus" aria-hidden="true">
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
						<path
							d="M9 3.5v11M3.5 9h11"
							stroke="currentColor"
							stroke-width="1.7"
							stroke-linecap="round"
						/>
					</svg>
				</span>
				<span class="composer-ph">{composerPh}</span>
				<span class="side-btn send" aria-hidden="true">
					<svg width="14" height="15" viewBox="0 0 112 122" fill="currentColor">
						<path
							d="M56 0c18 18 28 42 28 68 0 18-6 34-16 48L56 122 44 116C34 102 28 86 28 68 28 42 38 18 56 0Z"
						/>
					</svg>
				</span>
			</div>
		</div>
	</div>
</div>

<style>
	.stage {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		user-select: none;
	}

	.feed {
		position: absolute;
		left: 0;
		right: 0;
		/* Reach up under the headline so bubbles show through the veil */
		top: 12%;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 8px;
		padding: 0 1rem calc(76px + env(safe-area-inset-bottom, 0px));
		box-sizing: border-box;
	}

	.entity,
	.row {
		animation: rise 0.55s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)) both;
		width: min(100%, 34rem);
		max-width: 100%;
		align-self: center;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.entity {
		border-radius: 14px;
		background: color-mix(in srgb, var(--ink) 4.5%, transparent);
		overflow: hidden;
		margin-bottom: 2px;
	}

	.entity-head {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 14px 10px;
		min-width: 0;
	}

	.entity-meta {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.entity-row1 {
		display: flex;
		align-items: center;
		gap: 6px;
		min-width: 0;
	}

	.entity-name {
		font-size: 14px;
		font-weight: 650;
		color: var(--ink);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.entity-sub {
		font-size: 12px;
		font-weight: 450;
		color: var(--ink33);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.entity-title {
		margin: 0;
		font-size: 12px;
		font-weight: 450;
		color: var(--ink33);
		line-height: 1.25;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.entity-when {
		flex-shrink: 0;
		font-size: 11px;
		font-weight: 500;
		color: var(--ink33);
	}

	.entity-rule {
		height: 1px;
		background: color-mix(in srgb, var(--ink) 8%, transparent);
	}

	.entity-body {
		padding: 12px 14px 14px;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.45;
		color: var(--ink);
		text-align: left;
	}

	.row {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		width: min(100%, 28rem);
	}

	.row.mine {
		flex-direction: row-reverse;
		justify-content: flex-start;
		width: min(100%, 34rem);
	}

	.avatar {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 13px;
		font-weight: 650;
		flex-shrink: 0;
	}

	.avatar.sm {
		width: 36px;
		height: 36px;
	}

	.bubble {
		max-width: 100%;
		padding: 6px 12px 7px;
		border-radius: 16px 16px 16px 4px;
		background: color-mix(in srgb, var(--ink) 12%, transparent);
		text-align: left;
	}

	.bubble.mine {
		border-radius: 16px 16px 4px 16px;
		background: var(
			--gradient-accent-1,
			linear-gradient(145deg, color-mix(in srgb, var(--accent) 88%, white), var(--accent))
		);
		color: #fff;
		padding-bottom: 5px;
	}

	.bubble-head {
		display: flex;
		align-items: baseline;
		gap: 6px;
		margin-bottom: 1px;
	}

	.who {
		font-size: 12px;
		font-weight: 700;
		line-height: 1.3;
	}

	.text {
		margin: 0;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.4;
		color: inherit;
	}

	.bubble:not(.mine) .text {
		color: var(--ink);
	}

	.composer-fade {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 3;
		height: 88px;
		pointer-events: none;
		background: linear-gradient(
			to top,
			var(--bg) 0%,
			color-mix(in srgb, var(--bg) 80%, transparent) 32%,
			transparent 100%
		);
	}

	.composer-dock {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 4;
		padding: 10px 14px 14px;
		box-sizing: border-box;
	}

	.composer-pill {
		position: relative;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		min-height: 47px;
		border-radius: 9999px;
		border: 0;
		overflow: hidden;
		background: color-mix(in srgb, var(--glass, var(--bg)) 72%, transparent);
		backdrop-filter: blur(var(--glass-blur, 22px));
		-webkit-backdrop-filter: blur(var(--glass-blur, 22px));
		max-width: 40rem;
		margin-inline: auto;
	}

	.composer-pill::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		padding: 1px;
		pointer-events: none;
		z-index: 1;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--ink) 12%, transparent) 0%,
			color-mix(in srgb, var(--ink) 3%, transparent) 45%,
			color-mix(in srgb, var(--ink) 3%, transparent) 55%,
			color-mix(in srgb, var(--ink) 9%, transparent) 100%
		);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
	}

	.composer-row {
		display: flex;
		align-items: center;
		gap: 7px;
		min-height: calc(47px - 14px);
		padding: 7px;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.side-btn {
		width: 33px;
		height: 33px;
		flex-shrink: 0;
		display: grid;
		place-items: center;
		border-radius: 9999px;
	}

	.side-btn.plus {
		background: color-mix(in srgb, var(--ink) 12%, transparent);
		color: var(--ink66);
	}

	.side-btn.send {
		background: var(
			--gradient-accent-1,
			linear-gradient(145deg, color-mix(in srgb, var(--accent) 88%, white), var(--accent))
		);
		color: #fff;
	}

	.composer-ph {
		flex: 1;
		min-width: 0;
		padding: 0 4px;
		color: var(--ink33);
		font-size: 15px;
		font-weight: 500;
		text-align: left;
	}

	@media (min-width: 768px) {
		.feed {
			padding-inline: 1.5rem;
			padding-bottom: calc(84px + env(safe-area-inset-bottom, 0px));
		}

		.composer-dock {
			padding: 10px 24px 18px;
		}
	}
</style>
