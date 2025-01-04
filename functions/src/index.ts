import { onCall } from 'firebase-functions/v2/https';
import OpenAI from 'openai';
import { NODE_ENV, OPENAI_API_KEY } from './env';

type MessageI = {
	content: string;
	role: 'assistant' | 'user';
};

export const chat = onCall(async (request) => {
	const nodeEnv = NODE_ENV.value();

	if (nodeEnv === 'development') {
		return 'Some dummy text';
	}

	const client = new OpenAI({
		apiKey: OPENAI_API_KEY.value()
	});

	const updatedMessages = request.data.messages as MessageI[];

	const thread = await client.beta.threads.create({
		messages: updatedMessages.slice(0, -1)
	});

	await client.beta.threads.messages.create(thread.id, {
		content: updatedMessages[updatedMessages.length - 1].content,
		role: 'user'
	});

	const run = await client.beta.threads.runs.createAndPoll(thread.id, {
		assistant_id: 'asst_sDhIBGioG4HJxdLi1RmaUtpl'
	});

	if (run.status === 'completed') {
		const messages = await client.beta.threads.messages.list(run.thread_id);
		const latestMessage = messages.data[0].content[0];

		if (latestMessage.type === 'text') {
			return latestMessage.text.value;
		} else {
			return 'I am not sure how to respond to that.';
		}
	} else {
		return 'I am not sure how to respond to that.';
	}
});
