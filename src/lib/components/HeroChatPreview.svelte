<script>
	/**
	 * Decorative chat-feed mock synced to the hero topic carousel.
	 * Mimics Admin chat bubbles + bottom composer pill.
	 */
	import { fade } from 'svelte/transition';

	/** @typedef {{ kind: 'context' | 'in' | 'out', name?: string, hue?: number, text: string }} HeroMsg */

	/** @type {{ scenes: HeroMsg[][], active?: number, composerPh?: string }} */
	let { scenes = [], active = 0, composerPh = 'Message the Space…' } = $props();

	const scene = $derived(scenes[active] ?? scenes[0] ?? []);

	/** Simple initial avatar — no ProfilePic dependency on the marketing site. */
	function initial(name = '') {
		return (name.trim()[0] || '?').toUpperCase();
	}

	function avatarStyle(hue = 250) {
		return `background: oklch(0.62 0.14 ${hue} / 0.28); color: oklch(0.78 0.12 ${hue});`;
	}
</script>

<div class="preview" aria-hidden="true">
	<div class="fade-top"></div>

	{#key active}
		<div class="feed" in:fade={{ duration: 480, delay: 80 }} out:fade={{ duration: 280 }}>
			{#each scene as msg, i (active + '-' + i + '-' + msg.text)}
				{#if msg.kind === 'context'}
					<div class="context" style:animation-delay="{120 + i * 90}ms">
						<span class="context-dot"></span>
						<span class="context-text">{msg.text}</span>
					</div>
				{:else}
					<article
						class="row"
						class:mine={msg.kind === 'out'}
						style:animation-delay="{160 + i * 110}ms"
					>
						{#if msg.kind === 'in'}
							<div class="avatar" style={avatarStyle(msg.hue)}>{initial(msg.name)}</div>
						{/if}
						<div class="bubble" class:mine={msg.kind === 'out'}>
							{#if msg.kind === 'in' && msg.name}
								<span class="who" style:color="oklch(0.72 0.1 {msg.hue ?? 250})">{msg.name}</span>
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
			<span class="composer-ph">{composerPh}</span>
			<span class="composer-send" aria-hidden="true">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M2.2 8.1 13.4 2.6c.45-.22.93.26.7.71L8.6 13.7a.55.55 0 0 1-1.02-.08L6.2 9.2 2.35 7.75A.55.55 0 0 1 2.2 8.1Z"
						fill="currentColor"
					/>
				</svg>
			</span>
		</div>
	</div>
	<div class="fade-bottom"></div>
</div>

<style>
	.preview {
		position: relative;
		width: min(100%, 34rem);
		margin-inline: auto;
		height: clamp(280px, 52vw, 420px);
		overflow: hidden;
		pointer-events: none;
		user-select: none;
	}

	.feed {
		position: absolute;
		inset: 0 0 72px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 8px;
		padding: 2.5rem 1rem 0.5rem;
		box-sizing: border-box;
	}

	.context,
	.row {
		animation: rise 0.55s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)) both;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.context {
		align-self: center;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		max-width: 92%;
		padding: 6px 12px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--ink) 6%, transparent);
		border: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
		color: var(--ink66);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.3;
		margin-bottom: 4px;
	}

	.context-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		flex-shrink: 0;
		opacity: 0.85;
	}

	.context-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.row {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		max-width: 92%;
	}

	.row.mine {
		align-self: flex-end;
		flex-direction: row-reverse;
	}

	.avatar {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 12px;
		font-weight: 650;
		flex-shrink: 0;
	}

	.bubble {
		max-width: 100%;
		padding: 7px 12px 8px;
		border-radius: 16px 16px 16px 5px;
		background: color-mix(in srgb, var(--ink) 10%, transparent);
		text-align: left;
	}

	.bubble.mine {
		border-radius: 16px 16px 5px 16px;
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--accent) 88%, white) 0%,
			var(--accent) 100%
		);
		color: #fff;
	}

	.who {
		display: block;
		font-size: 12px;
		font-weight: 700;
		line-height: 1.3;
		margin-bottom: 1px;
	}

	.text {
		margin: 0;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.4;
		color: inherit;
	}

	.bubble:not(.mine) .text {
		color: var(--ink);
	}

	.fade-top {
		position: absolute;
		inset: 0 0 auto;
		height: 72px;
		z-index: 2;
		background: linear-gradient(
			to bottom,
			var(--bg) 0%,
			color-mix(in srgb, var(--bg) 72%, transparent) 42%,
			transparent 100%
		);
		pointer-events: none;
	}

	.composer-fade {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 52px;
		height: 56px;
		z-index: 2;
		background: linear-gradient(
			to top,
			color-mix(in srgb, var(--bg) 88%, transparent) 0%,
			color-mix(in srgb, var(--bg) 40%, transparent) 55%,
			transparent 100%
		);
		pointer-events: none;
	}

	.composer-dock {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 18px;
		z-index: 3;
		display: flex;
		justify-content: center;
		padding: 0 1rem;
		box-sizing: border-box;
	}

	.composer-pill {
		width: min(100%, 28rem);
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 0 8px 0 16px;
		border-radius: 9999px;
		box-sizing: border-box;
		background: color-mix(in srgb, var(--glass, var(--bg)) 72%, transparent);
		backdrop-filter: blur(var(--glass-blur, 14px));
		-webkit-backdrop-filter: blur(var(--glass-blur, 14px));
		border: 1px solid transparent;
		background-image:
			linear-gradient(
				color-mix(in srgb, var(--glass, var(--bg)) 80%, transparent),
				color-mix(in srgb, var(--glass, var(--bg)) 80%, transparent)
			),
			var(--glass-shine);
		background-origin: border-box;
		background-clip: padding-box, border-box;
	}

	.composer-ph {
		color: var(--ink33);
		font-size: 14px;
		font-weight: 500;
	}

	.composer-send {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: color-mix(in srgb, var(--ink) 10%, transparent);
		color: var(--ink66);
		flex-shrink: 0;
	}

	.fade-bottom {
		position: absolute;
		inset: auto 0 0;
		height: 28px;
		z-index: 4;
		background: linear-gradient(to top, var(--bg), transparent);
		pointer-events: none;
	}

	@media (min-width: 768px) {
		.preview {
			width: min(100%, 38rem);
			height: clamp(320px, 42vw, 460px);
		}

		.feed {
			padding-inline: 1.25rem;
		}

		.text {
			font-size: 15px;
		}
	}
</style>
