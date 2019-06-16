// jFetch
// adds handling of response errors to fetch
export async function jFetch(url) {
    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    return await fetch(url)
        .then(handleErrors)
        .then(response => { console.log('jFetch success:', {url, response}); return response.json(); } )
        .catch(error => {console.error('jFetch error:', {url, error}); return error; })
    ;
}

// timeout scheduler
const timeouts = {};
const timeoutHandler = (desiredItem, desiredCommand, desiredCommandParameter) => {
    //console.log('timeoutHandler:', {desiredItem, desiredCommand, desiredCommandParameter});
    const commands = {
        'schedule': () => {
            clearInterval(timeouts[desiredItem]);
            timeouts[desiredItem] = setTimeout(desiredCommandParameter.function, desiredCommandParameter.timeout);
        },
    }
    
    // create new timeout item if necessary
    if (Object.keys(timeouts).includes(desiredItem) === false) timeouts[desiredItem] = false;

    // run command
    commands[desiredCommand]();
}

// schedule a function
// works with timeoutHandler 
export const scheduleFunction = (functionName, functionObj, scheduleSeconds) => {
    console.log('scheduleFunction:', {functionName, scheduleSeconds});
    timeoutHandler(functionName, 'schedule', {
        'function': functionObj,
        'timeout': scheduleSeconds * 1000,
    });
}

// time string formatter
export const timeStringFormatter = (timeObj) => {
    let hoursFormatted = timeObj.getHours();
    if (hoursFormatted === 0) hoursFormatted = 12;
    else if (hoursFormatted > 12) hoursFormatted = hoursFormatted - 12;

    let minutesFormatted = timeObj.getMinutes().toString().padStart(2, '0');

    return `${hoursFormatted}:${minutesFormatted}`;
}

// datestring forammter
export const dateStringFormatter = (timeObj, outputFormat) => {

    const dateStrings = timeObj.toDateString().split(' ');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const days_short = days.map( item => item.substr(0,3));

    const day = days[days_short.indexOf(dateStrings[0])];
    const month = dateStrings[1];
    const date =  parseInt(dateStrings[2]);
    const year = dateStrings[3];

    let output = '';
    if (outputFormat === 'dayMonth') output = `${day}, ${month} ${date}`;
    else output = `${date} ${month} ${year}`;
    return output;
}