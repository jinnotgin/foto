import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'Foto',
		version: `0.25`,
	}
});

export default app;