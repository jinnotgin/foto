<script>
	import { photos } from './stores.js';
	import PhotoBackground from './PhotoBackground.svelte';
	import BottomBar from './BottomBar.svelte';

	export let name;
	export let version;

	console.log(`Starting ${name} v${version}...`);
	
	export let db;
	db = new Dexie("fotoDatabase");
	db.version(1).stores({photos: 'id'});
	db.version(2).stores({photos: 'id, modified'});
</script>


<!-- <h1>Welcome to {name}!</h1> -->	

<PhotoBackground {db}/>
<BottomBar />
