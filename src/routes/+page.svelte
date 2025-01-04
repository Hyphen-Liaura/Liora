<script lang="ts" module>
	export type MessageI = {
		content: string;
		role: 'assistant' | 'user';
	};
</script>

<script lang="ts">
	import Message from '$lib/components/Message.svelte';
	import { localStorageStore } from '$lib/localStorageStore';
	import { httpsCallable } from 'firebase/functions';
	import { Button, Heading, Input, P, Toast } from 'flowbite-svelte';
	import CircleMinus from 'flowbite-svelte-icons/CircleMinusSolid.svelte';
	import { SendHorizontal } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import { functions } from '../firebase';

	let input = $state('');
	let submitting = $state(false);
	let error = $state<string | null>(null);
	let toastStatus = $state(true);
	let messages = $state<MessageI[]>([
		{
			role: 'assistant',
			content: 'Hello! How can I help you?'
		}
	]);
	let messageContainer = $state<HTMLDivElement | undefined>();
	const hitLimit = localStorageStore('hitLimit', false);

	$effect(() => {
		toastStatus = !!error;
	});

	const focusInput = () => {
		// Focus the input
		const inputEl = document.getElementById('prompt-input') as HTMLInputElement;
		inputEl.focus();
	};

	const sendMessage = async () => {
		if ($hitLimit && import.meta.env.PROD) {
			error = 'You have reached the message limit.';
			focusInput();
			return;
		}

		if (!input || !messageContainer) {
			focusInput();
			return;
		}

		if (messages.length > 50 && import.meta.env.PROD) {
			error = 'You have reached the message limit.';
			hitLimit?.set(true);
			focusInput();
			return;
		}

		submitting = true;

		try {
			messages.push({
				role: 'user',
				content: input
			});
			input = '';

			tick().then(() => {
				messageContainer!.scrollTo({
					top: messageContainer!.scrollHeight,
					behavior: 'smooth'
				});
			});

			const resp = await httpsCallable(functions, 'chat')({ messages });
			const message = resp.data;

			messages.push({
				role: 'assistant',
				content: message as string
			});

			tick().then(() => {
				messageContainer!.scrollTo({
					top: messageContainer!.scrollHeight,
					behavior: 'smooth'
				});
			});
		} catch (err) {
			console.error(err);
		}

		submitting = false;

		// Focus the input
		focusInput();
	};

	const hideToast = () => {
		toastStatus = false;
		error = '';
	};
</script>

{#if error}
	<Toast bind:toastStatus transition={slide} onclick={hideToast} class="fixed bottom-2 right-2">
		<CircleMinus slot="icon" />
		{error}
	</Toast>
{/if}

<div class="flex h-full max-h-screen flex-col items-center pt-24">
	<div class="fixed right-16 top-12 flex items-center gap-x-8">
		<a href="https://github.com/Hyphen-Liora/Liora" target="_blank">
			<img src="/github.png" alt="GitHub" class="h-16 w-auto" />
		</a>
		<a href="https://x.com/AgentLiora" target="_blank">
			<img src="/twitter.png" alt="X" class="h-16 w-auto" />
		</a>
		<a href="" target="_blank">
			<img src="/pump.png" alt="Pump" class="h-16 w-auto" />
		</a>
	</div>

	<Heading class="mb-4 text-center tracking-tighter  max-sm:text-3xl">
		Your AI-Powered Emotional<br />
		Support & Trading Companion
	</Heading>

	<P class="mb-14 text-center ">The market doesn't care about your feelings.</P>

	<div class="min-h-0 w-full max-w-6xl flex-1 px-10 pb-10">
		<form
			onsubmit={sendMessage}
			class="relative grid h-full grid-cols-2 rounded-md border border-gray-300 pr-4"
		>
			<img src="/character.png" alt="Liora" class="h-auto w-full max-w-2xl select-none self-end" />

			<div class="grid min-h-0 grid-rows-[1fr_auto] pb-4">
				<div
					bind:this={messageContainer}
					class="no-scrollbar relative flex w-full scroll-mb-4 scroll-mt-24 flex-col gap-y-2 overflow-y-auto overflow-x-hidden pb-4 pt-32"
				>
					{#each messages as message}
						<Message message={message.content} role={message.role} />
					{/each}

					{#if submitting}
						<Message message="..." role="assistant" loading className="w-[3.75rem]" />
					{/if}
				</div>

				<div class="grid grid-cols-[1fr_auto] gap-x-2">
					<Input
						id="prompt-input"
						bind:value={input}
						placeholder="Confess your worst trade…"
						tabindex={0}
					/>
					<Button type="submit" disabled={submitting} color="primary" class="!p-2">
						<SendHorizontal class="size-6 -rotate-90" />
					</Button>
				</div>
			</div>
		</form>
	</div>
</div>
