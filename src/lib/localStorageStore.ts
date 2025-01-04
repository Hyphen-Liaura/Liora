import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const localStorageStore = <T extends any>(key: string, defaultValue?: T) => {
	if (!browser) return;

	const value = localStorage.getItem(key);
	const store = writable<T | undefined>(value ? JSON.parse(value) : defaultValue);

	function set(value: T) {
		localStorage.setItem(key, JSON.stringify(value));
		store.set(value);
	}

	return {
		...store,
		set
	};
};
