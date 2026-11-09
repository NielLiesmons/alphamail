<script>
	/**
	 * Hero chat mock — composed from @alpha/ui ChatBubble / FeedEntityPanel / ChatComposer.
	 */
	import { fade } from 'svelte/transition';
	import ChatBubble from '@alpha/ui/ChatBubble.svelte';
	import ChatComposer from '@alpha/ui/ChatComposer.svelte';
	import FeedEntityPanel from '@alpha/ui/FeedEntityPanel.svelte';

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
					<div class="item panel" style:animation-delay="{90 + i * 95}ms">
						<FeedEntityPanel
							name={msg.name}
							meta={msg.meta}
							title={msg.title}
							body={msg.body}
							when={msg.when}
						>
							{#snippet avatar()}
								<div class="avatar" style={avatarStyle(msg.hue)}>
									{(msg.name || '?').trim()[0]?.toUpperCase()}
								</div>
							{/snippet}
						</FeedEntityPanel>
					</div>
				{:else}
					<div class="item bubble" class:mine={msg.kind === 'out'} style:animation-delay="{110 + i * 110}ms">
						<ChatBubble
							mine={msg.kind === 'out'}
							name={msg.name}
							nameColor={nameColor(msg.hue)}
							when={msg.when}
						>
							{#snippet avatar()}
								{#if msg.kind === 'in'}
									<div class="avatar" style={avatarStyle(msg.hue)}>
										{(msg.name || '?').trim()[0]?.toUpperCase()}
									</div>
								{/if}
							{/snippet}
							{msg.text}
						</ChatBubble>
					</div>
				{/if}
			{/each}
		</div>
	{/key}

	<div class="composer-fade"></div>
	<div class="composer-dock">
		<div class="composer-shell">
			<ChatComposer demo placeholder={composerPh} canSend />
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
		/* Resolve @alpha/ui --fg* / --glass against site poles */
		--fg: var(--ink);
		--fg-83: color-mix(in srgb, var(--ink) 83%, transparent);
		--fg-66: var(--ink66);
		--fg-33: var(--ink33);
		--glass: color-mix(in srgb, var(--bg) 88%, transparent);
		--glass-blur: 22px;
	}

	.feed {
		position: absolute;
		left: 0;
		right: 0;
		top: 18%;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 2px;
		padding: 0 1rem calc(76px + env(safe-area-inset-bottom, 0px));
		box-sizing: border-box;
	}

	.item {
		animation: rise 0.55s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)) both;
		width: min(100%, 34rem);
		max-width: 100%;
		align-self: center;
	}

	.item.bubble {
		width: min(100%, 28rem);
	}

	.item.bubble.mine {
		width: min(100%, 34rem);
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

	.item.panel .avatar {
		width: 36px;
		height: 36px;
		font-size: 14px;
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

	.composer-shell {
		max-width: 40rem;
		margin-inline: auto;
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
