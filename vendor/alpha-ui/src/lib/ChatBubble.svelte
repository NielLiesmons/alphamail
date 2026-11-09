<script>
	/**
	 * Presentational chat bubble — Admin ChatFeedCard chrome (no domain logic).
	 * @typedef {{
	 *   mine?: boolean,
	 *   name?: string,
	 *   nameColor?: string,
	 *   when?: string,
	 *   stackFirst?: boolean,
	 *   stackLast?: boolean,
	 *   showAuthor?: boolean,
	 *   avatar?: import('svelte').Snippet,
	 *   children?: import('svelte').Snippet
	 * }} Props
	 * @type {Props}
	 */
	let {
		mine = false,
		name = '',
		nameColor = '',
		when = '',
		stackFirst = true,
		stackLast = true,
		showAuthor = true,
		avatar,
		children
	} = $props();
</script>

<article class="card" class:mine class:stack-first={stackFirst} class:stack-last={stackLast}>
	{#if !mine}
		<div class="avatar-wrap" class:hidden-slot={!stackLast}>
			{#if stackLast}
				{#if avatar}
					{@render avatar()}
				{:else if name}
					<div class="avatar-fallback" aria-hidden="true">{name.trim()[0]?.toUpperCase()}</div>
				{/if}
			{/if}
		</div>
	{/if}

	<div class="bubble-trailing">
		<div class="bubble-stack">
			<div
				class="bubble"
				class:mine
				class:stack-first={stackFirst}
				class:stack-last={stackLast}
				class:stack-mid={!stackFirst && !stackLast}
			>
				{#if !mine && showAuthor && stackFirst && name}
					<div class="bubble-head">
						<span class="author" style:color={nameColor || undefined}>{name}</span>
						{#if when}<span class="when">{when}</span>{/if}
					</div>
				{/if}
				<div class="text">
					{#if children}
						{@render children()}
					{/if}
				</div>
			</div>
		</div>
	</div>
</article>

<style>
	.card {
		display: flex;
		gap: 6px;
		align-items: flex-end;
		width: 100%;
		position: relative;
	}

	.card.stack-mid,
	.card:not(.stack-first):not(.stack-last) {
		margin-top: 2px;
	}

	.card.stack-last:not(.stack-first) {
		margin-top: 2px;
	}

	.card.stack-first {
		margin-top: 10px;
	}

	.card.mine {
		flex-direction: row-reverse;
		justify-content: flex-start;
	}

	.avatar-wrap {
		flex-shrink: 0;
		width: 34px;
		line-height: 0;
		align-self: flex-end;
	}

	.avatar-wrap.hidden-slot {
		visibility: hidden;
	}

	.avatar-fallback {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 13px;
		font-weight: 650;
		background: color-mix(in srgb, var(--fg, var(--ink)) 14%, transparent);
		color: var(--fg, var(--ink));
	}

	.bubble-trailing {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		min-width: 0;
		max-width: calc(100% - 40px);
	}

	.card.mine .bubble-trailing {
		flex-direction: row-reverse;
		max-width: 100%;
	}

	.bubble-stack {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 0;
		max-width: 100%;
	}

	.card.mine .bubble-stack {
		align-items: flex-end;
	}

	.bubble {
		position: relative;
		z-index: 0;
		width: fit-content;
		max-width: min(85vw, 100%);
		padding: 6px 0 7px;
		border: 0;
		border-radius: 16px 16px 16px 4px;
		background: color-mix(in srgb, var(--fg, var(--ink)) 12%, transparent);
		color: inherit;
		text-align: left;
		font: inherit;
	}

	.bubble.mine {
		border-radius: 16px 16px 4px 16px;
		background: var(--gradient-accent-1);
		color: #fff;
		padding-bottom: 4px;
	}

	.bubble.stack-mid,
	.bubble:not(.stack-last) {
		border-radius: 16px;
	}

	.card.mine .bubble.stack-last {
		border-radius: 16px 16px 4px 16px;
	}

	.bubble:not(.mine).stack-last {
		border-radius: 16px 16px 16px 4px;
	}

	.bubble-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 2px;
		padding: 1px 11px 0;
	}

	.author {
		font-size: 13px;
		font-weight: 600;
	}

	.when {
		font-size: 11px;
		font-weight: 500;
		color: var(--fg-33, var(--ink33));
		flex-shrink: 0;
	}

	.text {
		margin: 0;
		padding: 0 11px;
		font-size: 15px;
		line-height: 1.4;
		color: var(--fg-83, var(--ink));
		white-space: pre-wrap;
		word-break: break-word;
	}

	.bubble.mine .text {
		color: #fff;
	}
</style>
