<script>
	/**
	 * Primary glass CTA — Admin publish / marketing main actions.
	 * @typedef {'md' | 'sm' | 'sheet'} BtnSize
	 */
	import Button from './Button.svelte';

	let {
		href = '',
		children,
		type = 'button',
		onclick,
		size = /** @type {BtnSize} */ ('md'),
		disabled = false,
		target = undefined,
		rel = undefined,
		class: className = '',
		form = undefined
	} = $props();
</script>

<Button
	variant="primary"
	{href}
	{type}
	{onclick}
	{size}
	{disabled}
	{target}
	{rel}
	class={className}
	{form}
>
	{@render children()}
</Button>
