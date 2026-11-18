<script>
	/**
	 * Canonical dropdown / overflow menu — same look as Task create/detail FloatPanel lists.
	 * Portaled glass panel + optional item list, or custom children for rich rows.
	 */
	import FloatPanel from './FloatPanel.svelte';

	/**
	 * @typedef {{
	 *   id?: string,
	 *   label: string,
	 *   danger?: boolean,
	 *   disabled?: boolean,
	 *   onclick?: () => void
	 * }} DropdownItem
	 */

	/**
	 * @type {{
	 *   open?: boolean,
	 *   anchor?: HTMLElement | null,
	 *   placement?: 'above' | 'below',
	 *   align?: 'start' | 'end',
	 *   width?: number,
	 *   maxHeight?: number,
	 *   items?: DropdownItem[],
	 *   onclose?: () => void,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		open = false,
		anchor = null,
		placement = 'below',
		align = 'start',
		width = 200,
		maxHeight = 320,
		items = [],
		onclose = () => {},
		children
	} = $props();

	/** @param {DropdownItem} item */
	function activate(item) {
		if (item.disabled) return;
		item.onclick?.();
		onclose();
	}
</script>

<FloatPanel {open} {anchor} {placement} {align} {width} {maxHeight} {onclose}>
	{#if children}
		{@render children()}
	{:else}
		<div class="dropdown-list" role="menu">
			{#each items as item, i (item.id ?? `${item.label}-${i}`)}
				<button
					type="button"
					class="dropdown-item"
					class:danger={item.danger}
					role="menuitem"
					disabled={item.disabled}
					onclick={() => activate(item)}
				>
					{item.label}
				</button>
			{/each}
		</div>
	{/if}
</FloatPanel>

<style>
	.dropdown-list {
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: auto;
		padding: 4px 0;
	}

	.dropdown-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 14px;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--fg-66);
		font: inherit;
		font-size: 0.9375rem;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
	}

	.dropdown-item:not(:last-child) {
		border-bottom: 0.33px solid var(--fg-8);
	}

	.dropdown-item:hover:not(:disabled) {
		background: var(--fg-4);
		color: var(--fg);
	}

	.dropdown-item:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.dropdown-item.danger {
		color: var(--destructive, var(--accent-3, var(--fg-66)));
	}

	.dropdown-item.danger:hover:not(:disabled) {
		background: var(--fg-8);
		color: var(--destructive, var(--accent-3, var(--fg)));
	}

	/* Expose list/item classes for custom children snippets */
	:global(.dropdown-list) {
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: auto;
		padding: 4px 0;
	}

	:global(.dropdown-item) {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 14px;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--fg-66);
		font: inherit;
		font-size: 0.9375rem;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
	}

	:global(.dropdown-item:not(:last-child)) {
		border-bottom: 0.33px solid var(--fg-8);
	}

	:global(.dropdown-item:hover:not(:disabled)) {
		background: var(--fg-4);
		color: var(--fg);
	}

	:global(.dropdown-item.active),
	:global(.dropdown-item[aria-checked='true']) {
		color: var(--fg);
		background: var(--fg-4);
	}
</style>
