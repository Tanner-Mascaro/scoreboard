
function routeMessage(message, channels) {
    const sport = message.sport;

    if(!channels[sport]) {
        channels[sport] = new Set();
    }

    channels[sport].forEach(subscriber => {
        if(subscriber.readyState === 1) { // 1 means OPEN
            subscriber.send(JSON.stringify(message));
        }
    });
}

module.exports = { routeMessage };