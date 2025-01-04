<script lang="ts">
	import Cursor from '$lib/components/Cursor.svelte';
	import '@fontsource-variable/jetbrains-mono';
	import '../app.css';

	let { children } = $props();
</script>

<Cursor />
{@render children()}
