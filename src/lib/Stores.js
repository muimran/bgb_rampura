import { writable } from 'svelte/store';

export const showComparison = writable(false);
// This keeps track of the active audio globally
export const activeAudio = writable(null);