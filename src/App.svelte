<script>
	import { photos } from './stores.js';
	import PhotoBackground from './PhotoBackground.svelte';
	import BottomBar from './BottomBar.svelte';

	export let name;
	export let version;

	console.log(`Starting ${name} v${version}...`)	
</script>


<!-- <h1>Welcome to {name}!</h1> -->	

<PhotoBackground />
<BottomBar />
