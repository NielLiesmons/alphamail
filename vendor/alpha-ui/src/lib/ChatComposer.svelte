<script>
	/**
	 * Presentational chat composer pill — Admin ChatChannelPanel chrome.
	 * Pass interactive controls via slots; `demo` renders a static bar.
	 * @typedef {{
	 *   placeholder?: string,
	 *   canSend?: boolean,
	 *   expanded?: boolean,
	 *   demo?: boolean,
	 *   quote?: import('svelte').Snippet,
	 *   leading?: import('svelte').Snippet,
	 *   trailing?: import('svelte').Snippet,
	 *   children?: import('svelte').Snippet
	 * }} Props
	 * @type {Props}
	 */
	let {
		placeholder = 'Message',
		canSend = false,
		expanded = false,
		demo = false,
		quote,
		leading,
		trailing,
		children
	} = $props();
</script>

<div class="composer-pill" class:chrome-expanded={expanded || Boolean(quote)}>
	{#if quote}
		<div class="composer-quote-wrap">
			{@render quote()}
		</div>
	{/if}

	{#if children}
		{@render children()}
	{:else}
		<div class="composer-row">
			{#if leading}
				{@render leading()}
			{:else}
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
			{/if}

			{#if demo}
				<span class="composer-ph">{placeholder}</span>
			{:else}
				<div class="composer-field">
					<!-- Consumer binds a real textarea via trailing/leading or wraps this component -->
				</div>
			{/if}

			{#if trailing}
				{@render trailing()}
			{:else if canSend || demo}
				<span class="side-btn send" aria-hidden="true">
					<svg width="14" height="15" viewBox="0 0 112 122" fill="currentColor" aria-hidden="true">
						<path
							d="M56 0c18 18 28 42 28 68 0 18-6 34-16 48L56 122 44 116C34 102 28 86 28 68 28 42 38 18 56 0Z"
						/>
					</svg>
				</span>
			{:else}
				<span class="side-btn mic" aria-hidden="true">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
						<path
							d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"
							stroke="currentColor"
							stroke-width="1.7"
						/>
						<path
							d="M19 11a7 7 0 0 1-14 0M12 18v3"
							stroke="currentColor"
							stroke-width="1.7"
							stroke-linecap="round"
						/>
					</svg>
				</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.composer-pill {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0;
		min-height: 47px;
		padding: 0;
		border-radius: 9999px;
		box-sizing: border-box;
		position: relative;
		isolation: isolate;
		border: 0;
		background: var(--composer-bg, color-mix(in srgb, var(--glass) 72%, transparent));
		backdrop-filter: blur(var(--glass-blur, 22px));
		-webkit-backdrop-filter: blur(var(--glass-blur, 22px));
		overflow: hidden;
		width: 100%;
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
			color-mix(in srgb, var(--fg, var(--ink)) 12%, transparent) 0%,
			color-mix(in srgb, var(--fg, var(--ink)) 3%, transparent) 45%,
			color-mix(in srgb, var(--fg, var(--ink)) 3%, transparent) 55%,
			color-mix(in srgb, var(--fg, var(--ink)) 9%, transparent) 100%
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

	.composer-pill.chrome-expanded {
		border-radius: 16px 16px 23.5px 23.5px;
	}

	.composer-quote-wrap {
		padding: 8px 8px 0;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.composer-row {
		display: flex;
		align-items: flex-end;
		gap: 7px;
		min-height: calc(47px - 14px);
		padding: 7px;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.composer-pill.chrome-expanded .composer-row {
		padding-top: 4px;
	}

	.side-btn {
		width: 33px;
		height: 33px;
		flex-shrink: 0;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		border-radius: 9999px;
	}

	.side-btn.plus {
		background: color-mix(in srgb, var(--fg, var(--ink)) 12%, transparent);
		color: var(--fg-66, var(--ink66));
	}

	.side-btn.mic {
		background: transparent;
		color: var(--fg-33, var(--ink33));
	}

	.side-btn.send {
		background: var(--gradient-accent-1);
		color: #fff;
	}

	.composer-field {
		flex: 1;
		min-width: 0;
		max-height: 140px;
		display: flex;
		align-items: flex-end;
	}

	.composer-ph {
		flex: 1;
		min-width: 0;
		padding: 6px 4px 7px;
		color: var(--fg-33, var(--ink33));
		font-size: 15px;
		font-weight: 500;
		line-height: 20px;
		text-align: left;
	}
</style>
