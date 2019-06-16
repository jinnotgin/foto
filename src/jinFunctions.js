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

export const scheduleFunction = (functionName, functionObj, scheduleSeconds) => {
    console.log('scheduleFunction:', {functionName, scheduleSeconds});
    timeoutHandler(functionName, 'schedule', {
        'function': functionObj,
        'timeout': scheduleSeconds * 1000,
    });
}