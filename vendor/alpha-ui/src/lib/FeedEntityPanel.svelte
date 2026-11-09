<script>
	/**
	 * Presentational entity panel in a chat feed (mail / task / note / file).
	 * Matches Admin MailThreadFeed `.mail-panel` chrome.
	 * @typedef {{
	 *   name?: string,
	 *   meta?: string,
	 *   title?: string,
	 *   body?: string,
	 *   when?: string,
	 *   draft?: boolean,
	 *   avatar?: import('svelte').Snippet,
	 *   children?: import('svelte').Snippet
	 * }} Props
	 * @type {Props}
	 */
	let {
		name = '',
		meta = '',
		title = '',
		body = '',
		when = '',
		draft = false,
		avatar,
		children
	} = $props();
</script>

<article class="panel" class:draft>
	<header class="head">
		{#if avatar}
			{@render avatar()}
		{:else if name}
			<div class="avatar-fallback" aria-hidden="true">{name.trim()[0]?.toUpperCase()}</div>
		{/if}
		<div class="meta">
			<div class="row1">
				<span class="who-line">
					{#if name}<span class="name">{name}</span>{/if}
					{#if meta}<span class="sub">{meta}</span>{/if}
				</span>
			</div>
			{#if title}
				<div class="row2">
					<p class="title">{title}</p>
				</div>
			{/if}
		</div>
		{#if when}
			<div class="trail">
				<span class="when">{when}</span>
			</div>
		{/if}
	</header>
	{#if body || children}
		<div class="rule" aria-hidden="true"></div>
		<div class="content">
			{#if body}
				<p class="body">{body}</p>
			{/if}
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</article>

<style>
	.panel {
		display: block;
		padding: 0;
		margin: 0 0 10px;
		border-radius: 14px;
		background: color-mix(in srgb, var(--fg, var(--ink)) 4.5%, transparent);
		border: 0;
		overflow-x: clip;
		overflow-y: visible;
		flex: none;
		height: auto;
		max-height: none;
		width: 100%;
		box-sizing: border-box;
		text-align: left;
	}

	.panel.draft {
		background: color-mix(in srgb, var(--fg, var(--ink)) 3%, transparent);
		outline: 1px dashed color-mix(in srgb, var(--fg, var(--ink)) 12%, transparent);
		outline-offset: -1px;
	}

	.head {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
		padding: 12px 14px 10px;
		box-sizing: border-box;
	}

	.avatar-fallback {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 14px;
		font-weight: 650;
		flex-shrink: 0;
		background: color-mix(in srgb, var(--fg, var(--ink)) 14%, transparent);
		color: var(--fg, var(--ink));
	}

	.meta {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
		justify-content: center;
	}

	.row1,
	.row2 {
		display: flex;
		align-items: center;
		gap: 6px;
		min-width: 0;
	}

	.who-line {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 6px;
		overflow: hidden;
	}

	.name {
		font-size: 14px;
		font-weight: 650;
		line-height: 1.2;
		color: var(--fg, var(--ink));
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sub {
		flex-shrink: 1;
		min-width: 0;
		font-size: 12px;
		font-weight: 450;
		line-height: 1.2;
		color: var(--fg-33, var(--ink33));
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-top: 1px;
	}

	.title {
		flex: 1;
		min-width: 0;
		margin: 0;
		padding: 0;
		font-size: 12px;
		font-weight: 450;
		color: var(--fg-33, var(--ink33));
		line-height: 1.25;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.trail {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		gap: 3px;
	}

	.when {
		margin: 0;
		font-size: 11px;
		font-weight: 500;
		line-height: 1.25;
		color: var(--fg-33, var(--ink33));
		white-space: nowrap;
		text-align: right;
	}

	.rule {
		height: 1px;
		margin: 0;
		width: 100%;
		background: color-mix(in srgb, var(--fg, var(--ink)) 8%, transparent);
	}

	.content {
		padding: 12px 14px 14px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: flex-start;
	}

	.body {
		margin: 0;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.45;
		color: var(--fg, var(--ink));
	}
</style>
