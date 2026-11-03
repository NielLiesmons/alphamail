<script>
	/**
	 * `/` fallback for local preview — production should redirect to `/en`.
	 */
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { langFromPath } from '$lib/i18n-path';

	onMount(() => {
		if (!browser) return;
		if (langFromPath(window.location.pathname)) return;
		goto('/en', { replaceState: true });
	});
</script>

<svelte:head>
	<meta http-equiv="refresh" content="0;url=/en" />
	<link rel="canonical" href="https://alphamail.xyz/en" />
</svelte:head>

<p class="fallback">
	<a href="/en">English</a>
	·
	<a href="/fr">Français</a>
</p>

<style>
	.fallback {
		padding: 2rem;
		text-align: center;
	}
</style>
