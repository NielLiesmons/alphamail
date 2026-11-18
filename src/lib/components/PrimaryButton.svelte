<script>
	/**
	 * Main CTA — alpha-ui primary (ink-on-bg glass fill + shine stroke).
	 * Keeps class `btn` so hero equal-width rules still match.
	 */
	import PrimaryButton from '@alpha/ui/PrimaryButton.svelte';

	let { children, class: className = '', ...rest } = $props();
</script>

<PrimaryButton class="btn {className}" {...rest}>
	{@render children()}
</PrimaryButton>
