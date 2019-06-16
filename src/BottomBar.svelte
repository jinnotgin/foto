<script>
    import Clock from './Clock.svelte';
    import PhotoSlogan from './PhotoSlogan.svelte';
	import WeatherWidget from './WeatherWidget.svelte';
    
	import { onMount } from 'svelte';
	let time = new Date();

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
        }, 1000);
    });

    const timeStringFormatter = (timeObj) => {
        let hoursFormatted = timeObj.getHours();
        if (hoursFormatted === 0) hoursFormatted = 12;
        else if (hoursFormatted > 12) hoursFormatted = hoursFormatted - 12;

        let minutesFormatted = timeObj.getMinutes().toString().padStart(2, '0');

        return `${hoursFormatted}:${minutesFormatted}`;
    }

    const dateStringFormatter = (timeObj) => {

        const dateStrings = timeObj.toDateString().split(' ');

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const days_short = days.map( item => item.substr(0,3));

        const day = days[days_short.indexOf(dateStrings[0])];
        const month = dateStrings[1];
        const date =  dateStrings[2];
        return `${day}, ${month} ${date}`;
    }

    $: timeString = timeStringFormatter(time);
    $: dateString = dateStringFormatter(time);
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