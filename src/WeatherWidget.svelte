<script>
	import { onMount } from 'svelte';
    import { config } from  './config.js';
    import { jFetch, scheduleFunction } from  './jinFunctions.js';
    
    const WEATHERINFO_INTERVAL = 60 * 60 * 10;
    let weather = {
        'country': '',
        'temp': 0,
    };

    let userCoordinates = {};
    const getLocation = () => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            const {coords} = pos;
            const {latitude, longitude, accuracy} = coords;
            console.log('Your current position is:', {latitude, longitude, accuracy: `${accuracy}m`});
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        return new Promise((success, error, options) => {
            navigator.geolocation.getCurrentPosition(success, error, options);
        }).catch(error => false);
    }

    const schedule_getWeatherData = (scheduleSeconds = WEATHERINFO_INTERVAL) => scheduleFunction('getWeatherData', getWeatherData, scheduleSeconds);
    const getWeatherData = async (cords = userCoordinates) => {
        const {latitude, longitude, accuracy} = cords;
        const weatherService = {
            'default': {
                'current': `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${config.OPENWEATHERMAP_API_KEY}`,
                'forecast': `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${config.OPENWEATHERMAP_API_KEY}`,
            },
            'singapore': {
                'current': `https://api.data.gov.sg/v1/environment/air-temperature`,
                'forecast': `https://api.data.gov.sg/v1/environment/2-hour-weather-forecast`,
            },
        }

        const weather_owm = async () => {
            const current = jFetch(weatherService.default.current);
            const forecast = jFetch(weatherService.default.forecast);

            const weatherPromises = await Promise.all([current, forecast]).then(function(values) {
                const current = values[0];
                const forecast = values[1];
                console.log('weather_owm - raw values:', {current, forecast});

                const weatherData = {
                    'name': current.name,
                    'country': current.sys.country,
                    'temp': current.main.temp / 10,
                    'weather': current.weather[0].main,
                    'forecast': forecast.list[0].weather[0].main,
                };

                console.log('weather_owm - processed:', {weatherData});
                return weatherData;
            });

            return weatherPromises;
        }

        const weather_sg = async () => {
            const current = jFetch(weatherService.singapore.current);
            const forecast = jFetch(weatherService.singapore.forecast);

            const weatherPromises = await Promise.all([current, forecast]).then(function(values) {
                const current = values[0];
                const forecast = values[1];
                console.log('weather_sg - raw values:', {current, forecast});

                // FIND CLOSEST STATION using coordinates
                // for now, just assume Woodlands

                const current_closest_station_index = current.metadata.stations.reduce( (acc, item, idx) => {
                    if (acc === false) {
                        acc = (item.name.toLowerCase().includes('woodlands')) ? idx : false;
                    }
                    return acc;
                }, false);
                
                const forecast_closest_area_index = forecast.area_metadata.reduce( (acc, item, idx) => {
                    if (acc === false) {
                        acc = (item.name.toLowerCase().includes('woodlands')) ? idx : false;
                    }
                    return acc;
                }, false);

                const current_closest = current.items[0].readings[current_closest_station_index];
                const forecast_closest = forecast.items[0].forecasts[forecast_closest_area_index];

                console.log('weather_sg - finding closest match:', {current_closest_station_index, current_closest, forecast_closest_area_index, forecast_closest});

                const weatherData = {
                    'name': forecast_closest.area,
                    'country': 'SG',
                    'temp': current_closest.value,
                    'weather': forecast_closest.forecast,
                    'forecast': forecast_closest.forecast,
                };

                console.log('weather_sg - processed:', {weatherData});
                return weatherData;
            });

            return weatherPromises;
        }

        let weatherData = {};
        if (weather.country === 'SG') {
            weatherData = await weather_sg();
        } else {
            weatherData = await weather_owm();
            if (weatherData.country === 'SG') {
                console.log('Singapore detected! Changing to Singapore api...')
                weatherData = await weather_sg();
            }
        }
        schedule_getWeatherData();
        return weatherData;
    }
    
    
    onMount(() => {
        getLocation().then( async (data) => {
            const {coords} = data;
            userCoordinates = coords;
            
            console.log({coords});
            
            weather = await getWeatherData(coords);
            console.log({weather});
        });
    });
</script>


<style>
div {
    font-size: 2.5rem;
    line-height: 1em;
    margin-left: 1.5rem;
    margin-right: 2rem;
    text-shadow: 1px 1px 2px black;
}
</style>

<div>
    {isNaN(weather.temp) ? '-' : `${Math.round(weather.temp)}°`}
</div>