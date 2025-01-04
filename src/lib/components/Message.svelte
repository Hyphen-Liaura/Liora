<script lang="ts">
	import { cn } from '$lib/utils';
	import { P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import type { MessageI } from '../../routes/+page.svelte';

	const { message, role }: { message: string; role: MessageI['role'] } = $props();

	const opacity = new Spring(0);

	onMount(() => {
		opacity.target = 1;
	});
</script>

<div
	style="opacity: {opacity.current};"
	class={cn(
		'w-fit max-w-[80%] rounded-lg px-4 py-3 font-bold',
		role === 'assistant' && 'background self-start text-left',
		role === 'user' && 'self-end bg-neutral-50 text-right'
	)}
>
	<P>{message}</P>
</div>

<style>
	.background {
		background: hsla(0, 87%, 79%, 1);

		background: linear-gradient(225deg, hsla(0, 87%, 79%, 1) 0%, hsla(6, 77%, 85%, 1) 100%);

		background: -moz-linear-gradient(225deg, hsla(0, 87%, 79%, 1) 0%, hsla(6, 77%, 85%, 1) 100%);

		background: -webkit-linear-gradient(225deg, hsla(0, 87%, 79%, 1) 0%, hsla(6, 77%, 85%, 1) 100%);

		filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#F89999", endColorstr="#F6C0BA", GradientType=1 );
	}
</style>
