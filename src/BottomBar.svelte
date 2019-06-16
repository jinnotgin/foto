<script>
	import { onMount } from 'svelte';
    import Clock from './Clock.svelte';
    import PhotoSlogan from './PhotoSlogan.svelte';
	import WeatherWidget from './WeatherWidget.svelte';
    import { timeStringFormatter, dateStringFormatter } from  './jinFunctions.js';
    
	let time = new Date();

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
        }, 1000);
    });

    $: timeString = timeStringFormatter(time);
    $: dateString = dateStringFormatter(time, 'dayMonth');
</script>

<style>
div {
    position: absolute;
    bottom: 0;
    left: 0;
    margin-bottom: 2rem;
    color: white;
    width: 100%;
    line-height: 1em;
    text-shadow: 1px 1px 8px black;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    flex-direction: row;
}
</style>

<div>
    <Clock {timeString} />
    <WeatherWidget />
    <PhotoSlogan photoSlogan={dateString} />
</div>