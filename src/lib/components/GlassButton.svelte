<!-- Re-export from @alpha/ui (shared design system). -->
<script>
	import GlassButton from '@alpha/ui/GlassButton.svelte';

	let {
		href = '',
		children,
		type = 'button',
		onclick,
		size = 'md',
		disabled = false,
		target = undefined,
		rel = undefined,
		class: className = '',
		form = undefined
	} = $props();
</script>

<GlassButton
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
</GlassButton>
